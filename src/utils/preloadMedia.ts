import { Event, PreloadedMedia } from "@/data/events";

export const preloadMedia = async (event: Event, loadedIds: Set<string>) => {
  if (loadedIds.has(event._id)) {
    return;
  }

  return new Promise((resolve, reject) => {
    const mediaExtension = event.image_url.split(".").pop();

    if (mediaExtension !== "mp4" && event.is_photo) {
      const img = new Image();
      img.decoding = "async";
      img.onerror = reject;
      img.src = event.image_url;
      img.onload = async () => {
        loadedIds.add(event._id);
        try {
          await img.decode?.();
        } catch {
          // ignore decode failures
        }
        resolve(img);
      };
    } else {
      const video = document.createElement("video");
      video.onerror = reject;
      video.src = event.image_url;
      video.onloadeddata = () => {
        loadedIds.add(event._id);
        resolve(video);
      };
      video.load();
    }
  });
};
