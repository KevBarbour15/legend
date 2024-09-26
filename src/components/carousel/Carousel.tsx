import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import "./embla.css";
import { usePrevNextButtons, PrevButton, NextButton } from "./Arrows";

const slides = [
  "/images/carousel/1.jpg",
  "/images/carousel/3.jpg",
  "/images/carousel/4.jpg",
  "/images/carousel/5.jpg",
  "/images/carousel/6.jpg",
  "/images/carousel/7.jpg",
  "/images/carousel/8.jpg",
  "/images/carousel/9.jpg",
];

const Carousel: React.FC = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({});
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
              <div className="embla__slide__inner h-[275px] md:h-[500px]">
                <img
                  src={src}
                  loading="lazy"
                  alt="carousel"
                  className="h-[275px] md:h-[500px]"
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
