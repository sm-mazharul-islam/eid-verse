'use client';

import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Copy, Share2, ArrowRight, ArrowLeft, RefreshCw, Check, Sparkles, AlertCircle } from 'lucide-react';
import { EidConfig } from '@/lib/eidDetector';
import gsap from 'gsap';

interface Dua {
  id: string;
  text: string;
  arabic?: string;
  meaning?: string;
  category: string;
  duaType: string;
}

interface DuaGeneratorProps {
  config: EidConfig;
}

export default function DuaGenerator({ config }: DuaGeneratorProps) {
  const [duas, setDuas] = useState<Dua[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [category, setCategory] = useState('All');
  
  const [isRotating, setIsRotating] = useState(false);
  const [copied, setCopied] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  const fetchDuas = async () => {
    try {
      const res = await fetch(`/api/duas?eidType=${config.themeKey === 'fitr' ? 'eid-al-fitr' : 'eid-al-adha'}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setDuas(data.duas);
        setCurrentIndex(0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDuas();
  }, []);

  const handleNextDua = () => {
    if (duas.length === 0 || isRotating) return;
    setIsRotating(true);
    setCopied(false);

    // GSAP Slide-out Fade and Scale down
    gsap.to(cardRef.current, {
      opacity: 0,
      scale: 0.95,
      y: -10,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        // Increment
        const filtered = getFilteredDuas();
        setCurrentIndex((prev) => (prev + 1) % filtered.length);
        
        // Slide-in from below, scaling back up
        gsap.fromTo(cardRef.current,
          { opacity: 0, scale: 0.95, y: 15 },
          { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'power2.out', onComplete: () => setIsRotating(false) }
        );
      }
    });
  };

  const handlePrevDua = () => {
    if (duas.length === 0 || isRotating) return;
    setIsRotating(true);
    setCopied(false);

    // GSAP Slide-out Fade and Scale down
    gsap.to(cardRef.current, {
      opacity: 0,
      scale: 0.95,
      y: 10,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        const filtered = getFilteredDuas();
        setCurrentIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
        
        // Slide-in from above, scaling back up
        gsap.fromTo(cardRef.current,
          { opacity: 0, scale: 0.95, y: -15 },
          { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'power2.out', onComplete: () => setIsRotating(false) }
        );
      }
    });
  };

  const getFilteredDuas = () => {
    if (category === 'All') return duas;
    return duas.filter((d) => d.category.toLowerCase() === category.toLowerCase());
  };

  const handleCopy = () => {
    const filtered = getFilteredDuas();
    const current = filtered[currentIndex];
    if (!current) return;

    const copyText = `${current.arabic ? `${current.arabic}\n\n` : ''}“${current.text}”\n\nMeaning: ${current.meaning || ''}\n\nSpiritual sharing from EidVerse.`;
    navigator.clipboard.writeText(copyText);
    
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const filtered = getFilteredDuas();
    const current = filtered[currentIndex];
    if (!current) return;

    const shareText = `“${current.text}”\n\nMeaning: ${current.meaning || ''}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Eid Spiritual Dua sharing`,
          text: shareText,
          url: window.location.origin
        });
      } catch (err) {}
    } else {
      handleCopy();
    }
  };

  const categories = ['All', 'Sacrifice', 'Gratitude', 'Family', 'Peace'];
  const filteredList = getFilteredDuas();
  const currentDua = filteredList[currentIndex];

  return (
    <section id="dua-generator-section" className="relative py-24 w-full z-20 px-6">
      
      {/* Background radial soft light */}
      <div className="absolute inset-0 bg-contain bg-center opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, var(--eid-primary) 0%, transparent 60%)' }} />

      <div className="max-w-4xl mx-auto flex flex-col items-center">
        
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-sm md:text-base text-gold-300 tracking-[0.2em] uppercase mb-3">
            Spiritual Core Decks
          </h2>
          <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-wide">
            The Eid Dua Generator
          </h1>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto mt-4" />
          <p className="text-gray-400 text-xs md:text-sm mt-4 max-w-lg leading-relaxed">
            Expose your heart to authentic supplications (Duas) from the Quran and Sunnah, translated and transliterated beautifully.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 items-center justify-center mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                setCurrentIndex(0);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                category === cat 
                  ? 'bg-gold-500 text-black shadow-md' 
                  : 'glass-panel border-white/5 text-gray-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dynamic Dua Deck Card */}
        {currentDua ? (
          <div className="relative w-full max-w-xl">
            
            {/* Elegant luxury frame */}
            <div
              ref={cardRef}
              className="glass-panel border border-gold-400/20 p-8 md:p-10 rounded-2xl flex flex-col justify-between min-h-[360px] text-center shadow-[0_15px_40px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(255,255,255,0.01)] hover:scale-[1.01] transition-all"
            >
              {/* Card Accent Top */}
              <div className="flex items-center justify-between text-[10px] text-gold-400 uppercase tracking-widest font-serif border-b border-white/5 pb-4 mb-6 font-semibold">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  Sunnah Supplication
                </span>
                <span>{currentDua.category} category</span>
              </div>

              {/* Supplication Core Body */}
              <div className="flex flex-col gap-6 flex-grow justify-center py-4">
                
                {/* Arabic Calligraphy (Standard HTML font rendering supported by premium Arabic typography) */}
                {currentDua.arabic && (
                  <h3 className="font-arabic text-2xl md:text-3xl font-bold leading-loose text-gold-200 tracking-wide select-all px-2 filter drop-shadow-md">
                    {currentDua.arabic}
                  </h3>
                )}

                {/* Transliteration / Text */}
                <p className="text-white text-sm md:text-base leading-relaxed font-sans italic tracking-wide">
                  “{currentDua.text}”
                </p>

                {/* Meaning */}
                {currentDua.meaning && (
                  <p className="text-gray-400 text-xs leading-relaxed font-light font-sans max-w-md mx-auto border-t border-white/5 pt-4">
                    <span className="text-[10px] uppercase font-serif tracking-widest text-gold-300 font-semibold block mb-1">Meaning</span>
                    {currentDua.meaning}
                  </p>
                )}

              </div>

              {/* Action Toolbar */}
              <div className="border-t border-white/5 pt-6 flex justify-between items-center mt-6">
                
                {/* Left/Right Deck Browsers */}
                <div className="flex gap-2">
                  <button
                    onClick={handlePrevDua}
                    className="glass-panel border border-white/5 p-2 rounded-full text-gold-300 hover:text-white hover:border-gold-300/30 transition-all cursor-pointer"
                    title="Previous supplication"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  
                  <span className="text-[10px] text-gray-500 font-mono self-center px-1">
                    {currentIndex + 1} / {filteredList.length}
                  </span>

                  <button
                    onClick={handleNextDua}
                    className="glass-panel border border-white/5 p-2 rounded-full text-gold-300 hover:text-white hover:border-gold-300/30 transition-all cursor-pointer"
                    title="Next supplication"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Sharing actions */}
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="glass-panel border border-white/5 p-2.5 rounded-full text-gold-300 hover:text-white hover:border-gold-300/30 transition-all cursor-pointer flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-semibold px-4"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>

                  <button
                    onClick={handleShare}
                    className="glass-panel border border-white/5 p-2.5 rounded-full text-gold-300 hover:text-white hover:border-gold-300/30 transition-all cursor-pointer"
                    title="Share Dua on WhatsApp"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </div>

          </div>
        ) : (
          <div className="glass-panel border border-white/10 p-12 rounded-2xl max-w-xl w-full text-center flex flex-col items-center justify-center border-dashed">
            <AlertCircle className="w-8 h-8 text-gold-400 mb-4 animate-pulse" />
            <p className="text-gray-400 text-xs font-light">Loading spiritual dua decks...</p>
          </div>
        )}

      </div>
    </section>
  );
}
