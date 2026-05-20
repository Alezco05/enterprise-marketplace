import type { Application } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

export function setupProxies(app: Application): void {
  app.use(
    "/api/v1/auth",
    createProxyMiddleware({
      target: process.env.IDENTITY_SERVICE_URL as string,
      changeOrigin: true,
      pathRewrite: { "^/api/v1/auth": "" },
      logLevel: "silent",
    }),
  );

  app.use(
    "/api/v1/catalog",
    createProxyMiddleware({
      target: process.env.CATALOG_SERVICE_URL as string,
      changeOrigin: true,
      pathRewrite: { "^/api/v1/catalog": "" },
      logLevel: "silent",
    }),
  );

  app.use(
    "/api/v1/orders",
    createProxyMiddleware({
      target: process.env.ORDER_SERVICE_URL as string,
      changeOrigin: true,
      pathRewrite: { "^/api/v1/orders": "" },
      logLevel: "silent",
    }),
  );
}
