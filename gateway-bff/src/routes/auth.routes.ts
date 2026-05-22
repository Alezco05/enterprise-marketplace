import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { getSharedProxyOptions } from "../config/proxy.config.js";
import { validateSchema } from "../middlewares/validate.middleware.js";
import { LoginSchema, RegisterSchema } from "../schemas/auth.schema.js";

const router = Router();
const target = process.env.IDENTITY_SERVICE_URL || "http://localhost:5001";

// 🎯 Interceptamos el POST /login: Se valida con Zod y si pasa, se redirige por la tubería proxy a .NET
router.post(
  "/login", 
  validateSchema(LoginSchema), 
  createProxyMiddleware({
    target,
    ...getSharedProxyOptions("IdentityService")
  })
);

// 🎯 Interceptamos el POST /register: Se valida con Zod (mínimo 6 caracteres de clave) antes de ir a .NET
router.post(
  "/register", 
  validateSchema(RegisterSchema), 
  createProxyMiddleware({
    target,
    ...getSharedProxyOptions("IdentityService")
  })
);

// 🌍 Comodín: Cualquier otra ruta secundaria de auth pasa directo sin validación previa del BFF
router.use(
  "/", 
  createProxyMiddleware({
    target,
    ...getSharedProxyOptions("IdentityService")
  })
);

export const authRoutes = router;
