import { useEffect } from "react";
import { gsap } from "gsap";

const useGsapReveal = (selector, deps = []) => {
  useEffect(() => {
    gsap.fromTo(
      selector,
      { autoAlpha: 0, y: 30 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: selector,
          start: "top 85%"
        }
      }
    );
  }, deps);
};

export default useGsapReveal;
