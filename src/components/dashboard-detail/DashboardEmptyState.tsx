"use client";

import { cn } from "@/lib/utils";

interface DashboardEmptyStateProps {
  message: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function DashboardEmptyState({
  message,
  description,
  icon,
  className,
}: DashboardEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[40vh] flex-col items-center justify-center rounded-lg border border-dashed border-stone-200 bg-stone-50/50 px-6 py-12 text-center",
        className
      )}
    >
      {icon && (
        <div className="mb-3 text-stone-400 [&>svg]:h-12 [&>svg]:w-12">
          {icon}
        </div>
      )}
      <p className="text-lg font-medium text-stone-700">{message}</p>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-stone-500">{description}</p>
      )}
    </div>
  );
}
