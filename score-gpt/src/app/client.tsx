"use client";

import React, { useState } from "react";
import ChatInterface from "../components/ChatInterface";
import SheetMusicDisplay from "../components/SheetMusicDisplay";
import WebPlayback from "../components/WebPlayback";
import { ScoreData } from "../types";

interface ClientAppProps {
  initialToken: string;
}

const ClientApp: React.FC<ClientAppProps> = ({ initialToken }) => {
  const [generatedScore, setGeneratedScore] = useState<ScoreData | null>(null);

  const handleScoreGenerated = (scoreData: ScoreData): void => {
    setGeneratedScore(scoreData);
  };

  return (
    <>
      {initialToken && <WebPlayback token={initialToken} />}
      <ChatInterface onScoreGenerated={handleScoreGenerated} />

      {generatedScore && (
        <SheetMusicDisplay
          scoreImage={generatedScore.imageUrl}
          instrument={generatedScore.instrument}
          trackTitle={generatedScore.trackTitle}
        />
      )}
    </>
  );
};

export default ClientApp;
