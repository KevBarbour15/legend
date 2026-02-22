"use client";

import { cn } from "@/lib/utils";

export function DetailCard({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-stone-200 bg-white p-4 shadow-sm md:p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function DetailSection({
  title,
  className,
  children,
  ...props
}: {
  title?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn(
        "border-t border-stone-200 pt-4 first:border-t-0 first:pt-0",
        className
      )}
      {...props}
    >
      {title && (
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
          {title}
        </h3>
      )}
      {children}
    </section>
  );
}

export function DetailField({
  label,
  value,
  href,
  className,
}: {
  label: string;
  value: React.ReactNode;
  href?: string;
  className?: string;
}) {
  const content = href ? (
    <a
      href={href}
      className="text-stone-900 underline-offset-2 hover:underline"
    >
      {value}
    </a>
  ) : (
    <span className="text-stone-900">{value}</span>
  );

  return (
    <div
      className={cn(
        "flex flex-col gap-0.5 py-2 sm:flex-row sm:items-baseline sm:gap-3 sm:py-1.5",
        className
      )}
    >
      <span className="min-w-[100px] text-sm text-stone-500">{label}</span>
      <span className="text-sm sm:text-base">{content}</span>
    </div>
  );
}

export function DetailActions({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-stone-200 pt-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function DetailBody({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("whitespace-pre-wrap text-sm leading-relaxed text-stone-700", className)}
      {...props}
    >
      {children}
    </p>
  );
}
