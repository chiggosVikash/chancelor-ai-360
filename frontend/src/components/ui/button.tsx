"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// [PATTERN: Strategy] — Button variants encapsulate distinct visual intents (default, gold, outline, ghost)
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8862C] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer active:scale-[0.99]",
  {
    variants: {
      variant: {
        default:
          "bg-[#1E2D5A] text-white shadow-md hover:bg-[#2E4080] hover:shadow-lg",
        gold:
          "bg-gradient-to-r from-[#B8862C] to-[#D4A84B] text-white shadow-md hover:brightness-105 hover:shadow-gold",
        destructive:
          "bg-red-600 text-white shadow-sm hover:bg-red-700",
        outline:
          "border border-[rgba(26,22,20,0.14)] bg-white text-[#1A1614] hover:bg-stone-50 hover:border-[#B8862C]/40",
        secondary:
          "bg-[#FDF5E4] text-[#4A3F35] border border-[rgba(184,134,44,0.25)] hover:bg-[#F5E8C4]",
        ghost: "hover:bg-stone-100 text-[#1A1614]",
        link: "text-[#1E2D5A] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
