import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/dist/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

gsap.config({
  // tbd
});

// maybe recreate gsap functions here to import them in components
// rather than recompose them in each component

export { gsap, SplitText, ScrollTrigger, useGSAP };
