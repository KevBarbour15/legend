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
    <section className="embla px-3 pb-3 md:px-0">
      <div className="embla__viewport border-x-2" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((src, index) => (
            <div className="embla__slide drop-shadow-card" key={index}>
              <div className="embla__slide__inner h-[250px] w-auto border border-customNavy md:h-[300px] lg:h-[500px]">
                <Image
                  src={src}
                  alt="carousel"
                  className="h-[250px] w-auto md:h-[500px]"
                  style={{
                    height: "100%",
                    width: "auto",
                  }}
                  width={1000}
                  height={1000}
                  loading="eager"
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
