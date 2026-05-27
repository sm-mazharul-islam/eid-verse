'use client';

import React, { useEffect, useState, useRef } from 'react';
import { EidConfig } from '@/lib/eidDetector';
import MoonScene from '../animation/MoonScene';
import FloatingLanterns from '../animation/FloatingLanterns';
import GoldenButton from '../ui/GoldenButton';
import { Calendar, ChevronDown, Flame } from 'lucide-react';

interface HeroSectionProps {
  config: EidConfig;
}

export default function HeroSection({ config }: HeroSectionProps) {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollDown = () => {
    const nextSection = document.getElementById('personal-wish-section');
    nextSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      ref={heroRef}
      className="relative min-h-[92vh] md:min-h-screen w-full flex flex-col items-center justify-center overflow-hidden pt-16 md:pt-0"
    >
      {/* 1. Theme-Specific Skies & Background Gradients */}
      {config.themeKey === 'fitr' ? (
        // Fitr: Deep cosmic blue-navy sky
        <div className="absolute inset-0 bg-gradient-to-b from-[#09121F] via-[#0D1B2A] to-[#03070C] z-0" />
      ) : (
        // Adha: Pre-dawn early morning 4 AM gradient (black to dark blue-orange purple)
        <div className="absolute inset-0 bg-gradient-to-b from-[#070708] via-[#0D1321] via-[#1E1B29] to-[#0A0A0A] z-0" />
      )}

      {/* Floating lanterns background (Shared, but themed color) */}
      <FloatingLanterns count={config.themeKey === 'fitr' ? 14 : 8} />

      {/* Geometric Islamic Arabic Pattern overlay */}
      <div className="absolute inset-0 arabic-pattern-overlay z-0 pointer-events-none" />

      {/* 2. Interactive Columns */}
      <div className="relative z-20 max-w-7xl w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center flex-grow py-8">
        
        {/* Left Column: Typography & Narrative */}
        <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left order-2 lg:order-1 mt-6 lg:mt-0">
          
          {config.themeKey === 'adha' && (
            <div className="inline-flex self-center lg:self-start items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-amber-500/20 text-gold-300 text-xs font-serif tracking-widest uppercase mb-6 animate-pulse">
              <Flame className="w-4 h-4 text-amber-500" />
              The Festival of Sacrifice
            </div>
          )}

          {config.themeKey === 'fitr' && (
            <div className="inline-flex self-center lg:self-start items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-green-500/20 text-green-300 text-xs font-serif tracking-widest uppercase mb-6 animate-pulse">
              <Calendar className="w-4 h-4 text-green-400" />
              The Feast of Sweets & Relief
            </div>
          )}

          <h2 className="font-serif text-sm md:text-lg text-gold-300 tracking-[0.3em] uppercase mb-3 drop-shadow-md">
            Taqabbalallahu Minna Wa Minkum
          </h2>
          
          <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-wide leading-[1.1] mb-6">
            <span className="block text-white">Share the Soul of</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-tr from-gold-600 via-gold-300 to-gold-100 filter drop-shadow-[0_0_15px_rgba(226,192,125,0.2)]">
              {config.type === 'eid-al-fitr' ? 'Eid al-Fitr' : 'Eid al-Adha'}
            </span>
          </h1>

          <p className="text-gray-300 text-base md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-light mb-8">
            {config.themeKey === 'adha' 
              ? 'Step into a cinematic spiritual journey honoring the devotion of Ibrahim (AS) and the sacrifice of Ismail (AS). Create custom greeting links, explore stories, and celebrate community.'
              : 'Embrace the sweet joy of Eid day after a beautiful month of fasting and self-reflection. Build customized cards, send greetings to friends, and dive into a cosmic visual experience.'
            }
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <GoldenButton onClick={handleScrollDown}>
              Create a Personalized Wish
            </GoldenButton>
            
            <button
              onClick={() => {
                const wall = document.getElementById('memory-wall-section');
                wall?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="glass-panel border border-white/10 hover:border-gold-300/30 text-white font-medium px-8 py-3.5 rounded-lg text-sm transition-all hover:scale-[1.02] active:scale-95 cursor-pointer w-full sm:w-auto"
            >
              Explore Memory Wall
            </button>
          </div>
        </div>

        {/* Right Column: Visual Centerpiece */}
        <div className="lg:col-span-5 flex items-center justify-center order-1 lg:order-2">
          {config.themeKey === 'fitr' ? (
            // Fitr displays 3D Moon
            <div className="relative w-full aspect-square max-w-[450px]">
              <MoonScene />
            </div>
          ) : (
            // Adha displays 3D Moon but surrounded by beautiful pre-dawn landscape layers
            <div className="relative w-full aspect-square max-w-[450px] flex flex-col items-center">
              <MoonScene />
              {/* Soft overlay representing pre-dawn prayer time */}
              <div className="absolute -bottom-4 text-center z-20 pointer-events-none">
                <span className="font-arabic text-2xl text-gold-300 block tracking-widest opacity-80">
                  وَفَدَيْنَاهُ بِذِبْحٍ عَظِيمٍ
                </span>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest block mt-1">
                  "And We ransomed him with a great sacrifice"
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Mosque Silhouette with window glow (Themed placement) */}
      <div 
        className="absolute bottom-0 left-0 right-0 z-10 w-full pointer-events-none transition-transform duration-300"
        style={{ transform: `translateY(${scrollY * 0.15}px)` }}
      >
        <svg
          viewBox="0 0 1440 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto min-w-[1024px]"
        >
          {/* Mosque silhouettes */}
          <path
            d="M0 220 L0 180 L120 180 C150 180 160 160 180 120 C200 80 230 80 250 120 C270 160 280 180 310 180 L450 180 C470 180 480 160 500 130 C510 110 520 80 540 80 C560 80 570 110 580 130 C600 160 610 180 630 180 L720 180 L760 120 C780 90 800 50 830 50 C860 50 880 90 900 120 L940 180 L1080 180 C1100 180 1110 165 1130 140 C1150 110 1170 30 1200 30 C1230 30 1250 110 1270 140 C1290 165 1300 180 1320 180 L1440 180 L1440 220 Z"
            fill={config.themeKey === 'fitr' ? '#04070C' : '#040405'}
            stroke={config.themeKey === 'fitr' ? 'rgba(200, 169, 110, 0.15)' : 'rgba(184, 134, 11, 0.15)'}
            strokeWidth="1.5"
          />
          {/* Glowing Windows */}
          <path d="M208 140 A 12 12 0 0 1 222 140 Z" className="glow-window" fill="#E2C07D" />
          <path d="M532 145 A 8 8 0 0 1 548 145 Z" className="glow-window" fill="#E2C07D" style={{ animationDelay: '1.5s' }} />
          <path d="M822 145 A 8 8 0 0 1 838 145 Z" className="glow-window" fill="#E2C07D" style={{ animationDelay: '2.5s' }} />
          <path d="M1190 140 A 10 10 0 0 1 1210 140 Z" className="glow-window" fill="#E2C07D" style={{ animationDelay: '0.8s' }} />
        </svg>
      </div>

      {/* Down Chevron indicator */}
      <button
        onClick={handleScrollDown}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 text-gold-300 hover:text-white transition-colors cursor-pointer animate-bounce"
      >
        <ChevronDown className="w-6 h-6" />
      </button>
    </div>
  );
}
