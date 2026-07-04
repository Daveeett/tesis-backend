import jwt from "jsonwebtoken";
import { env } from "../config/environment";
import { UserRole } from "../entities/enums/user-role.enum";

export interface JwtPayload {
  userId: string;
  role: UserRole;
  sessionToken: string;
}

export const signToken = (payload: JwtPayload): string =>
  jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] });

export const verifyToken = (token: string): JwtPayload =>
  jwt.verify(token, env.JWT_SECRET) as JwtPayload;
