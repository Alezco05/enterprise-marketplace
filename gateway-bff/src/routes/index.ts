import { Router } from "express";
import { authRoutes } from "./auth.routes.js";
import { orderRoutes } from "./order.routes.js";

const router = Router();

// Mapeo limpio y escalable
router.use("/api/v1/auth", authRoutes);
router.use("/api/v1/orders", orderRoutes);
// Al añadir más microservicios, solo agregas una línea aquí. Ejemplo:
// router.use("/api/v1/payments", paymentRoutes);

export const mainRouter = router;
