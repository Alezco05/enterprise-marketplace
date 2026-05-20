import type { Options } from "http-proxy-middleware";

export const getSharedProxyOptions = (serviceName: string): Options => ({
  changeOrigin: true,
  logger: console,
  on: {
    error: (err: Error, req: any, res: any): void => {
      console.error(`❌ [${serviceName}] Error de conexión:`, err.message);
      if (res && typeof res.status === "function") {
        res.status(503).json({
          status: 503,
          error: "Service Unavailable",
          message: `El servicio de ${serviceName} no está disponible temporalmente.`
        });
      }
    }
  }
});
