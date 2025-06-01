"use client";

import React, { useState, useEffect } from "react";
import "./WebPlayback.css";
import {
  PlayerState,
  WebPlaybackPlayer,
  WebPlaybackState,
  DeviceReadyEvent,
} from "../types";

interface WebPlaybackProps {
  token: string;
}

const WebPlayback: React.FC<WebPlaybackProps> = ({ token }) => {
  const [player, setPlayer] = useState<WebPlaybackPlayer | null>(null);
  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);
  const [current_track, setTrack] = useState<PlayerState>({
    name: "",
    album: {
      images: [{ url: "" }],
    },
    artists: [{ name: "" }],
  });

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: "Score GPT Player",
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 0.5,
      });

      setPlayer(spotifyPlayer);

      spotifyPlayer.addListener("ready", (state: DeviceReadyEvent) => {
        console.log("Ready with Device ID", state.device_id);
      });

      spotifyPlayer.addListener("not_ready", (state: DeviceReadyEvent) => {
        console.log("Device ID has gone offline", state.device_id);
      });

      spotifyPlayer.addListener(
        "player_state_changed",
        (state?: WebPlaybackState) => {
          if (!state) {
            return;
          }

          setTrack(state.track_window.current_track);
          setPaused(state.paused);

          spotifyPlayer.getCurrentState().then((state) => {
            if (!state) {
              setActive(false);
            } else {
              setActive(true);
            }
          });
        }
      );

      spotifyPlayer.connect();
    };

    return () => {
      // Clean up the script when the component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      // Disconnect the player when the component unmounts
      if (player) {
        player.disconnect();
      }
    };
  }, [token, player]);

  const handlePrevious = () => {
    if (player) {
      player.previousTrack();
    }
  };

  const handlePlayPause = () => {
    if (player) {
      player.togglePlay();
    }
  };

  const handleNext = () => {
    if (player) {
      player.nextTrack();
    }
  };

  if (!is_active) {
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
        {current_track.album.images[0].url && (
          <img
            src={current_track.album.images[0].url}
            className="now-playing__cover"
            alt="Album cover"
          />
        )}

        <div className="now-playing__side">
          <div className="now-playing__name">{current_track.name}</div>
          <div className="now-playing__artist">
            {current_track.artists[0].name}
          </div>

          <div className="controls">
            <button
              className="btn-spotify"
              onClick={handlePrevious}
              aria-label="Previous track"
            >
              &lt;&lt;
            </button>

            <button
              className="btn-spotify"
              onClick={handlePlayPause}
              aria-label={is_paused ? "Play" : "Pause"}
            >
              {is_paused ? "PLAY" : "PAUSE"}
            </button>

            <button
              className="btn-spotify"
              onClick={handleNext}
              aria-label="Next track"
            >
              &gt;&gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebPlayback;
