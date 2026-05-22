import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { getSharedProxyOptions } from "../config/proxy.config.js";
import { validateSchema } from "../middlewares/validate.middleware.js";
import { LoginSchema, RegisterSchema } from "../schemas/auth.schema.js";

const router = Router();
const target = process.env.IDENTITY_SERVICE_URL || "http://127.0.0.1:5066";

// 🎯 Interceptamos el POST /login
router.post(
  "/login", 
  validateSchema(LoginSchema), 
  createProxyMiddleware({
    target,
    ...getSharedProxyOptions("IdentityService"),
    // 🚀 EXPLICACIÓN: Toma el "/" inicial del endpoint y lo reescribe como "/api/auth/"
    pathRewrite: { "^/": "/api/auth/" } 
  })
);

// 🎯 Interceptamos el POST /register
router.post(
  "/register", 
  validateSchema(RegisterSchema), 
  createProxyMiddleware({
    target,
    ...getSharedProxyOptions("IdentityService"),
    // 🚀 EXPLICACIÓN: Transforma el "/" inicial de la subruta en "/api/auth/" para que .NET lo entienda
    pathRewrite: { "^/": "/api/auth/" } 
  })
);

// 🌍 Comodín
router.use(
  "/", 
  createProxyMiddleware({
    target,
    ...getSharedProxyOptions("IdentityService"),
    pathRewrite: { "^/": "/api/auth/" }
  })
);

export const authRoutes = router;
