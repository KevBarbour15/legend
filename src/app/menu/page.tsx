"use client";
import { useRef, useState, useEffect } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import SideMenu from "@/components/side-menu/SideMenu";
import MobileHeading from "@/components/mobile-heading/MobileHeading";

import { Progress } from "@/components/ui/progress";

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

function generateProgress(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function Menu() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [menu, setMenu] = useState<MenuStructure | null>(null);
  const categoryRefs = useRef<(HTMLDivElement | null)[]>([]);
  const categoriesTL = useRef<gsap.core.Timeline | null>(null);
  const [progress, setProgress] = useState<number>(0);

  useGSAP(() => {
    if (!containerRef.current) return;

    if (loading) {
      gsap.fromTo(
        "#event-subheading",
        { opacity: 0 },
        { opacity: 1, ease: "linear", y: 0, delay: 0.05 },
      );
    }

    gsap.set(categoryRefs.current, {
      x: "50%",
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
        0,
      );
    }
  }, [menu]);

  const fetchMenu = async () => {
    try {
      setProgress(generateProgress(5, 35));
      const response = await fetch("/api/catalog");

      if (!response.ok) {
        setProgress(0);
        throw new Error("Failed to fetch events.");
      }

      const data = await response.json();

      setProgress(generateProgress(45, 85));
      setMenu(data);
    } catch (error) {
      setProgress(0);
      console.log("Error: ", error);
      setError("Failed to fetch events.");
    } finally {
      setTimeout(() => {
        setProgress(100);
        setTimeout(() => setLoading(false), 500);
      }, 200);
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
        className="z-10 flex w-screen flex-col items-center p-3 pb-16 md:pl-[300px] md:pr-6 md:pt-6"
      >
        <MobileHeading section={"Menu"} />
        {loading ? (
          <div
            id="event-subheading"
            className="flex h-[75vh] w-full flex-col items-center justify-center opacity-0"
          >
            <h2 className="mb-6 mt-3 font-bigola text-3xl text-customCream md:text-5xl">
              Loading menu...
            </h2>
            <Progress
              value={progress}
              className="w-[50%] max-w-[350px] text-customCream"
            />
          </div>
        ) : menu === null ? (
          <div
            id="event-subheading"
            className="flex h-[75vh] w-full items-center justify-center"
          >
            <h2 className="mt-3 font-bigola text-5xl text-customCream">
              Error loading menu. Please try again.
            </h2>
          </div>
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
                className="border-customGold opacity-0"
                key={category}
              >
                <AccordionTrigger className="cursor-pointer text-customCream transition-colors">
                  <h2 className="font-bigola text-2xl md:text-4xl">
                    {category}
                  </h2>
                </AccordionTrigger>
                <AccordionContent className="border-t border-customGold pt-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between pl-3 pr-6 font-hypatia text-customWhite"
                    >
                      <div>
                        <p className="font-bigola text-2xl text-customGold">
                          {item.name}
                        </p>
                        <p className="text-lg">{item.brand}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg">{item.description}</p>
                        <p className="text-lg">{item.price}</p>
                      </div>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </>
  );
}
