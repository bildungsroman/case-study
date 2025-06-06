import { NextRequest } from "next/server";

/**
 * Get the correct base URL for the current environment
 * Handles Vercel deployments, custom domains, and local development
 */
export function getBaseUrl(request?: NextRequest): string {
  // 1. Check for explicit NEXT_PUBLIC_APP_URL (highest priority)
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  // 2. For Vercel deployments, use Vercel-specific environment variables
  if (process.env.VERCEL) {
    // Production deployment
    if (
      process.env.VERCEL_ENV === "production" &&
      process.env.VERCEL_PROJECT_PRODUCTION_URL
    ) {
      return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    }

    // Preview/branch deployments
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }
  }

  // 3. Extract from request headers as fallback (if request is provided)
  if (request) {
    const host = request.headers.get("host");
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    if (host) {
      return `${protocol}://${host}`;
    }
  }

  // 4. Default fallback for local development
  return "http://localhost:3000";
}

/**
 * Log environment information for debugging
 */
export function logEnvironmentInfo(baseUrl: string, context: string) {
  console.log(`🔗 ${context} base URL: ${baseUrl}`);
  console.log(`🌍 Environment: ${process.env.VERCEL_ENV || "development"}`);
  console.log(`📦 Vercel: ${process.env.VERCEL ? "Yes" : "No"}`);
  console.log(
    `🎯 NEXT_PUBLIC_APP_URL: ${process.env.NEXT_PUBLIC_APP_URL || "Not set"}`
  );
  console.log(`🔧 VERCEL_URL: ${process.env.VERCEL_URL || "Not set"}`);
}
