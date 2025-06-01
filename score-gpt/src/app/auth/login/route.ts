import { NextRequest, NextResponse } from "next/server";

// This is a server-side API route that handles login requests
export async function GET(request: NextRequest) {
  try {
    // Forward the request to our backend server
    const response = await fetch("http://localhost:5000/auth/login", {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `Backend server responded with status: ${response.status}`
      );
    }

    // Get the redirect URL from the response
    const redirectUrl = response.url;

    // Redirect to the Spotify authorization page
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Error in login API route:", error);
    // If there's an error, redirect to the home page
    return NextResponse.redirect(new URL("/", request.url));
  }
}
