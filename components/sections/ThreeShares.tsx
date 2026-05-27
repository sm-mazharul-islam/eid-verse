'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Home, Users, Gift, Sparkles, Heart } from 'lucide-react';
import gsap from 'gsap';

interface ShareItem {
  id: number;
  name: string;
  fraction: string;
  colorClass: string;
  glowClass: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function ThreeShares() {
  const [activeShare, setActiveShare] = useState(0);
  const [totalSacrificed, setTotalSacrificed] = useState(0);
  const [totalFeedCount, setTotalFeedCount] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const shares: ShareItem[] = [
    {
      id: 0,
      name: 'Your Family',
      fraction: '1/3 Share',
      colorClass: 'bg-gold-500 text-black',
      glowClass: 'shadow-[0_0_20px_#B8860B]',
      icon: <Home className="w-5 h-5" />,
      title: 'Family & Household Blessing',
      description: 'The first share belongs to your own family. Gathering together around the breakfast and lunch table to break bread and share fresh dishes creates the eternal warmth and bond of home.'
    },
    {
      id: 1,
      name: 'Friends & Neighbors',
      fraction: '1/3 Share',
      colorClass: 'bg-emerald-500 text-black',
      glowClass: 'shadow-[0_0_20px_#2D5016]',
      icon: <Users className="w-5 h-5" />,
      title: 'Strengthening Community Bonds',
      description: 'The second share goes to relatives, friends, and neighbors. Exchanging plates and feeding the surrounding community is the absolute heart of Islamic hospitality and social harmony.'
    },
    {
      id: 2,
      name: 'The Vulnerable',
      fraction: '1/3 Share',
      colorClass: 'bg-white text-black',
      glowClass: 'shadow-[0_0_20px_rgba(255,255,255,0.7)]',
      icon: <Gift className="w-5 h-5" />,
      title: 'The Soul of Generosity',
      description: 'The third share goes to the poor and vulnerable. This is the deepest spiritual essence of Qurbani — guaranteeing that no family goes hungry on this sacred day.'
    }
  ];

  // Animated counters on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;

      if (inView && totalSacrificed === 0) {
        // Start counting animations
        const duration = 2.0; // Seconds
        const endSacrificed = 120000000; // 120 Million globally
        const endFeed = 350000000; // 350 Million fed

        let start = 0;
        const step = (timestamp: number) => {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / (duration * 1000), 1);
          
          setTotalSacrificed(Math.floor(progress * endSacrificed));
          setTotalFeedCount(Math.floor(progress * endFeed));

          if (progress < 1) {
            requestAnimationFrame(step);
          }
        };
        requestAnimationFrame(step);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [totalSacrificed]);

  return (
    <section id="three-shares-section" className="relative py-24 w-full z-20 px-6">
      <div className="max-w-5xl mx-auto" ref={containerRef}>
        
        {/* Title */}
        <div className="text-center mb-20">
          <h2 className="font-serif text-sm md:text-base text-gold-300 tracking-[0.2em] uppercase mb-3">
            Interactive Infographic
          </h2>
          <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-wide">
            The Three Shares of Qurbani
          </h1>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto mt-4" />
          <p className="text-gray-400 text-xs md:text-sm mt-4 max-w-lg mx-auto leading-relaxed">
            The distribution of Qurbani meat is designed to balance self-sustenance, friendship, and absolute social welfare. Click each segment below to learn more.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Animated Infographic Circle */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center">
              
              {/* Central Glowing Core */}
              <div className="absolute w-28 h-28 rounded-full bg-[#0a0c10] border border-white/10 z-30 flex flex-col items-center justify-center text-center shadow-[inset_0_0_15px_rgba(255,255,255,0.05)]">
                <span className="font-serif text-xl font-bold text-gold-300">100%</span>
                <span className="text-[8px] uppercase tracking-widest text-gray-400">Total Distribution</span>
              </div>

              {/* Segment 1: Family (1/3 Circle - Top left slice) */}
              <div 
                onClick={() => setActiveShare(0)}
                className={`absolute w-full h-full rounded-full cursor-pointer transition-all duration-500 border-4 border-transparent ${
                  activeShare === 0 ? 'scale-105 rotate-[-5deg] z-20' : 'opacity-65 hover:opacity-90 scale-100 z-10'
                }`}
                style={{
                  clipPath: 'polygon(50% 50%, 50% 0, 100% 50%, 50% 50%)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-gold-600 via-gold-500 to-gold-300" />
              </div>

              {/* Segment 2: Friends (1/3 Circle - Right slice) */}
              <div 
                onClick={() => setActiveShare(1)}
                className={`absolute w-full h-full rounded-full cursor-pointer transition-all duration-500 border-4 border-transparent ${
                  activeShare === 1 ? 'scale-105 rotate-[5deg] z-20' : 'opacity-65 hover:opacity-90 scale-100 z-10'
                }`}
                style={{
                  clipPath: 'polygon(50% 50%, 100% 50%, 50% 100%, 50% 50%)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-700 via-emerald-500 to-green-400" />
              </div>

              {/* Segment 3: Poor (1/3 Circle - Left slice) */}
              <div 
                onClick={() => setActiveShare(2)}
                className={`absolute w-full h-full rounded-full cursor-pointer transition-all duration-500 border-4 border-transparent ${
                  activeShare === 2 ? 'scale-105 rotate-[0deg] z-20' : 'opacity-65 hover:opacity-90 scale-100 z-10'
                }`}
                style={{
                  clipPath: 'polygon(50% 50%, 50% 100%, 0% 50%, 50% 0, 50% 50%)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-bl from-gray-200 via-white to-gray-100" />
              </div>

            </div>

            {/* Quick click controls below the circle */}
            <div className="flex gap-4 mt-8">
              {shares.map((sh) => (
                <button
                  key={sh.id}
                  onClick={() => setActiveShare(sh.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeShare === sh.id 
                      ? `${sh.colorClass} ${sh.glowClass} scale-105`
                      : 'glass-panel border-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  {sh.icon}
                  {sh.name}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Info Decks & Counters */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            
            {/* Fact Reader */}
            <div className="glass-panel p-8 rounded-2xl border border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.01)] min-h-[220px]">
              <div className="flex items-center justify-between text-xs text-gold-300 font-serif tracking-widest uppercase border-b border-white/5 pb-4 mb-4">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Divine Fraction System
                </span>
                <span>{shares[activeShare].fraction}</span>
              </div>
              <h2 className="font-serif text-xl font-bold text-white mb-3">
                {shares[activeShare].title}
              </h2>
              <p className="text-gray-300 text-xs md:text-sm leading-relaxed font-light">
                {shares[activeShare].description}
              </p>
            </div>

            {/* Live Counters Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-panel p-5 rounded-xl border border-white/5 text-center">
                <span className="text-[9px] uppercase tracking-widest text-gray-400 font-medium block mb-1">
                  Global Sacrifices
                </span>
                <span className="font-serif text-xl md:text-2xl font-bold text-gold-300 block tracking-wide">
                  ~{(totalSacrificed / 1000000).toFixed(1)}M
                </span>
                <span className="text-[8px] text-gray-500 block mt-1">Animals globally each Eid</span>
              </div>

              <div className="glass-panel p-5 rounded-xl border border-white/5 text-center">
                <span className="text-[9px] uppercase tracking-widest text-gray-400 font-medium block mb-1">
                  Vulnerable Families Fed
                </span>
                <span className="font-serif text-xl md:text-2xl font-bold text-emerald-400 block tracking-wide">
                  ~{(totalFeedCount / 1000000).toFixed(0)}M+
                </span>
                <span className="text-[8px] text-gray-500 block mt-1">Individuals receiving meat share</span>
              </div>
            </div>

            {/* Charitable CTA */}
            <div className="glass-panel p-6 rounded-xl border border-amber-500/20 bg-gradient-to-r from-[#1c160e]/40 to-transparent flex flex-col md:flex-row items-center gap-5 justify-between">
              <div className="flex flex-col gap-1 text-center md:text-left">
                <h4 className="font-serif text-xs font-semibold text-gold-300 uppercase tracking-wider">
                  Cannot perform Qurbani yourself?
                </h4>
                <p className="text-[10px] text-gray-400 leading-relaxed font-light">
                  Consider donating a full cattle share to trusted global charity operations to feed starving communities in Yemen, East Africa, and Syria.
                </p>
              </div>

              <a
                href="https://www.islamic-relief.org"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-golden flex items-center justify-center gap-1.5 text-xs py-2 px-5 rounded-lg font-semibold hover:scale-105 active:scale-95 transition-all text-center shrink-0"
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
                Sponsor a Share
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
