/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    REACT_APP_OPENAI_API_KEY: string;
    PUBLIC_URL: string;
  }
}
