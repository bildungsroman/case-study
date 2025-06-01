export interface ScoreData {
  imageUrl: string;
  instrument: string;
  trackTitle: string;
}

export interface Message {
  text: string;
  sender: "user" | "bot";
  hasScore?: boolean;
}

export interface Track {
  name: string;
  album: {
    images: {
      url: string;
    }[];
  };
  artists: {
    name: string;
  }[];
}

export interface WebPlaybackSDK {
  Player: new (options: {
    name: string;
    getOAuthToken: (callback: (token: string) => void) => void;
    volume: number;
  }) => WebPlaybackPlayer;
}

export interface WebPlaybackPlayer {
  connect: () => Promise<boolean>;
  disconnect: () => void;
  addListener: (event: string, callback: (state?: any) => void) => void;
  removeListener: (event: string, callback?: (state?: any) => void) => void;
  getCurrentState: () => Promise<any>;
  nextTrack: () => Promise<void>;
  previousTrack: () => Promise<void>;
  togglePlay: () => Promise<void>;
  seek: (position_ms: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
}

declare global {
  interface Window {
    Spotify: WebPlaybackSDK;
    onSpotifyWebPlaybackSDKReady: () => void;
  }
}
