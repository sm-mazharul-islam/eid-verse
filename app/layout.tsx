import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EidVerse | Premium Cinematic Emotional Experience",
  description: "Share personalized 3D Eid greeting cards, stories, and blessings.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Suspense fallback={
          <div className="min-h-screen bg-[#070708] flex items-center justify-center">
            <div className="text-gold-300 font-serif text-sm animate-pulse">Loading EidVerse...</div>
          </div>
        }>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
