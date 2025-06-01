"use client";

import React, { useState, useEffect } from "react";
import ChatInterface from "../components/ChatInterface";
import Login from "../components/Login";
import SheetMusicDisplay from "../components/SheetMusicDisplay";
import WebPlayback from "../components/WebPlayback";
import { ScoreData } from "../types";

interface ClientAppProps {
  initialToken: string;
}

const ClientApp: React.FC<ClientAppProps> = ({ initialToken }) => {
  const [generatedScore, setGeneratedScore] = useState<ScoreData | null>(null);
  const [token, setToken] = useState<string>(initialToken);
  const [isLoading, setIsLoading] = useState<boolean>(initialToken === "");

  // Fetch token if not provided initially
  useEffect(() => {
    const fetchToken = async () => {
      if (!initialToken) {
        setIsLoading(true);
        try {
          const response = await fetch("/api/auth/token");
          if (response.ok) {
            const data = await response.json();
            setToken(data.access_token || "");
          }
        } catch (error) {
          console.error("Error fetching token:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchToken();
  }, [initialToken]);

  const handleScoreGenerated = (scoreData: ScoreData): void => {
    setGeneratedScore(scoreData);
  };

  if (isLoading) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Score GPT</h1>
          <p>Loading...</p>
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Score GPT</h1>
        <p>Chat and Music Player Interface</p>
      </header>
      <main className="App-main">
        <div className="app-container">
          {token === "" ? <Login /> : <WebPlayback token={token} />}
          <ChatInterface onScoreGenerated={handleScoreGenerated} />

          {generatedScore && (
            <SheetMusicDisplay
              scoreImage={generatedScore.imageUrl}
              instrument={generatedScore.instrument}
              trackTitle={generatedScore.trackTitle}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default ClientApp;
