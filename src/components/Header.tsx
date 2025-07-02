import React, { useEffect, useRef } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Coins, Heart, Home, ListTodo, Plus } from "lucide-react";
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
      { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" }
    )
      .fromTo(
        logoRef.current,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.3, ease: "back.out(1.7)" },
        "-=0.4"
      )
      .fromTo(
        navRef.current?.children || [],
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.2, stagger: 0.1, ease: "power2.out" },
        "-=0.4"
      )
      .fromTo(
        connectRef.current,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.3, ease: "back.out(1.7)" },
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
          <Link ref={logoRef} to="/">
            <span className="font-space-grotesk font-bold text-xl bg-gradient-primary bg-clip-text text-transparent">
              <img src="/logo-long.png" alt="MonFund" className="h-8" />
            </span>
          </Link>
        </HoverAnimation>

        {/* Navigation */}
        <nav ref={navRef} className="hidden md:flex items-center space-x-1">
          <NavigationButton to="/" isActive={isActive("/")} icon={Home}>
            Beranda
          </NavigationButton>
          <NavigationButton
            to="/programs"
            isActive={isActive("/programs")}
            icon={ListTodo}
          >
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
