"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { API_BASE_URL } from "../lib/api";

// Global singleton audio controller across the entire app
let globalAudio: HTMLAudioElement | null = null;
let currentObjectUrl: string | null = null;
const playbackListeners = new Set<(playing: boolean) => void>();

function notifyPlaybackState(playing: boolean) {
  playbackListeners.forEach((fn) => fn(playing));
}

export function stopAllSpeech() {
  if (typeof window !== "undefined") {
    if (globalAudio) {
      globalAudio.pause();
      globalAudio.currentTime = 0;
      globalAudio.src = "";
    }
    if (currentObjectUrl) {
      URL.revokeObjectURL(currentObjectUrl);
      currentObjectUrl = null;
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    notifyPlaybackState(false);
  }
}

export function useSpeechRecognition(onResult?: (transcript: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = "en-IN"; // English (India) with support for Hindi words

        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const text = event.results[current][0].transcript;
          setTranscript(text);
          if (event.results[current].isFinal && onResult) {
            onResult(text);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn("Speech recognition error:", event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [onResult]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript("");
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn("Recognition start failed", err);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn("Recognition stop failed", err);
      }
      setIsListening(false);
    }
  }, [isListening]);

  return { isListening, transcript, startListening, stopListening, isSupported };
}

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);

  // Sync with global playback state
  useEffect(() => {
    const listener = (playing: boolean) => setIsSpeaking(playing);
    playbackListeners.add(listener);
    return () => {
      playbackListeners.delete(listener);
    };
  }, []);

  // Guaranteed single-voice fallback to Web Speech API
  const fallbackBrowserSpeech = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    stopAllSpeech();

    const cleanText = text.replace(/[*_#`[\]()]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice =
      voices.find(
        (v) =>
          (v.lang.includes("en-IN") ||
            v.lang.includes("hi-IN") ||
            v.name.includes("Google") ||
            v.name.includes("Natural")) &&
          (v.name.includes("Female") ||
            v.name.includes("Neerja") ||
            v.name.includes("Sangeeta") ||
            v.name.includes("Samantha"))
      ) || voices.find((v) => v.lang.includes("en-IN"));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => notifyPlaybackState(true);
    utterance.onend = () => notifyPlaybackState(false);
    utterance.onerror = () => notifyPlaybackState(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  const speak = useCallback(
    async (text: string) => {
      if (!isEnabled || !text.trim() || typeof window === "undefined") {
        return;
      }

      // Stop any active speech before starting a new one
      stopAllSpeech();

      const cleanText = text.replace(/[*_#`[\]()]/g, "").trim();

      try {
        // Fetch neural audio via POST to prevent query string truncation
        const resp = await fetch(`${API_BASE_URL}/api/tts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: cleanText,
            voice: "en-IN-NeerjaNeural",
          }),
        });

        if (!resp.ok) {
          throw new Error(`TTS server responded with ${resp.status}`);
        }

        const blob = await resp.blob();
        if (blob.size === 0) {
          throw new Error("Empty audio response");
        }

        if (!globalAudio) {
          globalAudio = new Audio();
          globalAudio.onended = () => notifyPlaybackState(false);
          globalAudio.onerror = () => notifyPlaybackState(false);
          globalAudio.onpause = () => notifyPlaybackState(false);
        }

        if (currentObjectUrl) {
          URL.revokeObjectURL(currentObjectUrl);
        }

        currentObjectUrl = URL.createObjectURL(blob);
        globalAudio.src = currentObjectUrl;
        globalAudio.playbackRate = 1.0;

        notifyPlaybackState(true);
        await globalAudio.play();
      } catch (err) {
        console.warn("Neural audio failed, using browser speech fallback:", err);
        fallbackBrowserSpeech(cleanText);
      }
    },
    [isEnabled, fallbackBrowserSpeech]
  );

  const stop = useCallback(() => {
    stopAllSpeech();
  }, []);

  const toggleVoice = useCallback(() => {
    setIsEnabled((prev) => {
      if (prev) stopAllSpeech();
      return !prev;
    });
  }, []);

  return { speak, stop, isSpeaking, isEnabled, toggleVoice };
}
