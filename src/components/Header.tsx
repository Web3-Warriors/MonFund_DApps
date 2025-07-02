import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Coins, Heart, Plus } from "lucide-react";
import { useIsOwner } from "@/hooks/useIsOwner";

export const Header: React.FC = () => {
  const location = useLocation();
  const { isOwner } = useIsOwner();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 bg-gradient-primary rounded-lg">
            <Coins className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-space-grotesk font-bold text-xl bg-gradient-primary bg-clip-text text-transparent">
            <img src="/logo-long.png" alt="MonFund" className="h-8" />
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Button
            variant={isActive("/") ? "default" : "ghost"}
            size="sm"
            asChild
          >
            <Link to="/">Beranda</Link>
          </Button>
          <Button
            variant={isActive("/programs") ? "default" : "ghost"}
            size="sm"
            asChild
          >
            <Link to="/programs">Program</Link>
          </Button>
          {isOwner && (
            <Button
              variant={isActive("/create") ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/create">
                <Plus className="w-4 h-4 mr-1" />
                Buat Program
              </Link>
            </Button>
          )}
          <Button
            variant={isActive("/my-contributions") ? "default" : "ghost"}
            size="sm"
            asChild
          >
            <Link to="/my-contributions">
              <Heart className="w-4 h-4 mr-1" />
              Kontribusi Saya
            </Link>
          </Button>
        </nav>

        {/* Connect Wallet */}
        <div className="flex items-center space-x-3">
          <ConnectButton />
        </div>
      </div>
    </header>
  );
};
