export interface Event {
  _id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  notes: string;
  image_url: string;
  is_photo: boolean;
  is_public: boolean;
}

export interface EventCardProps {
  event: Event;
  preloadedMedia: PreloadedMedia;
}

export interface DashEventCardProps {
  event: Event;
  fetchEvents: () => void;
  idx: number;
}

export type PreloadedMedia = HTMLImageElement | HTMLVideoElement;
