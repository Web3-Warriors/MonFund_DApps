import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, Target, Users, Clock } from "lucide-react";
import { Program, ProgramStatus } from "@/config/contract";
import { formatEther } from "viem";
import { Link } from "react-router-dom";
import { AnimatedCard } from "@/components/animations";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface ProgramCardProps {
  program: Program;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({ program }) => {
  const progress =
    (Number(program.totalAmount) / Number(program.targetFund)) * 100;
  const daysLeft = Math.max(
    0,
    Math.ceil(
      (Number(program.endDate) * 1000 - Date.now()) / (1000 * 60 * 60 * 24)
    )
  );

  return (
    <AnimatedCard className="h-full">
      <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-card transition-all duration-300">
        <CardHeader className="p-0">
          <div className="relative overflow-hidden rounded-t-lg">
            <img
              src={program.image || "/placeholder.svg"}
              alt={program.title}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute top-3 right-3">
              <StatusBadge status={program.status} />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Title */}
            <h3 className="font-space-grotesk font-semibold text-lg leading-tight line-clamp-2">
              {program.title}
            </h3>

            {/* Description */}
            <p className="text-muted-foreground text-sm line-clamp-3">
              {program.desc}
            </p>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Terkumpul</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={Math.min(progress, 100)} className="h-2" />
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-foreground">
                  {parseFloat(formatEther(program.totalAmount)).toFixed(4)} ETH
                </span>
                <span className="text-muted-foreground">
                  dari {parseFloat(formatEther(program.targetFund)).toFixed(4)}{" "}
                  ETH
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{daysLeft} hari tersisa</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Target className="w-4 h-4" />
                <span>
                  Target:{" "}
                  {parseFloat(formatEther(program.targetFund)).toFixed(2)} ETH
                </span>
              </div>
            </div>

            {/* Action Button */}
            <Button asChild className="w-full mt-4" variant="hero">
              <Link to={`/program/${program.id}`}>Lihat Detail</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </AnimatedCard>
  );
};
