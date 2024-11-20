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

import MobileHeading from "@/components/mobile-heading/MobileHeading";
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
  const [progress, setProgress] = useState<number>(0);

  const fetchMenu = async () => {
    try {
      // animate progress bar to give user feedback / realism
      // due to loading time, no need for timeouts
      const data = await getMenu();

      setProgress(generateProgress(34, 66));
      await new Promise((resolve) => setTimeout(resolve, 5));

      if (!data) {
        setProgress(0);
        setError("Failed to fetch menu data");
        throw new Error("Failed to fetch menu data");
      }
      setProgress(generateProgress(67, 99));
      await new Promise((resolve) => setTimeout(resolve, 5));

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

    tl.current = gsap.timeline({}).to("#menu", {
      delay: 0.15,
      opacity: 1,
      duration: 0.35,
    });
  }, [loading]);

  useEffect(() => {
    setProgress(generateProgress(1, 33));
    fetchMenu();
  }, []);

  const getIcon = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case "canned / bottled":
        return <BeerBottle weight="fill" />;
      case "draft":
        return <BeerStein weight="fill" />;
      case "wine":
        return <Wine weight="fill" />;
      default:
        return <PintGlass weight="fill" />;
    }
  };

  const renderMenuItem = (item: ProcessedItem) => (
    <div
      key={item.id}
      className="block text-nowrap pb-3 font-hypatia text-base text-customWhite md:text-lg"
    >
      <div className="flex w-full justify-between font-bigola text-lg text-customGold md:text-2xl">
        <p className="text-left leading-none">{item.name}</p>
        <Divider borderColor={"border-customWhite"} />
        <p className="text-right leading-none">{item.price}</p>
      </div>
      <div className="mt-1 flex w-full justify-between font-hypatiaSemibold leading-tight">
        <p>{item.brand}</p>
        <Divider borderColor={"border-customWhite"} />
        <p>{item.description}</p>
      </div>
      {item.city && item.abv && (
        <div className="mt-1 flex w-full justify-between leading-none">
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
          <AccordionTrigger
            className="cursor-pointer font-bigola text-2xl leading-none text-customCream md:text-4xl"
            icon={<CaretDown weight="regular" />}
          >
            <h3>{childCategory.name}</h3>
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
      className="z-10 mx-auto flex w-screen flex-col items-center justify-center overflow-y-auto p-3 pb-20 md:pb-6 md:pl-[258px] md:pr-6 md:pt-6 xl:max-w-[1280px] xxl:max-w-[1536px]"
    >
      <MobileHeading section={"Menu"} />
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
                <AccordionItem
                  value={categoryName}
                  className={`${index === 0 ? "md:border-t" : ""} border-b border-customGold`}
                  key={categoryName}
                >
                  <AccordionTrigger
                    className="cursor-pointer font-bigola text-2xl leading-none text-customCream md:text-4xl"
                    icon={getIcon(categoryName)}
                  >
                    <h2>{categoryName}</h2>
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
          </div>
        </Accordion>
      )}
    </div>
  );
};

export default Menu;
