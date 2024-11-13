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

import SideMenu from "@/components/side-menu/SideMenu";
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
    setLoading(true);
    setError(null);
    setProgress(generateProgress(1, 25));

    try {
      setTimeout(() => setProgress(generateProgress(36, 75)), 100);

      const data = await getMenu();

      setTimeout(() => setProgress(generateProgress(76, 95)), 100);

      setMenu(data);
    } catch (err) {
      setProgress(0);
      setError("Failed to fetch menu data. Please try again later.");
      console.error(err);
    } finally {
      setTimeout(() => {
        setProgress(100);
        setTimeout(() => setLoading(false), 300);
      }, 350);
    }
  };

  useGSAP(() => {
    if (!containerRef.current) return;

    if (loading) {
      gsap.fromTo(
        "#event-subheading",
        { opacity: 0 },
        { opacity: 1, duration: 0.25 },
      );
      return;
    }

    gsap.set("#menu", {
      opacity: 0,
    });

    tl.current = gsap.timeline({}).to("#menu", {
      duration: 0.25,
      opacity: 1,
      ease: "sine.inOut",
    });
  }, [loading]);

  useEffect(() => {
    let isMounted = true;
    const fetchMenuData = async () => {
      if (isMounted) {
        await fetchMenu();
      }
    };
    fetchMenuData();
    return () => {
      isMounted = false;
    };
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
            className="cursor-pointer font-bigola text-xl leading-none text-customCream md:text-4xl"
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
    <>
      <SideMenu />
      <div className="fixed left-0 top-0 z-[-1] h-full min-h-screen w-screen backdrop-blur-sm"></div>
      <div
        ref={containerRef}
        className="z-10 mx-auto flex w-screen flex-col items-center justify-center overflow-y-auto p-3 pb-20 md:pb-6 md:pl-[258px] md:pr-6 md:pt-6 xl:max-w-[1280px] xxl:max-w-[1536px]"
      >
        <MobileHeading section={"Menu"} />
        {loading ? (
          <Loading
            progress={progress}
            message={"Loading menu..."}
            loading={loading}
          />
        ) : menu === null ? (
          <div
            id="event-subheading"
            className="flex h-[50vh] w-full items-center justify-center"
          >
            <h2 className="my-3 text-center font-bigola text-3xl text-customCream md:text-4xl">
              Error loading menu. Please try again.
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
                      className="cursor-pointer font-bigola text-xl leading-none text-customCream md:text-4xl"
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
    </>
  );
};

export default Menu;
