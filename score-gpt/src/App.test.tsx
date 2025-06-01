import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";
import { ScoreData } from "./types";

// Mock the child components to isolate App component testing
jest.mock("./components/ChatInterface", () => {
  const MockChatInterface = ({
    onScoreGenerated,
  }: {
    onScoreGenerated: (data: ScoreData) => void;
  }) => (
    <div
      data-testid="mock-chat-interface"
      onClick={() =>
        onScoreGenerated({
          imageUrl: "test-url",
          instrument: "Piano",
          trackTitle: "Test Track",
        })
      }
    >
      Chat Interface Component
    </div>
  );
  return MockChatInterface;
});

jest.mock("./components/WebPlayback", () => {
  const MockWebPlayback = ({ token }: { token: string }) => (
    <div data-testid="mock-web-playback" data-token={token}>
      Web Playback Component
    </div>
  );
  return MockWebPlayback;
});

jest.mock("./components/Login", () => {
  const MockLogin = () => <div data-testid="mock-login">Login Component</div>;
  return MockLogin;
});

jest.mock("./components/SheetMusicDisplay", () => {
  const MockSheetMusicDisplay = ({
    scoreImage,
    instrument,
    trackTitle,
  }: {
    scoreImage: string;
    instrument: string;
    trackTitle: string;
  }) => (
    <div
      data-testid="mock-sheet-music-display"
      data-score={scoreImage}
      data-instrument={instrument}
      data-track={trackTitle}
    >
      Sheet Music Display Component
    </div>
  );
  return MockSheetMusicDisplay;
});

describe("App Component", () => {
  test("renders the header with correct title", () => {
    render(<App />);
    const headerElement = screen.getByText("Score GPT");
    expect(headerElement).toBeInTheDocument();
  });

  test("renders the subtitle text", () => {
    render(<App />);
    const subtitleElement = screen.getByText("Chat and Music Player Interface");
    expect(subtitleElement).toBeInTheDocument();
  });

  test("renders the Login component initially", () => {
    render(<App />);
    const loginElement = screen.getByTestId("mock-login");
    expect(loginElement).toBeInTheDocument();
  });

  test("renders the ChatInterface component", () => {
    render(<App />);
    const chatInterfaceElement = screen.getByTestId("mock-chat-interface");
    expect(chatInterfaceElement).toBeInTheDocument();
  });

  test("does not render SheetMusicDisplay initially", () => {
    render(<App />);
    const sheetMusicElement = screen.queryByTestId("mock-sheet-music-display");
    expect(sheetMusicElement).not.toBeInTheDocument();
  });

  test("renders SheetMusicDisplay when score is generated", async () => {
    render(<App />);

    // Simulate score generation by clicking the mock chat interface
    fireEvent.click(screen.getByTestId("mock-chat-interface"));

    // Wait for the SheetMusicDisplay to be rendered
    await waitFor(() => {
      expect(
        screen.getByTestId("mock-sheet-music-display")
      ).toBeInTheDocument();
    });

    // Now check the attributes
    const sheetMusicElement = screen.getByTestId("mock-sheet-music-display");
    expect(sheetMusicElement).toHaveAttribute("data-score", "test-url");
    expect(sheetMusicElement).toHaveAttribute("data-instrument", "Piano");
    expect(sheetMusicElement).toHaveAttribute("data-track", "Test Track");
  });
});
