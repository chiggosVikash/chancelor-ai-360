"use client";
import React from "react";
import { Sparkles, Volume2, VolumeX, QrCode, Radio } from "lucide-react";

interface HeaderProps {
  isVoiceEnabled: boolean;
  onToggleVoice: () => void;
  onOpenQR: () => void;
  isConnected: boolean;
  totalWishes: number;
}

export const Header: React.FC<HeaderProps> = ({
  isVoiceEnabled,
  onToggleVoice,
  onOpenQR,
  isConnected,
  totalWishes,
}) => {
  return (
    <header className="w-full border-b border-amber-500/20 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand & Emblem */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-400/40">
            <span className="font-serif font-black text-slate-950 text-xl tracking-tighter">SU</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-serif font-bold text-2xl tracking-tight text-white flex items-center gap-2">
                CHANCELLOR <span className="gold-gradient-text">AI 360</span>
              </h1>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                Tribute Edition
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Shobhit University • Honoring Hon'ble Chancellor Kunwar Shekhar Vijendra
            </p>
          </div>
        </div>

        {/* Live Controls & Badges */}
        <div className="flex items-center space-x-3">
          {/* Live Sync Indicator */}
          <div
            id="header-live-badge"
            className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs"
          >
            <Radio
              className={`w-3.5 h-3.5 ${
                isConnected ? "text-emerald-400 animate-pulse" : "text-amber-500"
              }`}
            />
            <span className={isConnected ? "text-emerald-400" : "text-amber-400"}>
              {isConnected ? "Stage Live Hub" : "Connecting..."}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300 font-medium">{totalWishes} Wishes</span>
          </div>

          {/* Voice Narration Toggle */}
          <button
            id="header-toggle-voice-btn"
            onClick={onToggleVoice}
            className={`p-2.5 rounded-xl border transition-all ${
              isVoiceEnabled
                ? "bg-amber-500/10 border-amber-500/40 text-amber-400 hover:bg-amber-500/20"
                : "bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300"
            }`}
            title={isVoiceEnabled ? "Voice narration active (Click to mute)" : "Voice narration muted (Click to unmute)"}
          >
            {isVoiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* QR Code Trigger for Audience */}
          <button
            id="header-open-qr-btn"
            onClick={onOpenQR}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-sm transition-all shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Send Wish (QR)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
