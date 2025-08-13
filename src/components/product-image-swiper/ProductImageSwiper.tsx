"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import Image from "next/image";
import { useState } from "react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";

interface ProductImageSwiperProps {
  images: Array<{
    url: string;
    altText?: string | null;
  }>;
  productTitle: string;
}

const ProductImageSwiper = ({
  images,
  productTitle,
}: ProductImageSwiperProps) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Main Swiper */}
      <Swiper
        spaceBetween={10}
        navigation={true}
        pagination={{ clickable: true }}
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        modules={[Navigation, Pagination, Thumbs]}
        className="aspect-square w-full box-shadow-card"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full w-full">
              <Image
                src={image.url}
                alt={image.altText || `${productTitle} - Image ${index + 1}`}
                className="h-full w-full border border-customNavy/20 object-cover"
                width={600}
                height={600}
                priority={index === 0}
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnail Swiper */}
      {images.length > 1 && (
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={10}
          slidesPerView={4}
          watchSlidesProgress={true}
          modules={[Thumbs]}
          className="mt-4 h-20"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="relative h-full w-full cursor-pointer">
                <Image
                  src={image.url}
                  alt={
                    image.altText || `${productTitle} - Thumbnail ${index + 1}`
                  }
                  className="h-full w-full border border-customNavy/20 object-cover"
                  width={100}
                  height={100}
                  loading="lazy"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default ProductImageSwiper;
