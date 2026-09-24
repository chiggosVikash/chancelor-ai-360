"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ArrowDown, ChevronRight, Award, GraduationCap, Globe, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/cn";

// [SOLID: SRP] — HeroSection presents the core tribute centerpiece, headline, and archival imagery
// [PATTERN: Strategy] — Archival moment switcher allows viewing multiple uncropped historic interactions
interface HeroSectionProps {
  onExploreJourney: () => void;
  onTalkToAI: () => void;
}

interface ArchivalMoment {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  dignitary: string;
  tag: string;
}

const ARCHIVAL_MOMENTS: ArchivalMoment[] = [
  {
    id: "modi",
    image: "/photos/image1.jpeg",
    title: "National Vision for Sustainable Development",
    subtitle: "Presenting green vision & educational initiatives",
    dignitary: "With Hon'ble Prime Minister Narendra Modi",
    tag: "National Dialogue",
  },
  {
    id: "kovind",
    image: "/photos/image2.jpeg",
    title: "Presidential Recognition for Academic Excellence",
    subtitle: "Conferred national tribute for pioneering education",
    dignitary: "With Hon'ble President of India Ram Nath Kovind",
    tag: "Presidential Honor",
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreJourney, onTalkToAI }) => {
  const [activeMomentIndex, setActiveMomentIndex] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const titleLine1Ref = useRef<HTMLSpanElement>(null);
  const titleLine2Ref = useRef<HTMLSpanElement>(null);
  const preTitleRef = useRef<HTMLDivElement>(null);
  const roleBadgeRef = useRef<HTMLDivElement>(null);
  const narrativeRef = useRef<HTMLDivElement>(null);
  const ctaGroupRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const imageCardRef = useRef<HTMLDivElement>(null);
  const imageElementRef = useRef<HTMLDivElement>(null);

  const activeMoment = ARCHIVAL_MOMENTS[activeMomentIndex];

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
          [titleLine1Ref.current, titleLine2Ref.current],
          { opacity: 0, y: 35, skewY: 1.5 },
          { opacity: 1, y: 0, skewY: 0, duration: 0.8, stagger: 0.12 },
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
          { opacity: 0, scale: 0.96, y: 30 },
          { opacity: 1, scale: 1, y: 0, duration: 1.0, ease: "power4.out" },
          "-=0.9"
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Smooth image cross-fade when switching archival moments
  const handleMomentSelect = (idx: number) => {
    if (idx === activeMomentIndex) return;
    if (imageElementRef.current) {
      gsap.to(imageElementRef.current, {
        opacity: 0,
        scale: 0.98,
        duration: 0.22,
        ease: "power2.inOut",
        onComplete: () => {
          setActiveMomentIndex(idx);
          gsap.to(imageElementRef.current, {
            opacity: 1,
            scale: 1,
            duration: 0.35,
            ease: "power2.out",
          });
        },
      });
    } else {
      setActiveMomentIndex(idx);
    }
  };

  // Subtle interactive 3D tilt on mousemove
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageCardRef.current) return;
    const rect = imageCardRef.current.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

    gsap.to(imageCardRef.current, {
      rotateY: x * 4,
      rotateX: -y * 3,
      duration: 0.5,
      ease: "power1.out",
      transformPerspective: 1000,
    });
  };

  const handleMouseLeave = () => {
    if (!imageCardRef.current) return;
    gsap.to(imageCardRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.8,
      ease: "power2.out",
    });
  };

  return (
    <section
      id="heritage"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
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

            {/* Main Headline — Modern Outfit Display Typography */}
            <div className="space-y-1">
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

          {/* ── RIGHT: 100% UN増CROPPED Archival Showcase (5 cols) ── */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            
            <div
              ref={imageCardRef}
              className="relative w-full max-w-md sm:max-w-lg lg:max-w-none group"
            >
              {/* Outer Golden Ambient Glow */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#B8862C]/20 via-[#D4A84B]/10 to-transparent rounded-[32px] blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              {/* Master Archival Showcase Container */}
              <div className="relative bg-white rounded-3xl p-3 sm:p-4 border border-[rgba(184,134,44,0.30)] shadow-[0_20px_50px_-12px_rgba(26,22,20,0.14)]">
                
                {/* 100% UNCROPPED 3:2 Historic Photo Frame */}
                {/* [DRY] — Exact 3:2 aspect ratio ensures Prime Minister Modi & President Kovind are NEVER cropped */}
                <div
                  ref={imageElementRef}
                  className="relative w-full aspect-[3/2] rounded-2xl overflow-hidden bg-[#1A1614]/5 shadow-inner"
                >
                  <Image
                    src={activeMoment.image}
                    alt={`${activeMoment.title} — ${activeMoment.dignitary}`}
                    fill
                    priority
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 520px"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  />

                  {/* Top-Right Moment Badge */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#1A1614]/80 backdrop-blur-md text-[10px] font-mono text-white/95 uppercase tracking-wider border border-white/10">
                    {activeMoment.tag}
                  </div>
                </div>

                {/* Dignitary & Moment Caption Bar */}
                <div className="mt-3.5 px-2 pb-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-[#1A1614] font-ui line-clamp-1">
                      {activeMoment.dignitary}
                    </span>
                    <span className="text-[10px] font-mono text-[#B8862C] uppercase tracking-wider whitespace-nowrap">
                      {activeMomentIndex === 0 ? "01 / 02" : "02 / 02"}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8B7B6F] font-ui line-clamp-1">
                    {activeMoment.title}
                  </p>
                </div>

                {/* Moment Switcher Tabs */}
                <div className="mt-3 pt-3 border-t border-[rgba(26,22,20,0.06)] grid grid-cols-2 gap-2">
                  {ARCHIVAL_MOMENTS.map((moment, idx) => {
                    const isSelected = idx === activeMomentIndex;
                    return (
                      <button
                        key={moment.id}
                        onClick={() => handleMomentSelect(idx)}
                        className={cn(
                          "px-2.5 py-2 rounded-xl text-left transition-all duration-200 text-xs font-ui flex items-center justify-between",
                          isSelected
                            ? "bg-[#1E2D5A] text-white shadow-xs font-medium"
                            : "bg-[#FAF8F4] text-[#4A3F35] hover:bg-[#F0ECE4]"
                        )}
                      >
                        <span className="truncate">
                          {idx === 0 ? "With PM Modi" : "With Pres. Kovind"}
                        </span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#E4C98A] flex-shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>

              </div>

              {/* Verified Tribute Stamp pinned bottom-right */}
              <div className="absolute -bottom-3 -right-3 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[rgba(184,134,44,0.30)] shadow-md text-[10px] font-mono text-[#8B7B6F]">
                <Award className="w-3.5 h-3.5 text-[#B8862C]" />
                <span>Historic Archive</span>
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

