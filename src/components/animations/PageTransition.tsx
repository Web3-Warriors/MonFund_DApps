import React, { useRef, useEffect, ReactNode } from "react";
import { gsap } from "gsap";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className = "",
}) => {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    // Page entrance animation
    gsap.fromTo(
      page,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      }
    );
  }, []);

  return (
    <div ref={pageRef} className={className}>
      {children}
    </div>
  );
};
