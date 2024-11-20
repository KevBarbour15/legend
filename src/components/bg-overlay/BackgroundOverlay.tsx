"use client";

import Image from "next/image";

const BackgroundOverlay: React.FC = () => {
  return (
    <div
      id="background-overlay"
      className="fixed inset-0 z-[-1] h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url(/images/background.webp)",
      }}
    >
      <Image
        src="/images/alt-logo.png"
        className="invisible absolute bottom-6 right-6 md:visible"
        alt="Legend Has It logo"
        width={150}
        height={150}
        style={{ height: "auto", width: "auto" }}
        priority={true}
      />
    </div>
  );
};

export default BackgroundOverlay;
