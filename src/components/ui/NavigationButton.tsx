import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface NavigationButtonProps {
  to: string;
  isActive: boolean;
  icon?: LucideIcon;
  children: React.ReactNode;
  size?: "sm" | "default" | "lg";
}

export const NavigationButton: React.FC<NavigationButtonProps> = ({
  to,
  isActive,
  icon: Icon,
  children,
  size = "sm",
}) => {
  return (
    <Button variant={isActive ? "default" : "ghost"} size={size} asChild>
      <Link to={to}>
        {Icon && <Icon className="w-4 h-4 mr-1" />}
        {children}
      </Link>
    </Button>
  );
};
