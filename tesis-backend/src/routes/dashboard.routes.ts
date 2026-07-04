import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.util";
import { UserRole } from "../entities/enums/user-role.enum";
import { allowRoles } from "../middlewares/auth.middleware";
import { dashboardController } from "../controllers/dashboard.controller";

export const dashboardRoutes = Router();

dashboardRoutes.get(
  "/alerts/overdue",
  allowRoles(UserRole.ADMIN),
  asyncHandler(dashboardController.getOverdueAlerts),
);

dashboardRoutes.get(
  "/stats",
  allowRoles(UserRole.ADMIN),
  asyncHandler(dashboardController.getDashboardStats),
);
