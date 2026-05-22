import rateLimit from "express-rate-limit";

export const globalRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 100, // Máximo 100 peticiones por IP por minuto
  standardHeaders: true, // Devuelve información de límite en los headers RateLimit-*
  legacyHeaders: false, // Desactiva los headers X-RateLimit-* antiguos
  message: {
    status: 429,
    error: "Too Many Requests",
    message: "Has superado el límite de peticiones permitidas por minuto. Inténtalo más tarde."
  }
});
