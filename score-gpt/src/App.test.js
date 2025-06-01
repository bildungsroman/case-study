import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import App from './App';

// Mock the child components to isolate App component testing
jest.mock('./components/ChatInterface', () => ({ onScoreGenerated }) => (
  <div 
    data-testid="mock-chat-interface" 
    onClick={() => onScoreGenerated && onScoreGenerated({
      imageUrl: 'test-url',
      instrument: 'Piano',
      trackTitle: 'Test Track'
    })}
  >
    Chat Interface Component
  </div>
));
jest.mock('./components/WebPlayback', () => ({ token }) => (
  <div data-testid="mock-web-playback" data-token={token}>
    Web Playback Component
  </div>
));
jest.mock('./components/Login', () => () => (
  <div data-testid="mock-login">
    Login Component
  </div>
));
jest.mock('./components/SheetMusicDisplay', () => ({ scoreImage, instrument, trackTitle }) => (
  <div 
    data-testid="mock-sheet-music-display" 
    data-score={scoreImage} 
    data-instrument={instrument} 
    data-track={trackTitle}
  >
    Sheet Music Display Component
  </div>
));

describe('App Component', () => {
  test('renders the header with correct title', () => {
    render(<App />);
    const headerElement = screen.getByText('Score GPT');
    expect(headerElement).toBeInTheDocument();
  });

  test('renders the subtitle text', () => {
    render(<App />);
    const subtitleElement = screen.getByText('Chat and Music Player Interface');
    expect(subtitleElement).toBeInTheDocument();
  });

  test('renders the Login component initially', () => {
    render(<App />);
    const loginElement = screen.getByTestId('mock-login');
    expect(loginElement).toBeInTheDocument();
  });

  test('renders the ChatInterface component', () => {
    render(<App />);
    const chatInterfaceElement = screen.getByTestId('mock-chat-interface');
    expect(chatInterfaceElement).toBeInTheDocument();
  });

  test('does not render SheetMusicDisplay initially', () => {
    render(<App />);
    const sheetMusicElement = screen.queryByTestId('mock-sheet-music-display');
    expect(sheetMusicElement).not.toBeInTheDocument();
  });

  test('renders SheetMusicDisplay when score is generated', async () => {
    render(<App />);
    
    // Simulate score generation by clicking the mock chat interface
    fireEvent.click(screen.getByTestId('mock-chat-interface'));
    
    // Wait for the SheetMusicDisplay to be rendered
    await waitFor(() => {
      expect(screen.getByTestId('mock-sheet-music-display')).toBeInTheDocument();
    });
    
    // Now check the attributes
    const sheetMusicElement = screen.getByTestId('mock-sheet-music-display');
    expect(sheetMusicElement).toHaveAttribute('data-score', 'test-url');
    expect(sheetMusicElement).toHaveAttribute('data-instrument', 'Piano');
    expect(sheetMusicElement).toHaveAttribute('data-track', 'Test Track');
  });
});
