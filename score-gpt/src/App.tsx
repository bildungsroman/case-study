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

  const handleScoreGenerated = (scoreData: ScoreData): void => {
    setGeneratedScore(scoreData);
  };

  useEffect(() => {
    const getToken = async (): Promise<void> => {
      try {
        const response = await fetch("/auth/token");
        const json = await response.json();
        setToken(json.access_token);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    getToken();
  }, []);

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
