import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import "./embla.css";

const slides = [
  "/images/carousel/1.jpg",
  "/images/carousel/3.jpg",
  "/images/carousel/4.jpg",
  "/images/carousel/5.jpg",
  "/images/carousel/6.jpg",
];

const options = {
  align: "center",
  containScroll: false,
};

const EmblaCarousel: React.FC = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({});

  return (
    <section className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((index) => (
            <div className="embla__slide" key={index}>
              <img
                src={index}
                alt="carousel"
                className="drop-shadow-record"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EmblaCarousel;
