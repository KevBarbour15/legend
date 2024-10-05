"use client";
import { useRef, useState, useEffect } from "react";
import { MenuStructure, CategoryWithItems, ProcessedItem } from "@/types.ts";

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
  const [displayMenu, setDisplayMenu] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  useGSAP(() => {
    if (!containerRef.current) return;

    if (loading) {
      gsap.fromTo(
        "#event-subheading",
        { opacity: 0 },
        { opacity: 1, duration: 0.25 },
      );
    }

    gsap.set(categoryRefs.current, {
      x: "75%",
      opacity: 0,
    });

    if (!loading && categoryRefs.current.length > 0 && displayMenu) {
      categoriesTL.current = gsap.timeline({}).to(categoryRefs.current, {
        delay: 0.15,
        duration: 0.35,
        stagger: 0.075,
        x: 0,
        opacity: 1,
      });
    }
  }, [displayMenu]);

  const fetchMenu = async () => {
    try {
      setProgress(generateProgress(1, 35));
      const response = await fetch("/api/catalog");

      if (!response.ok) {
        setProgress(0);
        throw new Error("Failed to fetch events.");
      }

      setProgress(generateProgress(36, 75));

      const data = await response.json();

      setProgress(generateProgress(76, 95));

      setMenu(data);
    } catch (error) {
      setProgress(0);
      console.log("Error: ", error);
      setError("Failed to fetch events.");
    } finally {
      setTimeout(() => {
        setProgress(100);

        setTimeout(() => setLoading(false), 200);
        setTimeout(() => setDisplayMenu(true), 350);
      }, 350);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const Divider = () => (
    <div className="flex w-full items-center px-3 md:mx-6">
      <div
        className="w-full border-t border-dashed border-customWhite"
        aria-hidden="true"
      ></div>
    </div>
  );

  const renderMenuItem = (item: ProcessedItem) => (
    <div
      key={item.id}
      className="block text-nowrap px-3 pb-3 font-hypatia text-base text-customWhite md:text-lg"
    >
      <div className="flex w-full justify-between font-bigola text-lg text-customGold md:text-2xl">
        <p className="text-left">{item.name}</p>
        <Divider />
        <p className="text-right">{item.price}</p>
      </div>
      <div className="mt-1 flex w-full justify-between">
        <p className="font-hypatiaSemibold">{item.brand}</p>
        <Divider />
        <p>{item.description}</p>
      </div>
      {item.city && item.abv && (
        <div className="mt-1 flex w-full justify-between">
          <p>
            {item.city}
            <span>, CA</span>
          </p>
          <Divider />
          <p>
            <span>ABV </span>
            {item.abv}
          </p>
        </div>
      )}
    </div>
  );

  const renderCannedBeerCategory = (category: CategoryWithItems) => (
    <Accordion type="single" collapsible className="w-full px-3">
      {category.childCategories.map((childCategory, index) => (
        <AccordionItem
          value={childCategory.id}
          className="border-b border-customGold"
          key={childCategory.id}
        >
          <AccordionTrigger className="cursor-pointer text-customWhite transition-colors">
            <h3 className="font-bigola text-xl md:text-3xl">
              {childCategory.name}
            </h3>
          </AccordionTrigger>
          <AccordionContent className="border-t border-customGold pt-3">
            {childCategory.items.map(renderMenuItem)}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );

  return (
    <>
      <SideMenu />
      <div className="fixed left-0 top-0 z-[-1] h-screen w-screen backdrop-blur-sm"></div>
      <div
        ref={containerRef}
        className="z-10 flex w-screen flex-col items-center justify-center p-3 pb-20 md:pb-6 md:pl-[325px] md:pr-6 md:pt-6"
      >
        <MobileHeading section={"Menu"} />
        {loading ? (
          <div
            id="event-subheading"
            className="flex h-[75vh] w-full flex-col items-center justify-center opacity-0"
          >
            <h2 className="mb-6 mt-3 font-bigola text-3xl text-customGold md:text-4xl">
              Loading menu...
            </h2>
            <Progress
              value={progress}
              className="w-[75vw] max-w-[350px] text-customCream"
            />
          </div>
        ) : menu === null ? (
          <div
            id="event-subheading"
            className="flex h-[75vh] w-full items-center justify-center"
          >
            <h2 className="mb-6 mt-3 font-bigola text-3xl text-customCream md:text-4xl">
              Error loading menu. Please try again.
            </h2>
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {Object.entries(menu).map(
              ([categoryName, categoryContent], index) => (
                <AccordionItem
                  ref={(el) => {
                    categoryRefs.current[index] = el;
                  }}
                  value={categoryName}
                  className={`${index === 0 ? "md:border-t" : ""} border-b border-customGold opacity-0`}
                  key={categoryName}
                >
                  <AccordionTrigger className="cursor-pointer text-customCream transition-colors">
                    <h2 className="font-bigola text-2xl md:text-4xl">
                      {categoryName}
                    </h2>
                  </AccordionTrigger>
                  <AccordionContent className="border-t border-customGold pt-3">
                    {categoryName === "Canned / Bottled"
                      ? renderCannedBeerCategory(
                          categoryContent as CategoryWithItems,
                        )
                      : (categoryContent as ProcessedItem[]).map(
                          renderMenuItem,
                        )}
                  </AccordionContent>
                </AccordionItem>
              ),
            )}
          </Accordion>
        )}
      </div>
    </>
  );
}
