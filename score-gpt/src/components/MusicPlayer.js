import { useState, useRef, useEffect, useMemo } from 'react';
import './MusicPlayer.css';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [currentTrack, setCurrentTrack] = useState(0);
  
  const audioRef = useRef(null);
  
  // Use useMemo to prevent the tracks array from being recreated on every render
  const tracks = useMemo(() => [
    {
      title: "Ambient Melody",
      artist: "Sound Sculptor",
      src: "https://example.com/track1.mp3",
      cover: "https://via.placeholder.com/80/2A7B9B/FFFFFF"
    },
    {
      title: "Rhythmic Patterns",
      artist: "Beat Architect",
      src: "https://example.com/track2.mp3",
      cover: "https://via.placeholder.com/80/57C785/FFFFFF"
    }
  ], []);

  useEffect(() => {
    // Set up audio event listeners
    const audio = audioRef.current;
    
    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      if (currentTrack < tracks.length - 1) {
        setCurrentTrack(currentTrack + 1);
      } else {
        setIsPlaying(false);
      }
    };

    // Add event listeners
    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', handleEnded);

    // Clean up event listeners
    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack, tracks.length]);

  useEffect(() => {
    // Update audio source when track changes
    audioRef.current.src = tracks[currentTrack].src;
    
    if (isPlaying) {
      audioRef.current.play();
    }
  }, [currentTrack, tracks, isPlaying]);

  useEffect(() => {
    // Update volume when it changes
    audioRef.current.volume = volume;
  }, [volume]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    if (currentTrack > 0) {
      setCurrentTrack(currentTrack - 1);
    }
  };

  const handleNext = () => {
    if (currentTrack < tracks.length - 1) {
      setCurrentTrack(currentTrack + 1);
    }
  };

  const handleTimeChange = (e) => {
    const newTime = e.target.value;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
  };

  // Format time in MM:SS
  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="music-player">
      <audio ref={audioRef} />
      
      <div className="track-info">
        <img 
          src={tracks[currentTrack].cover} 
          alt={`${tracks[currentTrack].title} cover`} 
          className="cover-art"
        />
        <div className="track-details">
          <div className="track-title">{tracks[currentTrack].title}</div>
          <div className="track-artist">{tracks[currentTrack].artist}</div>
        </div>
      </div>
      
      <div className="player-controls">
        <button className="control-button" onClick={handlePrevious}>
          ⏮️
        </button>
        <button className="control-button play-button" onClick={togglePlay}>
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        <button className="control-button" onClick={handleNext}>
          ⏭️
        </button>
      </div>
      
      <div className="progress-container">
        <span className="time">{formatTime(currentTime)}</span>
        <input
          type="range"
          className="progress-bar"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleTimeChange}
        />
        <span className="time">{formatTime(duration)}</span>
      </div>
      
      <div className="volume-container">
        <span className="volume-icon">🔊</span>
        <input
          type="range"
          className="volume-slider"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
        />
      </div>
    </div>
  );
};

export default MusicPlayer;
