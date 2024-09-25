"use client";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import SideMenu from "@/components/side-menu/SideMenu";
import MobileHeading from "@/components/mobile-heading/MobileHeading";

import { Button } from "@mui/material";
import { ArrowBackIosRounded } from "@mui/icons-material";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface MenuItem {
  id: string;
  name: string | undefined;
  brand: string | undefined;
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

    gsap.fromTo(
      "#event-subheading",
      { opacity: 0 },
      { opacity: 1, ease: "linear", y: 0, delay: 0.05 },
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

  return (
    <>
      <SideMenu />
      <div className="fixed left-0 top-0 z-[-1] h-screen w-screen backdrop-blur-sm"></div>
      <div
        ref={containerRef}
        className="z-10 flex w-screen flex-col items-center justify-center p-3 pb-14 md:pl-[300px] md:pr-6 md:pt-6"
      >
        <MobileHeading section={"Menu"} />
        {loading ? (
          <h2
            id="event-subheading"
            className="mt-3 text-center font-bigola text-4xl text-customCream opacity-0"
          >
            Loading Menu...
          </h2>
        ) : menu === null ? (
          <h2
            id="event-subheading"
            className="mt-3 text-center font-bigola text-4xl text-customCream opacity-0"
          >
            Error Loading Menu...
          </h2>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {Object.entries(menu).map(([category, items], index) => (
              <AccordionItem
                ref={(el) => {
                  categoryRefs.current[index] = el;
                }}
                value={category}
                className="border-customGold opacity-0"
                key={category}
              >
                <AccordionTrigger className="cursor-pointer text-4xl text-customCream transition-colors hover:text-customGold">
                  <h2 className="font-bigola">{category}</h2>
                </AccordionTrigger>
                {items.map((item) => (
                  <AccordionContent key={item.id}>
                    <div className="flex justify-between pl-3 pr-6 font-hypatia text-customWhite">
                      <div>
                        <p className="font-bigola text-3xl text-customGold">
                          {item.name}
                        </p>
                        <p className="text-xl">{item.brand}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl">{item.description}</p>
                        <p className="text-xl">{item.price}</p>
                      </div>
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
