import { AppDataSource } from "./config/data-source";
import { config } from "./config/environment";
import { createApp } from "./app";
import { seedAdmin } from "./services/seed.service";
import { startOverdueJob } from "./jobs/overdue-check.job";

const bootstrap = async (): Promise<void> => {
  await AppDataSource.initialize();
  await seedAdmin();
  startOverdueJob();

  const app = createApp();

  app.listen(config.server.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on port ${config.server.port}`);
  });
};

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Failed to bootstrap server", error);
  process.exit(1);
});
