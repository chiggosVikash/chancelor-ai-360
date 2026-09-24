"use client";
import React, { useState, useEffect } from "react";
import { Mic, MicOff, Send, Sparkles, BookOpen, Volume2, CornerDownLeft, Award } from "lucide-react";
import { useSpeechRecognition, useSpeechSynthesis } from "../hooks/useSpeech";
import { askChancellorAI, ChatResponse } from "../lib/api";

const PRESET_QUESTIONS = [
  "What inspired Chancellor Sir to establish NICE Society in 1989?",
  "How does Shobhit University bring Ayurveda and modern medicine together?",
  "Tell me about Shobhit University Gangoh and rural youth upliftment.",
  "What is Chancellor Sir's core philosophy on value-based education?"
];

export const TalkToChancellor: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState("");
  const [chatResponse, setChatResponse] = useState<ChatResponse | null>(null);

  const { speak, stop: stopSpeaking, isSpeaking } = useSpeechSynthesis();

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
      // Fallback response for stage continuity
      const fallback: ChatResponse = {
        answer: "Hon'ble Chancellor Kunwar Shekhar Vijendra has dedicated over 35 years to democratizing higher education and rural transformation in India. His guiding vision remains: 'Education must not merely prepare students for a living; it must prepare them for life.'",
        citations: ["Shobhit University Official Registry"],
        suggested_followups: ["Tell me about the founding of NICE in 1989.", "What are his initiatives in Ayurveda?"]
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
    <div className="w-full glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden border border-amber-500/20">
      {/* Decorative ambient gradient */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <h2 className="text-xl md:text-2xl font-serif font-bold text-white tracking-wide">
              Talk to Chancellor AI
            </h2>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Voice-enabled digital archivist celebrating the documented life, vision, and milestones of Kunwar Shekhar Vijendra.
          </p>
        </div>

        {/* Status & Mic Controls */}
        <div className="flex items-center space-x-3">
          {isSpeaking && (
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs animate-pulse">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Narrating...</span>
            </div>
          )}
          <button
            id="talk-mic-button"
            onClick={toggleMic}
            className={`px-5 py-2.5 rounded-2xl flex items-center space-x-2.5 font-medium text-sm transition-all shadow-lg ${
              isListening
                ? "bg-red-500 hover:bg-red-600 text-white animate-pulse shadow-red-500/30"
                : "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20"
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span>{isListening ? "Listening (Tap to stop)" : "Speak via Voice"}</span>
          </button>
        </div>
      </div>

      {/* Active Voice Waveform when listening */}
      {isListening && (
        <div className="my-6 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/30 flex flex-col items-center justify-center space-y-3">
          <div className="flex items-end space-x-1.5 h-10">
            <div className="w-1.5 bg-amber-400 rounded-full wave-bar-1" />
            <div className="w-1.5 bg-amber-400 rounded-full wave-bar-2" />
            <div className="w-1.5 bg-amber-400 rounded-full wave-bar-3" />
            <div className="w-1.5 bg-amber-400 rounded-full wave-bar-4" />
            <div className="w-1.5 bg-amber-400 rounded-full wave-bar-5" />
            <div className="w-1.5 bg-amber-400 rounded-full wave-bar-2" />
            <div className="w-1.5 bg-amber-400 rounded-full wave-bar-1" />
          </div>
          <p className="text-xs text-amber-300 font-mono tracking-wide">
            {transcript ? `"${transcript}"` : "Listening to your voice... Ask anything about Chancellor Sir"}
          </p>
        </div>
      )}

      {/* Suggested Quick Questions */}
      <div className="my-5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          Suggested Stage Questions
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESET_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              id={`quick-question-${idx}`}
              onClick={() => handleSendQuestion(q)}
              className="text-xs px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-amber-300 transition-all text-left active:scale-95 cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Response Display Box */}
      <div className="mt-4 p-5 md:p-6 rounded-2xl bg-slate-900/60 border border-slate-800 min-h-[160px] flex flex-col justify-between">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
            <p className="text-xs text-amber-400 font-medium">Retrieving verified biography & citations...</p>
          </div>
        ) : chatResponse ? (
          <div className="space-y-4">
            {lastQuery && (
              <div className="text-xs text-amber-400 font-medium flex items-center space-x-1.5">
                <CornerDownLeft className="w-3.5 h-3.5" />
                <span>Q: {lastQuery}</span>
              </div>
            )}
            <p className="text-slate-100 text-sm md:text-base leading-relaxed font-normal">
              {chatResponse.answer}
            </p>

            {/* Citations & Source Documentation */}
            {chatResponse.citations && chatResponse.citations.length > 0 && (
              <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  Source Citations:
                </span>
                {chatResponse.citations.map((cite, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-300/90 border border-amber-500/20"
                  >
                    {cite}
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500 text-sm">
            Tap the <span className="text-amber-400 font-medium">microphone</span> or select any question above to converse with Chancellor AI.
          </div>
        )}
      </div>

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendQuestion(inputText);
        }}
        className="mt-4 flex items-center space-x-2"
      >
        <input
          id="talk-text-input"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask about his 1989 inception, Ayurveda vision, or university leadership..."
          className="flex-1 bg-slate-900/90 border border-slate-800 focus:border-amber-500/60 rounded-2xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500/40 transition-all"
        />
        <button
          id="talk-submit-btn"
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-3 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 transition-all shadow-md shadow-amber-500/20 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
