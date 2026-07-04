import { NextFunction, Request, Response } from "express";
import { UserRole } from "../entities/enums/user-role.enum";
import { verifyToken } from "../utils/jwt.util";
import { AppError } from "../utils/app-error.util";
import { UserRepository } from "../repositories/user.repository";

export const requireAuth = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError("Token no proporcionado", 401, "UNAUTHORIZED");
    }

    const token = authHeader.split(" ")[1];
    let payload;
    try {
      payload = verifyToken(token);
    } catch {
      throw new AppError("Token inválido o expirado", 401, "UNAUTHORIZED");
    }

    // Single-session enforcement
    const userRepo = new UserRepository();
    const user = await userRepo.findActiveSessionUser(payload.userId);

    if (!user) {
      throw new AppError("Usuario no encontrado", 401, "UNAUTHORIZED");
    }

    if (user.sessionToken !== payload.sessionToken) {
      throw new AppError(
        "Tu sesión fue iniciada en otro dispositivo. Vuelve a iniciar sesión.",
        401,
        "SESSION_INVALIDATED",
      );
    }

    req.auth = payload;
    next();
  } catch (err) {
    next(err);
  }
};

export const allowRoles = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.auth) throw new AppError("No autenticado", 401, "UNAUTHORIZED");
    if (!roles.includes(req.auth.role)) throw new AppError("No autorizado para esta acción", 403, "FORBIDDEN");
    next();
  };
};
