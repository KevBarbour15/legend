/*
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const ScrollingMarquee: React.FC<> = ({ text }) => {
  const duration = 10;
  const gap = 32;
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const textElement = textRef.current;
    
    const textWidth = textElement.offsetWidth;

    // Create enough copies to fill the container plus one extra for seamless loop
    const copies = Math.ceil(window.innerWidth / textWidth) + 1;
    const marqueeText = container.querySelector(".marquee-text");

    // Clear existing content and create copies
    marqueeText.innerHTML = "";
    for (let i = 0; i < copies; i++) {
      const span = document.createElement("span");
      span.classList.add("text-copy");
      span.style.marginRight = `${gap}px`;
      span.textContent = text;
      marqueeText.appendChild(span);
    }

    // Set up GSAP animation
    gsap.to(marqueeText, {
      x: -textWidth - gap,
      duration: duration,
      ease: "none",
      repeat: -1,
    });
  }, [text, duration, gap]);

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      <div className="marquee-text flex whitespace-nowrap" ref={textRef}>
        <span className="text-copy">{text}</span>
      </div>
    </div>
  );
};

export default ScrollingMarquee;
*/