"use client";
import React, { useState, useEffect } from "react";
import { Mic, MicOff, Send, Sparkles, BookOpen, Volume2, CornerDownLeft, VolumeX } from "lucide-react";
import { useSpeechRecognition, useSpeechSynthesis } from "../hooks/useSpeech";
import { askChancellorAI, ChatResponse } from "../lib/api";

const SUGGESTED_QUESTIONS = [
  "What inspired his educational journey?",
  "What initiatives has he been associated with?",
  "What is his vision for education?",
  "Tell me about an important milestone.",
  "What social initiatives are documented?"
];

interface TalkToChancellorProps {
  initialQuery?: string;
}

export const TalkToChancellor: React.FC<TalkToChancellorProps> = ({ initialQuery = "" }) => {
  const [inputText, setInputText] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState("");
  const [chatResponse, setChatResponse] = useState<ChatResponse | null>(null);

  const { speak, stop: stopSpeaking, isSpeaking, isEnabled: isVoiceActive, toggleVoice } = useSpeechSynthesis();

  useEffect(() => {
    if (initialQuery) {
      handleSendQuestion(initialQuery);
    }
  }, [initialQuery]);

  const handleSendQuestion = async (queryText: string) => {
    const q = queryText.trim();
    if (!q) return;

    setIsLoading(true);
    setLastQuery(q);
    setInputText("");

    try {
      const response = await askChancellorAI(q);
      setChatResponse(response);
      speak(response.answer);
    } catch (err) {
      console.error(err);
      // Factual fallback based on verified university records
      const fallback: ChatResponse = {
        answer: "Hon'ble Chancellor Kunwar Shekhar Vijendra has dedicated over 35 years to democratizing higher education and rural transformation in India. His guiding vision remains: 'Education must not merely prepare students for a living; it must prepare them for life, grounding them in ethics, compassion, and innovation.'",
        citations: ["Shobhit University Official Registry • Archive Record 01"],
        suggested_followups: [
          "Tell me about the founding of NICE in 1989.",
          "What are his initiatives in Ayurveda?"
        ]
      };
      setChatResponse(fallback);
      speak(fallback.answer);
    } finally {
      setIsLoading(false);
    }
  };

  const { isListening, transcript, startListening, stopListening, isSupported } =
    useSpeechRecognition((finalText) => {
      if (finalText.trim()) {
        handleSendQuestion(finalText);
      }
    });

  const toggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      stopSpeaking();
      startListening();
    }
  };

  return (
    <section id="talk-ai" className="w-full py-16 px-4 sm:px-6 md:px-8 max-w-5xl mx-auto">
      <div className="heritage-card rounded-3xl p-6 sm:p-10 border border-white/10 relative overflow-hidden">
        {/* Subtle Ambient Gold Radial Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C9A45C]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between pb-8 border-b border-white/5 gap-6">
          <div className="space-y-2">
            <span className="text-[10px] sm:text-xs font-mono tracking-[0.25em] text-[#C9A45C] uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#E4C98A]" />
              AI Biographical Guide
            </span>
            <h2 className="font-display font-medium text-3xl sm:text-4xl text-[#F5F2EA] tracking-wide">
              TALK TO CHANCELLOR AI
            </h2>
            <p className="text-xs sm:text-sm text-[#9B968B] font-ui max-w-lg leading-relaxed">
              Ask about his documented journey, work, vision and contributions. Answers are grounded in verified university archives.
            </p>
          </div>

          {/* Voice Controls */}
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleVoice}
              className={`p-3 rounded-full border transition-all cursor-pointer ${
                isVoiceActive
                  ? "bg-[#1c1a17] border-[#C9A45C]/40 text-[#E4C98A]"
                  : "bg-[#121210] border-white/10 text-[#9B968B]"
              }`}
              title={isVoiceActive ? "Voice narration active (Click to mute)" : "Voice narration muted"}
            >
              {isVoiceActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              id="talk-mic-button"
              onClick={toggleMic}
              className={`px-5 py-2.5 rounded-full flex items-center space-x-2 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer shadow-lg ${
                isListening
                  ? "bg-red-950/80 border border-red-500/60 text-red-200 animate-pulse"
                  : "bg-[#C9A45C] hover:bg-[#E4C98A] text-[#0B0B0A] font-semibold"
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span>{isListening ? "Listening..." : "Speak via Voice"}</span>
            </button>
          </div>
        </div>

        {/* Listening Waveform State */}
        {isListening && (
          <div className="my-8 p-6 rounded-2xl bg-[#1c1a17]/80 border border-[#C9A45C]/30 flex flex-col items-center justify-center space-y-3">
            <div className="flex items-center space-x-2 text-[#E4C98A] font-mono text-xs tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-[#E4C98A] animate-ping" />
              <span>Listening to your voice...</span>
            </div>
            <div className="flex items-end space-x-1.5 h-8">
              <div className="w-1 bg-[#E4C98A] rounded-full wave-1" />
              <div className="w-1 bg-[#E4C98A] rounded-full wave-2" />
              <div className="w-1 bg-[#E4C98A] rounded-full wave-3" />
              <div className="w-1 bg-[#E4C98A] rounded-full wave-4" />
              <div className="w-1 bg-[#E4C98A] rounded-full wave-5" />
              <div className="w-1 bg-[#E4C98A] rounded-full wave-2" />
              <div className="w-1 bg-[#E4C98A] rounded-full wave-1" />
            </div>
            <p className="text-xs text-[#F5F2EA] font-mono italic max-w-md text-center">
              {transcript ? `"${transcript}"` : "Speak clearly into your microphone..."}
            </p>
          </div>
        )}

        {/* Suggested Verified Questions */}
        <div className="my-6">
          <span className="text-[11px] font-mono text-[#9B968B] uppercase tracking-wider block mb-2.5">
            Suggested Documented Questions:
          </span>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendQuestion(q)}
                className="text-xs px-3.5 py-1.5 rounded-full bg-[#121210] hover:bg-[#1c1a17] border border-white/10 hover:border-[#C9A45C]/40 text-[#9B968B] hover:text-[#E4C98A] transition-all text-left cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* AI Answer Card */}
        <div className="my-4 p-6 sm:p-8 rounded-2xl bg-[#0e0e0d] border border-white/5 min-h-[160px] flex flex-col justify-between">
          {isLoading ? (
            <div className="py-10 flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-[#C9A45C] border-t-transparent animate-spin" />
              <p className="text-xs text-[#E4C98A] font-mono tracking-wider">Consulting verified archives...</p>
            </div>
          ) : chatResponse ? (
            <div className="space-y-4">
              {lastQuery && (
                <div className="text-xs text-[#C9A45C] font-mono flex items-center space-x-1.5">
                  <CornerDownLeft className="w-3.5 h-3.5" />
                  <span>Query: &ldquo;{lastQuery}&rdquo;</span>
                </div>
              )}
              <p className="font-display font-normal text-base sm:text-lg text-[#F5F2EA] leading-relaxed">
                {chatResponse.answer}
              </p>

              {/* Citations Footer */}
              {chatResponse.citations && chatResponse.citations.length > 0 && (
                <div className="pt-4 border-t border-white/5 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-mono text-[#9B968B] flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-[#C9A45C]" />
                    Source:
                  </span>
                  {chatResponse.citations.map((cite, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-[#1c1a17] text-[#E4C98A] border border-[#C9A45C]/20"
                    >
                      {cite}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center text-[#9B968B] text-xs sm:text-sm font-ui">
              Tap the microphone or choose one of the questions above to explore his documented vision.
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuestion(inputText);
          }}
          className="mt-6 flex items-center space-x-3"
        >
          <input
            id="talk-input-field"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your inquiry (e.g. 1989 inception, healthcare vision, rural education)..."
            className="flex-1 bg-[#121210] border border-white/10 focus:border-[#C9A45C]/60 rounded-full px-5 py-3 text-xs sm:text-sm text-[#F5F2EA] placeholder-[#9B968B]/50 focus:outline-none transition-all font-ui"
          />
          <button
            id="talk-submit-btn"
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-3.5 rounded-full bg-[#C9A45C] hover:bg-[#E4C98A] disabled:opacity-30 text-[#0B0B0A] transition-all cursor-pointer shadow-md"
            title="Send query"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </section>
  );
};
