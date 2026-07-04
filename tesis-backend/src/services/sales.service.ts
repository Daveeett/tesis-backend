import { PaymentType } from "../entities/enums/payment-type.enum";
import { CreditStatus } from "../entities/enums/credit-status.enum";
import { CashMovementType } from "../entities/enums/cash-movement-type.enum";
import { CashSessionStatus } from "../entities/enums/cash-session-status.enum";
import { AppError } from "../utils/app-error.util";
import { CreditService } from "./credit.service";
import { UnitOfWork } from "../repositories/unit-of-work";
import { UserRepository } from "../repositories/user.repository";
import { CustomerRepository } from "../repositories/customer.repository";
import { ProductRepository } from "../repositories/product.repository";
import { SaleRepository } from "../repositories/sale.repository";
import { SaleItemRepository } from "../repositories/sale-item.repository";
import { CreditRepository } from "../repositories/credit.repository";
import { CreditItemRepository } from "../repositories/credit-item.repository";
import { CreditAccountRepository } from "../repositories/credit-account.repository";
import { CashSessionRepository } from "../repositories/cash-session.repository";
import { CashMovementRepository } from "../repositories/cash-movement.repository";

export class SalesService {
  private readonly creditService = new CreditService();
  private readonly unitOfWork = new UnitOfWork();

  async createSale(input: {
    userId: string;
    customerId?: string;
    paymentType: PaymentType;
    dueDate?: string;
    upfrontPaid?: number;
    items: Array<{ productId: string; qty: number }>;
  }) {
    if (!input.items.length) throw new AppError("Debe incluir al menos un articulo", 400, "EMPTY_ITEMS");

    if (input.paymentType !== PaymentType.CASH) {
      if (!input.customerId) throw new AppError("Cliente requerido para venta fiada", 400, "CUSTOMER_REQUIRED");
      if (!input.dueDate) throw new AppError("Fecha de vencimiento requerida", 400, "DUE_DATE_REQUIRED");
      await this.creditService.assertCanCreateCredit(input.customerId);
    }

    return this.unitOfWork.withTransaction(async (manager) => {
      const userRepo = new UserRepository(manager);
      const customerRepo = new CustomerRepository(manager);
      const productRepo = new ProductRepository(manager);
      const saleRepo = new SaleRepository(manager);
      const saleItemRepo = new SaleItemRepository(manager);
      const creditRepo = new CreditRepository(manager);
      const creditItemRepo = new CreditItemRepository(manager);
      const creditAccountRepo = new CreditAccountRepository(manager);
      const cashSessionRepo = new CashSessionRepository(manager);
      const cashMovementRepo = new CashMovementRepository(manager);

      const user = await userRepo.findById(input.userId);
      if (!user) throw new AppError("Usuario no encontrado", 404, "USER_NOT_FOUND");

      const customer = input.customerId ? await customerRepo.findById(input.customerId) : null;
      if (input.customerId && !customer) throw new AppError("Cliente no encontrado", 404, "CUSTOMER_NOT_FOUND");

      const productIds = input.items.map((item) => item.productId);
      const products = await productRepo.findByIds(productIds);
      if (products.length !== productIds.length) throw new AppError("Uno o mas productos no existen", 404, "PRODUCT_NOT_FOUND");

      const productsMap = new Map(products.map((p) => [p.id, p]));
      let total = 0;

      const saleItemsPayload = input.items.map((item) => {
        const product = productsMap.get(item.productId);
        if (!product) throw new AppError("Producto no encontrado", 404, "PRODUCT_NOT_FOUND");
        if (product.stock < item.qty) throw new AppError(`Stock insuficiente para ${product.name}`, 400, "INSUFFICIENT_STOCK");
        const unitPrice = Number(product.unitPrice);
        const subtotal = unitPrice * item.qty;
        total += subtotal;
        return { product, qty: item.qty, unitPrice, subtotal };
      });

      const upfrontPaid = input.upfrontPaid ?? 0;
      if (upfrontPaid < 0 || upfrontPaid > total) throw new AppError("Monto inicial invalido", 400, "INVALID_UPFRONT_AMOUNT");

      const sale = saleRepo.create({
        user, customer, paymentType: input.paymentType, totalAmount: total.toFixed(2),
      });
      const savedSale = await saleRepo.save(sale);

      const saleItems = saleItemsPayload.map((item) =>
        saleItemRepo.create({
          sale: savedSale, product: item.product,
          qty: item.qty, unitPrice: item.unitPrice.toFixed(2), subtotal: item.subtotal.toFixed(2),
        }),
      );
      await saleItemRepo.saveMany(saleItems);

      for (const item of saleItemsPayload) { item.product.stock -= item.qty; }
      await productRepo.saveMany(products);

      const openSession = await cashSessionRepo.findOpenSession();

      const creditAmount = input.paymentType === PaymentType.CASH ? 0 : Number((total - upfrontPaid).toFixed(2));
      let createdCredit = null;

      if (creditAmount > 0 && customer && input.dueDate) {
        let creditAccount = await creditAccountRepo.findByCustomerWithCustomer(customer.id);
        if (!creditAccount) {
          creditAccount = creditAccountRepo.create({
            customer, totalDebt: "0.00", totalPaid: "0.00", currentBalance: "0.00",
          });
          creditAccount = await creditAccountRepo.save(creditAccount);
        }

        const credit = creditRepo.create({
          creditAccount, sale: savedSale, dueDate: input.dueDate,
          amount: creditAmount.toFixed(2),
          status: upfrontPaid > 0 ? CreditStatus.PARTIAL : CreditStatus.OPEN,
        });
        createdCredit = await creditRepo.save(credit);

        const creditItems = saleItemsPayload.map((item) =>
          creditItemRepo.create({
            credit: createdCredit!, product: item.product,
            qty: item.qty, unitPrice: item.unitPrice.toFixed(2), subtotal: item.subtotal.toFixed(2),
          }),
        );
        await creditItemRepo.saveMany(creditItems);

        creditAccount.totalDebt = (Number(creditAccount.totalDebt) + creditAmount).toFixed(2);
        creditAccount.totalPaid = (Number(creditAccount.totalPaid) + upfrontPaid).toFixed(2);
        creditAccount.currentBalance = (Number(creditAccount.totalDebt) - Number(creditAccount.totalPaid)).toFixed(2);
        creditAccount.lastActivityAt = new Date();
        await creditAccountRepo.save(creditAccount);
      }

      if ((upfrontPaid > 0 || input.paymentType === PaymentType.CASH) && openSession) {
        const amountToCash = input.paymentType === PaymentType.CASH ? total : upfrontPaid;
        const movement = cashMovementRepo.create({
          cashSession: openSession, movementType: CashMovementType.INCOME,
          amount: amountToCash.toFixed(2), concept: `Venta ${savedSale.id}`, user,
        });
        await cashMovementRepo.save(movement);
      }

      return { sale: savedSale, total: total.toFixed(2), credit: createdCredit };
    });
  }
}
