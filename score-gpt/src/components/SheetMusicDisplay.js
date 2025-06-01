import React from "react";
import "./SheetMusicDisplay.css";

const SheetMusicDisplay = ({ scoreImage, instrument, trackTitle }) => {
  if (!scoreImage) {
    return null; // Don't render anything if no score is available
  }

  return (
    <div className="sheet-music-container">
      <div className="sheet-music-header">
        <h2>Generated Score</h2>
        <div className="score-details">
          <span className="instrument-name">{instrument}</span>
          <span className="track-title">"{trackTitle}"</span>
        </div>
      </div>

      <div className="sheet-music-display">
        <img
          src={scoreImage}
          alt={`Sheet music for ${instrument} part of ${trackTitle}`}
          className="score-image"
        />
      </div>

      <div className="sheet-music-actions">
        <button className="action-button download-button">
          <span className="button-icon">⬇️</span> Download PDF
        </button>
        <button className="action-button print-button">
          <span className="button-icon">🖨️</span> Print Score
        </button>
        <button className="action-button edit-button">
          <span className="button-icon">✏️</span> Edit Score
        </button>
      </div>
    </div>
  );
};

export default SheetMusicDisplay;
