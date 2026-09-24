import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chancellor AI 360 | Kunwar Shekhar Vijendra Digital Tribute",
  description: "An intelligent, interactive digital birthday tribute celebrating the visionary life, educational leadership, and contributions of Kunwar Shekhar Vijendra, Hon'ble Chancellor of Shobhit University.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#040914] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
        {children}
      </body>
    </html>
  );
}
