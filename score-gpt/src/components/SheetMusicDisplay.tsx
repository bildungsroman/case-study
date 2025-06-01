"use client";

import React from "react";
import "./SheetMusicDisplay.css";

interface SheetMusicDisplayProps {
  scoreImage: string;
  instrument: string;
  trackTitle: string;
}

const SheetMusicDisplay: React.FC<SheetMusicDisplayProps> = ({
  scoreImage,
  instrument,
  trackTitle,
}) => {
  if (!scoreImage) {
    return null; // Don't render anything if no score is available
  }

  const handleDownload = (): void => {
    // In a real app, implement PDF download functionality
    console.log("Download PDF requested");
  };

  const handlePrint = (): void => {
    // In a real app, implement print functionality
    window.print();
  };

  const handleEdit = (): void => {
    // In a real app, implement edit functionality
    console.log("Edit score requested");
  };

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
        <button
          className="action-button download-button"
          onClick={handleDownload}
          aria-label="Download PDF"
        >
          <span className="button-icon">⬇️</span> Download PDF
        </button>
        <button
          className="action-button print-button"
          onClick={handlePrint}
          aria-label="Print Score"
        >
          <span className="button-icon">🖨️</span> Print Score
        </button>
        <button
          className="action-button edit-button"
          onClick={handleEdit}
          aria-label="Edit Score"
        >
          <span className="button-icon">✏️</span> Edit Score
        </button>
      </div>
    </div>
  );
};

export default SheetMusicDisplay;
