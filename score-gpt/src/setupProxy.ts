import { createProxyMiddleware } from "http-proxy-middleware";
import type { Express } from "express";

/**
 * Sets up proxy middleware for development server
 * @param app Express application
 */
module.exports = function (app: Express) {
  app.use(
    "/auth",
    createProxyMiddleware({
      target: "http://localhost:8000",
      changeOrigin: true,
    })
  );
};
