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

export interface PlayerState {
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

export interface WebPlaybackState {
  track_window: {
    current_track: PlayerState;
  };
  paused: boolean;
}

export interface DeviceReadyEvent {
  device_id: string;
}

// Define a type for all possible event callbacks
export type SpotifyEventCallback =
  | ((state: DeviceReadyEvent) => void)
  | ((state?: WebPlaybackState) => void);

export interface WebPlaybackPlayer {
  connect: () => Promise<boolean>;
  disconnect: () => void;
  addListener: (event: string, callback: SpotifyEventCallback) => void;
  removeListener: (event: string, callback?: SpotifyEventCallback) => void;
  getCurrentState: () => Promise<WebPlaybackState | null>;
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
