import { useRef } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@mui/material";
import { ArrowBackIosRounded } from "@mui/icons-material";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface MobileHeadingProps {
  section: string;
}

const MobileHeading: React.FC<MobileHeadingProps> = ({ section }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.fromTo(
      "#mobile-heading",
      { opacity: 0, y: -50 },
      { opacity: 1, duration: 0.15, ease: "linear", y: 0, delay: 0.05 },
    );
  }, []);

  const handleAboutScroll = async (e: React.MouseEvent) => {
    e.preventDefault();

    await router.push("/");
    setTimeout(() => {
      const aboutSection = document.getElementById("about-content");

      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 150);
  };

  return (
    <div
      ref={containerRef}
      id="mobile-heading"
      className="w-full border-b border-customGold pb-3 text-customCream opacity-0 md:hidden"
    >
      <div>
        <Button onClick={handleAboutScroll}>
          <ArrowBackIosRounded className="mr-6 text-customCream" />
          <span className="font-bigola text-2xl capitalize text-customCream">
            {section}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default MobileHeading;
