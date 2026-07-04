import { Router } from "express";
import rateLimit from "express-rate-limit";
import { asyncHandler } from "../utils/async-handler.util";
import { requireAuth, allowRoles } from "../middlewares/auth.middleware";
import { UserRole } from "../entities/enums/user-role.enum";
import { authController } from "../controllers/auth.controller";

// Strict rate limit for auth routes: 10 attempts per 15min per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Demasiados intentos. Intenta en 15 minutos.", error: { code: "RATE_LIMITED" } },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authRoutes = Router();

authRoutes.post("/login", authLimiter, asyncHandler(authController.login));
authRoutes.post("/logout", requireAuth, asyncHandler(authController.logout));
authRoutes.post(
  "/cajeros",
  requireAuth,
  allowRoles(UserRole.ADMIN),
  asyncHandler(authController.createCajero),
);
