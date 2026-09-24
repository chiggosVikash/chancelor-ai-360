"use client";
import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Sparkles, X, Volume2, Heart, Share2, Award, Check } from "lucide-react";
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
      triggerConfetti();
      loadTribute();
    } else {
      stop();
    }
  }, [isOpen]);

  const triggerConfetti = () => {
    const end = Date.now() + 3 * 1000;
    const colors = ["#f59e0b", "#fbbf24", "#d97706", "#ffffff", "#3b82f6"];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const loadTribute = async () => {
    setIsLoading(true);
    try {
      const data = await generateBirthdayTribute();
      setTribute(data);
      // Auto-narrate the tribute poem
      if (data.recitation_text) {
        speak(data.recitation_text);
      }
    } catch (err) {
      console.error(err);
      // Fail-safe stage fallback
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
        total_wishes_synthesized: totalWishes
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
      <div className="bg-slate-950 border-2 border-amber-500/40 rounded-3xl max-w-3xl w-full p-6 md:p-10 relative shadow-2xl shadow-amber-500/20 my-8 animate-in fade-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          id="close-tribute-modal"
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebratory Banner */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>AI Synthesized Birthday Anthem</span>
          </div>
          <h2 className="font-serif font-black text-2xl md:text-4xl text-white tracking-tight pt-1">
            {tribute ? tribute.title : "Synthesizing Birthday Anthem..."}
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto">
            {tribute ? tribute.theme : `Aggregating ${totalWishes} messages across departments into a unified poetic tribute...`}
          </p>
        </div>

        {/* Stanzas Display */}
        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 rounded-full border-3 border-amber-500 border-t-transparent animate-spin" />
            <p className="text-sm text-amber-400 font-medium">Harmonizing student wishes into verse...</p>
          </div>
        ) : tribute ? (
          <div className="space-y-6">
            <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-b from-amber-500/5 to-transparent border border-amber-500/20 divide-y divide-amber-500/10">
              {tribute.poem_stanzas.map((stanza, idx) => (
                <div key={idx} className="py-4 first:pt-0 last:pb-0 text-center">
                  <p className="font-serif text-slate-100 text-sm md:text-lg italic leading-relaxed whitespace-pre-line">
                    &ldquo;{stanza}&rdquo;
                  </p>
                </div>
              ))}
            </div>

            {/* Recitation and Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
              <div className="flex items-center space-x-2">
                <button
                  id="recite-again-btn"
                  onClick={() => speak(tribute.recitation_text)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700 text-xs font-medium transition-all"
                >
                  <Volume2 className={`w-4 h-4 ${isSpeaking ? "animate-pulse text-amber-400" : ""}`} />
                  <span>{isSpeaking ? "Reciting Anthem..." : "Play Voice Recitation"}</span>
                </button>
                <button
                  id="copy-poem-btn"
                  onClick={handleCopyPoem}
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied!" : "Copy Poem"}</span>
                </button>
              </div>

              <div className="text-xs text-slate-500 font-mono flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
                <span>{tribute.total_wishes_synthesized} Student Voices United</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
