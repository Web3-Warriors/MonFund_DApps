import React, { useRef, useEffect, ReactNode } from "react";
import { gsap } from "gsap";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  hoverScale?: number;
  hoverY?: number;
  entranceDelay?: number;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = "",
  hoverScale = 1.02,
  hoverY = -8,
  entranceDelay = 0,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Entrance animation
    gsap.fromTo(
      card,
      { y: 50, opacity: 0, scale: 0.9 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        delay: entranceDelay,
        ease: "back.out(1.7)",
      }
    );

    // Hover animations
    const handleMouseEnter = () => {
      gsap.to(card, {
        y: hoverY,
        scale: hoverScale,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hoverScale, hoverY, entranceDelay]);

  return (
    <div ref={cardRef} className={className}>
      {children}
    </div>
  );
};
