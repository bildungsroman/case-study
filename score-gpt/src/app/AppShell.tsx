import { cookies } from "next/headers";
import ClientApp from "./client";
import Login from "../components/Login";
import AppHeader from "../components/AppHeader";
import UserProfile from "../components/UserProfile";

export default async function AppShell() {
  const cookieStore = await cookies();
  const token = cookieStore.get("spotify_token")?.value || "";

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
