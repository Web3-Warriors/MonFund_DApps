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
          className: "bg-success/20 text-success border-success/30",
          variant: "secondary" as const,
        };
      case ProgramStatus.Completed:
        return {
          label: "Selesai",
          className: "bg-info/20 text-info border-info/30",
          variant: "secondary" as const,
        };
      case ProgramStatus.Canceled:
        return {
          label: "Dibatalkan",
          className: "",
          variant: "destructive" as const,
        };
      default:
        return {
          label: "Unknown",
          className: "",
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
