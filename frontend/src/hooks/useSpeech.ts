"use client";
import { useState, useEffect, useCallback, useRef } from "react";

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

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window) || !isEnabled) {
      return;
    }

    window.speechSynthesis.cancel();

    // Clean markdown symbols for cleaner voice
    const cleanText = text.replace(/[*_#`[\]()]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95; // Dignified, calm cadence
    utterance.pitch = 1.0;

    // Prefer Indian English or natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => v.lang.includes("en-IN") || v.lang.includes("hi-IN") || v.name.includes("Google")
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [isEnabled]);

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
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
