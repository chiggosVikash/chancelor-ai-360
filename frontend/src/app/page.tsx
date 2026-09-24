"use client";
import React, { useState } from "react";
import { Header } from "../components/Header";
import { HeroMasterpiece } from "../components/HeroMasterpiece";
import { HorizontalJourneyTimeline } from "../components/HorizontalJourneyTimeline";
import { TalkToChancellor } from "../components/TalkToChancellor";
import { WishConstellation } from "../components/WishConstellation";
import { useSpeechSynthesis } from "../hooks/useSpeech";
import { QRCodeSVG } from "qrcode.react";
import { X, Sparkles, Heart } from "lucide-react";

export default function MasterStageExperience() {
  const [selectedAIQuery, setSelectedAIQuery] = useState("");
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [totalWishes, setTotalWishes] = useState(5);
  const [isConnected, setIsConnected] = useState(true);

  const { isEnabled: isVoiceEnabled, toggleVoice } = useSpeechSynthesis();

  const handleEnterExperience = () => {
    const journeyEl = document.getElementById("journey");
    if (journeyEl) {
      journeyEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleAskAIAboutMilestone = (title: string) => {
    setSelectedAIQuery(`Tell me about ${title} and Chancellor Sir's contribution`);
    const talkEl = document.getElementById("talk-ai");
    if (talkEl) {
      talkEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0B0A] text-[#F5F2EA] relative">
      {/* 1. Elegant Header & Stage Controller */}
      <Header
        isVoiceEnabled={isVoiceEnabled}
        onToggleVoice={toggleVoice}
        onOpenQR={() => setIsQrModalOpen(true)}
        isConnected={isConnected}
        totalWishes={totalWishes}
      />

      {/* 2. Hero — The 3D Masterpiece: The Chancellor at the Center of His Legacy */}
      <HeroMasterpiece onEnterExperience={handleEnterExperience} />

      {/* 3. Horizontal Journey Timeline (PAST ────→ PRESENT) */}
      <HorizontalJourneyTimeline
        onAskAIAboutMilestone={handleAskAIAboutMilestone}
      />

      {/* 4. AI Feature 01 — Talk to Chancellor AI (Voice + Citations) */}
      <TalkToChancellor initialQuery={selectedAIQuery} />

      {/* 5. AI Feature 03 — A Special Birthday Surprise (Live Wish Wall + Poem Anthem) */}
      <WishConstellation
        onWishCountUpdate={(count) => setTotalWishes(count)}
        onConnectionStatusChange={(connected) => setIsConnected(connected)}
      />

      {/* 6. On-Stage QR Code Fullscreen Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#121210] border border-[#C9A45C]/40 rounded-3xl p-8 max-w-md w-full text-center relative shadow-[0_20px_60px_rgba(0,0,0,0.9)] space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsQrModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#1c1a17] text-[#9B968B] hover:text-[#F5F2EA] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-[0.2em] text-[#C9A45C] uppercase">
                Auditorium Participation
              </span>
              <h3 className="font-display font-medium text-2xl text-[#F5F2EA]">
                Scan to Send Birthday Wishes
              </h3>
              <p className="text-xs text-[#9B968B]">
                Point your phone camera to submit greetings directly to Chancellor AI.
              </p>
            </div>

            <div className="p-4 bg-white rounded-3xl inline-block shadow-2xl mx-auto">
              <QRCodeSVG
                value={typeof window !== "undefined" ? `${window.location.origin}/wish` : "http://localhost:3000/wish"}
                size={220}
                bgColor="#ffffff"
                fgColor="#0B0B0A"
                level="Q"
                includeMargin={false}
              />
            </div>

            <p className="text-xs font-mono text-[#E4C98A] break-all bg-[#0e0e0d] p-3 rounded-xl border border-white/5">
              {typeof window !== "undefined" ? `${window.location.origin}/wish` : "http://localhost:3000/wish"}
            </p>
          </div>
        </div>
      )}

      {/* 7. Heritage Footer */}
      <footer className="w-full border-t border-white/5 bg-[#0B0B0A] px-6 py-8 text-center text-xs text-[#9B968B] font-ui space-y-1">
        <p className="font-display text-sm text-[#F5F2EA]">
          CHANCELLOR AI 360 • A Digital Tribute to Kunwar Shekhar Vijendra
        </p>
        <p className="text-[11px] text-[#9B968B]/70">
          Shobhit University • Meerut &amp; Gangoh • Celebrating Vision, Mentorship &amp; Education
        </p>
      </footer>
    </div>
  );
}
