"use client";
import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Heart, Sparkles, QrCode, MessageSquare, Send, Users, ExternalLink } from "lucide-react";
import { StudentWish, WS_BASE_URL } from "../lib/api";
import { BirthdaySurpriseModal } from "./BirthdaySurpriseModal";

interface WishConstellationProps {
  onWishCountUpdate?: (count: number) => void;
  onConnectionStatusChange?: (connected: boolean) => void;
  externalTriggerModal?: boolean;
  onResetExternalTrigger?: () => void;
}

export const WishConstellation: React.FC<WishConstellationProps> = ({
  onWishCountUpdate,
  onConnectionStatusChange,
  externalTriggerModal,
  onResetExternalTrigger,
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

  useEffect(() => {
    if (externalTriggerModal) {
      setIsModalOpen(true);
      if (onResetExternalTrigger) onResetExternalTrigger();
    }
  }, [externalTriggerModal, onResetExternalTrigger]);

  // Connect WebSocket to FastAPI
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
          // Try reconnect in 3s
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
    <section className="w-full glass-panel rounded-3xl p-6 md:p-8 border border-amber-500/20 relative overflow-hidden">
      {/* Decorative ambient lighting */}
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header and Grand Reveal Trigger */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-slate-800 gap-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400">
              <Heart className="w-5 h-5 fill-pink-500/30" />
            </span>
            <h2 className="text-xl md:text-2xl font-serif font-bold text-white tracking-wide">
              Live Wish Constellation & Birthday Surprise
            </h2>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Real-time messages from students, faculty, and well-wishers synthesized by AI into a grand celebratory tribute.
          </p>
        </div>

        {/* Grand Reveal Anthem Button */}
        <button
          id="reveal-tribute-btn"
          onClick={() => setIsModalOpen(true)}
          className="group relative inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 font-serif font-black text-sm md:text-base tracking-wide shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <Sparkles className="w-5 h-5 mr-2 animate-bounce" />
          <span>Reveal Birthday Tribute Anthem</span>
        </button>
      </div>

      {/* Main Grid: QR Code Scan Hub + Live Wish Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 my-6">
        {/* Left Column: QR Code Stage Anchor */}
        <div className="lg:col-span-1 glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4 border border-amber-500/30">
          <div className="p-3 bg-white rounded-2xl shadow-xl shadow-amber-500/20">
            {qrUrl ? (
              <QRCodeSVG
                value={qrUrl}
                size={160}
                bgColor="#ffffff"
                fgColor="#040914"
                level="Q"
                includeMargin={false}
              />
            ) : (
              <div className="w-40 h-40 bg-slate-200 animate-pulse rounded-xl" />
            )}
          </div>
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center justify-center gap-1">
              <QrCode className="w-3.5 h-3.5" />
              Scan on Phone
            </span>
            <p className="text-xs text-slate-300 font-medium">Send Your Birthday Wish</p>
            <p className="text-[11px] text-slate-500">Live audience participation</p>
          </div>
          <a
            href="/wish"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-amber-400 hover:text-amber-300 underline flex items-center gap-1 font-mono"
          >
            Open portal link <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Right Columns: Animated Wish Feed & Constellation */}
        <div className="lg:col-span-3 space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Live Community Wishes ({wishes.length})
              </span>
            </div>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              Real-time WebSocket active
            </span>
          </div>

          {/* Cards Scroll Container */}
          <div className="max-h-[380px] overflow-y-auto space-y-3 pr-1">
            {wishes.map((w, idx) => (
              <div
                key={w.id || idx}
                className="glass-card rounded-2xl p-4.5 border border-slate-800 hover:border-amber-500/40 transition-all flex items-start space-x-3.5"
              >
                {/* Avatar Badge */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-950 font-bold text-sm shrink-0 shadow-md"
                  style={{ backgroundColor: w.avatar_color || "#f59e0b" }}
                >
                  {w.student_name.charAt(0).toUpperCase()}
                </div>

                {/* Wish Content */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-slate-100">{w.student_name}</h4>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                      {w.department}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    &ldquo;{w.message}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grand Birthday Surprise Modal */}
      <BirthdaySurpriseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        totalWishes={wishes.length}
      />
    </section>
  );
};
