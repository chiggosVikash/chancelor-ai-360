"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import confetti from "canvas-confetti";
import { ArrowLeft, ArrowRight, Volume2, VolumeX, Flame, Heart } from "lucide-react";
import { RevealText } from "../../components/RevealText";
import { playFirecrackerSequence, playCrackerBlast, unlockAudioContext } from "../../lib/celebrationSound";

// [SOLID: SRP] — Dedicated non-scrollable single-section Birthday Greeting & Tribute Page
// [YAGNI] — Single viewport, zero scrolling, high-impact presentation

const VIBRANT_RAINBOW_CONFETTI = [
  "#FF0055",
  "#FF9900",
  "#FFD700",
  "#00E676",
  "#00B0FF",
  "#7C4DFF",
  "#FF4081",
  "#00E5FF",
  "#FFFFFF",
];

export default function GreetingPage() {
  const [isAudioActive, setIsAudioActive] = useState(true);

  const triggerFirecrackers = () => {
    if (isAudioActive) {
      playFirecrackerSequence();
    }

    // Left rocket
    confetti({
      particleCount: 85,
      angle: 72,
      spread: 65,
      origin: { x: 0.12, y: 1 },
      startVelocity: 94,
      colors: VIBRANT_RAINBOW_CONFETTI,
      gravity: 1.15,
      scalar: 1.25,
      ticks: 320,
    });

    // Right rocket
    confetti({
      particleCount: 85,
      angle: 108,
      spread: 65,
      origin: { x: 0.88, y: 1 },
      startVelocity: 94,
      colors: VIBRANT_RAINBOW_CONFETTI,
      gravity: 1.15,
      scalar: 1.25,
      ticks: 320,
    });

    // Center grand apex burst
    setTimeout(() => {
      confetti({
        particleCount: 140,
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

    // Staggered secondary bursts
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

  useEffect(() => {
    const handleFirstInteraction = () => {
      unlockAudioContext();
    };

    window.addEventListener("pointerdown", handleFirstInteraction, { once: true });
    window.addEventListener("keydown", handleFirstInteraction, { once: true });

    const timer = setTimeout(() => {
      triggerFirecrackers();
    }, 500);

    return () => {
      clearTimeout(timer);
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

  return (
    <main className="w-screen h-screen max-h-screen overflow-hidden bg-[#FAF8F4] flex flex-col justify-between p-4 sm:p-6 md:p-8 section-bg-pattern relative select-none">
      
      {/* ── Top Header Navigation Bar (Minimal) ── */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between z-20 flex-shrink-0 py-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-ui font-semibold text-[#4A3F35] hover:text-[#1A1614] bg-white/80 border border-[rgba(26,22,20,0.08)] px-4 py-2 rounded-full shadow-xs transition-all hover:bg-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Landing Page</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAudioActive(!isAudioActive)}
            title={isAudioActive ? "Mute sounds" : "Enable sounds"}
            className="p-2 sm:p-2.5 rounded-full bg-white/90 border border-[rgba(26,22,20,0.08)] text-[#4A3F35] hover:text-[#1A1614] shadow-xs transition-all"
          >
            {isAudioActive ? (
              <Volume2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#8B7B6F]" />
            )}
          </button>
        </div>
      </header>

      {/* ── Center Stage: One Non-Scrollable Split Card with Whole Left Section Image ── */}
      <section className="w-full max-w-6xl mx-auto my-auto z-10 flex items-center justify-center flex-1">
        <div className="w-full bg-white border border-[rgba(184,134,44,0.35)] rounded-[32px] shadow-[0_30px_90px_-20px_rgba(26,22,20,0.18)] overflow-hidden grid md:grid-cols-12 min-h-[480px] md:min-h-[540px] max-h-[82vh]">
          
          {/* ── WHOLE LEFT SECTION: Full-Bleed Solo Portrait of Chancellor Sir (5 cols) ── */}
          <div className="md:col-span-5 relative w-full h-64 md:h-full min-h-[260px] md:min-h-full bg-[#101420] overflow-hidden">
            <Image
              src="/photos/chancellor_portrait_solo.jpeg"
              alt="Hon'ble Chancellor Kunwar Shekhar Vijendra"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 480px"
              className="object-cover object-top filter contrast-[1.03] brightness-[1.0] transition-transform duration-700 ease-out hover:scale-105"
            />

            {/* Gradient vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E17] via-[#0B0E17]/25 to-transparent opacity-90" />

            {/* Dignitary Name overlay */}
            <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 text-left z-10">
              <span className="inline-block px-3 py-0.5 rounded-full bg-[#B8862C] text-white text-[9px] font-mono uppercase tracking-[0.2em] font-bold mb-2">
                Visionary Leader
              </span>
              <h1 className="font-display font-black text-xl sm:text-2xl text-white tracking-wide uppercase leading-tight">
                Kunwar Shekhar Vijendra
              </h1>
              <p className="text-xs font-ui text-[#D4AF37] font-semibold tracking-wide mt-1">
                Co-Founder &amp; Hon'ble Chancellor
              </p>
              <p className="text-[11px] text-white/70 font-ui">
                Shobhit University · 35+ Years of Leadership
              </p>
            </div>
          </div>

          {/* ── RIGHT SECTION: Modern High-Emphasis Birthday Greeting (7 cols) ── */}
          <div className="md:col-span-7 flex flex-col justify-between p-6 sm:p-8 md:p-10 space-y-4 sm:space-y-6 overflow-hidden">
            
            {/* Celebration Category Chip */}
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDF5E4] border border-[rgba(184,134,44,0.35)] text-[#B8862C] text-xs font-semibold font-ui uppercase tracking-[0.2em]">
                <span className="w-2 h-2 rounded-full bg-[#B8862C] animate-pulse" />
                <span>Happy Birthday Wishes</span>
              </div>
            </div>

            {/* High-Emphasis Birthday Headline with Kaushan Script */}
            <div className="space-y-1 text-left">
              <span className="font-script text-xl sm:text-2xl lg:text-3xl text-[#8B7B6F] leading-snug block">
                Wishing a Very Happy Birthday to
              </span>

              <div className="font-script text-2xl sm:text-3xl lg:text-[36px] text-[#1E2D5A] leading-tight">
                Hon&apos;ble Chancellor
              </div>

              {/* Chancellor Name: Beautiful Kaushan Script in rich gold */}
              <div className="pt-1 pb-0.5">
                <h2 className="font-script text-3xl sm:text-4xl lg:text-[46px] text-[#B8862C] leading-none">
                  Kunwar Shekhar Vijendra
                </h2>
              </div>

              <p className="text-[11px] sm:text-xs font-ui font-semibold text-[#8B7B6F] uppercase tracking-[0.16em] pt-1">
                Chancellor · Shobhit University
              </p>
            </div>

            {/* Simple, Warm & Professional Message (Clear, Plain English) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F4] border-l-4 border-l-[#B8862C] border border-[rgba(184,134,44,0.18)] text-left shadow-xs">
              <RevealText
                id="page-greeting-quote"
                text="Wishing you good health, great happiness, and a wonderful year ahead. Thank you for over 35 years of inspiring students and guiding us with wisdom and kindness."
                as="p"
                align="start"
                staggerAmount={0.022}
                duration={0.65}
                delay={0.35}
                className="text-xs sm:text-sm text-[#3E342B] font-ui leading-relaxed"
              />
            </div>

            {/* Core Simple Milestones */}
            <div className="flex flex-wrap items-center gap-2 text-left">
              <span className="px-3 py-1 rounded-full bg-white border border-[rgba(26,22,20,0.08)] text-[11px] font-semibold text-[#1E2D5A] font-ui shadow-2xs">
                🎓 Educating Since 1989
              </span>
              <span className="px-3 py-1 rounded-full bg-white border border-[rgba(26,22,20,0.08)] text-[11px] font-semibold text-[#B8862C] font-ui shadow-2xs">
                🏛️ 2 Universities Founded
              </span>
              <span className="px-3 py-1 rounded-full bg-white border border-[rgba(26,22,20,0.08)] text-[11px] font-semibold text-[#4A3F35] font-ui shadow-2xs">
                🌍 50,000+ Students Guided
              </span>
            </div>

            {/* Interactive Actions Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/wish"
                id="greeting-send-wish-cta"
                className="group flex items-center gap-2.5 px-6 sm:px-7 py-3 rounded-full bg-[#1E2D5A] hover:bg-[#2E4080] text-white font-semibold text-xs sm:text-sm font-ui tracking-wide transition-all shadow-md hover:shadow-xl hover:scale-105 active:scale-95"
              >
                <span>Send a Birthday Wish</span>
                <Heart className="w-3.5 h-3.5 text-rose-300 fill-rose-300" />
              </Link>

              <button
                onClick={handleReplayCrackers}
                id="greeting-firecrackers-cta"
                className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-[#FF0055]/10 via-[#FFD700]/15 to-[#0070F3]/10 hover:from-[#FF0055]/20 hover:to-[#0070F3]/20 border border-[rgba(184,134,44,0.40)] text-[#1A1614] font-semibold text-xs sm:text-sm font-ui tracking-wide transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Celebrate 🎉</span>
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ── Minimal Bottom Footer Attribution (Single line) ── */}
      <footer className="w-full max-w-6xl mx-auto flex items-center justify-between text-[11px] text-[#8B7B6F] font-ui py-2 z-20 flex-shrink-0">
        <p>© {new Date().getFullYear()} Shobhit University.</p>
        <p>Hon'ble Chancellor Kunwar Shekhar Vijendra Birthday Tribute</p>
      </footer>

    </main>
  );
}
