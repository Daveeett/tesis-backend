import { UserRole } from "../entities/enums/user-role.enum";
import { comparePassword, hashPassword } from "../utils/password.util";
import { AppError } from "../utils/app-error.util";
import { signToken } from "../utils/jwt.util";
import { randomUUID } from "crypto";
import { UserRepository } from "../repositories/user.repository";

// In-memory IP lockout store
const ipAttempts = new Map<string, { count: number; until: number }>();
const MAX_IP_ATTEMPTS = 10;
const IP_LOCKOUT_MS = 15 * 60 * 1000;

const MAX_USER_ATTEMPTS = 3;
const USER_LOCKOUT_MS = 15 * 60 * 1000;

export class AuthService {
  private readonly userRepo = new UserRepository();

  async login(email: string, password: string, ip: string) {
    // 1. IP-level check
    const ipEntry = ipAttempts.get(ip);
    if (ipEntry && ipEntry.until > Date.now()) {
      const remaining = Math.ceil((ipEntry.until - Date.now()) / 60000);
      throw new AppError(
        `Demasiados intentos desde esta dirección. Intenta en ${remaining} min.`,
        429,
        "IP_BLOCKED",
      );
    }

    // 2. Find user
    const user = await this.userRepo.findByEmail(email);

    const recordIpFail = () => {
      const e = ipAttempts.get(ip) ?? { count: 0, until: 0 };
      e.count++;
      if (e.count >= MAX_IP_ATTEMPTS) {
        e.until = Date.now() + IP_LOCKOUT_MS;
        e.count = 0;
      }
      ipAttempts.set(ip, e);
    };

    if (!user || !user.isActive) {
      recordIpFail();
      throw new AppError("Credenciales inválidas", 401, "INVALID_CREDENTIALS");
    }

    // 3. Account lockout
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const remaining = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
      throw new AppError(
        `Cuenta bloqueada. Intenta en ${remaining} minutos.`,
        423,
        "ACCOUNT_LOCKED",
      );
    }

    // 4. Validate password
    const isValid = await comparePassword(password, user.passwordHash);

    if (!isValid) {
      recordIpFail();
      user.failedAttempts = (user.failedAttempts ?? 0) + 1;

      if (user.failedAttempts >= MAX_USER_ATTEMPTS) {
        user.lockedUntil = new Date(Date.now() + USER_LOCKOUT_MS);
        user.failedAttempts = 0;
        await this.userRepo.save(user);
        throw new AppError(
          "Cuenta bloqueada por 15 minutos por demasiados intentos fallidos.",
          423,
          "ACCOUNT_LOCKED",
        );
      }

      await this.userRepo.save(user);
      const remaining = MAX_USER_ATTEMPTS - user.failedAttempts;
      throw new AppError(
        `Credenciales inválidas. Te quedan ${remaining} intento(s).`,
        401,
        "INVALID_CREDENTIALS",
      );
    }

    // 5. Rotate session token
    const sessionToken = randomUUID();
    user.failedAttempts = 0;
    user.lockedUntil = null;
    user.sessionToken = sessionToken;
    await this.userRepo.save(user);

    ipAttempts.delete(ip);

    const token = signToken({ userId: user.id, role: user.role, sessionToken });

    return {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  }

  async revokeSession(userId: string): Promise<void> {
    await this.userRepo.update(userId, { sessionToken: null });
  }

  async createCajero(input: { name: string; email: string; password: string }) {
    const existing = await this.userRepo.findByEmail(input.email);
    if (existing) {
      throw new AppError("El correo ya está registrado", 409, "EMAIL_TAKEN");
    }
    const passwordHash = await hashPassword(input.password);
    const user = this.userRepo.create({
      name: input.name,
      email: input.email,
      passwordHash,
      role: UserRole.CAJERO,
      isActive: true,
    });
    const saved = await this.userRepo.save(user);
    return { id: saved.id, name: saved.name, email: saved.email, role: saved.role };
  }
}
