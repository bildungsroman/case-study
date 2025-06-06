import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Set build output directory to 'build' instead of '.next'
  distDir: "build",

  // Enable server components and server-side rendering
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "*.vercel.app"],
    },
  },
  env: {
    NEXT_PUBLIC_APP_URL:
      process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000",
  },
};

export default nextConfig;
