"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { LegacyUniverseCanvas, MemoryNodeData, MEMORY_NODES } from "./LegacyUniverseCanvas";
import { Sparkles, ArrowDown, BookOpen, X, ChevronRight, Award, Compass } from "lucide-react";

interface HeroMasterpieceProps {
  onEnterExperience: () => void;
}

export const HeroMasterpiece: React.FC<HeroMasterpieceProps> = ({ onEnterExperience }) => {
  const [activeNode, setActiveNode] = useState<MemoryNodeData | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [imageSrc, setImageSrc] = useState("/photos/chancellor_portrait.jpg");

  // Handle subtle 3D tilt & parallax on the Living Portrait
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 2;
    const y = (clientY / innerHeight - 0.5) * 2;
    setMousePos({ x, y });
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-[92vh] flex flex-col justify-between items-center overflow-hidden bg-[#0B0B0A] px-4 sm:px-6 md:px-8 py-8"
    >
      {/* 1. Procedural 3D Three.js Legacy Universe Canvas */}
      <LegacyUniverseCanvas onNodeSelect={(node) => setActiveNode(node)} />

      {/* 2. Top Header Metadata / Stage Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="relative z-20 flex flex-col items-center text-center space-y-1"
      >
        <span className="text-[10px] sm:text-xs font-mono tracking-[0.25em] text-[#C9A45C] uppercase">
          A Digital Tribute
        </span>
        <h1 className="font-display font-semibold text-lg sm:text-xl text-[#F5F2EA] tracking-widest">
          CHANCELLOR AI 360
        </h1>
      </motion.div>

      {/* 3. Centerpiece: The Living Chancellor Portrait inside the 3D Universe */}
      <div className="relative z-20 my-auto flex flex-col items-center justify-center">
        {/* Memory Node Quick Tags Floating in 2D space around the portrait for accessibility */}
        <div className="hidden lg:block absolute inset-0 pointer-events-none w-[700px] h-[480px] -left-[140px] -top-[30px]">
          {MEMORY_NODES.map((node, i) => (
            <button
              key={node.id}
              onClick={() => setActiveNode(node)}
              className="pointer-events-auto absolute px-3 py-1.5 rounded-full bg-[#121210]/80 backdrop-blur-md border border-[#C9A45C]/30 text-[10px] font-mono tracking-wider text-[#E4C98A] hover:bg-[#C9A45C] hover:text-[#0B0B0A] hover:scale-105 transition-all shadow-lg cursor-pointer"
              style={{
                top: i === 0 ? "10%" : i === 1 ? "40%" : i === 2 ? "78%" : i === 3 ? "75%" : "8%",
                left: i === 0 ? "75%" : i === 1 ? "5%" : i === 2 ? "72%" : i === 3 ? "12%" : "38%",
              }}
            >
              ✦ {node.label}
            </button>
          ))}
        </div>

        {/* The Portrait Container with 3D Tilt, Gold Rim Light & Parallax */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ delay: 1.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            transform: `perspective(1000px) rotateY(${mousePos.x * 6}deg) rotateX(${-mousePos.y * 6}deg) translateZ(10px)`,
          }}
          className="relative group transition-transform duration-200 ease-out"
        >
          {/* Soft background glow & shadow */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-[#C9A45C]/15 to-transparent rounded-[32px] blur-2xl opacity-60 group-hover:opacity-90 transition-opacity" />

          {/* Living Portrait Frame */}
          <div className="relative w-56 h-72 sm:w-64 sm:h-80 md:w-72 md:h-92 rounded-[28px] p-[1.5px] bg-gradient-to-b from-[#E4C98A]/60 via-[#C9A45C]/20 to-transparent shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden">
            <div className="relative w-full h-full rounded-[26px] bg-[#121210] overflow-hidden">
              <Image
                src={imageSrc}
                alt="Kunwar Shekhar Vijendra"
                fill
                priority
                sizes="(max-width: 768px) 256px, 288px"
                onError={() => setImageSrc("/photos/chancellor_portrait.svg")}
                className="object-cover object-top filter contrast-[1.04] brightness-[0.98] transition-transform duration-700 group-hover:scale-105"
              />

              {/* Cinematic Edge Lighting & Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0A] via-transparent to-black/20 opacity-80" />
              <div className="absolute inset-0 border border-white/5 rounded-[26px] pointer-events-none" />

              {/* Bottom Subtle Overlay Ribbon */}
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-[#0B0B0A] to-transparent text-center">
                <span className="text-[9px] font-mono tracking-[0.2em] text-[#E4C98A] uppercase">
                  Living Legacy Portrait
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 4. Chancellor Title & Visionary Inscription */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.9 }}
          className="relative z-20 mt-6 text-center space-y-2 max-w-xl"
        >
          <h2 className="font-display font-medium text-2xl sm:text-4xl md:text-5xl text-[#F5F2EA] tracking-wide leading-tight">
            KUNWAR SHEKHAR VIJENDRA
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.6, duration: 0.8 }}
            className="text-xs sm:text-sm font-ui uppercase tracking-[0.25em] text-[#C9A45C]"
          >
            Co-Founder &amp; Chancellor • Shobhit University
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.5, duration: 0.8 }}
            className="text-xs sm:text-sm text-[#9B968B] font-ui max-w-md mx-auto pt-1 leading-relaxed"
          >
            A digital journey celebrating his documented life, transformative vision, and social initiatives.
          </motion.p>
        </motion.div>
      </div>

      {/* 5. Entrance CTA & Explore Trigger */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 4.5, duration: 0.8 }}
        className="relative z-20 flex flex-col items-center space-y-3 pt-4"
      >
        <button
          id="enter-experience-btn"
          onClick={onEnterExperience}
          className="group relative px-8 py-3.5 rounded-full bg-[#121210] hover:bg-[#C9A45C] border border-[#C9A45C]/40 text-[#F5F2EA] hover:text-[#0B0B0A] font-ui text-xs sm:text-sm tracking-[0.2em] font-semibold transition-all shadow-[0_0_30px_rgba(201,164,92,0.15)] hover:shadow-[0_0_40px_rgba(201,164,92,0.4)] active:scale-95 flex items-center space-x-3 cursor-pointer"
        >
          <span>ENTER THE EXPERIENCE</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>

        <a
          href="#journey"
          className="text-[11px] font-mono text-[#9B968B] hover:text-[#E4C98A] transition-colors flex items-center gap-1 pt-1"
        >
          <span>Explore Timeline</span>
          <ArrowDown className="w-3 h-3 animate-bounce" />
        </a>
      </motion.div>

      {/* 6. Memory Node Deep-Dive Drawer / Modal */}
      <AnimatePresence>
        {activeNode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="bg-[#121210] border border-[#C9A45C]/30 rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl"
            >
              <button
                id="close-node-modal"
                onClick={() => setActiveNode(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-[#1a1917] text-[#9B968B] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-full bg-[#C9A45C]/10 border border-[#C9A45C]/30 text-[#E4C98A] font-mono text-xs font-semibold">
                    ✦ {activeNode.label}
                  </span>
                  <span className="text-xs font-mono text-[#9B968B]">
                    {activeNode.yearRange}
                  </span>
                </div>

                <h3 className="font-display font-medium text-2xl sm:text-3xl text-[#F5F2EA]">
                  {activeNode.subtitle}
                </h3>

                <p className="text-sm text-[#9B968B] leading-relaxed">
                  {activeNode.description}
                </p>

                <div className="pt-4 border-t border-white/10 space-y-1">
                  <span className="text-[11px] font-mono text-[#C9A45C] uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    Verified Archival Citation:
                  </span>
                  <p className="text-xs text-[#9B968B] italic">
                    {activeNode.citation}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
