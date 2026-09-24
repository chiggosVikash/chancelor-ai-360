import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "CHANCELLOR AI 360 | Kunwar Shekhar Vijendra — Digital Tribute",
  description:
    "An intelligent, interactive digital tribute to Kunwar Shekhar Vijendra — Co-Founder & Hon'ble Chancellor, Shobhit University. One person → many moments → one legacy.",
  keywords: ["Shobhit University", "Kunwar Shekhar Vijendra", "Chancellor", "NICE", "Education", "Birthday"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF8F4] text-[#1A1614] selection:bg-[#B8862C]/20 selection:text-[#B8862C]">
        {children}
      </body>
    </html>
  );
}
