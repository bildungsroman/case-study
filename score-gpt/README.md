# Score GPT [WIP]

Score GPT is an AI-powered music transcription and sheet music generation application that integrates with Spotify. It allows users to chat with an AI assistant about music, generate sheet music, and control Spotify playback directly from the application.

## Features

- **Spotify Integration**: Play, pause, and control your Spotify music directly from the app
- **AI Chat Interface**: Discuss music theory, request transcriptions, and get music recommendations
- **Sheet Music Generation**: Generate and display sheet music for various instruments
- **Real-time Music Player**: View currently playing track information and album art

## Tech Stack

- **Frontend**: Next.js 15, React 19
- **Backend**: Express.js server for Spotify authentication
- **Authentication**: OAuth 2.0 flow with Spotify API
- **AI Integration**: OpenAI API for music analysis and sheet music generation
- **Type Safety**: TypeScript for improved developer experience
- **Styling**: CSS modules for component-specific styling

## Project Structure

- `/src`: Main application code
  - `/app`: Next.js App Router components and routes
  - `/components`: Reusable React components
  - `/types`: TypeScript type definitions
- `/server`: Express server for Spotify authentication
- `/public`: Static assets
- `/build`: Production build output

## Getting Started

### Prerequisites

- Node.js (v18.18.0 or higher)
- Spotify Developer Account and API credentials
- OpenAI API key

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
```

### Installation

```bash
# Install dependencies
npm install
```

### Available Scripts

| Command             | Description                                                              |
| ------------------- | ------------------------------------------------------------------------ |
| `npm run dev`       | Starts both the Next.js development server and the authentication server |
| `npm run build`     | Builds the application for production                                    |
| `npm run start`     | Starts the Next.js development server                                    |
| `npm run server`    | Starts only the authentication server                                    |
| `npm run lint`      | Runs ESLint to check for code quality issues                             |
| `npm run lint:fix`  | Automatically fixes ESLint issues when possible                          |
| `npm run format`    | Formats code using Prettier                                              |
| `npm run typecheck` | Runs TypeScript type checking                                            |
| `npm test`          | Runs the test suite                                                      |

## Deployment

This application is configured for deployment on Vercel. The build output is set to the `build` directory, and a `vercel.json` file is included for proper configuration.

## License

This project is private and not licensed for public use.
