"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Warning } from "@phosphor-icons/react";

interface DashboardErrorStateProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export default function DashboardErrorState({
  message,
  onRetry,
  className,
}: DashboardErrorStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[40vh] flex-col items-center justify-center rounded-lg border border-stone-200 bg-red-50/30 px-6 py-12 text-center",
        className
      )}
    >
      <Warning
        size={40}
        weight="duotone"
        className="mb-3 text-red-400"
      />
      <p className="text-lg font-medium text-stone-800">{message}</p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="mt-4"
        >
          Try again
        </Button>
      )}
    </div>
  );
}
