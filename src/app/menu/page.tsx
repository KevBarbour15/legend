"use client";
import { useRef } from "react";

//gsap imports
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Menu() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.set("#menu-column-left  #menu-item", {
      opacity: 0,
      y: 35,
      scale: 0.9,
    });
    gsap.set("#menu-column-right  #menu-item", {
      opacity: 0,
      y: 35,
      scale: 0.9,
    });

    tl.current = gsap
      .timeline({})
      .to("#menu-column-left #menu-item", {
        delay: 0.4,
        duration: 0.35,
        opacity: 1,
        ease: "power1.inOut",
        stagger: 0.1,
        scale: 1,
        y: 0,
      })
      .to("#menu-column-right #menu-item", {
        delay: -2.25,
        duration: 0.35,
        opacity: 1,
        ease: "power1.inOut",
        stagger: 0.1,
        scale: 1,
        y: 0,
      });
  });

  return (
    <div
      ref={containerRef}
      className="align-center flex min-h-screen w-screen flex-row justify-center"
    >
      <div
        id="menu-column-left"
        className="w-45vw justify-center text-center lg:w-30vw"
      >
        {/* Draft Beer section */}
        <h1
          id="menu-item"
          className="font-bigola text-3xl text-customCream underline opacity-0 lg:text-4xl"
        >
          Draft Beer
        </h1>
        <h1
          id="menu-item"
          className="my-6 font-hypatia text-2xl text-customGold opacity-0 lg:text-3xl"
        >
          Pilsner?
        </h1>

        <div
          id="menu-item"
          className="my-6 flex flex-col text-center font-hypatia opacity-0 lg:text-xl"
        >
          <p>Beer name, Brewery name</p>
          <p>Description, 5.0% ABV</p>
          <p>$10.00, 16oz</p>
        </div>
        <div
          id="menu-item"
          className="my-6 flex flex-col text-center font-hypatia text-base opacity-0 lg:text-xl"
        >
          <p>Beer name, Brewery name</p>
          <p>Description, 5.0% ABV</p>
          <p>$10.00, 16oz</p>
        </div>
        <h1
          id="menu-item"
          className="my-6 font-hypatia text-2xl text-customGold opacity-0 lg:text-3xl"
        >
          IPA?
        </h1>
        <div
          id="menu-item"
          className="my-6 flex flex-col text-center font-hypatia text-base opacity-0 lg:text-xl"
        >
          <p>Beer name, Brewery name</p>
          <p>Description, 5.0% ABV</p>
          <p>$10.00, 16oz</p>
        </div>
        <div
          id="menu-item"
          className="my-6 flex flex-col text-center font-hypatia text-base opacity-0 lg:text-xl"
        >
          <p>Beer name, Brewery name</p>
          <p>Description, 5.0% ABV</p>
          <p>$10.00, 16oz</p>
        </div>
        <h1
          id="menu-item"
          className="my-6 font-hypatia text-2xl text-customGold opacity-0 lg:text-3xl"
        >
          Stout?
        </h1>
        <div
          id="menu-item"
          className="my-6 flex flex-col text-center font-hypatia text-base opacity-0 lg:text-xl"
        >
          <p>Beer name, Brewery name</p>
          <p>Description, 5.0% ABV</p>
          <p>$10.00, 16oz</p>
        </div>
        <div
          id="menu-item"
          className="my-6 flex flex-col text-center font-hypatia text-base opacity-0 lg:text-xl"
        >
          <p>Beer name, Brewery name</p>
          <p>Description, 5.0% ABV</p>
          <p>$10.00, 16oz</p>
        </div>
        <h1
          id="menu-item"
          className="my-6 font-hypatia text-2xl text-customGold opacity-0 lg:text-3xl"
        >
          Sour?
        </h1>
        <div
          id="menu-item"
          className="my-6 flex flex-col text-center font-hypatia text-base opacity-0 lg:text-xl"
        >
          <p>Beer name, Brewery name</p>
          <p>Description, 5.0% ABV</p>
          <p>$10.00, 16oz</p>
        </div>
        <div
          id="menu-item"
          className="my-6 flex flex-col text-center font-hypatia text-base opacity-0 lg:text-xl"
        >
          <p>Beer name, Brewery name</p>
          <p>Description, 5.0% ABV</p>
          <p>$10.00, 16oz</p>
        </div>
        {/* Wine section */}
        <h1
          id="menu-item"
          className="font-bigola text-3xl text-customCream underline opacity-0 lg:text-4xl"
        >
          Wine
        </h1>
        <h1
          id="menu-item"
          className="my-6 font-hypatia text-2xl text-customGold opacity-0 lg:text-3xl"
        >
          Red?
        </h1>
        <div
          id="menu-item"
          className="my-6 flex flex-col text-center font-hypatia text-base opacity-0 lg:text-xl"
        >
          <p>Type, Name, Region</p>
          <p>$12.00 glass/$45.00 bottle</p>
        </div>
        <div
          id="menu-item"
          className="my-6 flex flex-col text-center font-hypatia text-base opacity-0 lg:text-xl"
        >
          <p>Type, Name, Region</p>
          <p>$12.00 glass/$45.00 bottle</p>
        </div>
        <h1
          id="menu-item"
          className="my-6 font-hypatia text-2xl text-customGold opacity-0 lg:text-3xl"
        >
          White?
        </h1>
        <div
          id="menu-item"
          className="my-6 flex flex-col text-center font-hypatia text-base opacity-0 lg:text-xl"
        >
          <p>Type, Name, Region</p>
          <p>$12.00 glass/$45.00 bottle</p>
        </div>
        <div
          id="menu-item"
          className="my-6 flex flex-col text-center font-hypatia text-base opacity-0 lg:text-xl"
        >
          <p>Type, Name, Region</p>
          <p>$12.00 glass/$45.00 bottle</p>
        </div>
      </div>
      {/* Column 2 of menu */}
      {/* Canner Beer section */}
      <div
        id="menu-column-right"
        className="w-45vw justify-center text-center lg:w-25vw"
      >
        <h1
          id="menu-item"
          className="font-bigola text-3xl text-customCream underline opacity-0 lg:text-4xl"
        >
          Canned Beer
        </h1>
        <h1
          id="menu-item"
          className="my-6 font-hypatia text-2xl text-customGold opacity-0 lg:text-3xl"
        >
          Pilsner?
        </h1>
        <div
          id="menu-item"
          className="my-6 flex flex-col text-center font-hypatia text-base opacity-0 lg:text-xl"
        >
          <p>Beer name, Brewery name</p>
          <p>Description, 5.0% ABV</p>
          <p>$10.00, 16oz</p>
        </div>
        <div
          id="menu-item"
          className="my-6 flex flex-col text-center font-hypatia text-base opacity-0 lg:text-xl"
        >
          <p>Beer name, Brewery name</p>
          <p>Description, 5.0% ABV</p>
          <p>$10.00, 16oz</p>
        </div>
        <h1
          id="menu-item"
          className="my-6 font-hypatia text-2xl text-customGold opacity-0 lg:text-3xl"
        >
          IPA?
        </h1>
        <div
          id="menu-item"
          className="my-6 flex flex-col text-center font-hypatia text-base opacity-0 lg:text-xl"
        >
          <p>Beer name, Brewery name</p>
          <p>Description, 5.0% ABV</p>
          <p>$10.00, 16oz</p>
        </div>
        <div
          id="menu-item"
          className="my-6 flex flex-col text-center font-hypatia text-base opacity-0 lg:text-xl"
        >
          <p>Beer name, Brewery name</p>
          <p>Description, 5.0% ABV</p>
          <p>$10.00, 16oz</p>
        </div>
        <h1
          id="menu-item"
          className="my-6 font-hypatia text-2xl text-customGold opacity-0 lg:text-3xl"
        >
          Stout?
        </h1>
        <div
          id="menu-item"
          className="my-6 flex flex-col text-center font-hypatia text-base opacity-0 lg:text-xl"
        >
          <p>Beer name, Brewery name</p>
          <p>Description, 5.0% ABV</p>
          <p>$10.00, 16oz</p>
        </div>
        <div
          id="menu-item"
          className="my-6 flex flex-col text-center font-hypatia text-base opacity-0 lg:text-xl"
        >
          <p>Beer name, Brewery name</p>
          <p>Description, 5.0% ABV</p>
          <p>$10.00, 16oz</p>
        </div>
        <h1
          id="menu-item"
          className="my-6 font-hypatia text-2xl text-customGold opacity-0 lg:text-3xl"
        >
          Sour?
        </h1>
        <div
          id="menu-item"
          className="my-6 flex flex-col text-center font-hypatia text-base opacity-0 lg:text-xl"
        >
          <p>Beer name, Brewery name</p>
          <p>Description, 5.0% ABV</p>
          <p>$10.00, 16oz</p>
        </div>
        <div
          id="menu-item"
          className="my-6 flex flex-col text-center font-hypatia text-base opacity-0 lg:text-xl"
        >
          <p>Beer name, Brewery name</p>
          <p>Description, 5.0% ABV</p>
          <p>$10.00, 16oz</p>
        </div>
        {/* Sake section */}
        <h1
          id="menu-item"
          className="font-bigola text-3xl text-customCream underline opacity-0 lg:text-4xl"
        >
          Sake
        </h1>
        <h1
          id="menu-item"
          className="my-6 font-hypatia text-2xl text-customGold opacity-0 lg:text-3xl"
        >
          Hot Sake?
        </h1>
        <div
          id="menu-item"
          className="my-6 flex flex-col text-center font-hypatia text-base opacity-0 lg:text-xl"
        >
          <p>Type, Name, Region</p>
          <p>$12.00 glass/$45.00 bottle</p>
        </div>
        <div
          id="menu-item"
          className="my-6 flex flex-col text-center font-hypatia text-base opacity-0 lg:text-xl"
        >
          <p>Type, Name, Region</p>
          <p>$12.00 glass/$45.00 bottle</p>
        </div>
        <h1
          id="menu-item"
          className="my-6 font-hypatia text-2xl text-customGold opacity-0 lg:text-3xl"
        >
          Cold Sake?
        </h1>
        <div
          id="menu-item"
          className="my-6 flex flex-col text-center font-hypatia text-base opacity-0 lg:text-xl"
        >
          <p>Type, Name, Region</p>
          <p>$12.00 glass/$45.00 bottle</p>
        </div>
        <div
          id="menu-item"
          className="my-6 flex flex-col text-center font-hypatia text-base opacity-0 lg:text-xl"
        >
          <p>Type, Name, Region</p>
          <p>$12.00 glass/$45.00 bottle</p>
        </div>
      </div>
    </div>
  );
}
