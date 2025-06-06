import { cookies } from "next/headers";

interface SpotifyUser {
  display_name: string;
  images?: Array<{ url: string }>;
  email: string;
  followers: { total: number };
}

export default async function UserProfile() {
  const cookieStore = await cookies();
  const token = await cookieStore.get("spotify_token")?.value;

  if (!token) return null;

  try {
    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "force-cache",
      next: { revalidate: 300 },
    });

    if (response.ok) {
      const user: SpotifyUser = await response.json();
      return (
        <div className="user-profile">
          {user.images?.[0]?.url && (
            <img
              src={user.images[0].url}
              alt="Profile"
              className="profile-image"
              width={40}
              height={40}
            />
          )}
          <div className="user-info">
            <span className="user-name">{user.display_name}</span>
            <span className="user-followers">
              {user.followers.total} followers
            </span>
          </div>
        </div>
      );
    }
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
  }

  return null;
}
