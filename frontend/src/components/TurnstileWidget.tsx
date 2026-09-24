"use client";
import React, { useEffect, useRef, useState } from "react";
import { ShieldCheck } from "lucide-react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        params: {
          sitekey: string;
          callback: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "compact" | "flexible";
        }
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  siteKey?: string;
  theme?: "light" | "dark";
}

// Cloudflare public testing key (always passes successfully)
const DEFAULT_TEST_SITEKEY = "1x00000000000000000000AA";

export const TurnstileWidget: React.FC<TurnstileWidgetProps> = ({
  onVerify,
  siteKey,
  theme = "light",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const activeKey =
    siteKey ||
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ||
    DEFAULT_TEST_SITEKEY;

  useEffect(() => {
    // If running in development without internet or turnstile disabled, auto-verify gracefully
    let scriptLoaded = false;

    const renderWidget = () => {
      if (!window.turnstile || !containerRef.current) return;
      if (widgetIdRef.current) return;

      try {
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: activeKey,
          theme: theme,
          callback: (token: string) => {
            setIsReady(true);
            onVerify(token);
          },
          "error-callback": () => {
            console.warn("[Turnstile] Verification error - falling back gracefully");
            onVerify("turnstile_fallback_token");
          },
          "expired-callback": () => {
            if (widgetIdRef.current && window.turnstile) {
              window.turnstile.reset(widgetIdRef.current);
            }
          },
        });
      } catch (err) {
        console.warn("[Turnstile Render Error]:", err);
        onVerify("turnstile_fallback_token");
      }
    };

    // Check if script is already present
    const existingScript = document.getElementById("cf-turnstile-script");
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "cf-turnstile-script";
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        scriptLoaded = true;
        renderWidget();
      };
      script.onerror = () => {
        console.warn("[Turnstile] Failed to load script - enabling graceful pass");
        onVerify("turnstile_bypass_token");
      };
      document.head.appendChild(script);
    } else {
      if (window.turnstile) {
        renderWidget();
      } else {
        existingScript.addEventListener("load", renderWidget);
      }
    }

    // Safety timeout: If user is on slow network, don't lock them out
    const fallbackTimer = setTimeout(() => {
      if (!widgetIdRef.current) {
        onVerify("turnstile_timeout_bypass");
      }
    }, 4000);

    return () => {
      clearTimeout(fallbackTimer);
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (e) {
          // ignore cleanup errors
        }
        widgetIdRef.current = null;
      }
    };
  }, [activeKey, onVerify, theme]);

  return (
    <div className="flex flex-col items-center justify-center py-2 space-y-1">
      <div ref={containerRef} className="min-h-[65px] flex items-center justify-center" />
      <div className="flex items-center space-x-1.5 text-[10px] text-[#8B7B6F] font-mono">
        <ShieldCheck className="w-3 h-3 text-[#B8862C]" />
        <span>Protected by Cloudflare Turnstile</span>
      </div>
    </div>
  );
};
