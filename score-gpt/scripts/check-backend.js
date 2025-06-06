#!/usr/bin/env node

// Simple script to check if the backend server is running
async function checkBackend() {
  try {
    const response = await fetch("http://localhost:8000/health");
    if (response.ok) {
      const data = await response.json();
      console.log("✅ Backend server is running:", data);
      return true;
    } else {
      console.log("❌ Backend server responded with status:", response.status);
      return false;
    }
  } catch (error) {
    console.log("❌ Backend server is not running:", error.message);
    return false;
  }
}

checkBackend();
