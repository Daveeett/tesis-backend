import PDFKit from "pdfkit";
import ExcelJS from "exceljs";
import { CreditAccountRepository } from "../repositories/credit-account.repository";

const streamToBuffer = (doc: PDFKit.PDFDocument): Promise<Buffer> =>
  new Promise((resolve) => {
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });

function drawHeader(doc: PDFKit.PDFDocument, title: string) {
  doc.rect(0, 0, doc.page.width, 100).fill("#002A5C");
  doc.fillColor("#FFDD00").fontSize(24).font("Helvetica-Bold").text("MINI MARKET URBANO", 50, 35);
  doc.fillColor("#FFFFFF").fontSize(14).font("Helvetica").text(title, 50, 65);
  doc.fillColor("#000000");
  doc.y = 130;
}

export class ReportService {
  private readonly creditAccountRepo = new CreditAccountRepository();

  async buildReceivablesReport(): Promise<Buffer> {
    const accounts = await this.creditAccountRepo.findAllWithCustomerByBalance();

    const doc = new PDFKit({ margin: 50, size: "A4" });
    drawHeader(doc, "REPORTE DE CUENTAS POR COBRAR (CARTERA ACTIVA)");

    let globalPending = 0;
    const headY = doc.y;
    doc.rect(50, headY, doc.page.width - 100, 25).fill("#002A5C");
    doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(10);
    doc.text("CLIENTE", 60, headY + 7, { lineBreak: false });
    doc.text("DEUDA TOTAL", 280, headY + 7, { lineBreak: false });
    doc.text("PAGADO", 380, headY + 7, { lineBreak: false });
    doc.text("SALDO PENDIENTE", 460, headY + 7, { lineBreak: false });
    doc.y = headY + 25;

    accounts.forEach((account, i) => {
      const pending = Number(account.currentBalance);
      if (pending <= 0) return;
      globalPending += pending;

      const rowY = doc.y;
      if (i % 2 === 0) doc.rect(50, rowY, doc.page.width - 100, 20).fill("#F8FAFC");
      doc.fillColor("#002A5C").font("Helvetica-Bold").fontSize(10);
      doc.text(account.customer.fullName, 60, rowY + 5, { lineBreak: false });
      doc.fillColor("#4A5568").font("Helvetica");
      doc.text(`$${account.totalDebt}`, 280, rowY + 5, { lineBreak: false });
      doc.text(`$${account.totalPaid}`, 380, rowY + 5, { lineBreak: false });
      doc.fillColor("#DC2626").font("Helvetica-Bold");
      doc.text(`$${account.currentBalance}`, 460, rowY + 5, { lineBreak: false });
      doc.y = rowY + 20;
    });

    doc.moveDown(2);
    const summaryY = doc.y;
    doc.rect(280, summaryY, doc.page.width - 330, 40).fillAndStroke("#FFF5F5", "#DC2626");
    doc.fillColor("#DC2626").font("Helvetica-Bold").fontSize(12);
    doc.text("TOTAL CARTERA POR COBRAR:", 295, summaryY + 15, { lineBreak: false });
    doc.fontSize(16).text(`$${globalPending.toFixed(2)}`, 495, summaryY + 15, { lineBreak: false });

    doc.end();
    return streamToBuffer(doc);
  }

  async buildReceivablesExcel(): Promise<Buffer> {
    const accounts = await this.creditAccountRepo.findAllWithCustomerByBalance();

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Mini Market Urbano";
    workbook.created = new Date();

    const sheet = workbook.addWorksheet("Cartera por Cobrar");

    // Header styling
    sheet.mergeCells("A1:E1");
    const titleCell = sheet.getCell("A1");
    titleCell.value = "MINI MARKET URBANO - Cartera por Cobrar";
    titleCell.font = { bold: true, size: 16, color: { argb: "FFDD00" } };
    titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "002A5C" } };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    sheet.getRow(1).height = 35;

    // Column headers
    const headers = ["Cliente", "Deuda Total", "Pagado", "Saldo Pendiente", "Última Actividad"];
    const headerRow = sheet.addRow(headers);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFF" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "003580" } };
      cell.alignment = { horizontal: "center" };
      cell.border = { bottom: { style: "thin" } };
    });

    sheet.columns = [
      { key: "name", width: 35 },
      { key: "debt", width: 16 },
      { key: "paid", width: 14 },
      { key: "balance", width: 20 },
      { key: "lastActivity", width: 22 },
    ];

    let grandTotal = 0;
    accounts.forEach((account, i) => {
      const pending = Number(account.currentBalance);
      if (pending <= 0) return;
      grandTotal += pending;

      const row = sheet.addRow([
        account.customer.fullName,
        Number(account.totalDebt),
        Number(account.totalPaid),
        pending,
        account.lastActivityAt ? new Date(account.lastActivityAt).toLocaleDateString("es-EC") : "-",
      ]);

      if (i % 2 === 0) {
        row.eachCell((cell) => {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "F0F4FF" } };
        });
      }
      const balanceCell = row.getCell(4);
      balanceCell.font = { bold: true, color: { argb: "DC2626" } };
    });

    // Total row
    const totalRow = sheet.addRow(["TOTAL CARTERA POR COBRAR", "", "", grandTotal, ""]);
    totalRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF5F5" } };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
