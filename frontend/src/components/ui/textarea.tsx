"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[100px] w-full rounded-xl border border-[rgba(26,22,20,0.14)] bg-white px-4 py-3 text-sm text-[#1A1614] shadow-xs transition-all placeholder:text-[#8B7B6F]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8862C] focus-visible:border-[#B8862C] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
