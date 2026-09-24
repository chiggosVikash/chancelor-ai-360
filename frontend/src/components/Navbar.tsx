"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Volume2, VolumeX, QrCode, Menu, X, Radio
} from "lucide-react";
import { cn } from "@/lib/cn";

interface NavbarProps {
  isVoiceEnabled: boolean;
  onToggleVoice: () => void;
  onOpenQR: () => void;
  isConnected?: boolean;
  totalWishes?: number;
}

const NAV_LINKS = [
  { label: "Heritage", href: "#heritage" },
  { label: "Journey",  href: "#journey"  },
  { label: "Wisdom",   href: "#wisdom"   },
  { label: "Celebrate",href: "#celebrate"},
];

export const Navbar: React.FC<NavbarProps> = ({
  isVoiceEnabled,
  onToggleVoice,
  onOpenQR,
  isConnected = false,
  totalWishes = 0,
}) => {
  const [scrolled,     setScrolled]     = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [activeSection,setActiveSection]= useState("");

  /* ── Scroll shadow ─────────────────────────────────────────── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Active section via IntersectionObserver ────────────────── */
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.replace("#", ""));
    const observers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
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
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 28, delay: 0.1 }}
        className={cn(
          "w-full sticky top-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/90 backdrop-blur-xl border-b border-[rgba(26,22,20,0.08)] shadow-[0_2px_20px_-4px_rgba(26,22,20,0.08)]"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">

          {/* ── Brand ─────────────────────────────────────────── */}
          <a href="#" className="flex items-center gap-3 group flex-shrink-0">
            {/* SU Monogram */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E2D5A] to-[#2E4080] flex items-center justify-center shadow-md flex-shrink-0 group-hover:scale-105 transition-transform">
              <span className="font-display font-bold text-white text-base tracking-tight">SU</span>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="font-display font-semibold text-xl tracking-tight text-[#1A1614]">
                  CHANCELLOR <span className="gold-gradient-text">AI 360</span>
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FDF5E4] text-[#B8862C] border border-[rgba(184,134,44,0.30)]">
                  <Sparkles className="w-3 h-3" />
                  Tribute Edition
                </span>
              </div>
              <p className="text-[11px] text-[#8B7B6F] font-ui leading-none mt-0.5">
                Shobhit University · Honoring Hon'ble Chancellor
              </p>
            </div>
          </a>

          {/* ── Desktop Nav Links ──────────────────────────────── */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.replace("#", "");
              return (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={cn(
                    "relative px-4 py-2 rounded-lg text-sm font-ui font-medium transition-all duration-200",
                    isActive
                      ? "text-[#B8862C]"
                      : "text-[#4A3F35] hover:text-[#1A1614] hover:bg-[#F5F1EC]"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-[#B8862C]"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* ── Right Controls ─────────────────────────────────── */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Live badge */}
            {totalWishes > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F5F1EC] border border-[rgba(26,22,20,0.08)] text-xs">
                <Radio className={cn("w-3 h-3", isConnected ? "text-emerald-600 animate-pulse" : "text-[#B8862C]")} />
                <span className={cn("font-medium", isConnected ? "text-emerald-700" : "text-[#B8862C]")}>
                  {isConnected ? "Live" : "Stage"}
                </span>
                <span className="text-[#8B7B6F]">· {totalWishes} wishes</span>
              </div>
            )}

            {/* Voice toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              onClick={onToggleVoice}
              title={isVoiceEnabled ? "Mute narration" : "Enable narration"}
              className={cn(
                "p-2.5 rounded-xl border text-sm transition-all",
                isVoiceEnabled
                  ? "bg-[#FDF5E4] border-[rgba(184,134,44,0.40)] text-[#B8862C] hover:bg-[#F5E8C4]"
                  : "bg-white border-[rgba(26,22,20,0.08)] text-[#8B7B6F] hover:text-[#4A3F35] hover:border-[rgba(26,22,20,0.16)]"
              )}
            >
              {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </motion.button>

            {/* Send Wish CTA */}
            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              onClick={onOpenQR}
              id="navbar-send-wish-btn"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1E2D5A] hover:bg-[#2E4080] text-white text-sm font-semibold font-ui transition-colors shadow-md"
            >
              <QrCode className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">Send a Wish</span>
              <span className="sm:hidden">Wish</span>
            </motion.button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 rounded-xl border border-[rgba(26,22,20,0.08)] text-[#4A3F35] hover:bg-[#F5F1EC] transition-colors"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Nav Sheet ─────────────────────────────────── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
              className="lg:hidden overflow-hidden border-t border-[rgba(26,22,20,0.06)] bg-white/95 backdrop-blur-xl"
            >
              <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.button
                    key={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, type: "spring", stiffness: 400, damping: 28 }}
                    onClick={() => handleNavClick(link.href)}
                    className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-[#4A3F35] hover:bg-[#F5F1EC] hover:text-[#1A1614] transition-colors"
                  >
                    {link.label}
                  </motion.button>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
};
