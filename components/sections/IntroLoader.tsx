'use client';

import React, { useEffect, useRef, useState } from 'react';
import { EidConfig } from '@/lib/eidDetector';
import gsap from 'gsap';

interface IntroLoaderProps {
  config: EidConfig;
  onComplete: () => void;
}

export default function IntroLoader({ config, onComplete }: IntroLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const moonRef = useRef<SVGSVGElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLHeadingElement>(null);
  const text3Ref = useRef<HTMLDivElement>(null);
  
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    // Show skip button after 2 seconds
    const skipTimer = setTimeout(() => setShowSkip(true), 2000);

    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
      }
    });

    // 1. Initial State
    gsap.set(containerRef.current, { opacity: 1 });
    gsap.set(moonRef.current, { y: 200, opacity: 0, scale: 0.8 });
    gsap.set(starsRef.current, { opacity: 0 });
    gsap.set(text1Ref.current, { opacity: 0, y: 15 });
    gsap.set(text2Ref.current, { opacity: 0, y: 20, scale: 0.95 });
    gsap.set(text3Ref.current, { opacity: 0, y: 15 });

    // 2. Timeline Sequence
    tl.to(moonRef.current, {
      y: 0,
      opacity: 0.8,
      scale: 1,
      duration: 2.2,
      ease: 'power3.out',
    })
    .to(starsRef.current, {
      opacity: 0.6,
      duration: 1.5,
      ease: 'power2.out',
    }, '-=1.2')
    .to(text1Ref.current, {
      opacity: 0.9,
      y: 0,
      duration: 1.2,
      ease: 'power2.out',
    }, '-=0.8')
    .to(text2Ref.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.5,
      ease: 'back.out(1.2)',
    }, '-=0.4')
    .to(text3Ref.current, {
      opacity: 0.8,
      y: 0,
      duration: 1.2,
      ease: 'power2.out',
    }, '-=0.6')
    .to(containerRef.current, {
      opacity: 0,
      duration: 1.0,
      ease: 'power3.inOut',
      delay: 1.5, // Hold reading text
    });

    return () => {
      clearTimeout(skipTimer);
      tl.kill();
    };
  }, [onComplete]);

  const handleSkip = () => {
    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut',
      onComplete: onComplete,
    });
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-[#070708] z-[99999] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Dynamic star field dust */}
      <div
        ref={starsRef}
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Skip Button */}
      {showSkip && (
        <button
          onClick={handleSkip}
          className="absolute top-6 right-6 z-50 glass-panel border border-white/10 px-4 py-1.5 rounded-full text-xs text-gray-300 hover:text-white hover:border-gold-300/30 transition-all active:scale-95 cursor-pointer"
        >
          Skip Intro
        </button>
      )}

      {/* Cinematic Center Content */}
      <div className="flex flex-col items-center justify-center text-center max-w-xl px-6">
        
        {/* Crescent Moon Rising */}
        <svg
          ref={moonRef}
          viewBox="0 0 100 100"
          className="w-24 h-24 md:w-32 md:h-32 mb-8 filter drop-shadow-[0_0_20px_rgba(226,192,125,0.7)] text-gold-400 fill-current"
        >
          <path d="M50,10 C62.5,10 74,15.5 82,24 C71.5,23.5 59.5,29.5 52,38.5 C44.5,47.5 43.5,59.5 48.5,69.5 C36.5,66 28,54.5 28,41 C28,24 37.5,10 50,10 Z" />
        </svg>

        {/* Text Sequence */}
        <div ref={text1Ref} className="font-serif text-sm md:text-base text-gold-200 tracking-[0.2em] uppercase mb-3 opacity-90">
          Bismillahir Rahmanir Rahim
        </div>

        <h1
          ref={text2Ref}
          className="font-serif text-4xl md:text-6xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-tr from-gold-600 via-gold-300 to-gold-100 filter drop-shadow-md mb-4"
        >
          {config.type === 'eid-al-fitr' ? 'Eid al-Fitr' : 'Eid al-Adha'} Mubarak
        </h1>

        <div
          ref={text3Ref}
          className="font-arabic text-lg md:text-2xl text-gray-300 tracking-wider mb-2 opacity-80"
        >
          {config.arabicName}
          <div className="font-sans text-xs md:text-sm text-gray-400 mt-2 font-light tracking-widest max-w-sm uppercase">
            {config.tagline}
          </div>
        </div>
      </div>
    </div>
  );
}
