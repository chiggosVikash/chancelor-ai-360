"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ArrowDown, ChevronRight, Award, GraduationCap, Globe, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/cn";

// [SOLID: SRP] — HeroSection presents the core tribute centerpiece, headline, and archival imagery
// [PATTERN: Strategy] — Dual continuous vertical image streams showcasing historic interactions uncropped
interface HeroSectionProps {
  onExploreJourney: () => void;
  onTalkToAI: () => void;
}

interface HeroSlideImage {
  id: string;
  src: string;
  alt: string;
  tag: string;
}

// First slide: Moves Top to Bottom (4 historic photos)
const SLIDE_1_IMAGES: HeroSlideImage[] = [
  {
    id: "ksv-17",
    src: "/photos/ksv_photo_17.jpg",
    alt: "Chancellor with International Dignitaries",
    tag: "Global Summit",
  },
  {
    id: "ksv-19-2",
    src: "/photos/ksv_photo_19-2.jpg",
    alt: "National Academic Leadership",
    tag: "Leadership",
  },
  {
    id: "ksv-19",
    src: "/photos/ksv_photo_19.jpg",
    alt: "Pioneering Higher Education",
    tag: "Education",
  },
  {
    id: "modi",
    src: "/photos/image1.jpeg",
    alt: "With Hon'ble Prime Minister Narendra Modi",
    tag: "National Dialogue",
  },
];

// Second slide: Moves Bottom to Top (4 historic photos)
const SLIDE_2_IMAGES: HeroSlideImage[] = [
  {
    id: "kovind",
    src: "/photos/image2.jpeg",
    alt: "With Hon'ble President Ram Nath Kovind",
    tag: "Presidential Tribute",
  },
  {
    id: "ksv-1",
    src: "/photos/ksv_photo_1.jpg",
    alt: "Empowering Rural & Youth Education",
    tag: "Community Impact",
  },
  {
    id: "ksv-6",
    src: "/photos/ksv_photo_6.jpg",
    alt: "Healthcare & Research Excellence",
    tag: "Integrative Health",
  },
  {
    id: "ksv-15",
    src: "/photos/ksv_photo_15.jpg",
    alt: "Guiding Future Generations",
    tag: "Academic Vision",
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreJourney, onTalkToAI }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const honorificRef = useRef<HTMLSpanElement>(null);
  const titleLine1Ref = useRef<HTMLSpanElement>(null);
  const titleLine2Ref = useRef<HTMLSpanElement>(null);
  const preTitleRef = useRef<HTMLDivElement>(null);
  const roleBadgeRef = useRef<HTMLDivElement>(null);
  const narrativeRef = useRef<HTMLDivElement>(null);
  const ctaGroupRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const imageCardRef = useRef<HTMLDivElement>(null);

  // [GSAP: Cinematic Entrance Animation inspired by bellavita-site]
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Staggered reveal of text and archival card
      tl.fromTo(
        preTitleRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.1 }
      )
        .fromTo(
          [honorificRef.current, titleLine1Ref.current, titleLine2Ref.current],
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 },
          "-=0.3"
        )
        .fromTo(
          roleBadgeRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.4"
        )
        .fromTo(
          narrativeRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.3"
        )
        .fromTo(
          ctaGroupRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.3"
        )
        .fromTo(
          statsRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.3"
        )
        .fromTo(
          imageCardRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
          "-=0.9"
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="heritage"
      ref={heroRef}
      className="relative min-h-[94vh] pt-28 pb-16 sm:pb-24 flex items-center overflow-hidden section-bg-pattern"
    >
      {/* Delicate background ambient gradient */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-[#B8862C]/5 via-[#1E2D5A]/4 to-transparent blur-[120px] pointer-events-none"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* ── LEFT: Typography & Vision Narrative (7 cols) ── */}
          <div className="lg:col-span-7 flex flex-col items-start gap-6 text-left">
            
            {/* Pre-title Chip — Modern, clean, NO star icons */}
            <div ref={preTitleRef}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[rgba(184,134,44,0.30)] shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8862C]" />
                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#B8862C] font-ui">
                  A Living Tribute · 35+ Years of Impact
                </span>
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-1">
              <span
                ref={honorificRef}
                className="font-script text-2xl sm:text-3xl lg:text-4xl text-[#B8862C] block leading-snug"
              >
                Hon&apos;ble Chancellor
              </span>
              <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-[#1A1614] leading-[1.08] tracking-tight">
                <span ref={titleLine1Ref} className="block">
                  Kunwar Shekhar
                </span>
                <span ref={titleLine2Ref} className="block gold-gradient-text">
                  Vijendra
                </span>
              </h1>
            </div>

            {/* Role & Title Pill */}
            <div ref={roleBadgeRef} className="flex flex-wrap items-center gap-2">
              <div className="px-3.5 py-1.5 rounded-lg bg-[#1E2D5A]/[0.06] border border-[#1E2D5A]/15 text-[#1E2D5A] text-xs font-semibold uppercase tracking-[0.14em] font-ui">
                Co-Founder &amp; Chancellor · Shobhit University
              </div>
              <div className="hidden sm:inline-block px-3 py-1.5 rounded-lg bg-[#FAF8F4] border border-[rgba(26,22,20,0.08)] text-[#8B7B6F] text-xs font-ui">
                Thought Leader &amp; Educationist
              </div>
            </div>

            {/* Editorial Tagline & Philosophy */}
            <div ref={narrativeRef} className="space-y-2 max-w-xl">
              <p className="font-display font-medium text-lg sm:text-xl text-[#2B231D] leading-snug">
                “One person → many moments → one enduring legacy.”
              </p>
              <p className="text-sm sm:text-[15px] text-[#6E6053] font-ui leading-relaxed">
                Celebrating a lifetime dedicated to bridging rural potential with global excellence.
                Pioneering accessible higher education, integrative medicine, and ethical leadership across India.
              </p>
            </div>

            {/* Call to Action Buttons — Modern, polished, NO star icons */}
            <div ref={ctaGroupRef} className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                onClick={onExploreJourney}
                id="hero-explore-journey-btn"
                className="group flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#1E2D5A] hover:bg-[#2E4080] text-white font-semibold text-xs sm:text-sm font-ui tracking-wide transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
              >
                <span>Explore His Journey</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={onTalkToAI}
                id="hero-talk-ai-btn"
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-[#FAF8F4] border border-[rgba(184,134,44,0.40)] text-[#996C18] hover:text-[#7A540E] font-semibold text-xs sm:text-sm font-ui tracking-wide transition-all duration-300 shadow-xs hover:shadow-sm active:scale-95"
              >
                <span>Talk to Chancellor AI</span>
              </button>
            </div>

            {/* Key Impact Stats Bar */}
            <div
              ref={statsRef}
              className="w-full max-w-xl grid grid-cols-3 gap-4 pt-6 border-t border-[rgba(26,22,20,0.08)]"
            >
              <div>
                <div className="font-display font-bold text-2xl sm:text-3xl text-[#1A1614] tracking-tight">
                  35<span className="text-[#B8862C]">+</span>
                </div>
                <div className="text-[11px] text-[#8B7B6F] font-ui uppercase tracking-wider mt-0.5">
                  Years of Service
                </div>
              </div>

              <div>
                <div className="font-display font-bold text-2xl sm:text-3xl text-[#1A1614] tracking-tight">
                  50K<span className="text-[#B8862C]">+</span>
                </div>
                <div className="text-[11px] text-[#8B7B6F] font-ui uppercase tracking-wider mt-0.5">
                  Global Alumni
                </div>
              </div>

              <div>
                <div className="font-display font-bold text-2xl sm:text-3xl text-[#1A1614] tracking-tight">
                  2<span className="text-[#B8862C]"> Univ</span>
                </div>
                <div className="text-[11px] text-[#8B7B6F] font-ui uppercase tracking-wider mt-0.5">
                  Meerut &amp; Gangoh
                </div>
              </div>
            </div>

          </div>

          {/* ── RIGHT: Boundary-less Dual Sliding Streams (Emerging from top & going down) ── */}
          <div className="lg:col-span-5 relative w-full flex flex-col items-center justify-center">
            
            {/* Height container with ZERO card background, ZERO border, ZERO boundaries */}
            <div
              ref={imageCardRef}
              className="relative h-[520px] sm:h-[580px] lg:h-[640px] w-full overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_0%,black_5%,black_95%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_5%,black_95%,transparent_100%)]"
            >
              
              {/* Delicate Top and Bottom Edge Fades (Subtle, not covering the photos) */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[#FAF8F4] to-transparent z-20" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#FAF8F4] to-transparent z-20" />

              {/* 2-Column Grid — No card, no outer border, boundary-less */}
              <div className="grid grid-cols-2 gap-3.5 sm:gap-5 h-full overflow-hidden">
                
                {/* Column 1: Top to Bottom Slider */}
                <div className="flex flex-col gap-3.5 sm:gap-5 animate-marquee-down">
                  {[...SLIDE_1_IMAGES, ...SLIDE_1_IMAGES].map((img, i) => (
                    <div
                      key={`col1-${img.id}-${i}`}
                      className="relative w-full aspect-[3/2] rounded-2xl overflow-hidden flex-shrink-0 bg-[#FAF8F4]"
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 280px"
                        className="object-contain object-center"
                      />
                    </div>
                  ))}
                </div>

                {/* Column 2: Bottom to Top Slider */}
                <div className="flex flex-col gap-3.5 sm:gap-5 animate-marquee-up">
                  {[...SLIDE_2_IMAGES, ...SLIDE_2_IMAGES].map((img, i) => (
                    <div
                      key={`col2-${img.id}-${i}`}
                      className="relative w-full aspect-[3/2] rounded-2xl overflow-hidden flex-shrink-0 bg-[#FAF8F4]"
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 280px"
                        className="object-contain object-center"
                      />
                    </div>
                  ))}
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Subtle bottom scroll prompt */}
      <div className="absolute bottom-4 inset-x-0 flex justify-center pointer-events-none">
        <a
          href="#journey"
          className="pointer-events-auto flex items-center gap-1.5 text-[11px] font-mono tracking-wider uppercase text-[#8B7B6F] hover:text-[#B8862C] transition-colors"
        >
          <span>Explore Timeline</span>
          <ArrowDown className="w-3 h-3 animate-bounce" />
        </a>
      </div>
    </section>
  );
};

