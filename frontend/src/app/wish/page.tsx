"use client";
import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Heart, Sparkles, Send, CheckCircle2, ArrowLeft, School } from "lucide-react";
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

const AVATAR_COLORS = ["#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#EC4899", "#06B6D4"];

export default function WishPortalPage() {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedColor, setSelectedColor] = useState(AVATAR_COLORS[0]);

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
      });

      setIsSuccess(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#f59e0b", "#fbbf24", "#ffffff", "#3b82f6"],
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
    <main className="min-h-screen bg-[#040914] text-slate-100 p-4 md:p-8 flex flex-col justify-between max-w-lg mx-auto">
      {/* Brand Header */}
      <div className="pt-4 pb-6 text-center space-y-2">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/25 border border-amber-400/40">
          <span className="font-serif font-black text-slate-950 text-2xl">SU</span>
        </div>
        <div>
          <h1 className="font-serif font-bold text-2xl text-white">
            Send Birthday Wishes
          </h1>
          <p className="text-xs text-amber-300 font-medium">
            To Hon&apos;ble Chancellor Kunwar Shekhar Vijendra
          </p>
          <p className="text-[11px] text-slate-400">Shobhit University Birthday Celebration</p>
        </div>
      </div>

      {/* Main Card Container */}
      <div className="glass-panel rounded-3xl p-6 border border-amber-500/20 shadow-2xl relative">
        {isSuccess ? (
          <div className="py-10 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h2 className="font-serif font-bold text-2xl text-white">Thank You, {name}!</h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                Your birthday tribute has been broadcast live to the main celebration screen!
              </p>
            </div>
            <div className="pt-4 space-y-2">
              <button
                id="send-another-wish-btn"
                onClick={handleReset}
                className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20"
              >
                Send Another Wish
              </button>
              <Link
                href="/"
                className="block text-xs text-slate-400 hover:text-amber-300 transition-colors pt-2"
              >
                Return to Chancellor AI 360 Presentation
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Student Name */}
            <div>
              <label htmlFor="student-name-input" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Your Full Name <span className="text-amber-400">*</span>
              </label>
              <input
                id="student-name-input"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                className="w-full bg-slate-900/90 border border-slate-800 focus:border-amber-500/60 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all"
              />
            </div>

            {/* Department */}
            <div>
              <label htmlFor="department-select" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Faculty / Department
              </label>
              <select
                id="department-select"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-800 focus:border-amber-500/60 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none transition-all"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept} className="bg-slate-950 text-slate-100">
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Avatar Color Picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Choose Badge Color
              </label>
              <div className="flex items-center space-x-2.5">
                {AVATAR_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`w-7 h-7 rounded-full transition-transform ${
                      selectedColor === c ? "scale-125 ring-2 ring-white ring-offset-2 ring-offset-[#040914]" : "opacity-70"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {/* Birthday Wish Message */}
            <div>
              <label htmlFor="wish-message-input" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Your Birthday Tribute <span className="text-amber-400">*</span>
              </label>
              <textarea
                id="wish-message-input"
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your appreciation, memories, or prayers for Chancellor Sir..."
                className="w-full bg-slate-900/90 border border-slate-800 focus:border-amber-500/60 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all resize-none"
              />
            </div>

            {/* Quick Templates */}
            <div>
              <span className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                Quick Template Taps:
              </span>
              <div className="space-y-1.5">
                {SAMPLE_WISHES.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setMessage(sample)}
                    className="w-full text-left text-[11px] p-2 rounded-lg bg-slate-900/60 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500/30 text-slate-300 hover:text-amber-300 transition-all line-clamp-1"
                  >
                    &ldquo;{sample}&rdquo;
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="submit-wish-btn"
              type="submit"
              disabled={isSubmitting || !name.trim() || !message.trim()}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 text-slate-950 font-serif font-black text-sm tracking-wide shadow-xl shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer mt-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? "Broadcasting to Stage..." : "Send Birthday Tribute"}</span>
            </button>
          </form>
        )}
      </div>

      {/* Footer */}
      <div className="py-4 text-center text-[11px] text-slate-500">
        Shobhit University • Chancellor AI 360 Tribute Portal
      </div>
    </main>
  );
}
