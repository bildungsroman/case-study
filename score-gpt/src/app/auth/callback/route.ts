import { NextRequest, NextResponse } from "next/server";
import { getBaseUrl, logEnvironmentInfo } from "@/lib/url-utils";

// This is a server-side API route that handles the Spotify callback
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  // Handle Spotify authorization errors
  if (error) {
    console.error("Spotify authorization error:", error);
    return NextResponse.redirect(new URL("/?error=spotify_auth", request.url));
  }

  if (!code) {
    console.error("No authorization code received");
    return NextResponse.redirect(new URL("/?error=no_code", request.url));
  }

  try {
    const spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
    const spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!spotify_client_id || !spotify_client_secret) {
      console.error("Spotify credentials not configured");
      return NextResponse.redirect(new URL("/?error=config", request.url));
    }

    // Get the correct base URL for this environment
    const baseUrl = getBaseUrl(request);
    const spotify_redirect_uri = `${baseUrl}/auth/callback`;

    // Log environment info for debugging
    logEnvironmentInfo(baseUrl, "Callback");
    console.log(`🔗 Callback redirect URI: ${spotify_redirect_uri}`);

    // Exchange the authorization code for an access token
    const tokenResponse = await fetch(
      "https://accounts.spotify.com/api/token",
      {
        method: "POST",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              spotify_client_id + ":" + spotify_client_secret
            ).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code: code,
          redirect_uri: spotify_redirect_uri,
          grant_type: "authorization_code",
        }),
      }
    );

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error("Token exchange failed:", tokenResponse.status, errorData);
      return NextResponse.redirect(
        new URL("/?error=token_exchange", request.url)
      );
    }

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      console.error("No access token received");
      return NextResponse.redirect(new URL("/?error=no_token", request.url));
    }

    console.log("✅ Successfully received access token");

    // Create response and set the token in a secure cookie
    const redirectResponse = NextResponse.redirect(new URL("/", request.url));

    // Set the access token cookie
    redirectResponse.cookies.set("spotify_token", tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: tokenData.expires_in || 3600, // Use Spotify's expiry time or default to 1 hour
      path: "/",
    });

    // Also set refresh token if provided
    if (tokenData.refresh_token) {
      redirectResponse.cookies.set(
        "spotify_refresh_token",
        tokenData.refresh_token,
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 30, // 30 days
          path: "/",
        }
      );
    }

    return redirectResponse;
  } catch (error) {
    console.error("Error in callback:", error);
    return NextResponse.redirect(new URL("/?error=callback", request.url));
  }
}
