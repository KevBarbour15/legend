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
];

const EmblaCarousel: React.FC = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({});
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <section className="embla pb-6">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((src, index) => (
            <div className="embla__slide" key={index}>
              <img src={src} alt="carousel" className="" />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-row justify-between text-3xl text-customNavy">
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

export default EmblaCarousel;
