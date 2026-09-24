"use client";
import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Heart, Sparkles, QrCode, ExternalLink, Users } from "lucide-react";
import { StudentWish, WS_BASE_URL } from "../lib/api";
import { BirthdaySurpriseModal } from "./BirthdaySurpriseModal";

interface WishConstellationProps {
  onWishCountUpdate?: (count: number) => void;
  onConnectionStatusChange?: (connected: boolean) => void;
  externalTriggerModal?: boolean;
}

export const WishConstellation: React.FC<WishConstellationProps> = ({
  onWishCountUpdate,
  onConnectionStatusChange,
}) => {
  const [wishes, setWishes] = useState<StudentWish[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setQrUrl(`${window.location.origin}/wish`);
    }
  }, []);

  // Connect WebSocket to FastAPI backend
  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: any = null;

    const connect = () => {
      try {
        ws = new WebSocket(WS_BASE_URL);

        ws.onopen = () => {
          setIsConnected(true);
          if (onConnectionStatusChange) onConnectionStatusChange(true);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.event === "INITIAL_STATE") {
              setWishes(data.wishes || []);
              if (onWishCountUpdate) onWishCountUpdate(data.total_count || 0);
            } else if (data.event === "NEW_WISH") {
              setWishes((prev) => [data.wish, ...prev]);
              if (onWishCountUpdate) onWishCountUpdate(data.total_count || 0);
            }
          } catch (e) {
            console.error("Error parsing WS message:", e);
          }
        };

        ws.onclose = () => {
          setIsConnected(false);
          if (onConnectionStatusChange) onConnectionStatusChange(false);
          reconnectTimeout = setTimeout(connect, 3000);
        };

        ws.onerror = () => {
          ws?.close();
        };
      } catch (err) {
        console.warn("WebSocket init error", err);
      }
    };

    connect();

    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (ws) ws.close();
    };
  }, [onWishCountUpdate, onConnectionStatusChange]);

  return (
    <section id="wishes" className="w-full py-16 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto border-t border-white/5">
      <div className="heritage-card rounded-3xl p-6 sm:p-10 border border-white/10 relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#C9A45C]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between pb-8 border-b border-white/5 gap-6">
          <div className="space-y-2">
            <span className="text-[10px] sm:text-xs font-mono tracking-[0.25em] text-[#C9A45C] uppercase flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-[#E4C98A]" />
              Student &amp; Faculty Tribute Wall
            </span>
            <h2 className="font-display font-medium text-3xl sm:text-4xl text-[#F5F2EA] tracking-wide">
              A SPECIAL BIRTHDAY SURPRISE
            </h2>
            <p className="text-xs sm:text-sm text-[#9B968B] font-ui max-w-xl leading-relaxed">
              Real-time birthday greetings from across Shobhit University faculties, synthesized into a unified commemorative poem.
            </p>
          </div>

          {/* Grand Reveal Anthem Button */}
          <button
            id="reveal-tribute-btn"
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3.5 rounded-full bg-[#1c1a17] hover:bg-[#C9A45C] border border-[#C9A45C]/40 text-[#E4C98A] hover:text-[#0B0B0A] font-ui text-xs sm:text-sm tracking-[0.15em] font-semibold transition-all shadow-[0_0_25px_rgba(201,164,92,0.15)] hover:shadow-[0_0_35px_rgba(201,164,92,0.4)] active:scale-95 flex items-center justify-center space-x-2.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>REVEAL BIRTHDAY TRIBUTE ANTHEM</span>
          </button>
        </div>

        {/* Main Grid: QR Code Scan Anchor + Live Community Wish Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 my-8">
          {/* Left Column: QR Code Stage Anchor */}
          <div className="lg:col-span-1 p-6 rounded-2xl bg-[#0e0e0d] border border-white/5 flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-3 bg-white rounded-2xl shadow-xl">
              {qrUrl ? (
                <QRCodeSVG
                  value={qrUrl}
                  size={150}
                  bgColor="#ffffff"
                  fgColor="#0B0B0A"
                  level="Q"
                  includeMargin={false}
                />
              ) : (
                <div className="w-36 h-36 bg-slate-800 animate-pulse rounded-xl" />
              )}
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-widest text-[#C9A45C] uppercase flex items-center justify-center gap-1">
                <QrCode className="w-3 h-3" />
                Scan via Phone
              </span>
              <p className="text-xs text-[#F5F2EA] font-medium">Send Your Birthday Wish</p>
              <p className="text-[10px] text-[#9B968B]">Live audience participation</p>
            </div>
            <a
              href="/wish"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-[#C9A45C] hover:text-[#E4C98A] flex items-center gap-1 font-mono transition-colors"
            >
              Open Mobile Portal <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Right Columns: Animated Wish Feed */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center space-x-2">
                <Users className="w-3.5 h-3.5 text-[#C9A45C]" />
                <span className="text-[11px] font-mono text-[#9B968B] uppercase tracking-wider">
                  Live Community Wishes ({wishes.length})
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#E4C98A] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E4C98A] animate-ping" />
                <span>{isConnected ? "Live WebSocket Active" : "Connecting Hub..."}</span>
              </span>
            </div>

            {/* Scrollable List */}
            <div className="max-h-[340px] overflow-y-auto space-y-2.5 pr-2">
              {wishes.map((w, idx) => (
                <div
                  key={w.id || idx}
                  className="p-4 rounded-2xl bg-[#0e0e0d] border border-white/5 hover:border-[#C9A45C]/30 transition-all flex items-start space-x-3.5"
                >
                  {/* Subtle initial badge */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#0B0B0A] font-mono font-bold text-xs shrink-0"
                    style={{ backgroundColor: w.avatar_color || "#C9A45C" }}
                  >
                    {w.student_name.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-medium text-[#F5F2EA]">{w.student_name}</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1a1917] border border-white/5 text-[#9B968B]">
                        {w.department}
                      </span>
                    </div>
                    <p className="font-display italic text-xs sm:text-sm text-[#F5F2EA]/90 leading-relaxed">
                      &ldquo;{w.message}&rdquo;
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal for Poem Anthem */}
        <BirthdaySurpriseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          totalWishes={wishes.length}
        />
      </div>
    </section>
  );
};
