#!/usr/bin/env node

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check environment variables
function checkEnvironment() {
  const envPath = path.join(__dirname, "..", ".env.local");

  console.log("🔍 Environment Variable Check");
  console.log("================================");
  console.log(`📁 Looking for .env.local at: ${envPath}`);

  // Check if .env.local exists
  if (!fs.existsSync(envPath)) {
    console.log("❌ .env.local file not found!");
    return false;
  }

  console.log("✅ .env.local file found");

  // Load environment variables
  dotenv.config({ path: envPath });

  // Check required variables
  const requiredVars = [
    "SPOTIFY_CLIENT_ID",
    "SPOTIFY_CLIENT_SECRET",
    "NEXT_PUBLIC_OPENAI_API_KEY",
    "NEXT_PUBLIC_APP_URL",
  ];

  let allPresent = true;

  requiredVars.forEach((varName) => {
    const value = process.env[varName];
    if (value) {
      console.log(`✅ ${varName}: Set (${value.substring(0, 10)}...)`);
    } else {
      console.log(`❌ ${varName}: Missing`);
      allPresent = false;
    }
  });

  console.log("================================");
  if (allPresent) {
    console.log("🎉 All environment variables are set!");
  } else {
    console.log("⚠️  Some environment variables are missing");
  }

  return allPresent;
}

checkEnvironment();
