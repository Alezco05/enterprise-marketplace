import type { Request, Response, NextFunction } from "express";
import { ZodError, type ZodType } from "zod";
import { sendErrorResponse } from "../utils/response.util.js";

export const validateSchema = (schema: ZodType) => 
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Valida body, query y params de Express
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      
      next(); // Datos perfectos, avanza por la tubería hacia el proxy de .NET
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        // 🚀 CORRECCIÓN AQUÍ: Usamos el método oficial .issues propio de ZodError
        const details = error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);
        const formattedMessage = `Errores de validación: ${details.join(" | ")}`;

        return sendErrorResponse({
          res,
          status: 400,
          error: "Bad Request",
          message: formattedMessage
        });
      }

      return sendErrorResponse({
        res,
        status: 500,
        error: "Internal Server Error",
        message: "Ocurrió un error inesperado al validar los esquemas de datos."
      });
    }
  };
