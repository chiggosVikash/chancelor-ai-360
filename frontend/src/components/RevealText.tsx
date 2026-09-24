"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import clsx from "clsx";

// [SOLID: SRP] — RevealText encapsulates word-by-word staggered reveal animation
// [PATTERN: Strategy] — Configurable animation duration, stagger, and alignment strategy
gsap.registerPlugin(useGSAP);

export interface RevealTextProps {
  text: string;
  id: string;
  staggerAmount?: number;
  className?: string;
  as?: React.ElementType;
  duration?: number;
  align?: "center" | "start" | "end";
  delay?: number;
}

export const RevealText: React.FC<RevealTextProps> = ({
  text,
  id,
  staggerAmount = 0.08,
  className,
  as: Component = "div",
  duration = 0.8,
  align = "start",
  delay = 0,
}) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const words = text.split(" ").filter(Boolean);

  useGSAP(
    () => {
      gsap.to(".reveal-text-word", {
        y: 0,
        stagger: staggerAmount,
        duration: duration,
        delay: delay,
        ease: "power3.out",
      });
    },
    { scope: componentRef }
  );

  return (
    <Component
      className={clsx(
        "reveal-text text-balance",
        align === "center" && "text-center",
        align === "start" && "text-left",
        align === "end" && "text-right",
        className
      )}
      ref={componentRef}
    >
      {words.map((word, index) => {
        return (
          <span
            key={`${word}-${index}-${id}`}
            className="mb-0 inline-block overflow-hidden pb-1 align-top"
          >
            <span className="reveal-text-word mt-0 inline-block translate-y-[120%] will-change-transform">
              {word}&nbsp;
            </span>
          </span>
        );
      })}
    </Component>
  );
};
