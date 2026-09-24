import type { Metadata, Viewport } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// [SOLID: SRP] — Layout configures global typography providers and root document envelope
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
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
  title: "CHANCELLOR AI 360 | Kunwar Shekhar Vijendra — Living Tribute",
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
      className={`${outfit.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF8F4] text-[#1A1614] selection:bg-[#B8862C]/20 selection:text-[#B8862C]">
        {children}
      </body>
    </html>
  );
}

