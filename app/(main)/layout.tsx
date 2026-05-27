'use client';

import React, { useState } from 'react';
import StarField from '@/components/animation/StarField';
import AudioControl from '@/components/ui/AudioControl';
import FireworksEffect from '@/components/animation/FireworksEffect';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/ui/Navbar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const forcedTheme = searchParams.get('theme');
  const eidType = forcedTheme === 'fitr' ? 'fitr' : 'adha';

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden selection:bg-gold-500 selection:text-black">
      
      {/* Dynamic drifting starfield */}
      <StarField density={120} speed={0.06} theme={eidType === 'fitr' ? 'fitr' : 'adha'} />

      {/* Secret achievement canvas trigger */}
      <FireworksEffect />

      {/* Luxury glassmorphic top header */}
      <Navbar eidType={eidType} />

      {/* Principal dynamic content stream */}
      <main className="flex-grow z-10">{children}</main>

      {/* Shared luxury minimal footer */}
      <footer className="relative z-20 border-t border-white/5 bg-[#030304]/80 py-10 px-6 text-center">
        <p className="font-serif text-sm font-bold tracking-[0.1em] text-white">EIDVERSE</p>
        <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mt-2 font-light">
          An Emotional Cinematic Journey • Created for sacred moments
        </p>
        <div className="w-12 h-[1px] bg-gold-400/20 mx-auto mt-4 mb-4" />
        <p className="text-[9px] text-gray-600 font-mono">
          Powered by Next.js, Prisma, Tailwind v4 & Web Audio API synthesis fallback
        </p>
      </footer>

      {/* Floating global audio deck */}
      <AudioControl />

    </div>
  );
}
