'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { detectCurrentEid, EidConfig } from '@/lib/eidDetector';
import IntroLoader from '@/components/sections/IntroLoader';
import HeroSection from '@/components/sections/HeroSection';
import PersonalWishGenerator from '@/components/sections/PersonalWishGenerator';
import SurpriseBlessing from '@/components/sections/SurpriseBlessing';
import CardGenerator from '@/components/sections/CardGenerator';
import QurbaniTimeline from '@/components/sections/QurbaniTimeline';
import CattleMarket from '@/components/sections/CattleMarket';
import ThreeShares from '@/components/sections/ThreeShares';
import MemoryWall from '@/components/sections/MemoryWall';
import BkashSalami from '@/components/sections/BkashSalami';
import DuaGenerator from '@/components/sections/DuaGenerator';
import GlobalWishes from '@/components/sections/GlobalWishes';

export default function HomePage() {
  const searchParams = useSearchParams();
  const forcedTheme = searchParams.get('theme'); // 'adha' | 'fitr'

  const [config, setConfig] = useState<EidConfig | null>(null);
  const [showLoader, setShowLoader] = useState(true);

  // Recalculate config whenever forcedTheme query parameters change
  useEffect(() => {
    const activeConfig = detectCurrentEid(forcedTheme);
    setConfig(activeConfig);
    
    // Manage document level attributes for styling variables (data-eid-theme)
    document.documentElement.setAttribute('data-eid-theme', activeConfig.themeKey);
  }, [forcedTheme]);

  useEffect(() => {
    // Hide overflow scrollbar when loader is running to preserve film-style bounds
    if (showLoader) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [showLoader]);

  if (!config) return null;

  return (
    <div className="relative min-h-screen">
      
      {/* 1. Cinematic entrance film loader */}
      {showLoader && (
        <IntroLoader config={config} onComplete={() => setShowLoader(false)} />
      )}

      {/* 2. Primary Layout content */}
      <div className={`transition-opacity duration-1000 ${showLoader ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* Core Hero Section (Parallax visual backdrops) */}
        <HeroSection config={config} />

        {/* Personalized Wish Builder Card */}
        <PersonalWishGenerator config={config} />

        {/* Surprise envelope slider card */}
        <SurpriseBlessing config={config} />

        {/* Dynamic conditionals based on detected Eid season */}
        {config.themeKey === 'adha' ? (
          <>
            {/* Qurbani Story Scroll Timeline */}
            <QurbaniTimeline />

            {/* Interactive Vector Bangladesh Haat illustrated map */}
            <CattleMarket />

            {/* Meat distribution infographic details */}
            <ThreeShares />

            {/* Stories and Animal Memory Masonry Grid */}
            <MemoryWall />

            {/* Playful bKash Salami box */}
            <BkashSalami />
          </>
        ) : (
          // Sweets and Joy fallback for Fitr
          <div className="py-24 text-center glass-panel max-w-xl mx-auto rounded-xl p-8 border border-green-500/10 mb-10">
            <h3 className="font-serif text-xl font-bold text-gold-300 mb-2">Ramadan Journey Timeline Coming Soon</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-light">
              Eid al-Fitr mode automatically highlights the journey of patience, shemai recipe cards, and dynamic family photos on the memory wall! Use query ?theme=adha to explore Qurbani.
            </p>
          </div>
        )}

        {/* 3D Card Generator Section */}
        <CardGenerator config={config} />

        {/* Spiritual Dua Deck selector */}
        <DuaGenerator config={config} />

        {/* Community Floating wish wall */}
        <GlobalWishes config={config} />

      </div>

    </div>
  );
}
