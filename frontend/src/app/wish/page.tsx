"use client";
import { TurnstileWidget } from "../../components/TurnstileWidget";
import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Heart, Send, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { submitStudentWish } from "../../lib/api";

const DEPARTMENTS = [
  "B.Tech Computer Science & AI",
  "Biotechnology & Bioinformatics",
  "Ayurvedic Medicine & Surgery (BAMS)",
  "School of Law & Constitutional Studies",
  "Agriculture & Agri-Informatics",
  "Management & Business Studies",
  "Biomedical Engineering",
  "Faculty / University Staff Member",
  "Alumni / Well-Wisher"
];

const SAMPLE_WISHES = [
  "Wishing our visionary Chancellor Sir a blessed and glorious birthday! Thank you for inspiring us.",
  "Happy Birthday Sir! Your dedication to value-based education and research guides us every day.",
  "Heartfelt birthday greetings to Chancellor Kunwar Shekhar Vijendra! May you be blessed with longevity and health.",
  "Happy Birthday Sir! Thank you for bringing world-class laboratories and education to our region."
];

const AVATAR_COLORS = ["#C9A45C", "#E4C98A", "#8B7340", "#6E695F", "#9B7A38"];

export default function WishPortalPage() {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedColor, setSelectedColor] = useState(AVATAR_COLORS[0]);
  const [turnstileToken, setTurnstileToken] = useState<string>("default_pass_token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);
    try {
      await submitStudentWish({
        student_name: name.trim(),
        department: department,
        message: message.trim(),
        avatar_color: selectedColor,
        turnstile_token: turnstileToken,
      });

      setIsSuccess(true);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#C9A45C", "#E4C98A", "#F5F2EA"],
      });
    } catch (err) {
      console.error(err);
      alert("Could not submit wish. Please check your network connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName("");
    setMessage("");
    setIsSuccess(false);
  };

  return (
    <main className="min-h-screen bg-[#0B0B0A] text-[#F5F2EA] p-4 sm:p-6 flex flex-col justify-between max-w-lg mx-auto">
      {/* Brand Header */}
      <div className="pt-6 pb-4 text-center space-y-2">
        <span className="text-[10px] font-mono tracking-[0.25em] text-[#C9A45C] uppercase">
          Shobhit University Tribute
        </span>
        <h1 className="font-display font-medium text-2xl sm:text-3xl text-[#F5F2EA] tracking-wide">
          SEND BIRTHDAY WISHES
        </h1>
        <p className="text-xs font-mono text-[#E4C98A]">
          Hon&apos;ble Chancellor Kunwar Shekhar Vijendra
        </p>
      </div>

      {/* Main Form Card */}
      <div className="heritage-card rounded-3xl p-6 sm:p-8 border border-white/10 relative shadow-2xl">
        {isSuccess ? (
          <div className="py-10 text-center space-y-5">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#1c1a17] text-[#C9A45C] flex items-center justify-center border border-[#C9A45C]/30">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h2 className="font-display font-medium text-2xl text-[#F5F2EA]">Thank You, {name}</h2>
              <p className="text-xs text-[#9B968B] max-w-xs mx-auto font-ui leading-relaxed">
                Your birthday tribute has been broadcast live to the main auditorium screen.
              </p>
            </div>
            <div className="pt-4 space-y-2">
              <button
                onClick={handleReset}
                className="w-full py-3 rounded-full bg-[#C9A45C] hover:bg-[#E4C98A] text-[#0B0B0A] font-ui text-xs font-semibold tracking-wider transition-all"
              >
                Send Another Wish
              </button>
              <Link
                href="/"
                className="block text-xs text-[#9B968B] hover:text-[#E4C98A] transition-colors pt-2 font-mono"
              >
                View Chancellor AI 360 Presentation →
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Student Name */}
            <div>
              <label htmlFor="student-name-input" className="block text-xs font-mono text-[#9B968B] mb-1.5 uppercase tracking-wider">
                Your Full Name <span className="text-[#C9A45C]">*</span>
              </label>
              <input
                id="student-name-input"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                className="w-full bg-[#0e0e0d] border border-white/10 focus:border-[#C9A45C]/60 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#F5F2EA] placeholder-[#9B968B]/50 focus:outline-none transition-all font-ui"
              />
            </div>

            {/* Department */}
            <div>
              <label htmlFor="department-select" className="block text-xs font-mono text-[#9B968B] mb-1.5 uppercase tracking-wider">
                Faculty / Affiliation
              </label>
              <select
                id="department-select"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-[#0e0e0d] border border-white/10 focus:border-[#C9A45C]/60 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#F5F2EA] focus:outline-none transition-all font-ui"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept} className="bg-[#121210] text-[#F5F2EA]">
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Tribute Message */}
            <div>
              <label htmlFor="wish-message-input" className="block text-xs font-mono text-[#9B968B] mb-1.5 uppercase tracking-wider">
                Your Birthday Tribute <span className="text-[#C9A45C]">*</span>
              </label>
              <textarea
                id="wish-message-input"
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your appreciation, gratitude, or prayers for Chancellor Sir..."
                className="w-full bg-[#0e0e0d] border border-white/10 focus:border-[#C9A45C]/60 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#F5F2EA] placeholder-[#9B968B]/50 focus:outline-none transition-all font-ui resize-none"
              />
            </div>

            {/* Quick Templates */}
            <div>
              <span className="block text-[10px] font-mono text-[#9B968B] mb-1.5 uppercase tracking-wider">
                Quick Appreciation Taps:
              </span>
              <div className="space-y-1.5">
                {SAMPLE_WISHES.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setMessage(sample)}
                    className="w-full text-left text-[11px] p-2 rounded-lg bg-[#0e0e0d] hover:bg-[#1c1a17] border border-white/5 hover:border-[#C9A45C]/30 text-[#9B968B] hover:text-[#E4C98A] transition-all line-clamp-1 font-ui"
                  >
                    &ldquo;{sample}&rdquo;
                  </button>
                ))}
              </div>
            </div>

            {/* Cloudflare Turnstile Human Verification */}
            <TurnstileWidget onVerify={(tok) => setTurnstileToken(tok)} theme="dark" />

            {/* Submit Button */}
            <button
              id="submit-wish-btn"
              type="submit"
              disabled={isSubmitting || !name.trim() || !message.trim()}
              className="w-full py-3.5 rounded-full bg-[#C9A45C] hover:bg-[#E4C98A] disabled:opacity-30 text-[#0B0B0A] font-ui font-semibold text-xs tracking-widest uppercase transition-all shadow-lg active:scale-95 flex items-center justify-center space-x-2 cursor-pointer mt-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Broadcasting..." : "Broadcast Birthday Tribute"}</span>
            </button>
          </form>
        )}
      </div>

      {/* Footer */}
      <div className="py-4 text-center text-[10px] font-mono text-[#9B968B]/60">
        Shobhit University • Chancellor AI 360 Tribute Portal
      </div>
    </main>
  );
}
