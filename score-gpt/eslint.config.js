import js from "@eslint/js";
import globals from "globals";
import * as tseslint from "typescript-eslint";

export default [
  // Base JS configuration
  js.configs.recommended,

  // TypeScript configuration
  ...tseslint.configs.recommended,

  // Custom configuration
  {
    rules: {
      // Set rules to warn instead of error for our own files
      "@typescript-eslint/no-unused-expressions": "warn",
      "@typescript-eslint/no-explicit-any": "error",
      "no-unused-vars": "off", // Use TypeScript's version instead
      "@typescript-eslint/no-unused-vars": "warn",
      "react/react-in-jsx-scope": "off",
      "react/no-unescaped-entities": "off",
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2020,
        ...globals.jest,
        React: "readonly",
        JSX: "readonly",
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
  },
  // Test files
  {
    files: ["**/*.test.{js,jsx,ts,tsx}", "**/setupTests.{js,jsx,ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/build/**",
      "**/server/**",
      "**/dist/**",
    ],
  },
];
