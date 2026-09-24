"use client";
import React from "react";
import { Sparkles, Heart, Globe, Building2, ExternalLink } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#F5F1EC] border-t border-[rgba(26,22,20,0.08)] py-14 px-4 sm:px-6 md:px-8 font-ui">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Top Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-[#1E2D5A] flex items-center justify-center text-white font-display font-bold text-sm shadow-sm">
                SU
              </div>
              <span className="font-display font-bold text-lg text-[#1A1614] tracking-tight">
                CHANCELLOR <span className="gold-gradient-text">AI 360</span>
              </span>
            </div>
            <p className="text-xs text-[#8B7B6F] leading-relaxed max-w-sm">
              An intelligent, interactive digital tribute commemorating the visionary leadership and transformative legacy of Kunwar Shekhar Vijendra — Co-Founder &amp; Chancellor, Shobhit University.
            </p>
            <div className="inline-flex items-center gap-1.5 text-[11px] text-[#B8862C] font-semibold bg-[#FDF5E4] px-3 py-1 rounded-full border border-[rgba(184,134,44,0.30)]">
              <Sparkles className="w-3 h-3 text-[#B8862C]" />
              Official Birthday Anniversary Tribute
            </div>
          </div>

          {/* Shobhit University Campuses */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1A1614]">
              Campuses
            </h4>
            <ul className="space-y-1.5 text-xs text-[#8B7B6F]">
              <li className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#B8862C]" />
                <span>Meerut, Uttar Pradesh (Deemed Univ)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#B8862C]" />
                <span>Gangoh, Saharanpur (State Univ)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#B8862C]" />
                <span>Global Alumni in 50+ Countries</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1A1614]">
              Navigation
            </h4>
            <ul className="space-y-1.5 text-xs text-[#8B7B6F]">
              <li><a href="#heritage" className="hover:text-[#B8862C] transition-colors">Heritage &amp; Vision</a></li>
              <li><a href="#legacy-numbers" className="hover:text-[#B8862C] transition-colors">By the Numbers</a></li>
              <li><a href="#journey" className="hover:text-[#B8862C] transition-colors">Chronological Odyssey</a></li>
              <li><a href="#wisdom" className="hover:text-[#B8862C] transition-colors">Talk to Chancellor AI</a></li>
              <li><a href="#celebrate" className="hover:text-[#B8862C] transition-colors">Send Birthday Greetings</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Attribution */}
        <div className="pt-8 border-t border-[rgba(26,22,20,0.06)] flex flex-col sm:flex-row items-center justify-between text-xs text-[#8B7B6F] gap-4">
          <p>
            © {new Date().getFullYear()} Shobhit University. Grounded in Ethics, Empowering the Future.
          </p>
          <p className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#B8862C] fill-[#B8862C]" />
            <span>for Hon'ble Chancellor Sir's Birthday</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
