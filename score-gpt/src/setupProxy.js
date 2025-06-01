import { createProxyMiddleware } from "http-proxy-middleware";

export default function setupProxy(app) {
  app.use(
    "/auth/**",
    createProxyMiddleware({
      target: "http://localhost:5000",
    })
  );
}
