import gsap from "gsap";
import { SplitText } from "gsap/dist/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

gsap.config({
  // tbd
});

// maybe recreate gsap functions here to import them in components
// rather than recompose them in each component

export { gsap, SplitText, ScrollTrigger };
