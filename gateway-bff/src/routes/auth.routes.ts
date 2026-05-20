import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { getSharedProxyOptions } from "../config/proxy.config.js";

const router = Router();
const target = process.env.IDENTITY_SERVICE_URL || "http://localhost:5001";

// 🔐 Endpoints específicos: Tienen validación estricta en Express antes de ir a .NET
router.post("/login", createProxyMiddleware({
  target,
  ...getSharedProxyOptions("IdentityService")
}));

router.post("/register", createProxyMiddleware({
  target,
  ...getSharedProxyOptions("IdentityService")
}));

// 🌍 Comodín del módulo: Cualquier otra cosa de auth (logout, perfil, etc.) pasa directo sin validación en el BFF
router.use("/", createProxyMiddleware({
  target,
  ...getSharedProxyOptions("IdentityService")
}));

export const authRoutes = router;
