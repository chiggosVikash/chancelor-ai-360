"use client";
import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Sparkles, X, Volume2, Heart, Share2, Check } from "lucide-react";
import { BirthdayTributeResponse, generateBirthdayTribute } from "../lib/api";
import { useSpeechSynthesis } from "../hooks/useSpeech";

interface BirthdaySurpriseModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalWishes: number;
}

export const BirthdaySurpriseModal: React.FC<BirthdaySurpriseModalProps> = ({
  isOpen,
  onClose,
  totalWishes,
}) => {
  const [tribute, setTribute] = useState<BirthdayTributeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const { speak, stop, isSpeaking } = useSpeechSynthesis();

  useEffect(() => {
    if (isOpen) {
      triggerSubtleCelebration();
      loadTribute();
    } else {
      stop();
    }
  }, [isOpen]);

  const triggerSubtleCelebration = () => {
    // Elegant gold and champagne particle burst, subtle and museum-like
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#C9A45C", "#E4C98A", "#F5F2EA", "#D9C5A0"],
    });
  };

  const loadTribute = async () => {
    setIsLoading(true);
    try {
      const data = await generateBirthdayTribute();
      setTribute(data);
      if (data.recitation_text) {
        speak(data.recitation_text);
      }
    } catch (err) {
      console.error(err);
      const fallback: BirthdayTributeResponse = {
        title: "The Architect of Dreams: Birthday Tribute Anthem",
        theme: `Synthesized from ${totalWishes} heartfelt student tributes celebrating visionary mentorship`,
        poem_stanzas: [
          "With vision high and roots anchored deep in native clay,\nYou lit a flame of knowledge that illuminates our way.\nFrom nineteen-eighty-nine's first dawn of NICE's noble call,\nTo universities where dreams arise for one and all.",
          "हज़ारों ज़ेहनों को दी आपने नई परवाज़,\nसँवर रहा है मुल्क, बदल रहा है आज।\nआयुर्वेद की पावन छाँव और विज्ञान का प्रकाश,\nआपके हर कदम से बना है एक नया इतिहास।",
          "In every campus corridor, in every laboratory's light,\nYour faith in rural youth turns our darkness into bright.\nNot merely for a livelihood you taught our souls to strive,\nBut with values, honor, and courage to keep the truth alive.",
          "On this auspicious day, with hearts united, proud and true,\nYour Shobhit University family sends love and reverence to you.\nMay health, long life, and endless joy your visionary path adorn,\nBlessed is the sacred soil where our beloved Chancellor was born!"
        ],
        recitation_text: "A Special Birthday Tribute to our Hon'ble Chancellor Kunwar Shekhar Vijendra. May health, long life, and endless joy adorn your visionary path!",
        total_wishes_synthesized: totalWishes,
      };
      setTribute(fallback);
      speak(fallback.recitation_text);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPoem = () => {
    if (tribute) {
      const text = `${tribute.title}\n\n${tribute.poem_stanzas.join("\n\n")}\n\n— Dedicated to Hon'ble Chancellor Kunwar Shekhar Vijendra with ${tribute.total_wishes_synthesized} student wishes.`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      <div className="bg-[#121210] border border-[#C9A45C]/30 rounded-3xl max-w-3xl w-full p-6 md:p-10 relative shadow-[0_20px_60px_rgba(0,0,0,0.9)] my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-[#1c1a17] text-[#9B968B] hover:text-[#F5F2EA] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebratory Inscription */}
        <div className="text-center space-y-2 mb-8">
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#C9A45C] uppercase">
            A Collective Gift of Gratitude
          </span>
          <h2 className="font-display font-medium text-2xl sm:text-4xl text-[#F5F2EA] tracking-wide pt-1">
            {tribute ? tribute.title : "Synthesizing Birthday Anthem..."}
          </h2>
          <p className="text-xs text-[#9B968B] font-ui max-w-md mx-auto">
            {tribute ? tribute.theme : `Aggregating ${totalWishes} messages across faculties into a commemorative poem...`}
          </p>
        </div>

        {/* Stanzas Display */}
        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 rounded-full border-2 border-[#C9A45C] border-t-transparent animate-spin" />
            <p className="text-xs text-[#E4C98A] font-mono tracking-wider">Harmonizing student appreciation into verse...</p>
          </div>
        ) : tribute ? (
          <div className="space-y-6">
            <div className="p-6 md:p-8 rounded-2xl bg-[#0e0e0d] border border-white/5 divide-y divide-white/5">
              {tribute.poem_stanzas.map((stanza, idx) => (
                <div key={idx} className="py-4 first:pt-0 last:pb-0 text-center">
                  <p className="font-display text-[#F5F2EA] text-base sm:text-lg italic leading-relaxed whitespace-pre-line">
                    &ldquo;{stanza}&rdquo;
                  </p>
                </div>
              ))}
            </div>

            {/* Recitation and Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/5">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => speak(tribute.recitation_text)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-[#1c1a17] hover:bg-[#C9A45C] text-[#E4C98A] hover:text-[#0B0B0A] border border-[#C9A45C]/30 text-xs font-mono transition-all"
                >
                  <Volume2 className={`w-4 h-4 ${isSpeaking ? "animate-pulse" : ""}`} />
                  <span>{isSpeaking ? "Reciting Anthem..." : "Play Voice Recitation"}</span>
                </button>
                <button
                  onClick={handleCopyPoem}
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-full bg-[#121210] hover:bg-[#1c1a17] text-[#9B968B] hover:text-[#F5F2EA] border border-white/10 text-xs font-mono transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy Poem"}</span>
                </button>
              </div>

              <div className="text-xs text-[#9B968B] font-mono flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#C9A45C]" />
                <span>{tribute.total_wishes_synthesized} Student Voices United</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
