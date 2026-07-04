import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.util";
import { UserRole } from "../entities/enums/user-role.enum";
import { allowRoles } from "../middlewares/auth.middleware";
import { reportController } from "../controllers/report.controller";

export const reportRoutes = Router();

reportRoutes.get(
  "/receivables",
  allowRoles(UserRole.ADMIN),
  asyncHandler(reportController.buildReceivablesReport),
);

reportRoutes.get(
  "/receivables/excel",
  allowRoles(UserRole.ADMIN),
  asyncHandler(reportController.buildReceivablesExcel),
);
