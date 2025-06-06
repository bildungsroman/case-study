import { NextRequest, NextResponse } from "next/server";

// This API route returns the stored Spotify access token
export async function GET(request: NextRequest) {
  try {
    // Get the token from cookies
    const token = request.cookies.get("spotify_token")?.value;

    if (token) {
      return NextResponse.json({
        access_token: token,
        expires_at: Date.now() + 3600 * 1000, // Assume 1 hour expiry
      });
    }

    // No token found
    return NextResponse.json(
      {
        access_token: null,
        error: "No token found",
      },
      { status: 401 }
    );
  } catch (error) {
    console.error("Error getting token:", error);
    return NextResponse.json(
      {
        access_token: null,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
