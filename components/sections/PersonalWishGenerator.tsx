'use client';

import React, { useState, useRef } from 'react';
import { EidConfig } from '@/lib/eidDetector';
import GoldenButton from '../ui/GoldenButton';
import { Copy, Share2, Sparkles, Wand2, RefreshCw, Send, Check } from 'lucide-react';
import gsap from 'gsap';

interface PersonalWishGeneratorProps {
  config: EidConfig;
}

const relationshipOptions = [
  { value: 'friend', label: 'Friend' },
  { value: 'parent', label: 'Parent' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'spouse', label: 'Spouse' },
  { value: 'child', label: 'Child' },
  { value: 'teacher', label: 'Teacher' },
  { value: 'bangla', label: 'Bangla Vibe 🐄' },
  { value: 'spiritual', label: 'Spiritual Sunnah 🌙' }
];

const themeOptions = [
  { value: 'moon', label: 'Moon Theme', desc: 'Silver night sky', bg: 'bg-[#09121F] border-blue-500/30' },
  { value: 'mosque', label: 'Mosque Theme', desc: 'Glowing domes', bg: 'bg-[#1E1B29] border-purple-500/30' },
  { value: 'lantern', label: 'Lantern Theme', desc: 'Warm hanging lights', bg: 'bg-[#1C160E] border-amber-500/30' },
  { value: 'gold', label: 'Royal Gold', desc: 'Heavy textured luxury', bg: 'bg-[#0F0F0B] border-gold-500/30' }
];

export default function PersonalWishGenerator({ config }: PersonalWishGeneratorProps) {
  const [sender, setSender] = useState('');
  const [receiver, setReceiver] = useState('');
  const [relationship, setRelationship] = useState('friend');
  const [theme, setTheme] = useState('gold');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWish, setGeneratedWish] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const wishDisplayRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sender.trim() || !receiver.trim()) return;

    setIsGenerating(true);
    setGeneratedWish('');
    setShareUrl('');
    setCopied(false);

    // Audio cue
    try {
      if ((window as any).triggerEidChime) {
        (window as any).triggerEidChime();
      }
    } catch (err) {}

    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName: sender,
          receiverName: receiver,
          relationship,
          theme,
          eidType: config.themeKey === 'fitr' ? 'eid-al-fitr' : 'eid-al-adha'
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setGeneratedWish(data.wish.message);
        
        // Generate full shareable URL
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        setShareUrl(`${origin}/wish/${data.wish.slug}`);

        // Beautiful staggered word-by-word reveal using GSAP
        setTimeout(() => {
          if (wishDisplayRef.current) {
            const words = wishDisplayRef.current.querySelectorAll('.word-span');
            gsap.fromTo(words, 
              { opacity: 0, y: 10, scale: 0.9 },
              { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.08, ease: 'power2.out' }
            );
          }
        }, 50);
      }
    } catch (err) {
      console.error('Generation Error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!shareUrl) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Personalized Eid Greetings from ${sender}`,
          text: `Hey! I prepared a beautiful cinematic Eid greeting especially for you. Open this link:`,
          url: shareUrl,
        });
      } catch (err) {}
    } else {
      handleCopyLink();
    }
  };

  return (
    <section id="personal-wish-section" className="relative py-24 w-full z-20 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-sm md:text-base text-gold-300 tracking-[0.2em] uppercase mb-3">
            Viral Connectivity Loop
          </h2>
          <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-wide">
            Personalized Eid Wish Generator
          </h1>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Generator Form Panel */}
          <form 
            onSubmit={handleGenerate}
            className="lg:col-span-6 glass-panel p-8 rounded-2xl border border-white/10 flex flex-col gap-6"
          >
            <div className="flex items-center gap-2 text-gold-300 font-serif border-b border-white/10 pb-4 mb-2">
              <Wand2 className="w-5 h-5" />
              Custom Greeting Blueprint
            </div>

            {/* Sender Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-300 uppercase tracking-widest font-medium">Your Name</label>
              <input
                type="text"
                required
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="Enter your name..."
                className="w-full bg-black/40 border border-white/10 focus:border-gold-400/50 rounded-lg px-4 py-3 text-sm text-white focus:outline-none transition-all placeholder:text-gray-600"
              />
            </div>

            {/* Receiver Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-300 uppercase tracking-widest font-medium">Friend's Name</label>
              <input
                type="text"
                required
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                placeholder="Enter their name..."
                className="w-full bg-black/40 border border-white/10 focus:border-gold-400/50 rounded-lg px-4 py-3 text-sm text-white focus:outline-none transition-all placeholder:text-gray-600"
              />
            </div>

            {/* Relationship Dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-300 uppercase tracking-widest font-medium">Relationship Dynamic</label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full bg-[#0a0a0c] border border-white/10 focus:border-gold-400/50 rounded-lg px-4 py-3 text-sm text-white focus:outline-none transition-all cursor-pointer"
              >
                {relationshipOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#0a0a0c] text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Theme Card Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-300 uppercase tracking-widest font-medium">Visual Aesthetics Template</label>
              <div className="grid grid-cols-2 gap-3">
                {themeOptions.map((opt) => {
                  const isSelected = theme === opt.value;
                  return (
                    <div
                      key={opt.value}
                      onClick={() => setTheme(opt.value)}
                      className={`cursor-pointer border rounded-xl p-3 flex flex-col justify-between min-h-[75px] transition-all hover:scale-[1.02] ${opt.bg} ${
                        isSelected 
                          ? 'border-gold-400 ring-1 ring-gold-400/30 bg-black/60 shadow-[0_0_12px_rgba(226,192,125,0.15)]' 
                          : 'opacity-60 hover:opacity-100 bg-black/30'
                      }`}
                    >
                      <span className={`text-xs font-semibold ${isSelected ? 'text-gold-300' : 'text-gray-300'}`}>
                        {opt.label}
                      </span>
                      <span className="text-[10px] text-gray-400 mt-1 block font-light">
                        {opt.desc}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <GoldenButton
              type="submit"
              disabled={isGenerating || !sender.trim() || !receiver.trim()}
              className="mt-2 w-full flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Drawing Star Gradients...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Cinematic Wish
                </>
              )}
            </GoldenButton>
          </form>

          {/* Right Side: Canvas Preview & Share Panel */}
          <div className="lg:col-span-6 flex flex-col gap-6 w-full h-full justify-stretch">
            
            {generatedWish ? (
              // Active Cinematic Reveal
              <div className="glass-panel p-8 rounded-2xl border border-white/10 flex-grow flex flex-col justify-between min-h-[350px] shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]">
                
                {/* Visual Header */}
                <div className="flex items-center justify-between text-xs text-gray-400 uppercase tracking-widest border-b border-white/10 pb-4">
                  <span>Custom Live Preview</span>
                  <span className="text-gold-300">{theme} Theme</span>
                </div>

                {/* Animated Body Wish Text */}
                <div 
                  ref={wishDisplayRef}
                  className="font-serif text-lg md:text-xl leading-relaxed text-white py-8 text-center"
                >
                  {generatedWish.split(' ').map((word, idx) => (
                    <span
                      key={idx}
                      className="word-span inline-block mr-1.5 opacity-0 transform translate-y-2 select-none"
                    >
                      {word}
                    </span>
                  ))}
                </div>

                {/* Action Buttons Panel */}
                <div className="border-t border-white/10 pt-6 flex flex-col gap-4">
                  <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg p-2.5">
                    <input
                      type="text"
                      readOnly
                      value={shareUrl}
                      className="bg-transparent text-xs text-gray-300 w-full focus:outline-none select-all font-mono"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="text-gold-300 hover:text-white p-1.5 transition-colors cursor-pointer"
                      title="Copy Share Link"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleShare}
                      className="btn-golden w-full py-3.5 rounded-lg text-sm flex items-center justify-center gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                      Send to Friend
                    </button>

                    <a
                      href={shareUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-panel border border-white/10 hover:border-gold-300/30 text-white font-semibold rounded-lg text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all text-center py-3.5"
                    >
                      <Send className="w-4 h-4" />
                      Open Full Screen
                    </a>
                  </div>
                </div>

              </div>
            ) : (
              // Empty Slate state
              <div className="glass-panel p-8 rounded-2xl border border-white/10 flex-grow min-h-[350px] flex flex-col items-center justify-center text-center border-dashed border-white/20">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gold-300 mb-4 animate-pulse">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-medium text-white mb-2">Cinematic Preview Awaiting</h3>
                <p className="text-gray-400 text-xs max-w-xs leading-relaxed">
                  Enter your names and preferences, then generate your greeting. A customized viral link will appear here instantly.
                </p>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
