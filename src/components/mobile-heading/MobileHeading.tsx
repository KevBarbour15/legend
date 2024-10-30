import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import Menu from "@/components/dropdown-menu/DropdownMenu";

import { MenuRounded } from "@mui/icons-material";

import { IconButton } from "@mui/material";

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

  return (
    <>
      <Menu menuStatus={menuOpen} toggleMenu={toggleMenu} />
      <div
        ref={containerRef}
        id="mobile-heading"
        className="flex w-full justify-between border-b border-customGold pb-3 text-customGold opacity-0 md:hidden"
      >
        <span className="font-bigola text-2xl">{section}</span>
        <IconButton
          onClick={toggleMenu}
          className="bg-transparent p-0 text-customGold"
        >
          <MenuRounded className="text-3xl" />
        </IconButton>
      </div>
    </>
  );
};

export default MobileHeading;
