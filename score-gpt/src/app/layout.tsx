import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ScoreGPT",
  description: "AI-powered music transcription and sheet music generation",
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
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
