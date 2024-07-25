"use client";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(Draggable);

const Playlist = () => {
  useGSAP(() => {
    Draggable.create("#playlist-container", {
      type: "x,y",
      inertia: true,
      onClick: function () {
        console.log("clicked");
      },
      onDragEnd: function () {
        console.log("drag ended");
      },
    });
  });

  return (
    <div
      id="playlist-container"
      className="fixed bottom-0 right-0 rounded-xl bg-customGold p-3 shadow-xl"
    >
      <iframe
        allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
        height="450"
        style={{
          width: "300px",
        }}
        sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
        src="https://embed.music.apple.com/us/playlist/nu-disco/pl.a8ccbf127f404c769af34ec8ae438138"
      ></iframe>
    </div>
  );
};

export default Playlist;
