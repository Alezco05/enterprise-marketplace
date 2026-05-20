import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { getSharedProxyOptions } from "../config/proxy.config.js";


const router = Router();
const target = process.env.ORDER_SERVICE_URL || "http://localhost:5003";

// 🔏 Todas las rutas de órdenes exigen token de forma obligatoria en el Gateway
//router.use(validateJwt);

// Endpoint crítico: Valida el JSON de la compra antes de golpear a .NET
router.post("/", createProxyMiddleware({
  target,
  ...getSharedProxyOptions("OrderService")
}));

// Rutas generales de órdenes (listar mis órdenes, ver detalles, etc.)
router.use("/", createProxyMiddleware({
  target,
  ...getSharedProxyOptions("OrderService")
}));

export const orderRoutes = router;
