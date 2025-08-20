"use client";
import { useRef, useState, useEffect } from "react";

import {
  MenuStructure,
  CategoryWithItems,
  ProcessedItem,
} from "@/data/menu.ts";

import { ArrowBendRightDown } from "@phosphor-icons/react";

import { generateProgress } from "@/utils/progress";
import AudioStatic from "@/components/audio-static/AudioStatic";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(SplitText);

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

      try {
        // Add timestamp to prevent caching
        const response = await fetch(`/api/menu?t=${Date.now()}`, {
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
          next: {
            revalidate: 0,
          },
        });

        const menuData = await response.json();
        setProgress(generateProgress(67, 99));

        setMenu(menuData.menu);
      } catch (error) {
        setProgress(0);
        setError("Failed to fetch menu data.");
        throw error;
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

    const tl = gsap.timeline({ delay: 0.25 });
    const heading = new SplitText("#menu-heading", { type: "chars" });
    const subheading = new SplitText("#menu-subheading", { type: "words" });

    tl.set("#menu", {
      opacity: 0,
    })

      .set("#menu-heading", {
        opacity: 1,
      })
      .set("#menu-subheading", {
        opacity: 1,
      })
      .set(heading.chars, {
        opacity: 0,
        y: -25,
      })
      .set(subheading.words, {
        x: -25,
        opacity: 0,
      })
      .set(menuItemRefs.current, {
        opacity: 0,
        y: 30,
      })
      .to(heading.chars, {
        duration: 0.35,
        ease: "back.out(1.7)",
        y: 0,
        opacity: 1,
        stagger: 0.015,
      })
      .to(subheading.words, {
        duration: 0.35,
        ease: "back.out(1.7)",
        x: 0,
        opacity: 1,
        stagger: 0.025,
      })
      .to(
        "#menu",
        {
          opacity: 1,
          duration: 0.025,
        },
        "<",
      )
      .to(
        menuItemRefs.current,
        {
          delay: 0.025,
          y: 0,
          duration: 0.3,
          stagger: 0.075,
          ease: "back.out(2.5)",
          opacity: 1,
        },
        "<",
      );
  }, [loading]);

  useEffect(() => {
    setProgress(generateProgress(1, 33));
    setTimeout(() => {
      fetchMenu();
    }, 1500);
  }, []);

  const getIcon = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case "canned / bottled":
        //return <BeerBottle weight="regular" />;
        return (
          <ArrowBendRightDown
            size={32}
            weight="regular"
            className="text-shadow-custom"
          />
        );
      case "draft":
        //return <BeerStein weight="regular" />;
        return (
          <ArrowBendRightDown
            size={32}
            weight="regular"
            className="text-shadow-custom"
          />
        );
      case "wine":
        //return <Wine weight="regular" />;
        return (
          <ArrowBendRightDown
            size={32}
            weight="regular"
            className="text-shadow-custom"
          />
        );
      case "sake":
        //return <ArrowDown />;
        return (
          <ArrowBendRightDown
            size={32}
            weight="regular"
            className="text-shadow-custom"
          />
        );
      default:
        //return <PintGlass weight="regular" />;
        return (
          <ArrowBendRightDown
            size={32}
            weight="regular"
            className="text-shadow-custom"
          />
        );
    }
  };

  const renderMenuItem = (item: ProcessedItem, isLast: boolean) => (
    <div
      key={item.id}
      className={`block ${!isLast ? "border-b-2 border-dashed border-customGold" : ""} py-3 font-hypatia text-base capitalize md:text-lg`}
    >
      <div className="flex w-full justify-between text-nowrap font-bigola text-lg text-customNavy md:text-2xl">
        <p className="whitespace-nowrap text-left leading-none text-shadow-custom">
          {item.name}
        </p>
        {item.bottlePrice ? (
          <div className="flex first-letter:items-end">
            <p className="flex gap-1 text-right leading-none text-shadow-custom">
              {item.price}{" "}
              <span>
                {item.bottleIsSellable && (
                  <>
                    <span>/</span>
                    {item.bottlePrice}
                  </>
                )}
              </span>
            </p>
          </div>
        ) : (
          <p className="text-right leading-none text-shadow-custom">
            {item.price}
          </p>
        )}
      </div>

      <div className="mt-1 flex w-full items-center justify-between font-hypatiaSemibold leading-tight text-customNavy">
        <p className="text-nowrap text-left text-shadow-custom">{item.brand}</p>

        {item.city && (
          <p className="flex gap-1 text-shadow-custom">
            <span>{item.city},</span>
            <span>CA</span>
          </p>
        )}
      </div>

      <div className="mt-1 flex w-full items-center justify-between leading-none text-customNavy">
        <p className="text-balance pr-[2px] text-left text-shadow-custom">
          {item.description}
        </p>

        {item.abv && (
          <div className="flex gap-1 text-right text-shadow-custom">
            <p>ABV</p>
            <p> {item.abv}</p>
          </div>
        )}
      </div>

      {item.varieties && (
        <p className="mt-1 text-nowrap italic text-customNavy text-shadow-custom">
          {item.varieties}
        </p>
      )}
    </div>
  );

  const renderCannedBeerCategory = (category: CategoryWithItems) => (
    <Accordion type="single" collapsible className="w-full pl-4">
      {category.childCategories.map((childCategory, index) => (
        <AccordionItem
          value={childCategory.id}
          className={`${index !== category.childCategories.length - 1 ? "border-b-2 border-customGold" : ""}`}
          key={childCategory.id}
        >
          <AccordionTrigger
            className={`cursor-pointer font-bigola text-xl leading-none drop-shadow-text md:text-4xl ${
              activeChildCategory === childCategory.id
                ? "text-customGold"
                : "text-customNavy"
            }`}
            icon={<ArrowBendRightDown weight="regular" />}
            onClick={() => handleChildCategoryClick(childCategory.id)}
          >
            <h2
              className={`transition-all duration-300 text-shadow-custom ${activeChildCategory === childCategory.id ? "translate-x-[15px] transform text-customGold" : "text-customNavy"}`}
            >
              {childCategory.name}
            </h2>
          </AccordionTrigger>
          <AccordionContent className="border-customGold">
            {childCategory.items.map((item, idx) =>
              renderMenuItem(item, idx === childCategory.items.length - 1),
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );

  return (
    <>
      <AudioStatic />
      <div ref={containerRef} className="min-h-screen pt-16 md:pt-0">
        <div className="mx-auto block h-auto pb-12 md:pl-[240px] md:pr-6 md:pt-6 xl:max-w-[1280px] xxl:max-w-[1536px]">
          {loading ? (
            <div className="z-[151] font-bigola">
              <Loading
                progress={progress}
                message={"Loading menu..."}
                textColor="text-customNavy"
                borderColor="border-customNavy"
              />
            </div>
          ) : error ? (
            <div className="z-[151] flex h-[50vh] w-full flex-col items-center justify-center">
              <h2 className="mb-3 text-center font-bigola text-3xl text-customNavy text-shadow-custom md:text-4xl">
                Failed to load menu. Please refresh the page.
              </h2>
            </div>
          ) : !menu ? (
            <div className="z-[151] flex h-[50vh] w-full flex-col items-center justify-center">
              <h2 className="mb-3 text-center font-bigola text-3xl text-customNavy text-shadow-custom md:text-4xl">
                No menu data found.
              </h2>
            </div>
          ) : (
            <div>
              <div className="overflow-hidden">
                <h2
                  id="menu-heading"
                  className="mb-2 mt-3 font-bigola text-4xl italic text-customGold opacity-0 text-shadow-custom md:hidden"
                >
                  Menu
                </h2>
                <h3
                  id="menu-subheading"
                  className="mb-6 w-full font-hypatia text-lg leading-[1.15] text-customNavy opacity-0 text-shadow-custom md:text-center md:font-bigola md:text-3xl"
                >
                  Stay up to date as our selections rotate!
                </h3>
              </div>
              <Accordion type="single" collapsible className="z-[151] w-full">
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
                            className={`${index === 0 ? "border-t-2" : ""} border-b-2 border-customGold`}
                            key={categoryName}
                          >
                            <AccordionTrigger
                              className={`cursor-pointer font-bigola text-3xl leading-none drop-shadow-text transition-all duration-300 md:py-4 md:text-4xl ${
                                activeCategory === index
                                  ? "text-customGold"
                                  : "text-customNavy"
                              }`}
                              icon={getIcon(categoryName)}
                              onClick={() => handleCategoryClick(index)}
                            >
                              <h2
                                className={`transition-all duration-300 text-shadow-custom ${activeCategory === index ? "translate-x-[16px] transform text-customGold" : "text-customNavy"}`}
                              >
                                {categoryName}
                              </h2>
                            </AccordionTrigger>
                            <AccordionContent
                              className={`border-customGold ${categoryName === "Canned / Bottled" ? "pt-0" : ""}`}
                            >
                              {categoryName === "Wine" && (
                                <div className="text-pretty py-3 text-center text-shadow-custom">
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
                                <div className="text-pretty py-3 text-center text-customNavy text-shadow-custom">
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
                                    (item, idx) =>
                                      renderMenuItem(
                                        item,
                                        idx ===
                                          (categoryContent as ProcessedItem[])
                                            .length -
                                            1,
                                      ),
                                  )}
                            </AccordionContent>
                          </AccordionItem>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </Accordion>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Menu;
