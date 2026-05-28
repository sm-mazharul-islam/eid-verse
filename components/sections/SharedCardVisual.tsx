'use client';

import React, { useState, useRef } from 'react';

interface SharedCardVisualProps {
  card: {
    receiverName: string;
    message: string;
    theme: string;
    senderName: string;
    eidType: string;
  };
}

const themeCards = {
  moon: {
    bg: 'bg-gradient-to-b from-[#09121F] to-[#03070C] border-blue-500/20 text-[#FFF8E7]',
    moonColor: 'text-blue-300/40 filter drop-shadow-[0_0_15px_rgba(147,197,253,0.3)]',
    cardGlow: 'shadow-[0_0_40px_rgba(59,130,246,0.22)]',
    patternOpacity: 'opacity-5',
    titleColor: 'text-gold-200',
  },
  mosque: {
    bg: 'bg-gradient-to-tr from-[#1E1B29] to-[#0A0812] border-purple-500/20 text-[#FFF8E7]',
    moonColor: 'text-purple-300/30 filter drop-shadow-[0_0_15px_rgba(216,180,254,0.3)]',
    cardGlow: 'shadow-[0_0_40px_rgba(168,85,247,0.22)]',
    patternOpacity: 'opacity-5',
    titleColor: 'text-purple-300',
  },
  lantern: {
    bg: 'bg-gradient-to-b from-[#1C160E] to-[#080603] border-amber-500/20 text-[#FFF3D4]',
    moonColor: 'text-amber-300/30 filter drop-shadow-[0_0_15px_rgba(252,211,77,0.3)]',
    cardGlow: 'shadow-[0_0_40px_rgba(245,158,11,0.22)]',
    patternOpacity: 'opacity-5',
    titleColor: 'text-amber-400',
  },
  gold: {
    bg: 'bg-gradient-to-tr from-[#0F0F0B] via-[#050503] to-[#14120D] border-gold-500/30 text-[#FFF8E7]',
    moonColor: 'text-gold-400/40 filter drop-shadow-[0_0_15px_#B8860B]',
    cardGlow: 'shadow-[0_0_45px_rgba(184,134,11,0.35)]',
    patternOpacity: 'opacity-10',
    titleColor: 'text-gold-300',
  }
};

export default function SharedCardVisual({ card }: SharedCardVisualProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    transition: 'transform 0.5s ease',
  });

  const [shineStyle, setShineStyle] = useState<React.CSSProperties>({
    background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 100%)',
    opacity: 0,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normalizedX = (x / rect.width) - 0.5;
    const normalizedY = (y / rect.height) - 0.5;

    // Tilt angle calculations (max 15 degrees)
    const rotateX = -normalizedY * 15;
    const rotateY = normalizedX * 15;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.025, 1.025, 1.025)`,
      transition: 'transform 0.1s ease',
    });

    // Dynamic shimmer reflections mapping standard cursors
    const shineX = (x / rect.width) * 100;
    const shineY = (y / rect.height) * 100;

    setShineStyle({
      background: `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,215,0,0.1) 0%, rgba(255,255,255,0) 60%)`,
      opacity: 0.8,
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease',
    });
    setShineStyle({
      background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 100%)',
      opacity: 0,
    });
  };

  const themeConfig = themeCards[card.theme as 'moon' | 'mosque' | 'lantern' | 'gold'] || themeCards.gold;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={tiltStyle}
      className={`relative aspect-[4/3] w-full rounded-2xl border p-8 md:p-10 flex flex-col justify-between overflow-hidden shadow-2xl transition-transform duration-500 hover:scale-[1.01] ${themeConfig.bg} ${themeConfig.cardGlow} select-none cursor-pointer`}
    >
      {/* Geometric overlay */}
      <div 
        className={`absolute inset-0 arabic-pattern-overlay ${themeConfig.patternOpacity} pointer-events-none`}
        style={{ mixBlendMode: 'overlay' }}
      />

      {/* Dynamic Cursor Shimmer Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 mix-blend-screen"
        style={shineStyle}
      />

      {/* Corner visual stamps */}
      <div className="absolute top-4 left-4 text-gold-400/30 font-serif text-[10px] tracking-widest uppercase">
        🕌 EID
      </div>
      <div className="absolute top-4 right-4 text-gold-400/30 font-serif text-[10px] tracking-widest uppercase">
        {card.eidType === 'eid-al-fitr' ? 'FITR 🌙' : 'ADHA 🕋'}
      </div>

      {/* Core themed vector logo moon */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 flex items-center justify-center pointer-events-none">
        <svg
          viewBox="0 0 100 100"
          className={`w-full h-full ${themeConfig.moonColor}`}
        >
          <path d="M50,10 C62.5,10 74,15.5 82,24 C71.5,23.5 59.5,29.5 52,38.5 C44.5,47.5 43.5,59.5 48.5,69.5 C36.5,66 28,54.5 28,41 C28,24 37.5,10 50,10 Z" />
        </svg>
      </div>

      {/* Recipient Slot */}
      <div className="relative z-10 text-center flex flex-col items-center">
        <span className="text-[10px] md:text-xs text-gold-300 font-serif tracking-[0.25em] uppercase font-semibold block mb-2">
          Prepared Especially For
        </span>
        <h3 className={`font-serif text-2xl md:text-3xl font-bold tracking-wide ${themeConfig.titleColor}`}>
          {card.receiverName}
        </h3>
        <div className="w-16 h-[1.5px] bg-gradient-to-r from-transparent via-gold-400 to-transparent mt-3" />
      </div>

      {/* Blessing Message Slot */}
      <div className="relative z-10 text-center my-6">
        <p className="text-xs md:text-sm leading-relaxed font-serif italic text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
          “{card.message}”
        </p>
      </div>

      {/* Card Footer branding */}
      <div className="relative z-10 text-center border-t border-gold-400/10 pt-4 flex flex-col items-center">
        {card.senderName && card.senderName !== 'Eid Card Generator' && (
          <span className="text-[9px] uppercase tracking-widest text-gold-300 font-serif mb-1 block tracking-wider">
            With Love & Respect: {card.senderName}
          </span>
        )}
        <span className="font-arabic text-xl text-gold-300 tracking-wider">عيد مبارك</span>
        <span className="text-[9px] uppercase tracking-widest text-gray-500 mt-1 font-light">
          {card.eidType === 'eid-al-fitr' ? 'Eid al-Fitr' : 'Eid al-Adha'} • Created on EidVerse
        </span>
      </div>
    </div>
  );
}
