import { Request, Response } from "express";
import { z } from "zod";
import { AuthService } from "../services/auth.service";
import { ok } from "../utils/response.util";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const cajeroSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

class AuthController {
  private readonly authService = new AuthService();

  login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = loginSchema.parse(req.body);
    const ip = (req.headers["x-forwarded-for"] as string) || req.ip || "unknown";
    const result = await this.authService.login(email, password, ip);
    res.status(200).json(ok("Login exitoso", result));
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    const userId = req.auth!.userId;
    await this.authService.revokeSession(userId);
    res.status(200).json(ok("Sesion cerrada", null));
  };

  createCajero = async (req: Request, res: Response): Promise<void> => {
    const input = cajeroSchema.parse(req.body);
    const result = await this.authService.createCajero(input);
    res.status(201).json(ok("Cajero creado", result));
  };
}

export const authController = new AuthController();
