import "dotenv/config";
import express from "express";
import type { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import http from "node:http";
import { Server as IOServer } from "socket.io";
import { mainRouter } from "./routes/index.js";


import { globalRateLimiter } from "./middlewares/security.middleware.js";

const app: Application = express();

// Middlewares globales esenciales
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(globalRateLimiter);
app.use(express.json({ limit: "2mb" })); // Limite de tamaño para evitar abusos|

// Enrutador principal montado en '/'
app.use("/", mainRouter);

// Middleware de manejo de errores global
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
	console.error("Unhandled error:", err instanceof Error ? err.stack || err.message : err);
	const message = err instanceof Error ? err.message : "Internal Server Error";
	res.status(500).json({ status: 500, error: "Internal Server Error", message });
});

// Crear servidor HTTP manualmente y adjuntar Socket.IO
const port = Number(process.env.PORT ?? 3000);
const server = http.createServer(app);
const io = new IOServer(server, { cors: { origin: "*" } });

// Exportamos instancias para pruebas o uso externo
export { app, server, io };

// Arrancamos el servidor solo si este módulo es el entrypoint principal
server.listen(port, () => {
  console.log(`🚀 Gateway/BFF running on port ${port}`);
});

export default app;
