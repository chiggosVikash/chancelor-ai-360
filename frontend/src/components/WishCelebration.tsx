"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
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
  X,
  Clock,
  Sparkles,
  Zap,
  CheckCircle2,
  Radio
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

interface LiveToast {
  id: string;
  student_name: string;
  department: string;
  message: string;
  timestamp: string;
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

  // 2-Minute Live Window State
  const TOTAL_WINDOW_SECONDS = 120;
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(120);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? `0${secs}` : secs}`;
  };
  const [windowStartTime, setWindowStartTime] = useState<number | null>(null);
  const [windowWishCount, setWindowWishCount] = useState(0);

  // Real-Time Incoming Toast Queue (max 3 visible)
  const [toasts, setToasts] = useState<LiveToast[]>([]);
  const knownWishIds = useRef<Set<string>>(new Set(wishes.map((w) => w.id)));
  const windowStartTimeRef = useRef<number | null>(null);
  windowStartTimeRef.current = windowStartTime;

  // AI Poem Generator state
  const [isGeneratingPoem, setIsGeneratingPoem] = useState(false);
  const [poemData, setPoemData] = useState<{
    title: string;
    poem_stanzas: string[];
    recitation_text: string;
    total_wishes_synthesized: number;
  } | null>(null);

  const { speak, isSpeaking, stop } = useSpeechSynthesis();

  // Watch for new wishes coming in via WebSocket or user submission
  useEffect(() => {
    const currentIds = knownWishIds.current;
    const incomingNewWishes: StudentWish[] = [];

    for (const w of wishes) {
      if (!currentIds.has(w.id)) {
        incomingNewWishes.push(w);
        currentIds.add(w.id);
      }
    }

    if (incomingNewWishes.length > 0) {
      // If 30-second window is running, increment captured count
      if (isCountdownActive) {
        setWindowWishCount((prev) => prev + incomingNewWishes.length);
      }

      // Pop the new wish into floating toast stream
      for (const wish of incomingNewWishes) {
        const toastItem: LiveToast = {
          id: wish.id,
          student_name: wish.student_name,
          department: wish.department,
          message: wish.message,
          timestamp: wish.timestamp,
        };

        setToasts((prev) => [toastItem, ...prev].slice(0, 3));

        // Auto dismiss after 4.5 seconds
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== toastItem.id));
        }, 4500);
      }
    }
  }, [wishes, isCountdownActive]);

  // Execute Tribute Synthesis
  const executePoemGeneration = useCallback(async (startEpoch?: number) => {
    setIsGeneratingPoem(true);
    try {
      const data = await generateBirthdayTribute(startEpoch);
      setPoemData(data);

      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#B8862C", "#1E2D5A", "#D4A84B", "#FAF8F4"]
      });

      // Auto-narrate the generated tribute ode
      if (data.recitation_text) {
        setTimeout(() => {
          speak(data.recitation_text);
        }, 600);
      }
    } catch (err) {
      console.error("Failed to generate tribute poem:", err);
    } finally {
      setIsGeneratingPoem(false);
    }
  }, [speak]);

  // Countdown timer effect
  useEffect(() => {
    if (!isCountdownActive) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsCountdownActive(false);
          // Automatically trigger the tribute generation with window start timestamp
          const start = windowStartTimeRef.current || undefined;
          executePoemGeneration(start);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isCountdownActive, executePoemGeneration]);

  // Launch the 30-second countdown window
  const handleStartWindow = () => {
    stop();
    const nowEpoch = Date.now() / 1000;
    setWindowStartTime(nowEpoch);
    setWindowWishCount(0);
    setSecondsLeft(TOTAL_WINDOW_SECONDS);
    setIsCountdownActive(true);

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.8 },
      colors: ["#B8862C", "#1E2D5A"]
    });
  };

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
      setTimeout(() => setSubmitSuccess(false), 3500);

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

  return (
    <section id="wishes-section" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto relative">
      {/* Floating Real-Time Incoming Wish Toasts */}
      <div className="fixed top-20 right-4 sm:right-8 z-50 flex flex-col space-y-3 pointer-events-none max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.85 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="pointer-events-auto bg-[#FAF8F4]/95 backdrop-blur-md border border-[rgba(184,134,44,0.4)] rounded-2xl p-4 shadow-xl shadow-[rgba(184,134,44,0.15)] space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-[#FDF5E4] border border-[rgba(184,134,44,0.3)] text-[#B8862C] text-[10px] font-semibold uppercase tracking-wider font-mono">
                  <Sparkles className="w-3 h-3 text-[#B8862C] animate-spin" />
                  <span>Live Tribute Incoming</span>
                </span>
                <span className="text-[10px] text-[#8B7B6F] font-mono">{toast.timestamp}</span>
              </div>
              <div className="text-xs font-bold text-[#1A1614]">{toast.student_name}</div>
              <div className="text-[11px] text-[#8B7B6F] truncate">{toast.department}</div>
              <p className="text-xs text-[#4A3F35] italic line-clamp-2 pt-1 border-t border-[rgba(26,22,20,0.06)]">
                &ldquo;{toast.message}&rdquo;
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="space-y-12">
        {/* Section Header & Stage Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[rgba(26,22,20,0.08)]">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FDF5E4] border border-[rgba(184,134,44,0.30)] text-[#B8862C] text-xs font-mono">
              <PartyPopper className="w-3.5 h-3.5" />
              <span>Real-Time Collective Tapestry</span>
            </div>
            <h2 className="font-display font-medium text-3xl sm:text-4xl text-[#1A1614]">
              Melodious Birthday Wishes...
            </h2>
            <p className="text-sm text-[#8B7B6F] font-ui max-w-xl">
              Every wish submitted by students, alumni, and faculty joins the live tribute constellation, preserved in real time.
            </p>
          </div>

          {/* Action Hub */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenQR}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-[rgba(26,22,20,0.12)] bg-white text-[#1A1614] hover:bg-[#F5F1EC] text-xs font-semibold font-ui shadow-sm transition-all"
            >
              <QrCode className="w-4 h-4 text-[#B8862C]" />
              <span>Stage QR Code</span>
            </button>

            {/* Launch 2-Min Wish Storm Button */}
            {!isCountdownActive ? (
              <button
                onClick={handleStartWindow}
                disabled={isGeneratingPoem}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B8862C] to-[#996D1E] hover:from-[#996D1E] hover:to-[#B8862C] text-white text-xs font-semibold font-ui shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                <Zap className="w-4 h-4 text-white animate-pulse" />
                <span>Launch 2-Min Live Wish Storm</span>
              </button>
            ) : (
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#1E2D5A] text-white text-xs font-mono font-semibold shadow-md animate-pulse">
                <Radio className="w-4 h-4 text-[#B8862C] animate-ping" />
                <span>Storm Active: {formatTime(secondsLeft)}</span>
              </div>
            )}

            {/* Direct Generate Button */}
            <button
              onClick={() => executePoemGeneration()}
              disabled={isGeneratingPoem || isCountdownActive}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#1E2D5A] hover:bg-[#2E4080] text-white text-xs font-semibold font-ui shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              <BookOpen className="w-4 h-4 text-[#D4A84B]" />
              <span>{isGeneratingPoem ? "Synthesizing Ode..." : "Generate Birthday Ode"}</span>
            </button>
          </div>
        </div>

        {/* 30-Second Live Window Stage Banner (visible when active) */}
        <AnimatePresence>
          {isCountdownActive && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              className="heritage-card rounded-3xl p-6 sm:p-8 border-2 border-[#B8862C] bg-gradient-to-br from-[#FDF5E4] via-[#FAF8F4] to-[#F5F1EC] shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[rgba(184,134,44,0.15)]">
                <motion.div
                  className="h-full bg-[#B8862C]"
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: TOTAL_WINDOW_SECONDS, ease: "linear" }}
                />
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center space-x-5">
                  <div className="w-16 h-16 rounded-2xl bg-[#1E2D5A] text-[#D4A84B] flex flex-col items-center justify-center font-mono font-bold shadow-inner">
                    <span className="text-xl sm:text-2xl leading-none">{formatTime(secondsLeft)}</span>
                    <span className="text-[10px] tracking-wider uppercase text-white/80">REMAINING</span>
                  </div>
                  <div className="space-y-1">
                    <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#B8862C] font-mono tracking-wider uppercase">
                      <Zap className="w-3.5 h-3.5 text-[#B8862C]" />
                      <span>Live 2-Minute Stage Storm In Progress</span>
                    </div>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-[#1A1614]">
                      Scan QR or Submit Now — Weaving Wishes into the Birthday Ode!
                    </h3>
                    <p className="text-xs text-[#8B7B6F] font-ui">
                      When this 2-minute countdown ends, AI will synthesize all audience wishes into a live commemorative anthem.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-white/80 px-4 py-2.5 rounded-2xl border border-[rgba(184,134,44,0.25)]">
                  <Heart className="w-5 h-5 text-[#B8862C] fill-[#B8862C] animate-bounce" />
                  <div className="text-left font-mono">
                    <div className="text-lg font-bold text-[#1A1614]">{windowWishCount}</div>
                    <div className="text-[10px] text-[#8B7B6F] uppercase">Captured in Window</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Grid: Wish Stream (2 cols) & Quick Submit Card (1 col) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Wishes Stream (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold text-[#8B7B6F] uppercase tracking-wider font-mono">
                Preserved Wishes ({wishes.length})
              </span>
              <span className="text-xs text-[#B8862C] font-mono">
                Persistent in SQLite Database • Auto-synced
              </span>
            </div>

            {wishes.length === 0 ? (
              <div className="p-12 text-center rounded-2xl border border-dashed border-[rgba(26,22,20,0.15)] bg-white/60">
                <Heart className="w-8 h-8 text-[#8B7B6F]/40 mx-auto mb-2" />
                <p className="text-sm text-[#8B7B6F] font-ui">
                  No wishes received yet. Be the first to congratulate the Chancellor!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[560px] overflow-y-auto pr-2 custom-scrollbar">
                {wishes.map((w, idx) => (
                  <motion.div
                    key={w.id || idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(idx * 0.04, 0.4) }}
                    className="heritage-card rounded-2xl p-5 border border-[rgba(26,22,20,0.08)] bg-white space-y-3 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <p className="text-xs sm:text-sm text-[#4A3F35] font-ui leading-relaxed italic">
                      &ldquo;{w.message}&rdquo;
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
                  placeholder="e.g. Computer Science & Engg."
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
                <div className="p-3 rounded-xl bg-[#FDF5E4] border border-[rgba(184,134,44,0.30)] text-center text-xs text-[#B8862C] font-medium font-ui flex items-center justify-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#B8862C]" />
                  <span>Your wish is now live on stage and part of the Chancellor's Ode!</span>
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
              className="bg-white border border-[rgba(184,134,44,0.35)] rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
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
                  Tribute Anthem &amp; Ode
                </span>
                <h3 className="font-display font-medium text-2xl sm:text-3xl text-[#1A1614]">
                  {poemData.title}
                </h3>
                <p className="text-xs text-[#8B7B6F] font-ui">
                  Synthesized live from {poemData.total_wishes_synthesized} student &amp; faculty greetings + Archival Milestones.
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
