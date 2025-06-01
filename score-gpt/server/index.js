import express from "express";
import request from "request";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";

const port = 5000;

// Use dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use global variable for access token
globalThis.access_token = "";

dotenv.config();

const spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
const spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;

const spotify_redirect_uri = "http://localhost:3000/auth/callback";

const generateRandomString = function (length) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Debug middleware to log requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.get("/auth/login", (req, res) => {
  const scope = "streaming user-read-email user-read-private";
  const state = generateRandomString(16);

  const auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: spotify_redirect_uri,
    state: state,
  });

  res.redirect(
    "https://accounts.spotify.com/authorize/?" +
      auth_query_parameters.toString()
  );
});

// Handle both GET and POST for callback
app.all("/auth/callback", (req, res) => {
  // Get code from query params (GET) or request body (POST)
  const code = req.method === "POST" ? req.body.code : req.query.code;

  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      code: code,
      redirect_uri: spotify_redirect_uri,
      grant_type: "authorization_code",
    },
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(spotify_client_id + ":" + spotify_client_secret).toString(
          "base64"
        ),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      globalThis.access_token = body.access_token;

      // For GET requests, redirect to the frontend
      if (req.method === "GET") {
        res.redirect("/");
      } else {
        // For POST requests, return the token as JSON
        res.json({ access_token: globalThis.access_token });
      }
    } else {
      console.error("Error getting access token:", error || body);

      if (req.method === "GET") {
        res.status(500).send("Error during authentication");
      } else {
        res.status(500).json({ error: "Error during authentication" });
      }
    }
  });
});

app.get("/auth/token", (req, res) => {
  res.json({ access_token: globalThis.access_token });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Listening at http://localhost:${port}`);
});
