import { Event, PreloadedMedia } from "@/data/events";

export const preloadMedia = async (
  event: Event,
  mediaMap: Map<string, PreloadedMedia>,
  setMediaMap: (
    value: React.SetStateAction<Map<string, PreloadedMedia>>,
  ) => void,
) => {
  if (mediaMap.has(event._id)) {
    return;
  }

  return new Promise((resolve, reject) => {
    const mediaExtension = event.image_url.split(".").pop();

    if (mediaExtension !== "mp4" && event.is_photo) {
      const img = new Image();
      img.onerror = reject;
      img.src = event.image_url;
      img.onload = () => {
        setMediaMap((prev) => {
          const newMap = new Map(prev);
          newMap.set(event._id, img);
          return newMap;
        });
        resolve(img);
      };
    } else {
      const video = document.createElement("video");
      video.onerror = reject;
      video.src = event.image_url;
      video.onloadeddata = () => {
        setMediaMap((prev) => {
          const newMap = new Map(prev);
          newMap.set(event._id, video);
          return newMap;
        });
        resolve(video);
      };
      video.load();
    }
  });
};
