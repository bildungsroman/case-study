import { NextRequest, NextResponse } from "next/server";
import { getBaseUrl, logEnvironmentInfo } from "@/lib/url-utils";

// Generate a random string for state parameter
function generateRandomString(length: number): string {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let text = "";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// This is a server-side API route that handles login requests
export async function GET(request: NextRequest) {
  try {
    const spotify_client_id = process.env.SPOTIFY_CLIENT_ID;

    if (!spotify_client_id) {
      console.error("SPOTIFY_CLIENT_ID is not set");
      return NextResponse.redirect(new URL("/?error=config", request.url));
    }

    // Get the correct base URL for this environment
    const baseUrl = getBaseUrl(request);
    const spotify_redirect_uri = `${baseUrl}/auth/callback`;

    // Log environment info for debugging
    logEnvironmentInfo(baseUrl, "Login");
    console.log(`🔗 Login redirect URI: ${spotify_redirect_uri}`);

    const scope = "streaming user-read-email user-read-private";
    const state = generateRandomString(16);

    const auth_query_parameters = new URLSearchParams({
      response_type: "code",
      client_id: spotify_client_id,
      scope: scope,
      redirect_uri: spotify_redirect_uri,
      state: state,
    });

    const spotifyAuthUrl =
      "https://accounts.spotify.com/authorize/?" +
      auth_query_parameters.toString();

    // Redirect to the Spotify authorization page
    return NextResponse.redirect(spotifyAuthUrl);
  } catch (error) {
    console.error("Error in login API route:", error);
    // If there's an error, redirect to the home page
    return NextResponse.redirect(new URL("/?error=login", request.url));
  }
}
