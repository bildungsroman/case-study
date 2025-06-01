import React from 'react';
import './WebPlayback.css';

const Login = () => {
    return (
        <div className="login-container">
            <div className="login-content">
                <h2>Connect to Spotify</h2>
                <p>Login to access your Spotify music library</p>
                <a 
                    className="btn-spotify" 
                    href="/auth/login"
                    aria-label="Login with Spotify"
                >
                    Login with Spotify 
                </a>
            </div>
        </div>
    );
};

export default Login;
