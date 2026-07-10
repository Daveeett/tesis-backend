import jwt from "jsonwebtoken";
import { config } from "../config/environment";
import { UserRole } from "../entities/enums/user-role.enum";

export interface JwtPayload {
  userId: string;
  role: UserRole;
  sessionToken: string;
}

export const signToken = (payload: JwtPayload): string =>
  jwt.sign(payload, config.encryption.jwtSecret, { expiresIn: config.encryption.jwtExpiresIn as jwt.SignOptions["expiresIn"] });

export const verifyToken = (token: string): JwtPayload =>
  jwt.verify(token, config.encryption.jwtSecret) as JwtPayload;
