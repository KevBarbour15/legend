"use client";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import SideMenu from "@/components/side-menu/SideMenu";
import { Button } from "@mui/material";
import { ArrowBackIos } from "@mui/icons-material";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface MenuItem {
  id: string;
  name: string | undefined;
  description: string | undefined;
  price: string | undefined;
}

interface MenuStructure {
  [categoryName: string]: MenuItem[];
}

export default function Menu() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [menu, setMenu] = useState<MenuStructure | null>(null);
  const categoryRefs = useRef<(HTMLDivElement | null)[]>([]);
  const categoriesTL = useRef<gsap.core.Timeline | null>(null);
  const router = useRouter();

  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.set("#no-events", {
      opacity: 0,
      y: 15,
    });

    if (loading) {
      gsap.fromTo(
        "#events-heading",
        { opacity: 0, y: -50 },
        { opacity: 1, duration: 0.15, ease: "linear", y: 0 },
      );
    }

    gsap.fromTo(
      "#event-subheading",
      { opacity: 0, y: -50 },
      { opacity: 1, duration: 0.15, ease: "linear", y: 0 },
    );

    gsap.set(categoryRefs.current, {
      x: "75%",
      opacity: 0,
    });

    if (!loading && categoryRefs.current.length > 0) {
      categoriesTL.current = gsap.timeline({}).to(
        categoryRefs.current,
        {
          duration: 0.25,
          stagger: 0.05,
          x: 0,
          opacity: 1,
        },
        0.05,
      );
    }
  }, [menu]);

  const fetchMenu = async () => {
    try {
      const response = await fetch("/api/catalog");

      if (!response.ok) {
        throw new Error("Failed to fetch events.");
      }
      const data = await response.json();

      setMenu(data);
    } catch (error) {
      console.log("Error: ", error);
      setError("Failed to fetch events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
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
    <>
      <SideMenu />
      <div className="fixed left-0 top-0 z-[-1] h-screen w-screen backdrop-blur-sm"></div>
      <div
        ref={containerRef}
        className="z-10 flex w-screen flex-col p-3 pb-24 md:w-screen md:pl-[275px] md:pr-6 md:pt-6"
      >
        <div
          id="events-heading"
          className="w-full border-b border-customGold pb-3 text-3xl text-customCream opacity-0 md:hidden"
        >
          <div>
            <Button onClick={handleAboutScroll}>
              <ArrowBackIos className="mr-6 text-customCream" />
              <span className="font-bigola text-customCream">Menu</span>
            </Button>
          </div>
        </div>

        {loading ? (
          <h2
            id="event-subheading"
            className="mt-3 text-center font-bigola text-4xl text-customCream opacity-0 lg:text-5xl"
          >
            Loading Menu...
          </h2>
        ) : menu === null ? (
          <h2
            id="event-subheading"
            className="mt-3 text-center font-bigola text-4xl text-customCream opacity-0 lg:text-5xl"
          >
            Error Loading Menu...
          </h2>
        ) : (
          <Accordion
            type="single"
            collapsible
            className="w-full md:border-t md:border-customGold"
          >
            {Object.entries(menu).map(([category, items], index) => (
              <AccordionItem
                ref={(el) => {
                  categoryRefs.current[index] = el;
                }}
                value={category}
                className="border-b border-customGold opacity-0"
                key={category}
              >
                <AccordionTrigger className="cursor-pointer text-4xl text-customCream">
                  <h2 className="font-bigola">{category}</h2>
                </AccordionTrigger>
                {items.map((item) => (
                  <AccordionContent>
                    <div key={item.id} className="px-3 font-hypatia">
                      <div className="flex justify-between text-2xl text-customWhite">
                        <p>{item.name}</p>
                        <p>{item.price}</p>
                      </div>
                      {item.description && (
                        <p className="text-lg text-customGold">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </AccordionContent>
                ))}
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </>
  );
}
