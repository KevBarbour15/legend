import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import Menu from "@/components/menu/Menu";

import { MenuRounded } from "@mui/icons-material";

import { Button } from "@/components/ui/button";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface MobileHeadingProps {
  section: string;
}

const MobileHeading: React.FC<MobileHeadingProps> = ({ section }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

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
    }, 300);
  };

  return (
    <>
      <Menu menuStatus={menuOpen} toggleMenu={toggleMenu} />
      <div
        ref={containerRef}
        id="mobile-heading"
        className="flex w-full justify-between border-b border-customGold pb-3 text-customGold opacity-0 md:hidden"
      >
        <span className="font-bigola text-2xl capitalize">{section}</span>
        <Button
          onClick={toggleMenu}
          size="mobileHeading"
          className="bg-transparent text-customGold"
        >
          <MenuRounded className="text-3xl" />
        </Button>
      </div>
    </>
  );
};

export default MobileHeading;
