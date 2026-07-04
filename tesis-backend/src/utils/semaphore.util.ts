import { Credit } from "../entities/credit.entity";
import { CreditStatus } from "../entities/enums/credit-status.enum";

interface SemaphoreResult {
  status: "GREEN" | "YELLOW" | "RED";
  reason: string;
  daysToDue?: number;
}

export const calculateSemaphore = (credits: Credit[], dueSoonDays: number, today = new Date()): SemaphoreResult => {
  const activeCredits = credits.filter((credit) => credit.status !== CreditStatus.PAID);

  if (activeCredits.length === 0) {
    return { status: "GREEN", reason: "Cliente sin deudas pendientes" };
  }

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const localTodayStr = `${year}-${month}-${day}`;
  const normalizedToday = new Date(`${localTodayStr}T00:00:00`);

  const overdue = activeCredits.find((credit) => {
    let creditDateStr = String(credit.dueDate);
    if (typeof credit.dueDate !== "string") {
      const d = credit.dueDate as unknown as Date;
      creditDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    } else {
      creditDateStr = creditDateStr.slice(0, 10);
    }
    return creditDateStr < localTodayStr;
  });

  if (overdue) {
    return { status: "RED", reason: "Cliente moroso con deuda vencida" };
  }

  const sorted = activeCredits
    .map((credit) => {
      let dueDate: Date;
      if (typeof credit.dueDate !== "string") {
        dueDate = credit.dueDate as unknown as Date;
      } else {
        dueDate = new Date(`${String(credit.dueDate).slice(0, 10)}T00:00:00`);
      }
      const diffMs = dueDate.getTime() - normalizedToday.getTime();
      const daysToDue = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      return { credit, daysToDue };
    })
    .sort((a, b) => a.daysToDue - b.daysToDue);

  const closest = sorted[0];

  if (closest.daysToDue <= dueSoonDays) {
    return { status: "YELLOW", reason: "Deuda cercana a vencer", daysToDue: closest.daysToDue };
  }

  return { status: "GREEN", reason: "Cliente al dia", daysToDue: closest.daysToDue };
};
