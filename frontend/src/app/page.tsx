"use client";
import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { HeroSection } from "../components/HeroSection";
import { LegacyNumbers } from "../components/LegacyNumbers";
import { JourneyTimeline } from "../components/JourneyTimeline";
import { WisdomPortal } from "../components/WisdomPortal";
import { WishCelebration } from "../components/WishCelebration";
import { Footer } from "../components/Footer";
import { useSpeechSynthesis } from "../hooks/useSpeech";
import { QRCodeSVG } from "qrcode.react";
import { X, Heart } from "lucide-react";
import { StudentWish, WS_BASE_URL, fetchWishes } from "../lib/api";

const SEED_WISHES: StudentWish[] = [
  {
    id: "seed-1",
    student_name: "Aman Tyagi",
    department: "B.Tech Computer Science (Final Year)",
    message: "Wishing Hon'ble Chancellor Sir a blessed and joyous Birthday! Thank you for establishing NICE and Shobhit University, giving students like me a launchpad for the future.",
    timestamp: "10:15 AM",
  },
  {
    id: "seed-2",
    student_name: "Dr. Meenakshi Sharma",
    department: "School of Ayurveda & Health Sciences",
    message: "Warmest birthday wishes to our visionary Chancellor. Your dedication to revitalizing integrative medicine in rural India continues to guide our clinical research daily.",
    timestamp: "10:28 AM",
  },
  {
    id: "seed-3",
    student_name: "Pooja Verma",
    department: "MBA Alumni • Class of 2021",
    message: "Happy Birthday Sir! Your leadership and constant emphasis on moral grounding alongside ambition have been the anchor of my entrepreneurial career.",
    timestamp: "11:02 AM",
  },
  {
    id: "seed-4",
    student_name: "Vikram Chaudhary",
    department: "Biotechnology Research Scholar",
    message: "Happy Birthday Hon'ble Chancellor Sir! Thank you for your tireless mentorship and for believing in research-driven higher education.",
    timestamp: "11:45 AM",
  }
];

export default function MasterStageExperience() {
  const [selectedAIQuery, setSelectedAIQuery] = useState("");
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [wishes, setWishes] = useState<StudentWish[]>(SEED_WISHES);
  const [isConnected, setIsConnected] = useState(false);

  const { isEnabled: isVoiceEnabled, toggleVoice } = useSpeechSynthesis();

  // Load existing wishes & connect WebSocket for live stream
  useEffect(() => {
    async function loadInitial() {
      try {
        const remoteWishes = await fetchWishes();
        if (remoteWishes && remoteWishes.length > 0) {
          setWishes(remoteWishes);
        }
      } catch (err) {
        console.warn("Using local seed wishes:", err);
      }
    }
    loadInitial();

    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket(WS_BASE_URL);
      ws.onopen = () => setIsConnected(true);
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.event === "INITIAL_STATE" && data.wishes) {
            setWishes(data.wishes);
          } else if (data.event === "NEW_WISH" && data.wish) {
            setWishes((prev) => [data.wish, ...prev]);
          }
        } catch (e) {
          console.error("WS Parse error:", e);
        }
      };
      ws.onclose = () => setIsConnected(false);
    } catch (err) {
      console.warn("WS Connection skipped:", err);
    }

    return () => {
      if (ws) ws.close();
    };
  }, []);

  const handleExploreJourney = () => {
    document.getElementById("journey")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleTalkToAI = () => {
    document.getElementById("wisdom")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAskAIAboutMilestone = (title: string) => {
    setSelectedAIQuery(`Tell me about ${title} and Chancellor Sir's contribution`);
    document.getElementById("wisdom")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleWishAdded = (newWish: StudentWish) => {
    setWishes((prev) => [newWish, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F4] text-[#1A1614] selection:bg-[#B8862C]/20 selection:text-[#B8862C] relative">
      {/* 1. Sticky Navigation Bar */}
      <Navbar
        isVoiceEnabled={isVoiceEnabled}
        onToggleVoice={toggleVoice}
        onOpenQR={() => setIsQrModalOpen(true)}
        isConnected={isConnected}
        totalWishes={wishes.length}
      />

      {/* 2. Hero Section — The Portrait & Vision */}
      <HeroSection
        onExploreJourney={handleExploreJourney}
        onTalkToAI={handleTalkToAI}
      />

      {/* 3. Legacy in Numbers — Animated Counters */}
      <LegacyNumbers />

      {/* 4. Chronological Journey — Milestones Carousel */}
      <JourneyTimeline
        onAskAIAboutMilestone={handleAskAIAboutMilestone}
      />

      {/* 5. Wisdom Portal — Talk to Chancellor AI */}
      <WisdomPortal
        initialQuery={selectedAIQuery}
        isVoiceEnabled={isVoiceEnabled}
      />

      {/* 6. Birthday Celebration Wall & AI Poem */}
      <WishCelebration
        wishes={wishes}
        onOpenQR={() => setIsQrModalOpen(true)}
        onWishAdded={handleWishAdded}
      />

      {/* 7. University Heritage Footer */}
      <Footer />

      {/* Stage Audience QR Code Modal */}
      {isQrModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#1A1614]/60 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="bg-white border border-[rgba(184,134,44,0.35)] rounded-3xl max-w-md w-full p-8 text-center relative shadow-2xl space-y-6">
            <button
              onClick={() => setIsQrModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#F5F1EC] text-[#8B7B6F] hover:text-[#1A1614] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#B8862C] font-ui flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8862C]" />
                Live Stage Submission
              </span>
              <h3 className="font-display font-semibold text-2xl text-[#1A1614]">
                Send Birthday Wishes
              </h3>
              <p className="text-xs text-[#8B7B6F] font-ui">
                Point your smartphone camera to submit greetings directly to Hon'ble Chancellor AI.
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl inline-block border border-[rgba(26,22,20,0.08)] shadow-lg mx-auto">
              <QRCodeSVG
                value={typeof window !== "undefined" ? `${window.location.origin}/wish` : "http://localhost:3000/wish"}
                size={200}
                bgColor="#ffffff"
                fgColor="#1A1614"
                level="Q"
                includeMargin={false}
              />
            </div>

            <p className="text-xs font-mono text-[#1E2D5A] break-all bg-[#FAF8F4] p-3 rounded-xl border border-[rgba(26,22,20,0.08)]">
              {typeof window !== "undefined" ? `${window.location.origin}/wish` : "http://localhost:3000/wish"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
