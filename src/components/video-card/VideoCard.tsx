"use client";
import React from "react";

type VideoCardProps = {
  title: string;
  heading: string;
  description: string;
  url: string;
};

const VideoCard: React.FC<VideoCardProps> = ({
  title,
  heading,
  description,
  url,
}) => {
  return (
    <div className="flex h-full flex-col justify-between gap-6 rounded-sm border border-neutral-400/20 bg-customWhite/25 p-4 text-customNavy backdrop-blur-[2px] box-shadow-card">
      <div className="flex flex-col space-y-3 text-pretty font-hypatia drop-shadow-text">
        <h2 className="font-bigola text-2xl">{title}</h2>
        <p className="text-lg">{heading}</p>
        <p className="text-lg">{description}</p>
      </div>
      <div
        style={{
          padding: "56.25% 0 0 0",
          position: "relative",
        }}
        className="overflow-hidden rounded-sm"
      >
        <iframe
          src={url}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
          title={title}
        ></iframe>
      </div>
    </div>
  );
};

export default VideoCard;
