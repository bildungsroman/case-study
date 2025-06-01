import type { Metadata } from "next";
import "./index.css";

export const metadata: Metadata = {
  title: "ScoreGPT",
  description: "Web site created with Next.js.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <script src="https://sdk.scdn.co/spotify-player.js"></script>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
