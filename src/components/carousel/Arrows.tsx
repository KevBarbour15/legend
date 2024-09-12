import React, { useCallback, useEffect, useState } from "react";
import { EmblaCarouselType } from "embla-carousel";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// Hook to manage prev/next button states
type UsePrevNextButtonsType = {
  prevBtnDisabled: boolean;
  nextBtnDisabled: boolean;
  onPrevButtonClick: () => void;
  onNextButtonClick: () => void;
};

export const usePrevNextButtons = (
  emblaApi: EmblaCarouselType | undefined,
): UsePrevNextButtonsType => {
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect).on("select", onSelect);
  }, [emblaApi, onSelect]);

  return {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  };
};

// Prop type based on IconButton props from Material-UI
type IconButtonProps = React.ComponentProps<typeof IconButton>;

export const PrevButton: React.FC<IconButtonProps> = (props) => {
  const { children, ...restProps } = props;

  return (
    <IconButton {...restProps} className="text-customNavy">
      <ChevronLeftIcon />
      {children}
    </IconButton>
  );
};

export const NextButton: React.FC<IconButtonProps> = (props) => {
  const { children, ...restProps } = props;

  return (
    <IconButton {...restProps} className="text-customNavy">
      <ChevronRightIcon />
      {children}
    </IconButton>
  );
};
