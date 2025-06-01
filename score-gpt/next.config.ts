import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Set build output directory to 'build' instead of '.next'
  distDir: "build",

  // Enable server components and server-side rendering
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
  env: {
    NEXT_PUBLIC_APP_URL:
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  },
};

export default nextConfig;
