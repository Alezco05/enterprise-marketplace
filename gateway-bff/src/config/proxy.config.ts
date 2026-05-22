// 🚀 SOLUCIÓN 2: Usamos "import type" para cumplir estrictamente con verbatimModuleSyntax
import type { Options } from "http-proxy-middleware";
import { fixRequestBody } from "http-proxy-middleware"; // Importamos la función nativa de re-inyección de bytes

export const getSharedProxyOptions = (serviceName: string): Options => ({
  changeOrigin: true,
  logger: console,
  
  on: {
    // 🚀 SOLUCIÓN 1: En la versión 4.x, los bytes se re-inyectan llamando a la función fixRequestBody 
    // dentro del evento del ciclo de vida proxyReq
    proxyReq: (proxyReq, req, res, options) => {
      fixRequestBody(proxyReq, req);
    },
    
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
