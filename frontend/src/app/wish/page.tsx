"use client";

import React, { useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { Heart, Send, CheckCircle2, ArrowLeft, Sparkles, User, GraduationCap, MessageSquareHeart } from "lucide-react";

import { submitStudentWish } from "@/lib/api";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// [SOLID: SRP] — Predefined university departments and curated tribute templates
const DEPARTMENTS = [
  "B.Tech Computer Science & AI",
  "Biotechnology & Bioinformatics",
  "Ayurvedic Medicine & Surgery (BAMS)",
  "School of Law & Constitutional Studies",
  "Agriculture & Agri-Informatics",
  "Management & Business Studies",
  "Biomedical Engineering",
  "Faculty / University Staff Member",
  "Alumni / Well-Wisher",
];

const SAMPLE_WISHES = [
  "Wishing our visionary Chancellor Sir a blessed and glorious birthday! Thank you for inspiring us.",
  "Happy Birthday Sir! Your dedication to value-based education and research guides us every day.",
  "Heartfelt birthday greetings to Chancellor Kunwar Shekhar Vijendra! May you be blessed with longevity and health.",
  "Happy Birthday Sir! Thank you for bringing world-class laboratories and education to our region.",
];

const AVATAR_COLORS = ["#B8862C", "#D4A84B", "#1E2D5A", "#8B7340", "#6E695F"];

// [SOLID: SRP] — WishPortalPage manages student tribute submission, validation, and celebratory feedback
export default function WishPortalPage() {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedColor] = useState(AVATAR_COLORS[0]);
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
        particleCount: 65,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#B8862C", "#D4A84B", "#1E2D5A", "#FDF5E4"],
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
    <main className="min-h-screen bg-[#FAF8F4] text-[#1A1614] p-4 sm:p-6 flex flex-col justify-between max-w-lg mx-auto relative selection:bg-[#B8862C]/20">
      {/* Ambient background radiant glow */}
      <div 
        className="pointer-events-none absolute inset-x-0 -top-20 h-72 opacity-60"
        style={{
          background: "radial-gradient(circle at 50% 0%, rgba(184, 134, 44, 0.15) 0%, transparent 70%)"
        }}
        aria-hidden="true"
      />

      {/* Top Navigation & Brand Header */}
      <header className="pt-4 pb-5 text-center space-y-3 relative z-10">
        <div className="flex items-center justify-between mb-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#8B7B6F] hover:text-[#1E2D5A] font-ui font-medium transition-colors py-1 px-2.5 rounded-full hover:bg-stone-200/50"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Presentation</span>
          </Link>
          <Badge variant="gold" className="text-[10px] tracking-wider uppercase font-mono py-0.5 px-2.5">
            Live Tribute
          </Badge>
        </div>

        <div className="space-y-1.5">
          <span className="text-[11px] font-mono tracking-[0.25em] text-[#B8862C] uppercase font-semibold block">
            Shobhit University Tribute
          </span>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#1E2D5A] tracking-tight">
            Send Birthday Wishes
          </h1>
          <p className="text-xs sm:text-sm font-ui text-[#4A3F35] flex items-center justify-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-[#B8862C] fill-[#B8862C]" />
            <span>Hon&apos;ble Chancellor Kunwar Shekhar Vijendra</span>
          </p>
        </div>
      </header>

      {/* Main Form Card using Shadcn UI Card */}
      <Card className="rounded-3xl border border-[rgba(184,134,44,0.22)] bg-white/95 shadow-xl shadow-stone-900/5 backdrop-blur-sm relative z-10">
        {isSuccess ? (
          <CardContent className="py-10 text-center space-y-5">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#FDF5E4] text-[#B8862C] flex items-center justify-center border border-[#B8862C]/30 shadow-xs">
              <CheckCircle2 className="w-8 h-8 text-[#B8862C]" />
            </div>
            <div className="space-y-2">
              <h2 className="font-display font-bold text-2xl text-[#1E2D5A]">
                Thank You, {name}!
              </h2>
              <p className="text-xs text-[#8B7B6F] max-w-xs mx-auto font-ui leading-relaxed">
                Your birthday tribute has been broadcast live to the main auditorium presentation screen.
              </p>
            </div>
            <div className="pt-4 space-y-2.5">
              <Button
                onClick={handleReset}
                variant="gold"
                className="w-full text-xs font-semibold tracking-wider uppercase h-11"
              >
                Send Another Wish
              </Button>
              <Button
                asChild
                variant="ghost"
                className="w-full text-xs text-[#8B7B6F] hover:text-[#1E2D5A] font-ui h-9"
              >
                <Link href="/">
                  View Chancellor AI 360 Presentation →
                </Link>
              </Button>
            </div>
          </CardContent>
        ) : (
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Student Name */}
              <div className="space-y-1.5">
                <Label htmlFor="student-name-input" className="flex items-center gap-1.5 text-[#4A3F35]">
                  <User className="w-3.5 h-3.5 text-[#B8862C]" />
                  <span>Your Full Name <span className="text-[#B8862C]">*</span></span>
                </Label>
                <Input
                  id="student-name-input"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="bg-stone-50/50 hover:bg-white focus:bg-white border-stone-200 focus-visible:ring-[#B8862C] focus-visible:border-[#B8862C] text-[#1A1614] placeholder:text-[#8B7B6F]/60"
                />
              </div>

              {/* Department / Affiliation via Shadcn Select */}
              <div className="space-y-1.5">
                <Label htmlFor="department-select" className="flex items-center gap-1.5 text-[#4A3F35]">
                  <GraduationCap className="w-3.5 h-3.5 text-[#B8862C]" />
                  <span>Faculty / Affiliation</span>
                </Label>
                <Select value={department} onValueChange={(val) => setDepartment(val)}>
                  <SelectTrigger id="department-select" className="bg-stone-50/50 hover:bg-white focus:bg-white border-stone-200">
                    <SelectValue placeholder="Select faculty / affiliation" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tribute Message */}
              <div className="space-y-1.5">
                <Label htmlFor="wish-message-input" className="flex items-center gap-1.5 text-[#4A3F35]">
                  <MessageSquareHeart className="w-3.5 h-3.5 text-[#B8862C]" />
                  <span>Your Birthday Tribute <span className="text-[#B8862C]">*</span></span>
                </Label>
                <Textarea
                  id="wish-message-input"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your appreciation, gratitude, or prayers for Chancellor Sir..."
                  className="bg-stone-50/50 hover:bg-white focus:bg-white border-stone-200 focus-visible:ring-[#B8862C] focus-visible:border-[#B8862C] text-[#1A1614] placeholder:text-[#8B7B6F]/60 resize-none min-h-[105px]"
                />
              </div>

              {/* Quick Appreciation Tap Pills */}
              <div className="space-y-2 pt-1">
                <span className="flex items-center gap-1.5 text-[11px] font-mono text-[#8B7B6F] uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-[#B8862C]" />
                  <span>Quick Appreciation Taps:</span>
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  {SAMPLE_WISHES.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setMessage(sample)}
                      className="w-full text-left text-xs p-2.5 rounded-xl bg-[#FDF5E4]/80 hover:bg-[#FDF5E4] border border-[rgba(184,134,44,0.2)] hover:border-[#B8862C]/40 text-[#4A3F35] hover:text-[#1A1614] transition-all line-clamp-1 font-ui cursor-pointer shadow-2xs active:scale-[0.99]"
                    >
                      &ldquo;{sample}&rdquo;
                    </button>
                  ))}
                </div>
              </div>

              {/* Cloudflare Turnstile Verification in Light Theme */}
              <div className="pt-1">
                <TurnstileWidget onVerify={(tok) => setTurnstileToken(tok)} theme="light" />
              </div>

              {/* Submit Button using Shadcn Button */}
              <Button
                id="submit-wish-btn"
                type="submit"
                disabled={isSubmitting || !name.trim() || !message.trim()}
                className="w-full h-12 rounded-xl bg-[#1E2D5A] hover:bg-[#2E4080] text-white font-ui font-semibold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? "Broadcasting..." : "Broadcast Birthday Tribute"}</span>
              </Button>
            </form>
          </CardContent>
        )}
      </Card>

      {/* Portal Footer */}
      <footer className="py-4 text-center text-[11px] font-mono text-[#8B7B6F] relative z-10">
        Shobhit University • Chancellor AI 360 Tribute Portal
      </footer>
    </main>
  );
}
