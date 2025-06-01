import { NextRequest, NextResponse } from "next/server";

// This is a server-side API route that handles the Spotify callback
export async function GET(request: NextRequest) {
  // Get the code and state from the URL
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code) {
    // If there's no code, redirect to the home page
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    // Forward the code to our backend server
    const response = await fetch("http://localhost:5000/auth/callback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, state }),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `Backend server responded with status: ${response.status}`
      );
    }

    const data = await response.json();

    // If we got a token, set it in a cookie and redirect to the home page
    if (data.access_token) {
      const redirectResponse = NextResponse.redirect(new URL("/", request.url));

      // Set the cookie in the response
      redirectResponse.cookies.set("spotify_token", data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600,
        path: "/",
      });

      return redirectResponse;
    }

    // If we didn't get a token, redirect to the home page
    return NextResponse.redirect(new URL("/", request.url));
  } catch (error) {
    console.error("Error in callback:", error);
    // If there's an error, redirect to the home page
    return NextResponse.redirect(new URL("/", request.url));
  }
}
