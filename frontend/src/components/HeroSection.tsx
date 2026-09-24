"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronRight, ArrowDown, Award, GraduationCap, Globe2 } from "lucide-react";
import { cn } from "@/lib/cn";

interface HeroSectionProps {
  onExploreJourney: () => void;
  onTalkToAI: () => void;
}

const FLOATING_BADGES = [
  { icon: Award,          label: "NICE Co-Founder", sub: "1989",        delay: 0.2, pos: "top-[8%] right-[5%]",  dir: "float-badge"   },
  { icon: GraduationCap,  label: "Shobhit University", sub: "Chancellor", delay: 0.5, pos: "top-[42%] left-[2%]", dir: "float-badge-2" },
  { icon: Globe2,         label: "Global Educator",  sub: "35+ Years",  delay: 0.8, pos: "bottom-[12%] right-[4%]", dir: "float-badge-3" },
];

/* stagger container */
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.6 },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreJourney, onTalkToAI }) => {
  const shouldReduceMotion = useReducedMotion();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [imageSrc, setImageSrc] = useState("/photos/image1.jpeg");
  const heroRef = useRef<HTMLDivElement>(null);

  /* ── Subtle tilt on mouse move ──────────────────────────────── */
  useEffect(() => {
    if (shouldReduceMotion) return;
    const onMove = (e: MouseEvent) => {
      const rect = heroRef.current?.getBoundingClientRect();
      if (!rect) return;
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      setMousePos({
        x: (e.clientX - cx) / (rect.width  / 2),
        y: (e.clientY - cy) / (rect.height / 2),
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [shouldReduceMotion]);

  const tiltStyle = shouldReduceMotion ? {} : {
    transform: `perspective(900px) rotateY(${mousePos.x * 5}deg) rotateX(${-mousePos.y * 4}deg) translateZ(8px)`,
  };

  return (
    <section
      id="heritage"
      ref={heroRef}
      className="relative min-h-[92vh] flex items-center overflow-hidden section-bg-pattern"
    >
      {/* ── Subtle background emblem watermark ──────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.025]"
      >
        <span
          className="font-display font-black text-[30vw] text-[#1E2D5A] leading-none"
          style={{ letterSpacing: "-0.04em" }}
        >
          SU
        </span>
      </div>

      {/* ── Top golden rule ─────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-[#B8862C] to-transparent opacity-50"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── LEFT: Portrait ──────────────────────────────────── */}
          <div className="flex justify-center md:justify-end order-first md:order-last">
            <div className="relative">
              {/* Floating achievement badges */}
              {FLOATING_BADGES.map(({ icon: Icon, label, sub, delay, pos, dir }) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay, type: "spring", stiffness: 400, damping: 20 }}
                  className={cn(
                    "absolute z-20 flex items-center gap-2 px-3 py-2 rounded-xl",
                    "bg-white border border-[rgba(184,134,44,0.25)] shadow-md",
                    "text-xs font-ui",
                    dir, pos
                  )}
                  style={{ minWidth: 130 }}
                >
                  <div className="w-7 h-7 rounded-lg bg-[#FDF5E4] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-[#B8862C]" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#1A1614] leading-tight" style={{ fontSize: 11 }}>{label}</div>
                    <div className="text-[#8B7B6F]" style={{ fontSize: 10 }}>{sub}</div>
                  </div>
                </motion.div>
              ))}

              {/* Portrait with tilt + gold frame */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 30 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.3 }}
                style={{ ...tiltStyle, transition: "transform 0.25s ease-out" }}
                className="relative group"
              >
                {/* Outer glow */}
                <div className="absolute -inset-5 bg-gradient-to-tr from-[#B8862C]/12 via-[#D4A84B]/6 to-transparent rounded-[36px] blur-2xl opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

                {/* Gold frame */}
                <div className="portrait-frame shadow-[0_24px_60px_-12px_rgba(26,22,20,0.18)] relative">
                  <div className="relative w-64 h-80 sm:w-72 sm:h-92 md:w-80 md:h-[420px] rounded-[22px] overflow-hidden bg-[#F5F1EC]">
                    <Image
                      src={imageSrc}
                      alt="Kunwar Shekhar Vijendra — Co-Founder & Chancellor, Shobhit University"
                      fill
                      priority
                      sizes="(max-width: 640px) 256px, (max-width: 768px) 288px, 320px"
                      className="object-cover object-top group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                      onError={() => setImageSrc("/photos/image2.jpeg")}
                    />

                    {/* Soft vignette bottom overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1614]/30 via-transparent to-transparent opacity-60" />

                    {/* Name ribbon at bottom */}
                    <div className="absolute bottom-0 inset-x-0 px-4 py-3 bg-gradient-to-t from-[#1A1614]/70 to-transparent text-center">
                      <span className="text-[10px] font-mono tracking-[0.18em] text-[#E8C96A] uppercase">
                        Living Legacy · Portrait
                      </span>
                    </div>
                  </div>
                </div>

                {/* Birthday badge pinned bottom-left of portrait */}
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 1.4, type: "spring", stiffness: 400, damping: 18 }}
                  className="absolute -bottom-4 -left-6 bg-gradient-to-br from-[#1E2D5A] to-[#2E4080] text-white px-4 py-2.5 rounded-2xl shadow-lg text-xs font-ui font-semibold flex items-center gap-2"
                >
                  🎂 <span>Happy Birthday, Sir!</span>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* ── RIGHT: Text Content ──────────────────────────────── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col items-start gap-5 text-left order-last md:order-first"
          >
            {/* Pre-title chip */}
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold font-ui bg-[#FDF5E4] text-[#B8862C] border border-[rgba(184,134,44,0.30)] tracking-wide">
                ✦ &nbsp;Shobhit University Presents
              </span>
            </motion.div>

            {/* Main name */}
            <motion.div variants={itemVariants} className="space-y-1">
              <h1 className="font-display font-semibold text-4xl sm:text-5xl lg:text-6xl text-[#1A1614] leading-tight tracking-tight">
                Kunwar<br />
                <span className="gold-gradient-text">Shekhar</span><br />
                Vijendra
              </h1>
            </motion.div>

            {/* Title badge */}
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1E2D5A]/8 border border-[#1E2D5A]/15 text-[#1E2D5A] text-xs font-semibold uppercase tracking-[0.18em] font-ui">
                Co-Founder &amp; Chancellor · Shobhit University
              </div>
            </motion.div>

            {/* Tagline */}
            <motion.div variants={itemVariants}>
              <p className="text-base sm:text-lg text-[#4A3F35] font-display leading-relaxed max-w-md">
                "One person → many moments → one legacy."
              </p>
              <p className="mt-2 text-sm text-[#8B7B6F] font-ui leading-relaxed max-w-sm">
                A digital journey celebrating 35+ years of visionary leadership, transformative education, and rural empowerment across India.
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3 pt-2">
              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                onClick={onExploreJourney}
                id="hero-explore-journey-btn"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1E2D5A] hover:bg-[#2E4080] text-white font-semibold text-sm font-ui transition-colors shadow-md"
              >
                Explore His Journey
                <ChevronRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                onClick={onTalkToAI}
                id="hero-talk-ai-btn"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-transparent border-2 border-[#B8862C] text-[#B8862C] hover:bg-[#FDF5E4] font-semibold text-sm font-ui transition-all"
              >
                ✦ Talk to Chancellor AI
              </motion.button>
            </motion.div>

            {/* Scroll hint */}
            <motion.a
              variants={itemVariants}
              href="#journey"
              className="flex items-center gap-1.5 text-xs font-mono text-[#8B7B6F] hover:text-[#B8862C] transition-colors mt-2"
            >
              <span>Scroll to explore</span>
              <ArrowDown className="w-3 h-3 animate-bounce" />
            </motion.a>
          </motion.div>

        </div>
      </div>

      {/* ── Bottom section divider ───────────────────────────────── */}
      <div className="absolute bottom-0 inset-x-0 section-divider" />
    </section>
  );
};
