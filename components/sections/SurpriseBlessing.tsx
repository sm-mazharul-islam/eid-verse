'use client';

import React, { useState, useRef } from 'react';
import { EidConfig } from '@/lib/eidDetector';
import GoldenButton from '../ui/GoldenButton';
import { Mail, Sparkles, RefreshCw, VolumeX } from 'lucide-react';
import gsap from 'gsap';

interface SurpriseBlessingProps {
  config: EidConfig;
}

export default function SurpriseBlessing({ config }: SurpriseBlessingProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [blessing, setBlessing] = useState('');
  const [category, setCategory] = useState('');
  
  const letterRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const handleOpenEnvelope = async () => {
    if (isOpen || isOpening) return;
    setIsOpening(true);

    // Audio cue
    try {
      if ((window as any).triggerEnvelopeSound) {
        (window as any).triggerEnvelopeSound();
      }
    } catch (e) {}

    // Fetch a random blessing from /api/blessings
    try {
      const res = await fetch(`/api/blessings?eidType=${config.themeKey === 'fitr' ? 'eid-al-fitr' : 'eid-al-adha'}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setBlessing(data.blessing.text);
        setCategory(data.blessing.category);
      } else {
        setBlessing('May Allah shower your home and heart with peace, good health, and infinite barakah today and always.');
        setCategory('general');
      }
    } catch (err) {
      setBlessing('May Allah accept your sacrifices, answer your duas, and protect your loved ones with His infinite mercy.');
      setCategory('general');
    }

    // GSAP 3D Open Animation Sequence
    const tl = gsap.timeline({
      onComplete: () => {
        setIsOpen(true);
        setIsOpening(false);
        // Stagger words
        if (letterRef.current) {
          const words = letterRef.current.querySelectorAll('.blessing-word');
          gsap.fromTo(words, 
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 0.4, stagger: 0.06, ease: 'power1.out' }
          );
        }
      }
    });

    // 1. Flip open flap (rotateX 180deg)
    tl.to(flapRef.current, {
      rotateX: 180,
      duration: 0.8,
      ease: 'power2.inOut',
    })
    // 2. Adjust z-index of flap to sit behind
    .set(flapRef.current, { zIndex: 0 })
    // 3. Slide folded paper out upward
    .to(letterRef.current, {
      y: -220,
      scaleY: 1.05,
      zIndex: 20,
      duration: 1.0,
      ease: 'power3.out',
    }, '-=0.2')
    // 4. Unfold paper (unscale/stretch fully to reveal message)
    .to(letterRef.current, {
      y: -190,
      scaleY: 1.0,
      height: 'auto',
      minHeight: '260px',
      paddingBottom: '32px',
      duration: 0.6,
      ease: 'back.out(1.2)',
    });
  };

  const handleReset = () => {
    setIsOpen(false);
    setBlessing('');
    
    // Reset positions
    gsap.set(flapRef.current, { rotateX: 0, zIndex: 30 });
    gsap.set(letterRef.current, { y: 0, scaleY: 0.1, zIndex: 10, height: '80px', minHeight: '80px' });
  };

  return (
    <section id="surprise-blessing-section" className="relative py-24 w-full z-20 px-6 bg-[#030304]/60">
      
      {/* Arabic Geometric tile in background */}
      <div className="absolute inset-0 arabic-pattern-overlay opacity-[0.02] pointer-events-none" />

      <div className="max-w-4xl mx-auto flex flex-col items-center">
        
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-sm md:text-base text-gold-300 tracking-[0.2em] uppercase mb-3">
            Emotional Surprise Moment
          </h2>
          <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-wide">
            Surprise Blessing Envelope
          </h1>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto mt-4" />
          <p className="text-gray-400 text-xs md:text-sm mt-4 max-w-md mx-auto leading-relaxed">
            Receive a handwritten spiritual message prepared especially for you this Eid. Open the glowing envelope below.
          </p>
        </div>

        {/* 3D Envelope Container with Perspective */}
        <div className="relative w-full max-w-[400px] h-[300px] flex items-center justify-center mb-24 cursor-pointer" style={{ perspective: '1000px' }}>
          
          {/* Faint gold glowing background */}
          <div className={`absolute w-[360px] h-[220px] rounded-xl transition-all duration-1000 ${
            isOpen || isOpening ? 'bg-gold-500/10 blur-3xl scale-110' : 'bg-gold-500/5 blur-2xl animate-pulse'
          }`} />

          {/* Envelope Wrapper */}
          <div 
            onClick={handleOpenEnvelope}
            className="relative w-[360px] h-[220px] bg-[#0c0d10] border border-gold-400/20 rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.5)] flex items-center justify-center"
          >
            
            {/* The folded letter inside */}
            <div
              ref={letterRef}
              className="absolute left-4 right-4 bottom-4 bg-[#FCFBF8] text-[#1D1B18] p-6 rounded-lg shadow-lg flex flex-col justify-between overflow-hidden select-none border border-gold-300/30"
              style={{
                zIndex: 10,
                transformOrigin: 'bottom center',
                height: '80px',
                minHeight: '80px',
                transform: 'scaleY(0.1)',
              }}
            >
              {blessing ? (
                <div className="flex flex-col h-full justify-between gap-4">
                  {/* Category Stamp */}
                  <div className="flex justify-between items-center text-[10px] text-gold-700 tracking-wider uppercase font-semibold font-serif border-b border-gold-400/20 pb-2">
                    <span>A Spiritual Gift</span>
                    <span>{category} blessing</span>
                  </div>

                  {/* Staggered Word text */}
                  <p className="font-serif text-sm md:text-base leading-relaxed text-center text-[#2A2621]">
                    {blessing.split(' ').map((word, idx) => (
                      <span key={idx} className="blessing-word inline-block mr-1 opacity-0">
                        {word}
                      </span>
                    ))}
                  </p>

                  <div className="text-[10px] text-gray-400 text-center font-light uppercase tracking-widest mt-2 border-t border-gold-400/10 pt-2">
                    Prepared for you by EidVerse
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-gray-100 animate-pulse rounded" />
              )}
            </div>

            {/* Envelope Flap (Triangular top flap) */}
            <div
              ref={flapRef}
              className="absolute top-0 left-0 right-0 h-[110px] bg-[#0a0a0d] border-t border-gold-400/30 shadow-[0_2px_5px_rgba(0,0,0,0.2)]"
              style={{
                zIndex: 30,
                clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
                transformOrigin: 'top center',
              }}
            />

            {/* Left and Right Envelope seams */}
            <div className="absolute inset-0 bg-transparent" style={{ zIndex: 25 }}>
              {/* Left Side cover */}
              <div 
                className="absolute left-0 bottom-0 top-0 w-1/2 bg-[#0d0e12] border-l border-gold-400/10" 
                style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }}
              />
              {/* Right Side cover */}
              <div 
                className="absolute right-0 bottom-0 top-0 w-1/2 bg-[#0c0d11] border-r border-gold-400/10" 
                style={{ clipPath: 'polygon(100% 0, 0 50%, 100% 100%)' }}
              />
              {/* Bottom seam cover */}
              <div 
                className="absolute left-0 right-0 bottom-0 h-[120px] bg-[#090a0d] border-b border-gold-400/10 shadow-[0_-2px_10px_rgba(0,0,0,0.15)]" 
                style={{ clipPath: 'polygon(0 100%, 50% 0, 100% 100%)' }}
              />
            </div>

            {/* Front glowing icon */}
            {!isOpen && !isOpening && (
              <div className="relative z-40 flex flex-col items-center gap-2 text-gold-300">
                <div className="w-12 h-12 rounded-full bg-gold-400/10 flex items-center justify-center border border-gold-400/30 animate-pulse">
                  <Mail className="w-5 h-5 text-gold-400" />
                </div>
                <span className="text-[10px] uppercase tracking-widest font-medium text-gold-200">
                  Open Blessing
                </span>
              </div>
            )}

          </div>

        </div>

        {/* Reset button shown after opening */}
        {isOpen && (
          <button
            onClick={handleReset}
            className="glass-panel border border-white/10 hover:border-gold-300/30 text-gold-300 px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4.5 h-4.5" />
            Receive Another Blessing
          </button>
        )}

      </div>
    </section>
  );
}
