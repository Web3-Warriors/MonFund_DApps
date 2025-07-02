import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { AnimatedCard } from "@/components/animations";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  delay = 0,
}) => {
  return (
    <AnimatedCard className="group" entranceDelay={delay}>
      <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
        <CardContent className="flex flex-col items-center text-center p-6 space-y-4">
          <div className="p-3 bg-gradient-primary rounded-full">
            <Icon className="w-6 h-6 text-primary-foreground" />
          </div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </CardContent>
      </Card>
    </AnimatedCard>
  );
};
