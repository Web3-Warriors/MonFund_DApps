import React, { useRef, useEffect, ReactNode, ElementType } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?:
    | "fadeUp"
    | "fadeDown"
    | "fadeLeft"
    | "fadeRight"
    | "scale"
    | "stagger";
  delay?: number;
  duration?: number;
  trigger?: string;
  staggerDelay?: number;
  as?: ElementType;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = "",
  animation = "fadeUp",
  delay = 0,
  duration = 0.8,
  trigger = "top 80%",
  staggerDelay = 0.2,
  as: Component = "div",
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    const getInitialState = () => {
      switch (animation) {
        case "fadeUp":
          return { y: 50, opacity: 0 };
        case "fadeDown":
          return { y: -50, opacity: 0 };
        case "fadeLeft":
          return { x: -50, opacity: 0 };
        case "fadeRight":
          return { x: 50, opacity: 0 };
        case "scale":
          return { scale: 0.8, opacity: 0 };
        case "stagger":
          return { y: 30, opacity: 0 };
        default:
          return { y: 50, opacity: 0 };
      }
    };

    const getFinalState = () => {
      switch (animation) {
        case "fadeUp":
        case "fadeDown":
          return { y: 0, opacity: 1 };
        case "fadeLeft":
        case "fadeRight":
          return { x: 0, opacity: 1 };
        case "scale":
          return { scale: 1, opacity: 1 };
        case "stagger":
          return { y: 0, opacity: 1 };
        default:
          return { y: 0, opacity: 1 };
      }
    };

    if (animation === "stagger") {
      gsap.fromTo(element.children, getInitialState(), {
        ...getFinalState(),
        duration,
        delay,
        stagger: staggerDelay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: trigger,
          toggleActions: "play none none reverse",
        },
      });
    } else {
      gsap.fromTo(element, getInitialState(), {
        ...getFinalState(),
        duration,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: trigger,
          toggleActions: "play none none reverse",
        },
      });
    }
  }, [animation, delay, duration, trigger, staggerDelay]);

  return (
    <Component ref={sectionRef} className={className}>
      {children}
    </Component>
  );
};
