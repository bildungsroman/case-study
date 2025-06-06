"use client";

import React, { useState, useEffect } from "react";
import "./WebPlayback.css";
import {
  PlayerState,
  WebPlaybackPlayer,
  WebPlaybackState,
  DeviceReadyEvent,
  SpotifyErrorEvent,
} from "../types";

interface WebPlaybackProps {
  token: string;
}

const track = {
  name: "",
  album: {
    images: [{ url: "" }],
  },
  artists: [{ name: "" }],
};

const WebPlayback: React.FC<WebPlaybackProps> = ({ token }) => {
  const [player, setPlayer] = useState<WebPlaybackPlayer | undefined>(
    undefined
  );
  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);
  const [current_track, setTrack] = useState<PlayerState>(track);

  useEffect(() => {
    if (player || !token) {
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://sdk.scdn.co/spotify-player.js"]'
    );
    if (existingScript) {
      if (window.Spotify) {
        window.onSpotifyWebPlaybackSDKReady();
      }
      return;
    }

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: "Score GPT Web Player",
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 0.5,
      });

      setPlayer(spotifyPlayer);

      spotifyPlayer.addListener("ready", ({ device_id }: DeviceReadyEvent) => {
        console.log("✅ Ready with Device ID", device_id);
      });

      spotifyPlayer.addListener(
        "not_ready",
        ({ device_id }: DeviceReadyEvent) => {
          console.log("❌ Device ID has gone offline", device_id);
        }
      );

      spotifyPlayer.addListener(
        "initialization_error",
        ({ message }: SpotifyErrorEvent) => {
          console.error("❌ Initialization Error:", message);
        }
      );

      spotifyPlayer.addListener(
        "authentication_error",
        ({ message }: SpotifyErrorEvent) => {
          console.error("❌ Authentication Error:", message);
        }
      );

      spotifyPlayer.addListener(
        "account_error",
        ({ message }: SpotifyErrorEvent) => {
          console.error("❌ Account Error:", message);
        }
      );

      spotifyPlayer.addListener(
        "playback_error",
        ({ message }: SpotifyErrorEvent) => {
          console.error("❌ Playback Error:", message);
        }
      );

      spotifyPlayer.addListener(
        "player_state_changed",
        (state?: WebPlaybackState) => {
          if (!state) {
            return;
          }

          setTrack(state.track_window.current_track);
          setPaused(state.paused);

          spotifyPlayer.getCurrentState().then((state) => {
            setActive(!!state);
          });
        }
      );

      spotifyPlayer.connect();
    };

    return () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [token]);

  useEffect(() => {
    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [player]);

  // Control handlers
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

  // Show instructions when not active
  if (!is_active) {
    return (
      <div className="container">
        <div className="main-wrapper">
          <div style={{ textAlign: "center", padding: "20px" }}>
            <h3>Connect to Score GPT Web Player</h3>
            <p>
              1. Open Spotify on your phone or computer
              <br />
              2. Start playing any song
              <br />
              3. Tap the "Connect to a device" icon
              <br />
              4. Select "Score GPT Web Player"
            </p>
            <p style={{ fontSize: "12px", color: "#666", marginTop: "20px" }}>
              Once connected, you'll see the full web player with controls here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Full web player interface
  return (
    <div className="container">
      <div className="main-wrapper">
        <img
          src={current_track.album.images[0].url}
          className="now-playing__cover"
          alt="Album cover"
        />

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
