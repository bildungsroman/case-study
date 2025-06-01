import React, { useState } from 'react';
import './App.css';
import ChatInterface from './components/ChatInterface';
import MusicPlayer from './components/MusicPlayer';
import SheetMusicDisplay from './components/SheetMusicDisplay';

function App() {
  const [generatedScore, setGeneratedScore] = useState(null);
  
  const handleScoreGenerated = (scoreData) => {
    setGeneratedScore(scoreData);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Score GPT</h1>
        <p>Chat and Music Player Interface</p>
      </header>
      <main className="App-main">
        <div className="app-container">
          <MusicPlayer />
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
}

export default App;
