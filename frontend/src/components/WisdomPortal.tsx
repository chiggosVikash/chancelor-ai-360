"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Volume2,
  VolumeX,
  BookOpen,
  MessageSquare,
  Bot,
  User,
  Quote,
  Loader2,
  CheckCircle2,
  Mic,
  MicOff
} from "lucide-react";
import { ChatResponse, askChancellorAI } from "../lib/api";
import { useSpeechSynthesis, useSpeechRecognition } from "../hooks/useSpeech";
import { cn } from "@/lib/cn";

const PRESET_QUERIES = [
  "What inspired the founding of NICE in 1989?",
  "Tell me about your Gandhian philosophy and social work",
  "How does the 200-bed Ayurvedic hospital serve Western UP?",
  "What is the collection 'Quotes I Quote'?",
  "What are your thoughts on higher education and NEP 2020?"
];

interface WisdomPortalProps {
  initialQuery?: string;
  isVoiceEnabled?: boolean;
}

export const WisdomPortal: React.FC<WisdomPortalProps> = ({
  initialQuery = "",
  isVoiceEnabled = true,
}) => {
  const [inputText, setInputText] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState("");
  const [chatResponse, setChatResponse] = useState<ChatResponse | null>({
    answer: "Welcome to this interactive tribute. Throughout the last 35 years, our core pursuit has been singular: to ensure that knowledge is not a privilege confined to metropolitan hubs, but an empowering catalyst available to every eager mind in our villages and towns. In an age of artificial intelligence and swift technological shifts, our grounding must remain deep in values, compassion, and nation-building.",
    citations: [
      "Shobhit University Convocation Address",
      "NICE Society Archival Registry • Vol. 1",
      "Gandhi Smriti Event Archives"
    ],
    suggested_followups: [
      "What inspired the founding of NICE in 1989?",
      "Tell me about the 200-bed Ayurvedic hospital in Gangoh",
      "What is the collection 'Quotes I Quote'?"
    ]
  });

  const { speak, stop: stopSpeaking, isSpeaking, isEnabled: isVoiceActive, toggleVoice } = useSpeechSynthesis();
  const responseEndRef = useRef<HTMLDivElement>(null);

  // Speech Recognition (Microphone Voice Input)
  const { isListening, transcript, startListening, stopListening, isSupported: isMicSupported } = useSpeechRecognition(
    (finalText) => {
      if (finalText.trim()) {
        setInputText(finalText);
        handleSendQuestion(finalText);
      }
    }
  );

  useEffect(() => {
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (initialQuery) {
      handleSendQuestion(initialQuery);
    }
  }, [initialQuery]);

  const handleSendQuestion = async (queryText: string) => {
    const q = queryText.trim();
    if (!q) return;

    if (isListening) stopListening();
    setIsLoading(true);
    setLastQuery(q);
    setInputText("");

    try {
      const response = await askChancellorAI(q);
      setChatResponse(response);
      if (isVoiceEnabled && isVoiceActive) {
        speak(response.answer);
      }
    } catch (err) {
      console.warn("Using contextual tribute fallback:", err);
      const fallback: ChatResponse = {
        answer: "Hon'ble Chancellor Kunwar Shekhar Vijendra has dedicated over three decades to democratizing higher education, Gandhian values, and rural transformation in India. His guiding vision remains: 'Education must not merely prepare students for a living; it must prepare them for life, grounding them in ethics, compassion, and innovation.'",
        citations: ["Shobhit University Official Registry • Archive Record 01"],
        suggested_followups: [
          "Tell me about the university's research focus",
          "What awards and recognitions have been conferred?"
        ],
      };
      setChatResponse(fallback);
      if (isVoiceEnabled && isVoiceActive) {
        speak(fallback.answer);
      }
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        responseEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <section id="wisdom" className="w-full py-20 px-4 sm:px-6 md:px-8 bg-[#FAF8F4] relative">
      <div className="max-w-6xl mx-auto">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold font-ui bg-[#FDF5E4] text-[#B8862C] border border-[rgba(184,134,44,0.30)] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8862C]" />
            Conversational Legacy Guide
          </span>
          <h2 className="font-display font-semibold text-3xl sm:text-5xl text-[#1A1614] tracking-tight">
            Talk to Chancellor AI
          </h2>
          <p className="text-sm text-[#8B7B6F] font-ui leading-relaxed">
            Inquire hands-free or type questions about his 35-year journey from NICE 1989, Gandhian philosophy, rural healthcare, or educational vision.
          </p>
        </div>

        {/* Interactive Chat Console */}
        <div className="heritage-card rounded-3xl overflow-hidden shadow-lg border border-[rgba(26,22,20,0.08)] bg-white">
          {/* Header Bar */}
          <div className="px-6 py-4 bg-[#F5F1EC] border-b border-[rgba(26,22,20,0.08)] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#1E2D5A] flex items-center justify-center text-white shadow-sm">
                <Bot className="w-5 h-5 text-[#D4A84B]" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-base text-[#1A1614]">
                  Chancellor AI · Digital Archivist
                </h3>
                <span className="text-xs text-[#8B7B6F] font-ui flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  Powered by OpenRouter &amp; Shobhit Knowledge Base
                </span>
              </div>
            </div>

            {/* Audio Waveform / Voice Status */}
            <div className="flex items-center space-x-2">
              {isSpeaking && (
                <div className="flex items-end space-x-1 h-5 px-3 py-1 bg-[#FDF5E4] rounded-full border border-[rgba(184,134,44,0.30)]">
                  <div className="w-1 bg-[#B8862C] rounded-full wave-1" />
                  <div className="w-1 bg-[#B8862C] rounded-full wave-2" />
                  <div className="w-1 bg-[#B8862C] rounded-full wave-3" />
                  <div className="w-1 bg-[#B8862C] rounded-full wave-4" />
                </div>
              )}
              <button
                onClick={() => {
                  if (isSpeaking) stopSpeaking();
                  toggleVoice();
                }}
                className={cn(
                  "p-2.5 rounded-xl border text-xs font-ui transition-all flex items-center gap-1.5",
                  isVoiceActive
                    ? "bg-[#FDF5E4] border-[rgba(184,134,44,0.30)] text-[#B8862C]"
                    : "bg-white border-[rgba(26,22,20,0.08)] text-[#8B7B6F]"
                )}
                title={isVoiceActive ? "Mute audio narration" : "Enable voice narration"}
              >
                {isVoiceActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span className="hidden sm:inline font-medium">
                  {isVoiceActive ? (isSpeaking ? "Speaking" : "Voice On") : "Voice Muted"}
                </span>
              </button>
            </div>
          </div>

          {/* Dialogue Conversation Space */}
          <div className="p-6 sm:p-8 space-y-6 max-h-[500px] overflow-y-auto bg-gradient-to-b from-[#FAF8F4]/50 to-white">
            {/* User Question */}
            {lastQuery && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start justify-end space-x-3"
              >
                <div className="bg-[#1E2D5A] text-white p-4 rounded-2xl rounded-tr-none max-w-lg shadow-sm text-sm font-ui leading-relaxed">
                  {lastQuery}
                </div>
                <div className="w-8 h-8 rounded-full bg-[#1E2D5A]/10 flex items-center justify-center text-[#1E2D5A] flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
              </motion.div>
            )}

            {/* AI Response */}
            {isLoading ? (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#FDF5E4] flex items-center justify-center text-[#B8862C] flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-[rgba(26,22,20,0.08)] p-5 rounded-2xl rounded-tl-none max-w-2xl shadow-sm flex items-center space-x-3">
                  <Loader2 className="w-4 h-4 text-[#B8862C] animate-spin" />
                  <span className="text-xs font-ui text-[#8B7B6F]">
                    Consulting Shobhit University Archives &amp; verified addresses...
                  </span>
                </div>
              </div>
            ) : chatResponse && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="flex items-start space-x-3"
              >
                <div className="w-8 h-8 rounded-full bg-[#FDF5E4] border border-[rgba(184,134,44,0.30)] flex items-center justify-center text-[#B8862C] flex-shrink-0">
                  <Quote className="w-4 h-4" />
                </div>
                <div className="space-y-4 max-w-2xl">
                  {/* Response bubble */}
                  <div className="bg-white border border-[rgba(184,134,44,0.20)] p-6 rounded-2xl rounded-tl-none shadow-sm text-sm sm:text-base text-[#1A1614] font-ui leading-relaxed">
                    <p className="whitespace-pre-line">{chatResponse.answer}</p>

                    {/* Citations footer */}
                    {chatResponse.citations && chatResponse.citations.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-[rgba(26,22,20,0.06)] flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-mono text-[#B8862C] uppercase tracking-wider font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-[#B8862C]" /> Source Citations:
                        </span>
                        {chatResponse.citations.map((cite, i) => (
                          <span
                            key={i}
                            className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#FAF8F4] text-[#8B7B6F] border border-[rgba(26,22,20,0.06)] font-ui"
                          >
                            {cite}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Follow-up suggestions */}
                  {chatResponse.suggested_followups && chatResponse.suggested_followups.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="text-xs text-[#8B7B6F] self-center">Follow up:</span>
                      {chatResponse.suggested_followups.map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendQuestion(suggestion)}
                          className="text-xs px-3 py-1.5 rounded-full bg-white hover:bg-[#FDF5E4] text-[#4A3F35] hover:text-[#B8862C] border border-[rgba(26,22,20,0.08)] hover:border-[rgba(184,134,44,0.30)] transition-all font-ui shadow-sm active:scale-95"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            <div ref={responseEndRef} />
          </div>

          {/* Quick Questions Row */}
          <div className="px-6 py-3 bg-[#FAF8F4] border-t border-[rgba(26,22,20,0.06)] flex items-center space-x-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] text-[#8B7B6F] font-semibold uppercase tracking-wider flex-shrink-0">
              Suggested:
            </span>
            {PRESET_QUERIES.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSendQuestion(preset)}
                className="text-xs px-3 py-1 rounded-full bg-white hover:bg-[#FDF5E4] text-[#4A3F35] hover:text-[#B8862C] border border-[rgba(26,22,20,0.08)] whitespace-nowrap transition-colors flex-shrink-0 active:scale-95 shadow-sm"
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Input Bar with Mic Input & Send */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuestion(inputText);
            }}
            className="p-4 sm:p-5 bg-white border-t border-[rgba(26,22,20,0.08)] flex items-center space-x-3"
          >
            {/* Microphone Voice Input Toggle */}
            <button
              type="button"
              onClick={() => {
                if (isListening) {
                  stopListening();
                } else {
                  startListening();
                }
              }}
              className={cn(
                "p-3 rounded-xl border transition-all flex items-center justify-center flex-shrink-0",
                isListening
                  ? "bg-rose-500 text-white border-rose-600 animate-pulse shadow-md shadow-rose-500/20"
                  : "bg-[#FAF8F4] text-[#4A3F35] border-[rgba(26,22,20,0.08)] hover:bg-[#FDF5E4] hover:text-[#B8862C]"
              )}
              title={isListening ? "Listening... (Click to stop)" : "Speak via Microphone (Hands-free)"}
            >
              {isListening ? <Mic className="w-5 h-5 animate-bounce" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isListening ? "Listening to your voice on stage..." : "Ask Hon'ble Chancellor AI anything about his journey, vision, or advice..."}
              disabled={isLoading}
              className={cn(
                "flex-1 text-sm font-ui px-4 py-3 rounded-xl border transition-all",
                isListening
                  ? "bg-rose-50/50 border-rose-300 text-rose-950 placeholder-rose-400"
                  : "bg-[#FAF8F4] text-[#1A1614] placeholder-[#8B7B6F] border-[rgba(26,22,20,0.08)] focus:outline-none focus:border-[#B8862C] focus:ring-2 focus:ring-[#B8862C]/15"
              )}
            />

            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="p-3 rounded-xl bg-[#1E2D5A] hover:bg-[#2E4080] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md active:scale-95 flex-shrink-0"
              title="Send Inquiry"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>

      </div>
    </section>
  );
};
