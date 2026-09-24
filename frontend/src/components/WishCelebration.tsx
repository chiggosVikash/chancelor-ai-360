"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  QrCode,
  Heart,
  Send,
  User,
  PartyPopper,
  BookOpen,
  Volume2,
  VolumeX,
  X
} from "lucide-react";
import confetti from "canvas-confetti";
import { StudentWish, generateBirthdayTribute, submitStudentWish } from "../lib/api";
import { useSpeechSynthesis } from "../hooks/useSpeech";
import { cn } from "@/lib/cn";

interface WishCelebrationProps {
  wishes: StudentWish[];
  onOpenQR: () => void;
  onWishAdded?: (wish: StudentWish) => void;
}

export const WishCelebration: React.FC<WishCelebrationProps> = ({
  wishes,
  onOpenQR,
  onWishAdded,
}) => {
  const [studentName, setStudentName] = useState("");
  const [department, setDepartment] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // AI Poem Generator state
  const [isGeneratingPoem, setIsGeneratingPoem] = useState(false);
  const [poemData, setPoemData] = useState<{
    title: string;
    poem_stanzas: string[];
    recitation_text: string;
    total_wishes_synthesized: number;
  } | null>(null);

  const { speak, isSpeaking, stop } = useSpeechSynthesis();

  const handleLocalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !message.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await submitStudentWish({
        student_name: studentName.trim(),
        department: department.trim() || "Shobhit University Student",
        message: message.trim(),
      });

      const newWish: StudentWish = {
        id: res.id || String(Date.now()),
        student_name: studentName.trim(),
        department: department.trim() || "Shobhit University",
        message: message.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      if (onWishAdded) onWishAdded(newWish);
      setStudentName("");
      setDepartment("");
      setMessage("");
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#B8862C", "#1E2D5A", "#D4A84B"]
      });
    } catch (err) {
      console.error("Failed to submit wish:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGeneratePoem = async () => {
    setIsGeneratingPoem(true);
    try {
      const data = await generateBirthdayTribute();
      setPoemData(data);

      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.5 },
        colors: ["#B8862C", "#1E2D5A", "#E4C98A", "#2E4080"]
      });

      if (data.recitation_text) {
        speak(data.recitation_text);
      }
    } catch (err) {
      console.warn("Using offline birthday synthesis fallback:", err);
      const fallbackPoem = {
        title: "Echoes of Wisdom: A Birthday Tribute",
        theme: "Educational Pioneer & Guiding Light",
        poem_stanzas: [
          "From NICE's early dawn in eighty-nine,\nYou carved a path where intellect could shine.\nThrough Gangoh's fertile soil and Meerut's ground,\nA haven where true knowledge could be found.",
          "Not just degrees you sculpted, but the soul,\nTeaching each youth to seek a noble goal.\nWith ethics as the compass, truth the guide,\nIn your warm mentorship, our dreams abide.",
          "Today the university stands as one,\nTo honor thirty-five bright circuits of the sun.\nHappy Birthday, Chancellor Sir, we proudly say,\nMay peace and boundless grace illuminate your day."
        ],
        recitation_text: "Today the university stands as one to honor thirty-five bright circuits of the sun. Happy Birthday, Chancellor Sir, we proudly say, may peace and boundless grace illuminate your day.",
        total_wishes_synthesized: wishes.length || 18,
      };
      setPoemData(fallbackPoem);
      speak(fallbackPoem.recitation_text);

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#B8862C", "#1E2D5A", "#D4A84B"]
      });
    } finally {
      setIsGeneratingPoem(false);
    }
  };

  return (
    <section id="celebrate" className="w-full py-20 px-4 sm:px-6 md:px-8 bg-white border-t border-[rgba(26,22,20,0.08)] relative">
      <div className="max-w-7xl mx-auto space-y-16">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold font-ui tracking-[0.2em] text-[#B8862C] uppercase flex items-center gap-1.5">
              <PartyPopper className="w-4 h-4 text-[#B8862C]" />
              Birthday Celebration &amp; Community Wall
            </span>
            <h2 className="font-display font-semibold text-3xl sm:text-5xl text-[#1A1614] tracking-tight">
              Greetings for Hon'ble Chancellor
            </h2>
            <p className="text-sm text-[#8B7B6F] font-ui max-w-xl leading-relaxed">
              Every wish submitted by students, alumni, and faculty joins the live tribute tapestry.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleGeneratePoem}
              disabled={isGeneratingPoem}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#B8862C] to-[#D4A84B] hover:opacity-95 text-white font-ui font-semibold text-sm shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>{isGeneratingPoem ? "Composing Birthday Poem..." : "Compose Birthday Poem"}</span>
            </button>

            <button
              onClick={onOpenQR}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#F5F1EC] hover:bg-[#EFEAE2] text-[#1E2D5A] border border-[rgba(26,22,20,0.08)] font-ui font-semibold text-sm transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>Display QR for Audience</span>
            </button>
          </div>
        </div>

        {/* Main Grid: Live Wish Constellation (Left) + Quick Submit Form (Right) */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">

          {/* Live Wish Stream (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[rgba(26,22,20,0.06)]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8B7B6F] font-ui">
                Live Greetings Feed ({wishes.length} Recorded)
              </span>
              <span className="text-xs text-[#B8862C] font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync Enabled
              </span>
            </div>

            {wishes.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-[#FAF8F4] border border-dashed border-[rgba(26,22,20,0.12)] space-y-2">
                <Heart className="w-8 h-8 text-[#B8862C] mx-auto opacity-40 animate-pulse" />
                <p className="text-sm text-[#4A3F35] font-ui font-medium">Be the first to send a birthday greeting!</p>
                <p className="text-xs text-[#8B7B6F] font-ui">Use the form or scan the QR code to submit greetings.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4 max-h-[550px] overflow-y-auto pr-1">
                {wishes.map((w, idx) => (
                  <motion.div
                    key={w.id || idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25, delay: idx * 0.05 }}
                    className="heritage-card rounded-2xl p-5 flex flex-col justify-between space-y-3"
                  >
                    <p className="text-xs sm:text-sm text-[#1A1614] font-ui italic leading-relaxed">
                      "{w.message}"
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-[rgba(26,22,20,0.06)]">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-full bg-[#1E2D5A]/10 text-[#1E2D5A] flex items-center justify-center font-bold text-xs">
                          {w.student_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-[#1A1614]">{w.student_name}</div>
                          <div className="text-[10px] text-[#8B7B6F]">{w.department}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-[#8B7B6F]">{w.timestamp}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Submit Form Card (1 col) */}
          <div className="heritage-card rounded-3xl p-6 sm:p-7 border border-[rgba(184,134,44,0.25)] bg-[#FAF8F4] space-y-5">
            <div className="space-y-1">
              <h3 className="font-display font-semibold text-xl text-[#1A1614]">
                Leave Your Birthday Wish
              </h3>
              <p className="text-xs text-[#8B7B6F] font-ui">
                Send your heartfelt tribute directly into the anniversary celebration.
              </p>
            </div>

            <form onSubmit={handleLocalSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#4A3F35] font-ui mb-1.5">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[rgba(26,22,20,0.10)] text-sm font-ui focus:outline-none focus:border-[#B8862C] text-[#1A1614]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3F35] font-ui mb-1.5">
                  Department / Organization
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Computer Science &amp; Engg."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[rgba(26,22,20,0.10)] text-sm font-ui focus:outline-none focus:border-[#B8862C] text-[#1A1614]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3F35] font-ui mb-1.5">
                  Your Message for Hon'ble Chancellor *
                </label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Wishing Hon'ble Chancellor Sir a very Happy Birthday! Thank you for inspiring us..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[rgba(26,22,20,0.10)] text-sm font-ui focus:outline-none focus:border-[#B8862C] text-[#1A1614] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !studentName.trim() || !message.trim()}
                className="w-full py-3 rounded-xl bg-[#1E2D5A] hover:bg-[#2E4080] text-white font-ui font-semibold text-xs tracking-wider uppercase transition-all shadow-md active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? "Submitting..." : "Send Birthday Greeting"}</span>
              </button>

              {submitSuccess && (
                <div className="p-3 rounded-xl bg-[#FDF5E4] border border-[rgba(184,134,44,0.30)] text-center text-xs text-[#B8862C] font-medium font-ui">
                  ✨ Thank you! Your wish has joined the tribute constellation.
                </div>
              )}
            </form>
          </div>

        </div>

      </div>

      {/* AI Birthday Poem Synthesis Modal */}
      <AnimatePresence>
        {poemData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#1A1614]/60 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 25 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 25 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="bg-white border border-[rgba(184,134,44,0.35)] rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl space-y-6"
            >
              <button
                onClick={() => {
                  stop();
                  setPoemData(null);
                }}
                className="absolute top-5 right-5 p-2 rounded-full bg-[#F5F1EC] text-[#8B7B6F] hover:text-[#1A1614] hover:bg-[#EFEAE2] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-2">
                <span className="px-3.5 py-1.5 rounded-full bg-[#FDF5E4] border border-[rgba(184,134,44,0.30)] text-[#B8862C] font-mono text-xs font-semibold inline-block">
                  Tribute Poem &amp; Ode
                </span>
                <h3 className="font-display font-medium text-2xl sm:text-3xl text-[#1A1614]">
                  {poemData.title}
                </h3>
                <p className="text-xs text-[#8B7B6F] font-ui">
                  Synthesized from {poemData.total_wishes_synthesized} student and faculty greetings.
                </p>
              </div>

              <div className="space-y-4 p-6 rounded-2xl bg-[#FAF8F4] border border-[rgba(184,134,44,0.20)] text-sm sm:text-base text-[#1A1614] font-display italic leading-relaxed">
                {poemData.poem_stanzas.map((stanza, i) => (
                  <p key={i} className="whitespace-pre-line">
                    {stanza}
                  </p>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => {
                    if (isSpeaking) {
                      stop();
                    } else if (poemData.recitation_text) {
                      speak(poemData.recitation_text);
                    }
                  }}
                  className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#FDF5E4] border border-[rgba(184,134,44,0.30)] text-[#B8862C] text-xs font-semibold font-ui transition-colors hover:bg-[#F5E8C4]"
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{isSpeaking ? "Pause Narration" : "Listen to Recitation"}</span>
                </button>

                <button
                  onClick={() => {
                    stop();
                    setPoemData(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#1E2D5A] text-white font-ui font-semibold text-xs transition-colors hover:bg-[#2E4080]"
                >
                  Close Tribute
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
