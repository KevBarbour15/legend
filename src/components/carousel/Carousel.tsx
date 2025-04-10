import React from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import "./embla.css";
import { usePrevNextButtons, PrevButton, NextButton } from "./Arrows";

const slides = [
  "/images/carousel/3.jpg",
  "/images/carousel/4.jpg",
  "/images/carousel/5.jpg",
  "/images/carousel/1.jpg",
  "/images/carousel/6.jpg",
  "/images/carousel/7.jpg",
  "/images/carousel/8.jpg",
  "/images/carousel/9.jpg",
];

const Carousel: React.FC = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <section className="embla pb-3">
      <div
        className="embla__viewport overflow-hidden rounded-md border-x-2 border-customNavy"
        ref={emblaRef}
      >
        <div className="embla__container">
          {slides.map((src, index) => (
            <div className="embla__slide" key={index}>
              <div
                className={`embla__slide__inner h-[250px] w-auto overflow-hidden rounded-md border-y-2 border-customNavy md:h-[500px] ${index === 0 ? "border-r-2" : ""} ${index === slides.length - 1 ? "border-l-2" : ""} ${index !== 0 && index !== slides.length - 1 ? "border-x-2" : ""}`}
              >
                <img
                  src={src}
                  alt="carousel"
                  className="h-[250px] md:h-[500px]"
                  style={{
                    height: "100%",
                    width: "auto",
                  }}
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-row justify-between">
        <PrevButton
          onClick={onPrevButtonClick}
          disabled={prevBtnDisabled}
        ></PrevButton>
        <NextButton
          onClick={onNextButtonClick}
          disabled={nextBtnDisabled}
        ></NextButton>
      </div>
    </section>
  );
};

export default Carousel;
