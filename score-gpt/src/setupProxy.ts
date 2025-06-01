import { createProxyMiddleware, Options } from "http-proxy-middleware";
import { Express } from "express";

module.exports = function (app: Express): void {
  app.use(
    "/auth",
    createProxyMiddleware({
      target: "http://localhost:5000",
      changeOrigin: true,
      // Using any type to bypass the type error since logLevel is supported but not in the types
      ...({ logLevel: "debug" } as any as Options),
    })
  );
};
