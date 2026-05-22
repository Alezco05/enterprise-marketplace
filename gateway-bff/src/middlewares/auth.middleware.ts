import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtUserPayload } from "../types/auth.types.js";
import { sendErrorResponse } from "../utils/response.util.js";

const JWT_SECRET: string = process.env.JWT_SECRET ?? "TuClaveSecretaSuperSeguraParaDesarrolloLocal123!";

export function validateJwt(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return sendErrorResponse({
      res,
      status: 401,
      error: "Unauthorized",
      message: "Token de autenticación ausente o mal formateado."
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return sendErrorResponse({
      res,
      status: 401,
      error: "Unauthorized",
      message: "Token de autenticación ausente o mal formateado."
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as JwtUserPayload;
    req.user = decoded;
    next();
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn("⚠️ Intento de acceso con token inválido:", msg);
    
    return sendErrorResponse({
      res,
      status: 401,
      error: "Unauthorized",
      message: "El token es inválido o ha expirado."
    });
  }
}
