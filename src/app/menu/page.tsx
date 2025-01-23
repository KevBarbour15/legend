"use client";
import { useRef, useState, useEffect } from "react";

import { getMenu } from "../actions/getMenu.server";

import {
  MenuStructure,
  CategoryWithItems,
  ProcessedItem,
} from "@/data/menu.ts";

import {
  BeerBottle,
  BeerStein,
  Wine,
  CaretDown,
  PintGlass,
} from "@phosphor-icons/react";

import { generateProgress } from "@/utils/progress";
import AudioStatic from "@/components/audio-static/AudioStatic";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import Loading from "@/components/loading/Loading";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Menu: React.FC = ({}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [menu, setMenu] = useState<MenuStructure | null>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const menuItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [activeChildCategory, setActiveChildCategory] = useState<string | null>(
    null,
  );

  const handleCategoryClick = (index: number) => {
    if (activeCategory === index) {
      setActiveCategory(null);
    } else {
      setActiveCategory(index);
    }
    setActiveChildCategory(null);
  };

  const handleChildCategoryClick = (id: string) => {
    if (activeChildCategory === id) {
      setActiveChildCategory(null);
    } else {
      setActiveChildCategory(id);
    }
  };

  const fetchMenu = async () => {
    try {
      setProgress(generateProgress(34, 66));
      const data = await getMenu();

      if (!data) {
        setProgress(generateProgress(67, 85));
        // fetch fallback menu client side if ssr fails
        try {
          const response = await fetch("/api/fallback-menu");
          if (!response.ok) {
            setProgress(0);
            throw new Error(`Fallback API returned ${response.status}`);
          }
          const fallbackMenu = await response.json();

          setProgress(generateProgress(86, 99));
          setMenu(fallbackMenu.menu);
        } catch (fallbackError) {
          setProgress(0);
          setError(
            "Failed to fetch menu data from both primary and fallback sources",
          );
          throw fallbackError;
        }
      } else {
        setProgress(generateProgress(67, 99));
        setMenu(data);
      }
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error("Unknown error occurred");
      console.error("Error: ", err);
      setError(err.message);
    } finally {
      setProgress(100);
      await new Promise((resolve) => setTimeout(resolve, 350));
      setLoading(false);
    }
  };

  useGSAP(() => {
    if (loading || !containerRef.current) return;

    gsap.set("#menu", {
      opacity: 0,
    });
    gsap.set("#menu-heading", {
      opacity: 0,
    });
    gsap.set(menuItemRefs.current, {
      opacity: 0,
      y: 75,
      clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
    });

    tl.current = gsap
      .timeline({})
      .to("#menu", {
        opacity: 1,
        duration: 0.15,
      })
      .to("#menu-heading", {
        opacity: 1,
        duration: 0.15,
      })
      .to(menuItemRefs.current, {
        delay: 0.15,
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        y: 0,
        duration: 0.2,
        stagger: 0.075,
        ease: "linear",
        opacity: 1,
      });
  }, [loading]);

  useEffect(() => {
    setProgress(generateProgress(1, 33));
    fetchMenu();
  }, []);

  const getIcon = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case "canned / bottled":
        return <BeerBottle weight="thin" />;
      case "draft":
        return <BeerStein weight="thin" />;
      case "wine":
        return <Wine weight="thin" />;
      default:
        return <PintGlass weight="thin" />;
    }
  };

  const renderMenuItem = (item: ProcessedItem) => (
    <div
      key={item.id}
      className="mb-3 block border-b border-dashed border-customGold pb-3 font-hypatia text-base capitalize text-customWhite md:text-lg"
    >
      <div className="flex w-full justify-between text-nowrap font-bigola text-lg text-customNavy md:text-2xl">
        <p className="whitespace-nowrap text-left leading-none">{item.name}</p>
        {item.bottlePrice ? (
          <div className="flex first-letter:items-end">
            <p className="flex gap-1 text-right leading-none">
              {item.price} <span>/</span>
              {item.bottlePrice}
            </p>
          </div>
        ) : (
          <p className="text-right leading-none">{item.price}</p>
        )}
      </div>

      <div className="mt-1 flex w-full items-center justify-between font-hypatiaSemibold leading-tight text-customNavy">
        <p className="text-nowrap text-left">{item.brand}</p>

        {item.city && (
          <p className="flex gap-1">
            <span>{item.city},</span>
            <span>CA</span>
          </p>
        )}
      </div>

      <div className="mt-1 flex w-full items-center justify-between text-nowrap leading-none text-customNavy">
        <p className="text-balance pr-[2px] text-left md:text-nowrap">
          {item.description}
        </p>

        {item.abv && (
          <div className="flex gap-1 text-right">
            <p>ABV</p>
            <p> {item.abv}</p>
          </div>
        )}
      </div>

      {item.varieties && (
        <p className="mt-1 text-nowrap italic text-customNavy">
          {item.varieties}
        </p>
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
          <AccordionTrigger
            className={`cursor-pointer font-bigola text-xl leading-none md:text-4xl ${
              activeChildCategory === childCategory.id
                ? "text-customGold"
                : "text-customNavy"
            }`}
            icon={<CaretDown weight="thin" />}
            onClick={() => handleChildCategoryClick(childCategory.id)}
          >
            <h2
              className={`transition-all duration-300 ${activeChildCategory === childCategory.id ? "translate-x-[15px] transform text-customGold" : "text-customNavy"}`}
            >
              {childCategory.name}
            </h2>
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
      <AudioStatic />
      <div ref={containerRef} className="min-h-dvh w-screen">
        <div className="mx-auto flex flex-col items-center justify-center overflow-y-auto px-3 pb-20 md:pb-6 md:pl-[258px] md:pr-6 md:pt-6 xl:max-w-[1280px] xxl:max-w-[1536px]">
          {loading ? (
            <div className="z-20 font-bigola">
              <Loading
                progress={progress}
                message={"Loading menu..."}
                textColor="text-customNavy"
                borderColor="border-customNavy"
              />
            </div>
          ) : error ? (
            <div className="z-20 flex h-[50vh] w-full flex-col items-center justify-center">
              <h2 className="mb-3 text-center font-bigola text-3xl text-customNavy md:text-4xl">
                Failed to load menu. Please refresh the page.
              </h2>
            </div>
          ) : !menu ? (
            <div className="z-20 flex h-[50vh] w-full flex-col items-center justify-center">
              <h2 className="mb-3 text-center font-bigola text-3xl text-customNavy md:text-4xl">
                No menu data found.
              </h2>
            </div>
          ) : (
            <>
              <Accordion type="single" collapsible className="z-20 w-full">
                <h3
                  id="menu-heading"
                  className="hidden w-full text-pretty border-b border-customGold pb-6 pt-3 text-center font-bigola text-xl text-customNavy opacity-0 md:mb-6 md:block md:border-0 md:py-0 md:text-3xl"
                >
                  Stay up to date as our selections rotate!
                </h3>
                <div className="w-full opacity-0" id="menu">
                  {Object.entries(menu).map(
                    ([categoryName, categoryContent], index) => (
                      <div className="w-full" key={index}>
                        <div
                          ref={(el) => {
                            menuItemRefs.current[index] = el;
                          }}
                          className="relative w-full"
                        >
                          <AccordionItem
                            value={categoryName}
                            className={`${index === 0 ? "md:border-t" : ""} border-b border-customGold`}
                            key={categoryName}
                          >
                            <AccordionTrigger
                              className={`cursor-pointer font-bigola text-3xl leading-none transition-all duration-300 md:text-4xl ${
                                activeCategory === index
                                  ? "text-customGold"
                                  : "text-customNavy"
                              }`}
                              icon={getIcon(categoryName)}
                              onClick={() => handleCategoryClick(index)}
                            >
                              <h2
                                className={`transition-all duration-300 ${activeCategory === index ? "translate-x-[15px] transform text-customGold" : "text-customNavy"}`}
                              >
                                {categoryName}
                              </h2>
                            </AccordionTrigger>
                            <AccordionContent
                              className={`border-customGold ${categoryName === "Canned / Bottled" ? "pt-0" : ""}`}
                            >
                              {categoryName === "Wine" && (
                                <div className="text-pretty pb-6 text-center">
                                  <p className="font-bigola text-lg text-customNavy md:text-2xl">
                                    Wine Down Wednesday
                                  </p>
                                  <p className="font-hypatiaBold text-base text-customNavy md:text-lg">
                                    All Day Wednesday: 3-10pm
                                  </p>
                                  <p className="font-hypatia text-base text-customNavy md:text-lg">
                                    $2 off glasses and $5 off bottles.
                                  </p>
                                </div>
                              )}

                              {categoryName === "Draft" && (
                                <div className="text-pretty pb-6 text-center text-customNavy">
                                  <p className="font-bigola text-lg text-customNavy md:text-2xl">
                                    Happy Hour
                                  </p>
                                  <p className="font-hypatiaBold text-base text-customNavy md:text-lg">
                                    {" "}
                                    Wednesday - Friday, 3 - 6pm
                                  </p>
                                  <p className="font-hypatia text-base text-customNavy md:text-lg">
                                    $2 off draft beers.
                                  </p>
                                </div>
                              )}

                              {categoryName === "Canned / Bottled"
                                ? renderCannedBeerCategory(
                                    categoryContent as CategoryWithItems,
                                  )
                                : (categoryContent as ProcessedItem[]).map(
                                    renderMenuItem,
                                  )}
                            </AccordionContent>
                          </AccordionItem>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </Accordion>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Menu;
