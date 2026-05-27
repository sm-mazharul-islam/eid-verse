'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Compass, Eye, Heart, HelpCircle, Flame, Moon, Sparkles } from 'lucide-react';
import gsap from 'gsap';

interface TimelineChapter {
  id: number;
  title: string;
  subtitle: string;
  arabic?: string;
  text: string;
  verse?: string;
  visual: React.ReactNode;
}

export default function QurbaniTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [activeChapter, setActiveChapter] = useState(0);

  const chapters: TimelineChapter[] = [
    {
      id: 0,
      title: 'Chapter 1: The Command',
      subtitle: 'A Vision in the Starlit Desert',
      verse: '“O my son, indeed I have seen in a dream that I sacrifice you, so see what you think.” (Quran 37:102)',
      text: 'Under the open Arabian sky, Ibrahim (AS) received a divine instruction that would test the very fiber of his existence. It was not a call of wrath, but a profound trial of absolute obedience and trust in Al-Khaliq.',
      visual: (
        <div className="relative w-full h-full bg-[#08090f] flex items-center justify-center rounded-xl overflow-hidden border border-white/5 shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
          {/* Constellation effect */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
          <div className="relative text-center p-6 z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gold-500/10 border border-gold-400/20 flex items-center justify-center mb-4 text-gold-300 animate-pulse">
              <Eye className="w-7 h-7" />
            </div>
            <span className="font-arabic text-xl text-gold-300 block mb-2">يَا بُنَيَّ إِنِّي أَرَىٰ فِي الْمَنَامِ أَنِّي أَذْبَحُكَ</span>
            <span className="text-[10px] uppercase tracking-widest text-gray-400">Divine Dream Vision</span>
          </div>
        </div>
      )
    },
    {
      id: 1,
      title: "Chapter 2: The Son's Obedience",
      subtitle: 'Complete Love & Faith',
      verse: '“O my father, do what you are commanded. You will find me, if Allah wills, of the steadfast.” (Quran 37:102)',
      text: 'Ismail (AS), a young boy raised with pure devotion, did not hesitate. His heart was locked in alignment with his father’s. Together, they turned their backs to doubts and stood united in submission.',
      visual: (
        <div className="relative w-full h-full bg-[#0a0f0d] flex items-center justify-center rounded-xl overflow-hidden border border-white/5">
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/20 to-transparent" />
          <div className="relative text-center p-6 z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center mb-4 text-emerald-300 animate-pulse">
              <Heart className="w-7 h-7" />
            </div>
            <span className="font-arabic text-xl text-emerald-300 block mb-2">يَا أَبَتِ افْعَلْ مَا تُؤْمَرُ ۖ سَتَجِدُنِي إِنْ شَاءَ اللَّهُ مِنَ الصَّابِرِينَ</span>
            <span className="text-[10px] uppercase tracking-widest text-gray-400">Undivided Submission</span>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: 'Chapter 3: The Journey',
      subtitle: 'Every Step is Sacrifice',
      text: 'Father and son walked side-by-side toward Mount Arafat. Every step on the dusty gravel was an echo of faith. The shadows lengthened in the early dawn sun, framing their resolve.',
      visual: (
        <div className="relative w-full h-full bg-[#0d0a08] flex items-center justify-center rounded-xl overflow-hidden border border-white/5">
          <div className="relative text-center p-6 z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-400/20 flex items-center justify-center mb-4 text-amber-400">
              <Compass className="w-7 h-7 animate-spin" style={{ animationDuration: '20s' }} />
            </div>
            <span className="font-serif text-lg text-gold-300 block mb-2">Desert Mountain Path</span>
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-light">Mina, Makkah Valley</span>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: 'Chapter 4: The Stillness',
      subtitle: 'Blinding White Light',
      text: 'The absolute peak of devotion. As Ibrahim raised his hands in prayer, his eyes turned to the heavens, a blinding white light representing divine presence filled the landscape. A moment of ultimate peace.',
      visual: (
        <div className="relative w-full h-full bg-white flex items-center justify-center rounded-xl overflow-hidden border border-gold-400/30 transition-all duration-500 shadow-[0_0_40px_rgba(255,255,255,0.7)]">
          <div className="absolute inset-0 bg-gradient-to-tr from-gold-100 to-white" />
          <div className="relative text-center p-6 z-10 flex flex-col items-center text-black">
            <div className="w-16 h-16 rounded-full bg-gold-400/20 border border-gold-600/40 flex items-center justify-center mb-4 animate-ping">
              <Sparkles className="w-7 h-7 text-gold-600" />
            </div>
            <span className="font-serif text-xl font-bold text-gold-700 block mb-1">Divine Intervention</span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Perfect Devotion Accepted</span>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: 'Chapter 5: The Ransom',
      subtitle: 'Miracle of The Ram',
      verse: '“O Ibrahim, you have fulfilled the vision. Indeed, We thus reward the doers of good.” (Quran 37:104-105)',
      text: 'In the place of Ismail, a majestic ram appeared in the golden brush. Ibrahim wept in gratitude, embracing his son. The sacrifice was accepted, not of blood and flesh, but of their pure intentions.',
      visual: (
        <div className="relative w-full h-full bg-[#120f0a] flex items-center justify-center rounded-xl overflow-hidden border border-gold-400/20">
          <div className="relative text-center p-6 z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gold-400/10 border border-gold-400/30 flex items-center justify-center mb-4 text-gold-400">
              <Flame className="w-7 h-7" />
            </div>
            <span className="font-arabic text-xl text-gold-300 block mb-2">قَدْ صَدَّقْتَ الرُّؤْيَا ۚ إِنَّا كَذَٰلِكَ نَجْزِي الْمُحْسِنِينَ</span>
            <span className="text-[10px] uppercase tracking-widest text-gray-400">Acceptance & Mercy</span>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: 'Chapter 6: The Legacy',
      subtitle: 'Connecting Hearts Across Eras',
      text: 'Every Qurbani made today is not just a holiday tradition. It is a direct legacy and spiritual echo of Ibrahim’s love. We stand connected across thousands of years by the beauty of giving and faith.',
      visual: (
        <div className="relative w-full h-full bg-[#0a0a0d] flex items-center justify-center rounded-xl overflow-hidden border border-white/5">
          <div className="relative text-center p-6 z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-white">
              <Moon className="w-7 h-7 animate-pulse" />
            </div>
            <span className="font-serif text-lg text-white block mb-2">Eternal Spiritual Thread</span>
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-light">Every Sacrifice Matters</span>
          </div>
        </div>
      )
    }
  ];

  // Animate the path drawing as we scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !pathRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const scrollPos = window.innerHeight / 2 - rect.top;
      const height = rect.height;

      // Map scroll progress (0 to 1) to stroke dash offset
      const progress = Math.max(0, Math.min(1, scrollPos / height));
      const pathLength = pathRef.current.getTotalLength();
      
      pathRef.current.style.strokeDashoffset = String(pathLength * (1 - progress));

      // Determine active chapter card
      const chapterElements = containerRef.current.querySelectorAll('.timeline-chapter-card');
      let currentIdx = 0;
      
      chapterElements.forEach((el, idx) => {
        const elRect = el.getBoundingClientRect();
        if (elRect.top < window.innerHeight / 2) {
          currentIdx = idx;
        }
      });
      setActiveChapter(currentIdx);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger initially
    setTimeout(handleScroll, 100);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="qurbani-timeline-section" className="relative py-28 w-full z-20 px-6">
      
      {/* Title */}
      <div className="text-center mb-24 max-w-xl mx-auto">
        <h2 className="font-serif text-sm md:text-base text-gold-300 tracking-[0.2em] uppercase mb-3">
          Cinematic Storytelling
        </h2>
        <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-wide">
          The Sacrifice Timeline
        </h1>
        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto mt-4" />
        <p className="text-gray-400 text-xs md:text-sm mt-4 leading-relaxed">
          Follow the five chapters of Ibrahim (AS)'s devotion. The golden path draws itself as you scroll through history.
        </p>
      </div>

      <div ref={containerRef} className="relative max-w-5xl mx-auto">
        
        {/* SVG Drawing Line connecting timeline items */}
        <div className="absolute left-[30px] md:left-1/2 -translate-x-1/2 top-4 bottom-4 w-4 h-full pointer-events-none z-10">
          <svg className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Dark background guideline path */}
            <path
              d="M 8 0 L 8 4000" // Rough straight line fallback, updated dynamically if desired
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="3"
              strokeDasharray="8 8"
            />
            {/* Glowing gold drawing path */}
            <path
              ref={pathRef}
              d="M 8 0 L 8 4000"
              stroke="url(#gold-timeline-grad)"
              strokeWidth="4"
              strokeDasharray="1000"
              strokeDashoffset="1000"
              style={{ transition: 'stroke-dashoffset 0.1s ease-out' }}
            />
            <defs>
              <linearGradient id="gold-timeline-grad" x1="0" y1="0" x2="0" y2="100%">
                <stop offset="0%" stopColor="#E2C07D" />
                <stop offset="50%" stopColor="#B8860B" />
                <stop offset="100%" stopColor="#D2691E" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Chapters Cards */}
        <div className="flex flex-col gap-24 md:gap-32 relative">
          {chapters.map((chap, idx) => {
            const isEven = idx % 2 === 0;
            const isActive = activeChapter === idx;

            return (
              <div
                key={chap.id}
                className="timeline-chapter-card relative flex flex-col md:flex-row items-stretch w-full"
              >
                
                {/* Left Side (Even chapters: Info, Odd chapters: Visual on Desktop) */}
                <div className={`w-full md:w-1/2 flex flex-col justify-center px-8 z-20 ${
                  isEven ? 'md:order-1 md:text-right md:items-end' : 'md:order-2 md:text-left md:items-start'
                }`}>
                  
                  {/* Glowing Node on Line */}
                  <div className={`absolute left-[30px] md:left-1/2 -translate-x-1/2 w-5 h-5 rounded-full border border-gold-400/50 transition-all duration-500 z-30 flex items-center justify-center ${
                    isActive ? 'bg-gold-500 shadow-[0_0_15px_#B8860B] scale-125' : 'bg-[#070708] scale-100'
                  }`}>
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                  </div>

                  <span className="text-[10px] text-gold-300 font-serif uppercase tracking-[0.25em] mb-2">
                    {chap.subtitle}
                  </span>

                  <h2 className="font-serif text-2xl font-bold text-white mb-4 hover:text-gold-300 transition-colors">
                    {chap.title}
                  </h2>

                  {chap.verse && (
                    <blockquote className="border-l-2 md:border-l-0 md:border-r-2 border-gold-400/30 pl-4 md:pl-0 md:pr-4 py-1.5 text-xs text-gold-300/80 italic mb-4 max-w-md leading-relaxed font-serif">
                      {chap.verse}
                    </blockquote>
                  )}

                  <p className="text-gray-300 text-sm leading-relaxed max-w-md font-light mb-6">
                    {chap.text}
                  </p>
                </div>

                {/* Right Side (Visual Panel) */}
                <div className={`w-full md:w-1/2 px-8 flex items-center justify-center z-20 min-h-[220px] md:min-h-[250px] ${
                  isEven ? 'md:order-2' : 'md:order-1'
                }`}>
                  <div className={`w-full h-full max-w-sm aspect-video rounded-xl transition-all duration-700 ${
                    isActive 
                      ? 'scale-105 shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_15px_rgba(226,192,125,0.15)] opacity-100' 
                      : 'scale-95 opacity-40 blur-[0.5px]'
                  }`}>
                    {chap.visual}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
