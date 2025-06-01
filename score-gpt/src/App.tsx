"use client";
import React, { useEffect, useState } from "react";
import ChatInterface from "./components/ChatInterface";
import Login from "./components/Login";
import SheetMusicDisplay from "./components/SheetMusicDisplay";
import WebPlayback from "./components/WebPlayback";
import { ScoreData } from "./types";
import "./App.css";

const App: React.FC = () => {
  const [generatedScore, setGeneratedScore] = useState<ScoreData | null>(null);
  const [token, setToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [, setError] = useState<string | null>(null);

  const handleScoreGenerated = (scoreData: ScoreData): void => {
    setGeneratedScore(scoreData);
  };

  useEffect(() => {
    const getToken = async (): Promise<void> => {
      setIsLoading(true);
      try {
        // Add a small delay to ensure the server is ready
        await new Promise((resolve) => setTimeout(resolve, 500));

        const response = await fetch("/auth/token");

        if (!response.ok) {
          // If we get a 403, try to show the login screen instead of an error
          if (response.status === 403) {
            setToken("");
            setError(null);
            setIsLoading(false);
            return;
          }
          throw new Error(`Server responded with status: ${response.status}`);
        }

        const json = await response.json();
        setToken(json.access_token || "");
        setError(null);
      } catch (error) {
        console.error("Error fetching token:", error);
        // Just show the login screen instead of an error
        setToken("");
        setError(null);
      } finally {
        setIsLoading(false);
      }
    };

    getToken();
  }, []);

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

export default App;
