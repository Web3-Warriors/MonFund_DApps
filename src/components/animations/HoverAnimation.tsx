import React, { useRef, useEffect, ReactNode } from "react";
import { gsap } from "gsap";

interface HoverAnimationProps {
  children: ReactNode;
  className?: string;
  scale?: number;
  y?: number;
  duration?: number;
  ease?: string;
}

export const HoverAnimation: React.FC<HoverAnimationProps> = ({
  children,
  className = "",
  scale = 1.1,
  y = 0,
  duration = 0.3,
  ease = "power2.out",
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMouseEnter = () => {
      gsap.to(element, {
        scale,
        y,
        duration,
        ease,
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        scale: 1,
        y: 0,
        duration,
        ease,
      });
    };

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [scale, y, duration, ease]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
};
