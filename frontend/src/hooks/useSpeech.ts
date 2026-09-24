"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { API_BASE_URL } from "../lib/api";

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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize persistent Audio object
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio();
      const a = audioRef.current;
      a.onended = () => setIsSpeaking(false);
      a.onerror = () => setIsSpeaking(false);
      a.onpause = () => setIsSpeaking(false);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  // Fallback to browser Web Speech API if backend TTS unreachable
  const fallbackBrowserSpeech = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`[\]()]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) =>
        (v.lang.includes("en-IN") || v.lang.includes("hi-IN") || v.name.includes("Google") || v.name.includes("Natural")) &&
        (v.name.includes("Female") || v.name.includes("Neerja") || v.name.includes("Sangeeta") || v.name.includes("Samantha"))
    ) || voices.find((v) => v.lang.includes("en-IN"));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  const speak = useCallback(
    async (text: string) => {
      if (!isEnabled || !text.trim() || typeof window === "undefined") {
        return;
      }

      // Stop any current playback
      stop();

      try {
        const audio = audioRef.current;
        if (!audio) throw new Error("Audio object not ready");

        // Use backend neural voice stream (en-IN-NeerjaNeural female voice)
        const ttsUrl = `${API_BASE_URL}/api/tts?text=${encodeURIComponent(text.trim())}`;
        audio.src = ttsUrl;
        audio.playbackRate = 1.0;

        setIsSpeaking(true);
        await audio.play();
      } catch (err) {
        console.warn("Neural audio streaming failed, using browser speech fallback:", err);
        fallbackBrowserSpeech(text);
      }
    },
    [isEnabled, fallbackBrowserSpeech]
  );

  const stop = useCallback(() => {
    if (typeof window !== "undefined") {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
    }
  }, []);

  const toggleVoice = useCallback(() => {
    setIsEnabled((prev) => {
      if (prev) stop();
      return !prev;
    });
  }, [stop]);

  return { speak, stop, isSpeaking, isEnabled, toggleVoice };
}
