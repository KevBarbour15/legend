export interface Track {
  title: string;
  url: string;
  artist: string;
}

export interface MusicPlayerProps {
  tracks: Track[];
}
