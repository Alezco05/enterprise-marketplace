import express from "express";
import type { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import http from "http";
import { Server as IOServer } from "socket.io";
import { mainRouter } from "./routes/index.js";

const app: Application = express();

// Middlewares globales esenciales
app.use(helmet());
app.use(cors());
app.use(express.json());

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
if (process.argv[1] && process.argv[1].endsWith("app.ts")) {
	server.listen(port, () => {
		// Mensaje minimal y claro de que el Gateway/BFF está corriendo
		// Evitamos exponer lógica de negocio aquí
		// eslint-disable-next-line no-console
		console.log(`Gateway/BFF running on port ${port}`);
	});
}

export default app;
