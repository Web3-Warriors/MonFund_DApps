import React, { useEffect, useRef } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Coins, Heart, Plus } from "lucide-react";
import { useIsOwner } from "@/hooks/useIsOwner";
import { NavigationButton } from "@/components/ui/NavigationButton";
import { HoverAnimation } from "@/components/animations";
import { gsap } from "gsap";

export const Header: React.FC = () => {
  const location = useLocation();
  const { isOwner } = useIsOwner();
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const connectRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const tl = gsap.timeline();

    // Animate header entrance
    tl.fromTo(
      headerRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    )
      .fromTo(
        logoRef.current,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
        "-=0.4"
      )
      .fromTo(
        navRef.current?.children || [],
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: "power2.out" },
        "-=0.4"
      )
      .fromTo(
        connectRef.current,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
        "-=0.6"
      );
  }, []);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <HoverAnimation scale={1.1}>
          <Link ref={logoRef} to="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-primary rounded-lg">
              <Coins className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-space-grotesk font-bold text-xl bg-gradient-primary bg-clip-text text-transparent">
              <img src="/logo-long.png" alt="MonFund" className="h-8" />
            </span>
          </Link>
        </HoverAnimation>

        {/* Navigation */}
        <nav ref={navRef} className="hidden md:flex items-center space-x-1">
          <NavigationButton to="/" isActive={isActive("/")}>
            Beranda
          </NavigationButton>
          <NavigationButton to="/programs" isActive={isActive("/programs")}>
            Program
          </NavigationButton>
          {isOwner && (
            <NavigationButton
              to="/create"
              isActive={isActive("/create")}
              icon={Plus}
            >
              Buat Program
            </NavigationButton>
          )}
          <NavigationButton
            to="/my-contributions"
            isActive={isActive("/my-contributions")}
            icon={Heart}
          >
            Kontribusi Saya
          </NavigationButton>
        </nav>

        {/* Connect Wallet */}
        <div ref={connectRef} className="flex items-center space-x-3">
          <ConnectButton />
        </div>
      </div>
    </header>
  );
};
