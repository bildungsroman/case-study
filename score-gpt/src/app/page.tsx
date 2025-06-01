import { Metadata } from "next";
import ClientApp from "./client";

export const metadata: Metadata = {
  title: "Score GPT",
  description: "AI-powered music transcription and sheet music generation",
};

// This is a Server Component
export default function Home() {
  // In Next.js App Router, we don't need to explicitly handle searchParams
  // as they're automatically passed to the page component
  return <ClientApp initialToken="" />;
}
