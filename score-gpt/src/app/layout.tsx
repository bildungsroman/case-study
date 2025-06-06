import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";

export const metadata: Metadata = {
  title: "ScoreGPT",
  description: "AI-powered music transcription and sheet music generation",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side user preference detection
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value || "dark";

  // Detect if user prefers reduced motion
  const prefersReducedMotion =
    cookieStore.get("prefers-reduced-motion")?.value === "true";

  return (
    <html lang="en" data-theme={theme}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2a7b9b" />
        {prefersReducedMotion && (
          <style>{`
            *, *::before, *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          `}</style>
        )}
      </head>
      <body className={prefersReducedMotion ? "reduced-motion" : ""}>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
