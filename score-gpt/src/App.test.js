import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the child components to isolate App component testing
jest.mock('./components/ChatInterface', () => ({ onScoreGenerated }) => (
  <div data-testid="mock-chat-interface" onClick={() => onScoreGenerated && onScoreGenerated({
    imageUrl: 'test-url',
    instrument: 'Piano',
    trackTitle: 'Test Track'
  })}>
    Chat Interface Component
  </div>
));
jest.mock('./components/MusicPlayer', () => () => <div data-testid="mock-music-player">Music Player Component</div>);
jest.mock('./components/SheetMusicDisplay', () => ({ scoreImage, instrument, trackTitle }) => (
  <div data-testid="mock-sheet-music-display" data-score={scoreImage} data-instrument={instrument} data-track={trackTitle}>
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

  test('renders the MusicPlayer component', () => {
    render(<App />);
    const musicPlayerElement = screen.getByTestId('mock-music-player');
    expect(musicPlayerElement).toBeInTheDocument();
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

  test('renders SheetMusicDisplay when score is generated', () => {
    render(<App />);
    
    // Simulate score generation by clicking the mock chat interface
    const chatInterfaceElement = screen.getByTestId('mock-chat-interface');
    chatInterfaceElement.click();
    
    // Now the SheetMusicDisplay should be rendered
    const sheetMusicElement = screen.getByTestId('mock-sheet-music-display');
    expect(sheetMusicElement).toBeInTheDocument();
    expect(sheetMusicElement).toHaveAttribute('data-score', 'test-url');
    expect(sheetMusicElement).toHaveAttribute('data-instrument', 'Piano');
    expect(sheetMusicElement).toHaveAttribute('data-track', 'Test Track');
  });
});
