import { Metadata } from "next";
import AppShell from "./AppShell";

export const metadata: Metadata = {
  title: "Score GPT",
  description: "AI-powered music transcription and sheet music generation",
};

export default function Home() {
  return <AppShell />;
}
