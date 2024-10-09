"use client";
import { useRef, useState, useEffect } from "react";
import {
  MenuStructure,
  CategoryWithItems,
  ProcessedItem,
  MenuProps,
} from "@/types.ts";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import SideMenu from "@/components/side-menu/SideMenu";
import MobileHeading from "@/components/mobile-heading/MobileHeading";
import Divider from "@/components/divider/Divider";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const MenuClient: React.FC<MenuProps> = ({
  initialData,
  error: initialError,
  initialTimestamp,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [menu, setMenu] = useState<MenuStructure | null>(initialData);
  const categoryRefs = useRef<(HTMLDivElement | null)[]>([]);
  const categoriesTL = useRef<gsap.core.Timeline | null>(null);
  const [timestamp, setTimestamp] = useState(initialTimestamp);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/catalog");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMenu(data);
        setTimestamp(new Date().toISOString());
      } catch (e) {}
    };

    const intervalId = setInterval(fetchData, 10000);
    console.log(`[${timestamp}] Menu data fetched successfully`);
    return () => clearInterval(intervalId);
  }, []);

  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.set(categoryRefs.current, {
      x: "75%",
      opacity: 0,
    });

    if (categoryRefs.current.length > 0) {
      categoriesTL.current = gsap.timeline({}).to(categoryRefs.current, {
        delay: 0.15,
        duration: 0.35,
        stagger: 0.075,
        x: 0,
        opacity: 1,
      });
    }
  }, []);

  const renderMenuItem = (item: ProcessedItem) => (
    <div
      key={item.id}
      className="block text-nowrap pb-3 font-hypatia text-base text-customWhite md:text-lg"
    >
      <div className="flex w-full justify-between font-bigola text-lg text-customGold md:text-2xl">
        <p className="text-left">{item.name}</p>
        <Divider borderColor={"border-customWhite"} />
        <p className="text-right">{item.price}</p>
      </div>
      <div className="mt-1 flex w-full justify-between">
        <p className="font-hypatiaSemibold">{item.brand}</p>
        <Divider borderColor={"border-customWhite"} />
        <p>{item.description}</p>
      </div>
      {item.city && item.abv && (
        <div className="mt-1 flex w-full justify-between">
          <p>
            {item.city}
            <span>, CA</span>
          </p>
          <Divider borderColor={"border-customWhite"} />
          <p>
            <span>ABV </span>
            {item.abv}
          </p>
        </div>
      )}
    </div>
  );

  const renderCannedBeerCategory = (category: CategoryWithItems) => (
    <Accordion type="single" collapsible className="w-full pl-3">
      {category.childCategories.map((childCategory, index) => (
        <AccordionItem
          value={childCategory.id}
          className={`${index !== category.childCategories.length - 1 ? "border-b border-customGold" : ""}`}
          key={childCategory.id}
        >
          <AccordionTrigger className="cursor-pointer text-xl text-customCream md:text-3xl">
            <h3 className="font-bigola">{childCategory.name}</h3>
          </AccordionTrigger>
          <AccordionContent className="border-customGold">
            {childCategory.items.map(renderMenuItem)}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );

  return (
    <>
      <SideMenu />
      <div className="absolute left-0 top-0 z-[-1] h-screen w-screen backdrop-blur-sm"></div>
      <div
        ref={containerRef}
        className="z-10 flex w-screen flex-col items-center justify-center p-3 pb-20 md:pb-6 md:pl-[250px] md:pr-6 md:pt-6"
      >
        <MobileHeading section={"Menu"} />
        {menu === null ? (
          <div
            id="event-subheading"
            className="flex h-[50vh] w-full items-center justify-center"
          >
            <h2 className="mb-6 mt-3 text-center font-bigola text-3xl text-customCream md:text-4xl">
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
                  <AccordionTrigger className="text-customCream">
                    <h2 className="font-bigola">{categoryName}</h2>
                  </AccordionTrigger>
                  <AccordionContent
                    className={`border-customGold ${categoryName === "Canned / Bottled" ? "pt-0" : ""}`}
                  >
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
};

export default MenuClient;
