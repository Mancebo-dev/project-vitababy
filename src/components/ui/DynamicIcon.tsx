"use client";

import { icons } from "lucide-react";

interface DynamicIconProps {
  name?: string | null;
  className?: string;
  fallback?: React.ReactNode;
}

export function DynamicIcon({ name, className, fallback }: DynamicIconProps) {
  if (!name) return <>{fallback}</>;

  // @ts-expect-error
  const LucideIcon = icons[name];

  if (!LucideIcon) {
    return <>{fallback}</>;
  }

  return <LucideIcon className={className} />;
}
