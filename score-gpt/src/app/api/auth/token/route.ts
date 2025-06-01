import { NextRequest, NextResponse } from "next/server";

// This is a server-side API route that handles token requests
export async function GET(request: NextRequest) {
  try {
    // Get the token from cookies using request.cookies instead of cookies()
    const token = request.cookies.get("spotify_token")?.value;

    // If we don't have a token, try to get it from the backend server
    if (!token) {
      console.log("No token in cookies, fetching from backend server");

      try {
        const response = await fetch("http://localhost:5000/auth/token", {
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        if (!response.ok) {
          console.error(
            `Backend server responded with status: ${response.status}`
          );
          throw new Error(
            `Backend server responded with status: ${response.status}`
          );
        }

        const data = await response.json();
        console.log("Received data from backend:", data);

        // If we got a token from the backend, return it
        if (data.access_token) {
          const response = NextResponse.json({
            access_token: data.access_token,
          });
          // Set the cookie in the response
          response.cookies.set("spotify_token", data.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600,
            path: "/",
          });
          return response;
        }

        // If we didn't get a token, return an empty response
        return NextResponse.json({ access_token: "" });
      } catch (error) {
        console.error("Error fetching token from backend:", error);
        return NextResponse.json(
          { error: "Failed to get token from backend" },
          { status: 500 }
        );
      }
    }

    // If we have a token in cookies, return it
    console.log("Found token in cookies");
    return NextResponse.json({ access_token: token });
  } catch (error) {
    console.error("Error in token API route:", error);
    return NextResponse.json({ error: "Failed to get token" }, { status: 500 });
  }
}
