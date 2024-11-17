import { useRef, useState } from "react";

import Menu from "@/components/dropdown-menu/DropdownMenu";

import { List } from "@phosphor-icons/react";

import { IconButton } from "@mui/material";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface MobileHeadingProps {
  section: string;
}

const MobileHeading: React.FC<MobileHeadingProps> = ({ section }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
        className="flex w-full justify-between border-b border-customGold pb-3 text-customCream opacity-0 md:hidden"
      >
        <span className="font-bigola text-2xl italic">{section}</span>
        <IconButton
          onClick={toggleMenu}
          className="bg-transparent p-0 text-customCream"
        >
          <List weight="regular" size={28} />
        </IconButton>
      </div>
    </>
  );
};

export default MobileHeading;
