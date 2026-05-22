import type { Response } from "express";

export interface ErrorResponseOptions {
  res: Response;
  status: number;
  error: string;
  message: string;
}

export function sendErrorResponse({ res, status, error, message }: ErrorResponseOptions): void {
  res.status(status).json({
    status,
    error,
    message,
    timestamp: new Date().toISOString() // ✨ Una mejora Senior: Añadir marcas de tiempo automáticas para auditoría
  });
}
