'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Shield, Volume2, VolumeX, Sparkles, Flame, Calendar, ExternalLink } from 'lucide-react';

interface NavbarProps {
  eidType?: 'fitr' | 'adha';
}

export default function Navbar({ eidType = 'adha' }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Wish Generator', href: '#personal-wish-section', icon: '🌙' },
    { label: 'Surprise Envelope', href: '#surprise-blessing-section', icon: '✉️' },
    ...(eidType === 'adha' ? [
      { label: 'Qurbani Story', href: '#qurbani-timeline-section', icon: '🐄' },
      { label: 'Cattle Haat Map', href: '#cattle-market-section', icon: '🚜' },
      { label: 'Three Shares', href: '#three-shares-section', icon: '🍖' },
      { label: 'Memory Wall', href: '#memory-wall-section', icon: '📸' },
      { label: 'bKash Salami', href: '#bkash-salami-section', icon: '📱' },
    ] : []),
    { label: '3D Card Creator', href: '#card-generator-section', icon: '💳' },
    { label: 'Dua Deck', href: '#dua-generator-section', icon: '🕌' },
    { label: 'Global Wall', href: '#global-wishes-section', icon: '🌐' }
  ];

  const handleScrollTo = (id: string) => {
    setIsOpen(false);
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Primary Fixed Navbar wrapper */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/5 px-6 py-4 flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
        
        {/* Left: Brand Logo */}
        <Link 
          href="/" 
          className="font-serif text-lg font-bold tracking-[0.15em] text-white hover:text-gold-300 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          EIDVERSE 
          <span className="text-[10px] text-gold-400 font-sans tracking-widest bg-gold-500/10 px-2 py-0.5 rounded border border-gold-400/20 uppercase">
            {eidType === 'adha' ? 'Adha Special' : 'Fitr Mode'}
          </span>
        </Link>

        {/* Center space remains completely clear and minimal for premium visual aesthetics */}

        {/* Right: Tools & Menu Toggle */}
        <div className="flex items-center gap-4">
          
          {/* Quick theme toggles (Desktop only) */}
          <div className="hidden sm:flex items-center gap-2 glass-panel border border-white/5 p-1 rounded-full text-[9px] uppercase tracking-widest font-semibold">
            <Link 
              href="/?theme=adha" 
              className={`px-3 py-1 transition-all rounded-full cursor-pointer flex items-center gap-1 ${
                eidType === 'adha' ? 'bg-[#B8860B] text-black font-bold' : 'hover:text-gold-300'
              }`}
            >
              🐄 Adha
            </Link>
            <Link 
              href="/?theme=fitr" 
              className={`px-3 py-1 transition-all rounded-full cursor-pointer flex items-center gap-1 ${
                eidType === 'fitr' ? 'bg-[#7EC8A4] text-black font-bold' : 'hover:text-green-300'
              }`}
            >
              🌙 Fitr
            </Link>
          </div>

          {/* Admin console link (Desktop only) */}
          <Link
            href="/admin"
            className="hidden sm:flex glass-panel border border-white/5 hover:border-gold-400/30 text-gold-300 hover:text-white px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all hover:scale-[1.03] active:scale-95 items-center gap-1.5 cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5" />
            Console
          </Link>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 text-gold-300 hover:text-white transition-colors cursor-pointer border border-white/5 bg-black/20 rounded-lg hover:scale-105"
            title="Toggle responsive navigation menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </header>

      {/* Mobile full screen drawer menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/90 backdrop-blur-lg flex flex-col justify-between p-8 pt-28 animate-fade-in">
          
          {/* Scrollable list of links */}
          <div className="flex flex-col gap-6 overflow-y-auto max-h-[60vh] border-b border-white/5 pb-6">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold border-b border-white/5 pb-2">
              Atmospheric Sections
            </span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleScrollTo(item.href)}
                  className="glass-panel border border-white/5 p-4 rounded-xl text-left hover:border-gold-300/30 text-white flex items-center gap-3 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <span className="text-xl bg-white/5 w-8 h-8 rounded-lg flex items-center justify-center border border-white/10">{item.icon}</span>
                  <span className="text-sm font-semibold uppercase tracking-wider">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Settings & Admin console segment in drawer footer */}
          <div className="flex flex-col gap-5 mt-4">
            
            {/* Quick Eid swap Campaign pills */}
            <div className="flex flex-col gap-2">
              <span className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold">
                Eid campaign selection
              </span>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/?theme=adha"
                  onClick={() => setIsOpen(false)}
                  className={`border p-3.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    eidType === 'adha'
                      ? 'bg-[#B8860B] border-[#B8860B] text-black shadow-lg'
                      : 'glass-panel border-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <Flame className="w-4 h-4" />
                  Qurbani Eid (Adha)
                </Link>
                <Link
                  href="/?theme=fitr"
                  onClick={() => setIsOpen(false)}
                  className={`border p-3.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    eidType === 'fitr'
                      ? 'bg-[#7EC8A4] border-[#7EC8A4] text-black shadow-lg'
                      : 'glass-panel border-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Sheer Khurma Eid (Fitr)
                </Link>
              </div>
            </div>

            {/* Dashboard shortcuts */}
            <div className="flex gap-3">
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="btn-golden flex-grow py-3.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Administrative Console
              </Link>
            </div>

          </div>

        </div>
      )}
    </>
  );
}
