import { CashSessionStatus } from "../entities/enums/cash-session-status.enum";
import { CashMovementType } from "../entities/enums/cash-movement-type.enum";
import { AppError } from "../utils/app-error.util";
import { CashSessionRepository } from "../repositories/cash-session.repository";
import { CashMovementRepository } from "../repositories/cash-movement.repository";
import { UserRepository } from "../repositories/user.repository";

export class CashService {
  private readonly sessionRepo = new CashSessionRepository();
  private readonly movementRepo = new CashMovementRepository();
  private readonly userRepo = new UserRepository();

  async getOpenSession() {
    return this.sessionRepo.findOpenSession(true);
  }

  async getOpenSessionOrFail() {
    const session = await this.getOpenSession();
    if (!session) throw new AppError("No existe caja abierta", 409, "CASH_SESSION_NOT_OPEN");
    return session;
  }

  async openCash(input: { openingBalance: number; userId: string }) {
    const existing = await this.getOpenSession();
    if (existing) throw new AppError("Ya existe una caja abierta", 409, "CASH_SESSION_ALREADY_OPEN");

    const user = await this.userRepo.findById(input.userId);
    if (!user) throw new AppError("Usuario no encontrado", 404, "USER_NOT_FOUND");

    const session = this.sessionRepo.create({
      openingBalance: input.openingBalance.toFixed(2),
      openedBy: user,
      status: CashSessionStatus.OPEN,
    });
    return this.sessionRepo.save(session);
  }

  async addMovement(input: {
    movementType: CashMovementType;
    amount: number;
    concept: string;
    userId: string;
  }) {
    const session = await this.getOpenSessionOrFail();
    const user = await this.userRepo.findById(input.userId);
    if (!user) throw new AppError("Usuario no encontrado", 404, "USER_NOT_FOUND");

    const movement = this.movementRepo.create({
      cashSession: session,
      movementType: input.movementType,
      amount: input.amount.toFixed(2),
      concept: input.concept,
      user,
    });
    return this.movementRepo.save(movement);
  }

  async closeCash(closingBalance: number, userId: string) {
    const session = await this.getOpenSessionOrFail();
    const user = await this.userRepo.findById(userId);
    if (!user) throw new AppError("Usuario no encontrado", 404, "USER_NOT_FOUND");

    const totals = await this.movementRepo.sumBySession(session.id);
    const income = totals.income;
    const expense = totals.expense;
    const expected = Number(session.openingBalance) + income - expense;
    const difference = closingBalance - expected;

    session.status = CashSessionStatus.CLOSED;
    session.closedAt = new Date();
    session.closedBy = user;
    session.closingBalance = closingBalance.toFixed(2);
    session.expectedBalance = expected.toFixed(2);
    session.difference = difference.toFixed(2);

    return this.sessionRepo.save(session);
  }

  async getSessionHistory() {
    return this.sessionRepo.findHistory();
  }
}
