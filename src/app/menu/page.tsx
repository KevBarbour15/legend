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

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import Divider from "@/components/divider/Divider";
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
      setActiveChildCategory(null);
    } else {
      setActiveCategory(index);
    }
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
      // animate progress bar to give user feedback / realism
      // due to loading time, no need for timeouts
      const data = await getMenu();

      setProgress(generateProgress(34, 66));
      await new Promise((resolve) => setTimeout(resolve, 15));

      if (!data) {
        setProgress(0);
        setError("Failed to fetch menu data");
        throw new Error("Failed to fetch menu data");
      }
      setProgress(generateProgress(67, 99));
      await new Promise((resolve) => setTimeout(resolve, 15));

      setMenu(data);
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
      className="block text-nowrap px-3 pb-6 font-hypatia text-base text-customWhite md:text-lg"
    >
      <div className="flex w-full justify-between font-bigola text-lg text-customCream md:text-2xl">
        <p className="text-left leading-none">{item.name}</p>
        <p className="text-right italic leading-none">{item.price}</p>
      </div>
      <div className="mt-1 flex w-full justify-between font-hypatiaSemibold leading-tight text-customGold">
        <p>{item.brand}</p>
        <Divider borderColor={"border-customCream"} />
        <p className="italic">{item.description}</p>
      </div>
      {item.city && item.abv && (
        <div className="mt-1 flex w-full justify-between leading-none text-customGold">
          <p className="flex gap-1">
            <p>{item.city}</p>
            <p>, CA</p>
          </p>
          <Divider borderColor={"border-customCream"} />
          <div className="flex gap-1 italic">
            <p>ABV</p>
            <p> {item.abv}</p>
          </div>
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
          <AccordionTrigger
            className={`cursor-pointer font-bigola text-2xl leading-none md:text-4xl ${
              activeChildCategory === childCategory.id
                ? "text-customGold"
                : "text-customCream"
            }`}
            icon={<CaretDown weight="thin" />}
            onClick={() => handleChildCategoryClick(childCategory.id)}
          >
            <h2
              className={`transition-all duration-300 ${activeChildCategory === childCategory.id ? "translate-x-[15px] transform text-customGold" : "text-customCream"}`}
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
    <div
      ref={containerRef}
      className="z-10 mx-auto flex w-screen flex-col items-center justify-center overflow-y-auto px-3 pb-20 md:pb-6 md:pl-[258px] md:pr-6 md:pt-6 xl:max-w-[1280px] xxl:max-w-[1536px]"
    >
      {loading ? (
        <div className="font-bigola">
          <Loading
            progress={progress}
            message={"Loading menu..."}
            textColor="text-customCream"
            borderColor="border-customGold"
          />
        </div>
      ) : error ? (
        <div className="flex h-[50vh] w-full flex-col items-center justify-center">
          <h2 className="mb-6 text-center font-bigola text-3xl text-customCream md:text-4xl">
            {error}
          </h2>
        </div>
      ) : !menu ? (
        <div className="flex h-[50vh] w-full flex-col items-center justify-center">
          <h2 className="mb-6 text-center font-bigola text-3xl text-customCream md:text-4xl">
            No menu data found.
          </h2>
        </div>
      ) : (
        <Accordion type="single" collapsible className="w-full">
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
                        className={`cursor-pointer font-bigola text-2xl leading-none transition-all duration-300 md:text-5xl ${
                          activeCategory === index
                            ? "text-customGold"
                            : "text-customCream"
                        }`}
                        icon={getIcon(categoryName)}
                        onClick={() => handleCategoryClick(index)}
                      >
                        <h2
                          className={`transition-all duration-300 ${activeCategory === index ? "translate-x-[15px] transform text-customGold" : "text-customCream"}`}
                        >
                          {categoryName}
                        </h2>
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
                  </div>
                </div>
              ),
            )}
          </div>
        </Accordion>
      )}
    </div>
  );
};

export default Menu;
