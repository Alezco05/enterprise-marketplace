
import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { getSharedProxyOptions } from "../config/proxy.config.js";
import { validateJwt } from "../middlewares/auth.middleware.js";
import { injectUserHeaders } from "../utils/proxy.util.js";

const router = Router();
const target = process.env.ORDER_SERVICE_URL || "http://localhost:5003";

// 🔏 Obligamos a que TODAS las rutas de este módulo pasen por la verificación de firma del JWT
router.use(validateJwt);

router.use(
  "/",
  createProxyMiddleware({
    target,
    ...getSharedProxyOptions("OrderService"),
    on: {
      ...getSharedProxyOptions("OrderService").on,
      // 🚀 Usamos el helper directamente. Ahora cualquier otra ruta protegida 
      // (como pagos o inventario) solo tendrá que llamar a esta misma línea.
      proxyReq: (proxyReq, req) => injectUserHeaders(proxyReq, req as any)
    }
  })
);

export const orderRoutes = router;
