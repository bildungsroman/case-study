"use client";

import React, { useState, useEffect } from "react";
import { Track, WebPlaybackPlayer } from "../types";
import "./WebPlayback.css";

interface WebPlaybackProps {
  token: string;
}

const defaultTrack: Track = {
  name: "",
  album: {
    images: [{ url: "" }],
  },
  artists: [{ name: "" }],
};

const WebPlayback: React.FC<WebPlaybackProps> = ({ token }) => {
  const [isPaused, setPaused] = useState<boolean>(false);
  const [isActive, setActive] = useState<boolean>(false);
  const [player, setPlayer] = useState<WebPlaybackPlayer | undefined>(
    undefined
  );
  const [currentTrack, setTrack] = useState<Track>(defaultTrack);

  useEffect(() => {
    // Define the callback function before loading the script
    window.onSpotifyWebPlaybackSDKReady = () => {
      console.log("Spotify Web Playback SDK Ready");
      const player = new window.Spotify.Player({
        name: "Score GPT Web Player",
        getOAuthToken: (cb: (token: string) => void) => {
          cb(token);
        },
        volume: 0.5,
      });

      setPlayer(player);

      player.addListener("ready", ({ device_id }: { device_id: string }) => {
        console.log("Ready with Device ID", device_id);
      });

      player.addListener(
        "not_ready",
        ({ device_id }: { device_id: string }) => {
          console.log("Device ID has gone offline", device_id);
        }
      );

      player.addListener("player_state_changed", (state: any) => {
        if (!state) {
          return;
        }

        setTrack(state.track_window.current_track);
        setPaused(state.paused);

        player.getCurrentState().then((state: any) => {
          !state ? setActive(false) : setActive(true);
        });
      });

      player.connect();
    };

    // Load the Spotify Web Playback SDK script
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    // Cleanup function
    return () => {
      // Remove script tag if component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [token]);

  const handlePreviousTrack = (): void => {
    player?.previousTrack();
  };

  const handleTogglePlay = (): void => {
    player?.togglePlay();
  };

  const handleNextTrack = (): void => {
    player?.nextTrack();
  };

  if (!isActive) {
    return (
      <div className="container">
        <div className="main-wrapper">
          <b>
            Instance not active. Transfer your playback using your Spotify app
          </b>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="main-wrapper">
        <img
          src={currentTrack.album.images[0].url}
          className="now-playing__cover"
          alt={`Cover for ${currentTrack.name}`}
        />

        <div className="now-playing__side">
          <div className="now-playing__name">{currentTrack.name}</div>
          <div className="now-playing__artist">
            {currentTrack.artists[0].name}
          </div>

          <button
            className="btn-spotify"
            onClick={handlePreviousTrack}
            aria-label="Previous track"
          >
            &lt;&lt;
          </button>

          <button
            className="btn-spotify"
            onClick={handleTogglePlay}
            aria-label={isPaused ? "Play" : "Pause"}
          >
            {isPaused ? "PLAY" : "PAUSE"}
          </button>

          <button
            className="btn-spotify"
            onClick={handleNextTrack}
            aria-label="Next track"
          >
            &gt;&gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebPlayback;
