import { UserRole } from "../entities/enums/user-role.enum";
import { hashPassword } from "../utils/password.util";
import { UserRepository } from "../repositories/user.repository";

export const seedAdmin = async (): Promise<void> => {
  const repo = new UserRepository();
  const exists = await repo.findByEmail("admin@minimarket.local");
  if (exists) return;

  const admin = repo.create({
    name: "Administrador",
    email: "admin@minimarket.local",
    passwordHash: await hashPassword("Admin123*"),
    role: UserRole.ADMIN,
    isActive: true,
  });
  await repo.save(admin);
};
