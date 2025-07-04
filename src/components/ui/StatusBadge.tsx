import React from "react";
import { Badge } from "@/components/ui/badge";
import { ProgramStatus } from "@/config/contract";

interface StatusBadgeProps {
  status: ProgramStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (status: ProgramStatus) => {
    switch (status) {
      case ProgramStatus.Active:
        return {
          label: "Aktif",
          className: "text-success border-white/30 shadow-sm shadow-black",
          variant: "secondary" as const,
        };
      case ProgramStatus.Completed:
        return {
          label: "Selesai",
          className: "text-info border-white/30 shadow-sm shadow-black",
          variant: "secondary" as const,
        };
      case ProgramStatus.Canceled:
        return {
          label: "Dibatalkan",
          className: "text-danger border-white/30 shadow-sm shadow-black",
          variant: "destructive" as const,
        };
      default:
        return {
          label: "Unknown",
          className: "bg-whute text-muted-foreground border-white/30",
          variant: "outline" as const,
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
};
