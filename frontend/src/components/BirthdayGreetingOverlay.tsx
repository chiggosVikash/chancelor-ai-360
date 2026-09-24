"use client";

import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { X, ArrowRight, Volume2, VolumeX, Flame } from "lucide-react";
import { RevealText } from "./RevealText";
import { playFirecrackerSequence, playCrackerBlast, unlockAudioContext } from "../lib/celebrationSound";
import Image from "next/image";

// [SOLID: SRP] — BirthdayGreetingOverlay delivers a modern, high-emphasis birthday ceremony with edge-to-edge portrait framing and auto-unmount timer
// [PATTERN: Strategy] — Split-screen editorial layout with full-bleed left portrait and typographic emphasis

export interface BirthdayGreetingOverlayProps {
  onDismiss?: () => void;
  autoCloseSeconds?: number;
}

// Vibrant multi-color festival celebration palette
const VIBRANT_RAINBOW_CONFETTI = [
  "#FF0055", // Vivid Crimson Pink
  "#FF9900", // Bright Mandarin
  "#FFD700", // Imperial Gold
  "#00E676", // Radiant Green
  "#00B0FF", // Royal Cyan
  "#7C4DFF", // Electric Purple
  "#FF4081", // Neon Rose
  "#00E5FF", // Aquamarine
  "#FFFFFF", // Pure White
];

export const BirthdayGreetingOverlay: React.FC<BirthdayGreetingOverlayProps> = ({
  onDismiss,
  autoCloseSeconds = 30,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRendered, setIsRendered] = useState(true);
  const [isAudioActive, setIsAudioActive] = useState(true);
  const [secondsRemaining, setSecondsRemaining] = useState(autoCloseSeconds);
  const overlayRef = useRef<HTMLDivElement>(null);

  // High-energy colorful firecracker confetti launch from bottom of viewport
  const triggerFirecrackers = () => {
    if (isAudioActive) {
      playFirecrackerSequence();
    }

    // 1. Left rocket
    confetti({
      particleCount: 80,
      angle: 72,
      spread: 65,
      origin: { x: 0.12, y: 1 },
      startVelocity: 94,
      colors: VIBRANT_RAINBOW_CONFETTI,
      gravity: 1.15,
      scalar: 1.25,
      ticks: 320,
    });

    // 2. Right rocket
    confetti({
      particleCount: 80,
      angle: 108,
      spread: 65,
      origin: { x: 0.88, y: 1 },
      startVelocity: 94,
      colors: VIBRANT_RAINBOW_CONFETTI,
      gravity: 1.15,
      scalar: 1.25,
      ticks: 320,
    });

    // 3. Center grand apex burst
    setTimeout(() => {
      confetti({
        particleCount: 130,
        angle: 90,
        spread: 95,
        origin: { x: 0.5, y: 1 },
        startVelocity: 100,
        colors: VIBRANT_RAINBOW_CONFETTI,
        gravity: 1.05,
        scalar: 1.35,
        ticks: 360,
      });
    }, 280);

    // 4. Staggered secondary fireworks
    setTimeout(() => {
      confetti({
        particleCount: 65,
        angle: 80,
        spread: 75,
        origin: { x: 0.32, y: 1 },
        startVelocity: 85,
        colors: VIBRANT_RAINBOW_CONFETTI,
        ticks: 260,
      });
      confetti({
        particleCount: 65,
        angle: 100,
        spread: 75,
        origin: { x: 0.68, y: 1 },
        startVelocity: 85,
        colors: VIBRANT_RAINBOW_CONFETTI,
        ticks: 260,
      });
    }, 560);
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      setIsRendered(false);
      onDismiss?.();
    }, 400);
  };

  // Launch on mount + 30-second auto-unmount countdown timer
  useEffect(() => {
    const handleFirstInteraction = () => {
      unlockAudioContext();
    };

    window.addEventListener("pointerdown", handleFirstInteraction, { once: true });
    window.addEventListener("keydown", handleFirstInteraction, { once: true });

    const mountTimer = setTimeout(() => {
      setIsVisible(true);
      triggerFirecrackers();
    }, 400);

    // [PATTERN: Observer] — 30-second auto-dismiss countdown
    const countdownInterval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          handleClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(mountTimer);
      clearInterval(countdownInterval);
      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };
  }, []);

  const handleReplayCrackers = () => {
    unlockAudioContext().then(() => {
      triggerFirecrackers();
      playCrackerBlast(1.0);
    });
  };

  if (!isRendered) return null;

  const progressPercent = (secondsRemaining / autoCloseSeconds) * 100;

  return (
    <div
      ref={overlayRef}
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 transition-all duration-500 ${
        isVisible
          ? "opacity-100 bg-[#0F0D0B]/80 backdrop-blur-xl pointer-events-auto"
          : "opacity-0 bg-transparent pointer-events-none"
      }`}
      role="dialog"
      aria-modal="true"
    >
      {/* Modern Compact Celebration Modal — Sleek height, no excessive vertical sprawl */}
      <div
        className={`relative w-full max-w-3xl bg-white border border-[rgba(184,134,44,0.35)] rounded-[24px] shadow-[0_25px_80px_-15px_rgba(0,0,0,0.55)] overflow-hidden transition-all duration-500 transform ${
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-8"
        }`}
      >
        {/* 30-Second Auto-Dismiss Progress Bar along bottom */}
        <div className="absolute bottom-0 inset-x-0 h-1 bg-[rgba(26,22,20,0.06)] z-30">
          <div
            className="h-full bg-gradient-to-r from-[#B8862C] to-[#D4AF37] transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Top Floating Controls: 30s Countdown, Audio & Dismiss */}
        <div className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 flex items-center gap-2 z-30">
          {/* 30s Countdown Pill */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/90 border border-[rgba(26,22,20,0.08)] shadow-xs text-[11px] font-mono font-medium text-[#4A3F35]"
            title={`Auto-closing in ${secondsRemaining}s`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8862C] animate-pulse" />
            <span>{secondsRemaining}s</span>
          </div>

          {/* Audio Mute/Unmute */}
          <button
            onClick={() => setIsAudioActive(!isAudioActive)}
            title={isAudioActive ? "Mute firecracker sounds" : "Enable firecracker sounds"}
            className="p-1.5 sm:p-2 rounded-full bg-white/90 border border-[rgba(26,22,20,0.08)] text-[#4A3F35] hover:text-[#1A1614] hover:bg-white transition-all shadow-xs cursor-pointer"
          >
            {isAudioActive ? (
              <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-[#8B7B6F]" />
            )}
          </button>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="p-1.5 sm:p-2 rounded-full bg-white/90 border border-[rgba(26,22,20,0.08)] text-[#8B7B6F] hover:text-[#1A1614] hover:bg-white transition-all shadow-xs cursor-pointer"
            aria-label="Dismiss greeting"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Split Grid: Compact height balanced between image and content */}
        <div className="grid md:grid-cols-12 min-h-[380px] md:min-h-[440px]">
          
          {/* ── LEFT SECTION: 100% Full-Bleed Portrait of Chancellor Sir (5 cols) ── */}
          <div className="md:col-span-5 relative w-full h-56 md:h-full min-h-[220px] md:min-h-[440px] bg-[#12151F] overflow-hidden">
            <Image
              src="/photos/chancellor_portrait_solo.jpeg"
              alt="Hon'ble Chancellor Kunwar Shekhar Vijendra"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 360px"
              className="object-cover object-top filter contrast-[1.03] brightness-[1.0] transition-transform duration-700 ease-out hover:scale-105"
            />

            {/* Cinematic Gradient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C0F17] via-[#0C0F17]/30 to-transparent opacity-90" />

            {/* Portrait Bottom Dignitary Name Card */}
            <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 text-left z-10">
              <span className="inline-block px-2 py-0.5 rounded-full bg-[#B8862C] text-white text-[9px] font-mono uppercase tracking-[0.2em] font-bold mb-1.5">
                Visionary Leader
              </span>
              <h3 className="font-display font-black text-lg sm:text-xl text-white tracking-wide uppercase leading-tight">
                Kunwar Shekhar Vijendra
              </h3>
              <p className="text-[11px] font-ui text-[#D4AF37] font-medium tracking-wide mt-0.5">
                Co-Founder &amp; Hon'ble Chancellor
              </p>
              <p className="text-[10px] text-white/70 font-ui">
                Shobhit University · 35+ Years of Service
              </p>
            </div>
          </div>

          {/* ── RIGHT SECTION: High-Emphasis, Attractive Modern Birthday Typography (7 cols) ── */}
          <div className="md:col-span-7 flex flex-col justify-between p-5 sm:p-6 md:p-7 space-y-3.5 sm:space-y-4">
            
            {/* Top Category Tag */}
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF5E4] border border-[rgba(184,134,44,0.35)] text-[#B8862C] text-[11px] font-semibold font-ui uppercase tracking-[0.16em]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8862C] animate-pulse" />
                <span>Happy Birthday Wishes</span>
              </div>
            </div>

            {/* High-Emphasis Professional Birthday Headline */}
            <div className="space-y-1 text-left">
              <span className="font-script text-lg sm:text-xl lg:text-2xl text-[#8B7B6F] leading-snug block">
                Wishing a Very Happy Birthday to
              </span>
              
              <div className="font-script text-2xl sm:text-3xl lg:text-[32px] text-[#1E2D5A] leading-tight">
                Hon&apos;ble Chancellor
              </div>

              {/* Chancellor Name: Beautiful Kaushan Script in rich gold */}
              <div className="pt-1 pb-0.5">
                <h3 className="font-script text-3xl sm:text-4xl lg:text-[42px] text-[#B8862C] leading-none">
                  Kunwar Shekhar Vijendra
                </h3>
              </div>

              <p className="text-[10px] sm:text-[11px] font-ui font-semibold text-[#8B7B6F] uppercase tracking-[0.14em] pt-1">
                Chancellor · Shobhit University
              </p>
            </div>

            {/* Simple, Warm & Professional Message (Clear, Plain English) */}
            <div className="p-3 sm:p-3.5 rounded-xl bg-[#FAF8F4] border-l-4 border-l-[#B8862C] border border-[rgba(184,134,44,0.18)] text-left shadow-xs">
              <RevealText
                id="modal-greeting-message"
                text="Wishing you good health, great happiness, and a wonderful year ahead. Thank you for over 35 years of inspiring students and guiding us with wisdom and kindness."
                as="p"
                align="start"
                staggerAmount={0.022}
                duration={0.65}
                delay={0.35}
                className="text-xs sm:text-[13px] text-[#3E342B] font-ui leading-relaxed"
              />
            </div>

            {/* Core Simple Milestones */}
            <div className="flex flex-wrap items-center gap-1.5 text-left">
              <span className="px-2.5 py-0.5 rounded-full bg-white border border-[rgba(26,22,20,0.08)] text-[10px] sm:text-[11px] font-semibold text-[#1E2D5A] font-ui shadow-2xs">
                🎓 Educating Since 1989
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white border border-[rgba(26,22,20,0.08)] text-[10px] sm:text-[11px] font-semibold text-[#B8862C] font-ui shadow-2xs">
                🏛️ 2 Universities Founded
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white border border-[rgba(26,22,20,0.08)] text-[10px] sm:text-[11px] font-semibold text-[#4A3F35] font-ui shadow-2xs">
                🌍 50,000+ Students Guided
              </span>
            </div>

            {/* Interactive Actions Row */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                onClick={handleClose}
                id="overlay-enter-tribute-btn"
                className="group flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-full bg-[#1E2D5A] hover:bg-[#2E4080] text-white font-semibold text-xs sm:text-sm font-ui tracking-wide transition-all shadow-md hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Enter Website</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleReplayCrackers}
                id="overlay-firecrackers-btn"
                className="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-full bg-gradient-to-r from-[#FF0055]/10 via-[#FFD700]/15 to-[#0070F3]/10 hover:from-[#FF0055]/20 hover:to-[#0070F3]/20 border border-[rgba(184,134,44,0.40)] text-[#1A1614] font-semibold text-xs sm:text-sm font-ui tracking-wide transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Celebrate 🎉</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
