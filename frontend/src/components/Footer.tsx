"use client";
import React from "react";
import Image from "next/image";

// [SOLID: SRP] — Footer handles brand attribution and essential copyright anchors without layout clutter
// [YAGNI] — Eliminated bloated multi-column campus lists and widget badges; optimized for a clean landing page
export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#F5F1EC] border-t border-[rgba(26,22,20,0.06)] py-10 px-4 sm:px-6 md:px-8 font-ui">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand & Tribute Tagline */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="relative h-9 flex items-center">
            <Image
              src="/photos/site-logo-white.png"
              alt="Shobhit University"
              width={120}
              height={38}
              className="h-8 w-auto object-contain"
            />
          </div>
          <div className="sm:border-l sm:border-[rgba(26,22,20,0.12)] sm:pl-4">
            <p className="text-xs text-[#8B7B6F]">
              Celebrating 35+ years of visionary leadership &amp; transformative education.
            </p>
          </div>
        </div>

        {/* Minimal Navigation Anchors */}
        <nav className="flex flex-wrap items-center justify-center gap-5 text-xs font-medium text-[#4A3F35]">
          <a href="#heritage" className="hover:text-[#B8862C] transition-colors">
            Heritage
          </a>
          <a href="#journey" className="hover:text-[#B8862C] transition-colors">
            Journey
          </a>
          <a href="#legacy-numbers" className="hover:text-[#B8862C] transition-colors">
            Milestones
          </a>
          <a href="#wisdom" className="hover:text-[#B8862C] transition-colors">
            Wisdom AI
          </a>
          <a href="#celebrate" className="hover:text-[#B8862C] transition-colors">
            Tributes
          </a>
        </nav>

        {/* Copyright */}
        <div className="text-center md:text-right text-[11px] text-[#8B7B6F]">
          <p>© {new Date().getFullYear()} Shobhit University.</p>
        </div>

      </div>
    </footer>
  );
};

