"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Menu, X, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";

// [SOLID: SRP] — Navbar component is solely responsible for top-level navigation and lightweight action triggers
// [YAGNI] — Removed redundant live radio widget, star badges, and multi-layer clutter for an airy, elegant landing page navbar
export interface NavbarProps {
  isVoiceEnabled?: boolean;
  onToggleVoice?: () => void;
  onOpenQR: () => void;
  isConnected?: boolean;
  totalWishes?: number;
}

const NAV_LINKS = [
  { label: "Journey",   href: "#journey" },
  { label: "Milestones", href: "#legacy-numbers" },
  { label: "Wisdom AI", href: "#wisdom" },
  { label: "Tributes",  href: "#celebrate" },
];

export const Navbar: React.FC<NavbarProps> = ({
  isVoiceEnabled = false,
  onToggleVoice,
  onOpenQR,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.replace("#", ""));
    const observers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.3 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "w-full fixed top-0 z-50 transition-all duration-300 ease-out",
        scrolled
          ? "bg-[#FAF8F4]/85 backdrop-blur-xl border-b border-[rgba(26,22,20,0.06)] shadow-[0_4px_24px_-8px_rgba(26,22,20,0.06)] py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-between gap-4">
        
        {/* ── Brand Logo (Shobhit University official emblem + Chancellor 360) ── */}
        <a
          href="#"
          className="flex items-center gap-3.5 group flex-shrink-0 transition-opacity hover:opacity-90"
        >
          <div className="relative h-10 sm:h-11 flex items-center">
            <Image
              src="/photos/site-logo-white.png"
              alt="Shobhit University"
              width={140}
              height={44}
              priority
              className="h-9 sm:h-10 w-auto object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </div>
          <div className="hidden sm:flex flex-col pl-3 border-l border-[rgba(26,22,20,0.12)]">
            <span className="font-display font-semibold text-sm tracking-wider text-[#1A1614] uppercase leading-tight">
              CHANCELLOR <span className="gold-text">360</span>
            </span>
            <span className="text-[10px] text-[#8B7B6F] font-ui tracking-wide">
              Living Digital Tribute
            </span>
          </div>
        </a>

        {/* ── Minimal Desktop Navigation ── */}
        <nav className="hidden md:flex items-center gap-1 bg-[#1A1614]/[0.03] border border-[rgba(26,22,20,0.06)] px-2 py-1.5 rounded-full backdrop-blur-md">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href.replace("#", "");
            return (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className={cn(
                  "relative px-4 py-1.5 rounded-full text-xs font-ui font-medium transition-all duration-200",
                  isActive
                    ? "text-[#1A1614] font-semibold bg-white shadow-sm"
                    : "text-[#4A3F35] hover:text-[#1A1614] hover:bg-white/50"
                )}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* ── Right Compact Actions ── */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          {/* Subtle audio narrator toggle */}
          {onToggleVoice && (
            <button
              onClick={onToggleVoice}
              title={isVoiceEnabled ? "Mute audio guide" : "Enable audio guide"}
              className={cn(
                "p-2.5 rounded-full border text-xs transition-all",
                isVoiceEnabled
                  ? "bg-[#FDF5E4] border-[rgba(184,134,44,0.35)] text-[#B8862C]"
                  : "bg-white/80 border-[rgba(26,22,20,0.08)] text-[#8B7B6F] hover:text-[#1A1614] hover:bg-white"
              )}
            >
              {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          )}

          {/* Clean, modern CTA */}
          <button
            onClick={onOpenQR}
            id="navbar-send-wish-btn"
            className="flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#1E2D5A] hover:bg-[#2E4080] text-white text-xs font-semibold font-ui tracking-wide transition-all shadow-sm hover:shadow active:scale-95"
          >
            <span>Send a Wish</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-full border border-[rgba(26,22,20,0.08)] bg-white/80 text-[#4A3F35] hover:text-[#1A1614]"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ── Minimal Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="md:hidden overflow-hidden border-t border-[rgba(26,22,20,0.06)] bg-[#FAF8F4]/98 backdrop-blur-xl px-6 py-4"
          >
            <nav className="flex flex-col gap-1.5">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-[#4A3F35] hover:bg-black/5 hover:text-[#1A1614] transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

