// src/lib/gsap/index.tsx

import gsap from "gsap";
import { SplitText } from "gsap/dist/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

gsap.config({
  // tbd
});

export { gsap, SplitText, ScrollTrigger};
