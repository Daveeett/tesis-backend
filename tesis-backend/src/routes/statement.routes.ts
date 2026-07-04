import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.util";
import { statementController } from "../controllers/statement.controller";

export const statementRoutes = Router();

statementRoutes.post(
  "/generate/:customerId",
  asyncHandler(statementController.generateToken),
);
