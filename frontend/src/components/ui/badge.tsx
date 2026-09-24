"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#B8862C] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#1E2D5A] text-white shadow-xs",
        secondary:
          "border-[rgba(184,134,44,0.25)] bg-[#FDF5E4] text-[#4A3F35]",
        gold:
          "border-[#B8862C]/40 bg-gradient-to-r from-[#B8862C]/15 to-[#D4A84B]/20 text-[#B8862C]",
        outline: "text-[#1A1614] border-[rgba(26,22,20,0.14)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
