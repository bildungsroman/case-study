import { cookies } from "next/headers";
import ClientApp from "./client";
import Login from "../components/Login";
import AppHeader from "../components/AppHeader";
import UserProfile from "../components/UserProfile";

async function getServerToken(): Promise<string> {
  // Try to fetch token from backend server
  try {
    const response = await fetch("http://localhost:5000/auth/token", {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (response.ok) {
      const data = await response.json();
      return data.access_token || "";
    }
  } catch (error) {
    console.error("Server-side token fetch failed:", error);
  }

  return "";
}

export default async function AppShell() {
  const cookieStore = await cookies();
  let token = cookieStore.get("spotify_token")?.value || "";

  // If no token in cookies, try to get from backend
  if (!token) {
    token = await getServerToken();
  }

  // Server-side authentication check
  const isAuthenticated = Boolean(token);

  return (
    <div className="App">
      <AppHeader />

      {isAuthenticated && (
        <div className="user-section">
          <UserProfile />
        </div>
      )}

      <main className="App-main">
        <div className="app-container">
          {!isAuthenticated ? <Login /> : <ClientApp initialToken={token} />}
        </div>
      </main>
    </div>
  );
}
