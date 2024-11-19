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
    <section className="embla pb-9 md:pb-3">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((src, index) => (
            <div className="embla__slide" key={index}>
              <div className="embla__slide__inner h-[250px] w-auto md:h-[500px]">
                <Image
                  src={src}
                  alt="carousel"
                  className="h-[250px] md:h-[500px]"
                  style={{
                    height: "100%",
                    width: "auto",
                  }}
                  height={250}
                  width={250}
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
