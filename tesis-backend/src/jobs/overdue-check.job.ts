import { CreditService } from "../services/credit.service";

export const startOverdueJob = () => {
  const creditService = new CreditService();
  const run = async () => {
    try {
      const updated = await creditService.markOverdueCredits();
      if (updated.length > 0) {
        console.log(`[OverdueJob] Marcados ${updated.length} créditos como OVERDUE`);
      }
    } catch (error) {
      console.error("[OverdueJob] Error:", error);
    }
  };

  // Run immediately then every hour
  run();
  setInterval(run, 60 * 60 * 1000);
};
