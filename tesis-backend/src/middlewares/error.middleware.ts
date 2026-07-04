import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError, isAppError } from "../utils/app-error.util";
import { fail } from "../utils/response.util";

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json(fail(`Ruta no encontrada: ${req.originalUrl}`, "NOT_FOUND"));
};

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (isAppError(error)) {
    res.status(error.statusCode).json(fail(error.message, error.code));
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json(fail("Error de validacion", "VALIDATION_ERROR", error.flatten()));
    return;
  }

  if (error instanceof Error) {
    res.status(500).json(fail(error.message));
    return;
  }

  const fallback = new AppError("Error interno del servidor");
  res.status(fallback.statusCode).json(fail(fallback.message, fallback.code));
};
