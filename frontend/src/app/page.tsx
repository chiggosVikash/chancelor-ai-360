"use client";
import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { TalkToChancellor } from "../components/TalkToChancellor";
import { MilestoneExplorer } from "../components/MilestoneExplorer";
import { WishConstellation } from "../components/WishConstellation";
import { useSpeechSynthesis } from "../hooks/useSpeech";
import { Sparkles, Award, Quote, QrCode, X, Heart, Compass, MessageCircle, ExternalLink } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function StageHomePage() {
  const [activeTab, setActiveTab] = useState<"talk" | "journey" | "wishes">("talk");
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [totalWishes, setTotalWishes] = useState(5);
  const [isConnected, setIsConnected] = useState(true);
  const [qrUrl, setQrUrl] = useState("");

  const { isEnabled: isVoiceEnabled, toggleVoice } = useSpeechSynthesis();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setQrUrl(`${window.location.origin}/wish`);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#040914] text-slate-100 relative selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Navigation & Status Bar */}
      <Header
        isVoiceEnabled={isVoiceEnabled}
        onToggleVoice={toggleVoice}
        onOpenQR={() => setIsQrModalOpen(true)}
        isConnected={isConnected}
        totalWishes={totalWishes}
      />

      {/* Hero Tribute Banner */}
      <section className="relative px-6 py-8 md:py-12 max-w-7xl mx-auto w-full">
        <div className="glass-panel rounded-3xl p-6 md:p-10 border border-amber-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-center gap-8 relative z-10">
            {/* Chancellor Commemorative Portrait & Insignia */}
            <div className="relative shrink-0">
              <div className="w-36 h-36 md:w-44 md:h-44 rounded-3xl p-1 bg-gradient-to-br from-amber-400 via-amber-600 to-amber-900 shadow-2xl shadow-amber-500/30">
                <div className="w-full h-full rounded-[22px] bg-slate-950 flex flex-col items-center justify-center text-center p-3 border border-amber-400/40 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-950/60 to-transparent" />
                  <Award className="w-12 h-12 text-amber-400 mb-2 relative z-10" />
                  <span className="font-serif font-bold text-amber-200 text-sm tracking-wide relative z-10">
                    Kunwar Shekhar
                  </span>
                  <span className="font-serif font-black text-amber-400 text-base tracking-wider relative z-10">
                    Vijendra
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 relative z-10">
                    Hon&apos;ble Chancellor
                  </span>
                </div>
              </div>
              <div className="absolute -bottom-3 -right-2 px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-bold text-[11px] shadow-lg flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Birthday Wish
              </div>
            </div>

            {/* Visionary Introduction */}
            <div className="flex-1 space-y-3 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
                <span>Shobhit University Tribute Presentation</span>
              </div>
              <h2 className="font-serif font-extrabold text-3xl md:text-5xl text-white tracking-tight leading-tight">
                Architect of Dreams &amp; <span className="gold-gradient-text">Youth Empowerment</span>
              </h2>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-3xl">
                Co-Founder &amp; Chancellor of Shobhit University, Chairman of NICE Society, and visionary leader uniting ancient Indian medical wisdom with frontier biotechnology and artificial intelligence.
              </p>

              {/* Chancellor Quote Box */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/20 flex items-start space-x-3 text-left">
                <Quote className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p className="font-serif italic text-xs md:text-sm text-amber-100/90 leading-relaxed">
                  &ldquo;Education must not merely prepare students for a living; it must prepare them for life, grounding them in ethics, compassion, and innovation.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Feature Tabs */}
      <section className="px-6 max-w-7xl mx-auto w-full pb-4">
        <div className="flex items-center justify-center p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 max-w-xl mx-auto space-x-1.5">
          <button
            id="tab-talk"
            onClick={() => setActiveTab("talk")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs md:text-sm font-semibold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
              activeTab === "talk"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>1. Talk to Chancellor AI</span>
          </button>

          <button
            id="tab-journey"
            onClick={() => setActiveTab("journey")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs md:text-sm font-semibold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
              activeTab === "journey"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>2. Explore His Journey</span>
          </button>

          <button
            id="tab-wishes"
            onClick={() => setActiveTab("wishes")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs md:text-sm font-semibold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
              activeTab === "wishes"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>3. Birthday Surprise</span>
          </button>
        </div>
      </section>

      {/* Active Feature Demonstration Slice */}
      <main className="flex-1 px-6 pb-12 max-w-7xl mx-auto w-full space-y-8">
        {activeTab === "talk" && <TalkToChancellor />}
        {activeTab === "journey" && <MilestoneExplorer />}
        {activeTab === "wishes" && (
          <WishConstellation
            onWishCountUpdate={(count) => setTotalWishes(count)}
            onConnectionStatusChange={(connected) => setIsConnected(connected)}
          />
        )}
      </main>

      {/* QR Code Presentation Modal for Stage */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-slate-950 border-2 border-amber-500/40 rounded-3xl p-8 max-w-md w-full text-center relative shadow-2xl shadow-amber-500/20 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <button
              id="close-qr-modal"
              onClick={() => setIsQrModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                Live Audience Participation
              </span>
              <h3 className="font-serif font-bold text-2xl text-white">
                Scan to Send Birthday Wishes
              </h3>
              <p className="text-xs text-slate-400">
                Point your phone camera to submit greetings directly to Chancellor AI.
              </p>
            </div>

            <div className="p-4 bg-white rounded-3xl inline-block shadow-2xl mx-auto">
              <QRCodeSVG
                value={qrUrl}
                size={220}
                bgColor="#ffffff"
                fgColor="#040914"
                level="Q"
                includeMargin={false}
              />
            </div>

            <p className="text-xs font-mono text-amber-300 break-all bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              {qrUrl}
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950/80 px-6 py-6 text-center text-xs text-slate-500">
        <p>Chancellor AI 360 • Shobhit University Commemorative Birthday Tribute</p>
        <p className="text-[11px] text-slate-600 mt-1">Honoring Kunwar Shekhar Vijendra (Co-Founder &amp; Chancellor)</p>
      </footer>
    </div>
  );
}
