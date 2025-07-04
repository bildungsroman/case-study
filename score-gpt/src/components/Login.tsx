"use client";

import React from "react";
import "./WebPlayback.css";

const Login: React.FC = () => {
  const handleLogin = (): void => {
    // Use Next.js app directory API route for login
    window.location.href = "/auth/login";
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <h2>Connect to Spotify</h2>
        <p>Login to access your Spotify music library</p>
        <button
          className="btn-spotify"
          onClick={handleLogin}
          aria-label="Login with Spotify"
        >
          Login with Spotify
        </button>
      </div>
    </div>
  );
};

export default Login;
