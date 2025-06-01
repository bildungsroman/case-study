/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    NEXT_PUBLIC_OPENAI_API_KEY: string;
    PUBLIC_URL: string;
  }
}
