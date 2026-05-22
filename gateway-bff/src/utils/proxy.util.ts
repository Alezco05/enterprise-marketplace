import type { ClientRequest } from "http";
import type { Request } from "express";

export function injectUserHeaders(proxyReq: ClientRequest, req: Request): void {
  if (req.user) {
    // Seteamos strings limpios y seguros para los microservicios internos
    proxyReq.setHeader("X-User-Id", req.user.sub);
    proxyReq.setHeader("X-User-Email", req.user.email);
    proxyReq.setHeader("X-User-Roles", JSON.stringify(req.user.roles));
    
    // Eliminamos el token original para evitar fugas de información internas
    proxyReq.removeHeader("Authorization");
  }
}
