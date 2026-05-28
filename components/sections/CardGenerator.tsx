'use client';

import React, { useState, useRef } from 'react';
import GoldenButton from '../ui/GoldenButton';
import { Download, Sparkles, Share2, Palette, RefreshCw, Send, Check, Copy } from 'lucide-react';
import { EidConfig } from '@/lib/eidDetector';
import { generateCustomWish } from '@/lib/wishTemplates';
import html2canvas from 'html2canvas';

interface CardGeneratorProps {
  config: EidConfig;
}

const themeCards = {
  moon: {
    bg: 'bg-gradient-to-b from-[#09121F] to-[#03070C] border-blue-500/20 text-[#FFF8E7]',
    moonColor: 'text-blue-300/40 filter drop-shadow-[0_0_15px_rgba(147,197,253,0.3)]',
    cardGlow: 'shadow-[0_0_30px_rgba(59,130,246,0.15)]',
    patternOpacity: 'opacity-5',
    titleColor: 'text-gold-200',
  },
  mosque: {
    bg: 'bg-gradient-to-tr from-[#1E1B29] to-[#0A0812] border-purple-500/20 text-[#FFF8E7]',
    moonColor: 'text-purple-300/30 filter drop-shadow-[0_0_15px_rgba(216,180,254,0.3)]',
    cardGlow: 'shadow-[0_0_30px_rgba(168,85,247,0.15)]',
    patternOpacity: 'opacity-5',
    titleColor: 'text-purple-300',
  },
  lantern: {
    bg: 'bg-gradient-to-b from-[#1C160E] to-[#080603] border-amber-500/20 text-[#FFF3D4]',
    moonColor: 'text-amber-300/30 filter drop-shadow-[0_0_15px_rgba(252,211,77,0.3)]',
    cardGlow: 'shadow-[0_0_30px_rgba(245,158,11,0.15)]',
    patternOpacity: 'opacity-5',
    titleColor: 'text-amber-400',
  },
  gold: {
    bg: 'bg-gradient-to-tr from-[#0F0F0B] via-[#050503] to-[#14120D] border-gold-500/30 text-[#FFF8E7]',
    moonColor: 'text-gold-400/40 filter drop-shadow-[0_0_15px_#B8860B]',
    cardGlow: 'shadow-[0_0_35px_rgba(184,134,11,0.25)]',
    patternOpacity: 'opacity-10',
    titleColor: 'text-gold-300',
  }
};

export default function CardGenerator({ config }: CardGeneratorProps) {
  const [senderName, setSenderName] = useState('Your Name');
  const [receiverName, setReceiverName] = useState('My Beloved Family');
  const [relationship, setRelationship] = useState('friend');
  const [profession, setProfession] = useState('none');
  const [personalMessage, setPersonalMessage] = useState('May Allah accept every silent prayer and fill your home with His mercy this Eid.');
  const [cardTheme, setCardTheme] = useState<'moon' | 'mosque' | 'lantern' | 'gold'>('gold');
  const [fontStyle, setFontStyle] = useState<'traditional' | 'modern'>('traditional');
  
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  // 3D tilt tracking style
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    transition: 'transform 0.5s ease',
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card || isDownloading) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalize coordinates: -0.5 to 0.5
    const normalizedX = (x / rect.width) - 0.5;
    const normalizedY = (y / rect.height) - 0.5;

    // Rotate bounds: max 12 degrees
    const rotateX = -normalizedY * 12;
    const rotateY = normalizedX * 12;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease',
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease',
    });
  };

  const handleSuggestMessage = () => {
    const sName = senderName === 'Your Name' ? 'Your Name' : senderName;
    const wish = generateCustomWish(
      sName,
      receiverName || 'Someone Special',
      relationship,
      cardTheme,
      config.themeKey === 'fitr' ? 'fitr' : 'adha',
      profession
    );
    setPersonalMessage(wish);
  };

  const handleDownload = async () => {
    if (!cardRef.current || isDownloading) return;
    setIsDownloading(true);

    // Capture original inline style transforms
    const originalTransform = cardRef.current.style.transform;
    const originalTransition = cardRef.current.style.transition;

    // Remove active 3D transforms to prevent html2canvas skew/crop bug
    cardRef.current.style.transform = 'none';
    cardRef.current.style.transition = 'none';

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2.5, // High resolution output
        useCORS: true,
        backgroundColor: null,
      });

      // Restore original 3D styles
      if (cardRef.current) {
        cardRef.current.style.transform = originalTransform;
        cardRef.current.style.transition = originalTransition;
      }

      const imgData = canvas.toDataURL('image/png');

      // Fallback for iOS / Mobile Safari where direct base64 downloads are blocked
      const isMobile = typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        const newTab = window.open();
        if (newTab) {
          newTab.document.write(`
            <html>
              <head>
                <title>Save Eid Card</title>
                <style>
                  body {
                    background-color: #070708;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    font-family: serif;
                    color: #fff8e7;
                    text-align: center;
                    padding: 20px;
                    box-sizing: border-box;
                  }
                  img {
                    max-width: 100%;
                    height: auto;
                    border: 1px solid rgba(212, 175, 55, 0.3);
                    border-radius: 12px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                  }
                  p {
                    color: #d4af37;
                    font-size: 14px;
                    letter-spacing: 0.1em;
                    margin-top: 20px;
                    text-transform: uppercase;
                  }
                </style>
              </head>
              <body>
                <img src="${imgData}" alt="Eid Card" />
                <p>Long Press the Image above to Save to Photos 📸</p>
              </body>
            </html>
          `);
          newTab.document.close();
          return;
        }
      }

      const link = document.createElement('a');
      link.download = `${receiverName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-eid-card.png`;
      link.href = imgData;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download Error:', err);
      if (cardRef.current) {
        cardRef.current.style.transform = originalTransform;
        cardRef.current.style.transition = originalTransition;
      }
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePublish = async () => {
    if (isPublishing) return;
    setIsPublishing(false);
    setIsPublishing(true);
    setShareUrl('');
    setCopied(false);

    try {
      const res = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName: senderName === 'Your Name' ? '' : senderName,
          receiverName,
          message: personalMessage,
          theme: cardTheme,
          fontStyle,
          eidType: config.themeKey === 'fitr' ? 'eid-al-fitr' : 'eid-al-adha'
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        const uniqueId = data.card.slug.replace('card-', '');
        setShareUrl(`${origin}/card/${uniqueId}`);
      }
    } catch (err) {
      console.error('Publish Error:', err);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCopy = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentTheme = themeCards[cardTheme];

  return (
    <section id="card-generator-section" className="relative py-24 w-full z-20 px-6 bg-[#030304]/60">
      
      {/* Background Islamic pattern */}
      <div className="absolute inset-0 arabic-pattern-overlay opacity-[0.015] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-sm md:text-base text-gold-300 tracking-[0.2em] uppercase mb-3">
            Portfolio Showpiece
          </h2>
          <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-wide">
            Interactive 3D Card Generator
          </h1>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto mt-4" />
          <p className="text-gray-400 text-xs md:text-sm mt-4 max-w-lg mx-auto leading-relaxed">
            Customize typography, message prompts, and premium Islamic backdrops. Download instantly as high-resolution PNG or publish and share on WhatsApp!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Editor Panel */}
          <div className="lg:col-span-5 glass-panel p-8 rounded-2xl border border-white/10 flex flex-col gap-6">
            <div className="flex items-center gap-2 text-gold-300 font-serif border-b border-white/10 pb-4 mb-2">
              <Palette className="w-5 h-5 animate-pulse" />
              Card Creator Workspace
            </div>

            {/* Sender and Recipient Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-300 uppercase tracking-widest font-medium">From</label>
                <input
                  type="text"
                  maxLength={30}
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full bg-black/40 border border-white/10 focus:border-gold-400/50 rounded-lg px-4 py-3 text-sm text-white focus:outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-300 uppercase tracking-widest font-medium">To</label>
                <input
                  type="text"
                  maxLength={30}
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  placeholder="e.g. Beloved Friend"
                  className="w-full bg-black/40 border border-white/10 focus:border-gold-400/50 rounded-lg px-4 py-3 text-sm text-white focus:outline-none transition-all"
                />
              </div>
            </div>

             {/* Relationship Tone Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-300 uppercase tracking-widest font-medium">Relationship / Tone</label>
              <div className="relative">
                <select
                  value={relationship}
                  onChange={(e) => {
                    const val = e.target.value;
                    setRelationship(val);
                    const sName = senderName === 'Your Name' ? 'Your Name' : senderName;
                    const wish = generateCustomWish(
                      sName,
                      receiverName || 'Someone Special',
                      val,
                      cardTheme,
                      config.themeKey === 'fitr' ? 'fitr' : 'adha',
                      profession
                    );
                    setPersonalMessage(wish);
                  }}
                  className="w-full bg-black/40 border border-white/10 focus:border-gold-400/50 rounded-lg px-4 py-3 text-sm text-white focus:outline-none transition-all cursor-pointer appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='rgba(212,175,55,0.7)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    backgroundSize: '16px'
                  }}
                >
                  <option value="friend" className="bg-[#0e0e11] text-white">Friend / Close Buddy</option>
                  <option value="parent" className="bg-[#0e0e11] text-white">Respectful Parent</option>
                  <option value="sibling" className="bg-[#0e0e11] text-white">Sibling (Funny & Heartfelt)</option>
                  <option value="spouse" className="bg-[#0e0e11] text-white">Spouse / Partner 💍</option>
                  <option value="child" className="bg-[#0e0e11] text-white">Beloved Child</option>
                  <option value="teacher" className="bg-[#0e0e11] text-white">Honorable Teacher</option>
                  <option value="bangla" className="bg-[#0e0e11] text-white">Bangla Deshi Vibe 🐄</option>
                  <option value="spiritual" className="bg-[#0e0e11] text-white">Spiritual Sunnah 🌙</option>
                </select>
              </div>
            </div>

            {/* Recipient's Profession / Vibe Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-300 uppercase tracking-widest font-medium">Recipient's Profession / Vibe</label>
              <div className="relative">
                <select
                  value={profession}
                  onChange={(e) => {
                    const val = e.target.value;
                    setProfession(val);
                    const sName = senderName === 'Your Name' ? 'Your Name' : senderName;
                    const wish = generateCustomWish(
                      sName,
                      receiverName || 'Someone Special',
                      relationship,
                      cardTheme,
                      config.themeKey === 'fitr' ? 'fitr' : 'adha',
                      val
                    );
                    setPersonalMessage(wish);
                  }}
                  className="w-full bg-black/40 border border-white/10 focus:border-gold-400/50 rounded-lg px-4 py-3 text-sm text-white focus:outline-none transition-all cursor-pointer appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='rgba(212,175,55,0.7)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    backgroundSize: '16px'
                  }}
                >
                  <option value="none" className="bg-[#0e0e11] text-white">None (Use Relationship default)</option>
                  <option value="developer" className="bg-[#0e0e11] text-white">Software Engineer 💻</option>
                  <option value="doctor" className="bg-[#0e0e11] text-white">Doctor / Healthcare 🩺</option>
                  <option value="banker" className="bg-[#0e0e11] text-white">Banker / Accountant 📊</option>
                  <option value="student" className="bg-[#0e0e11] text-white">Student / Academic 📚</option>
                  <option value="businessman" className="bg-[#0e0e11] text-white">Businessman / Visionary 💼</option>
                  <option value="artist" className="bg-[#0e0e11] text-white">Artist / Designer 🎨</option>
                </select>
              </div>
            </div>

            {/* Custom Message Prompt */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs text-gray-300 uppercase tracking-widest font-medium">
                <span>Personal Message</span>
                <span className="text-[10px] text-gray-500">{personalMessage.length}/120</span>
              </div>
              <div className="relative">
                <textarea
                  maxLength={120}
                  rows={3}
                  value={personalMessage}
                  onChange={(e) => setPersonalMessage(e.target.value)}
                  placeholder="Write your custom blessing..."
                  className="w-full bg-black/40 border border-white/10 focus:border-gold-400/50 rounded-lg px-4 py-3 pr-12 text-sm text-white focus:outline-none transition-all resize-none leading-relaxed"
                />
                <button
                  onClick={handleSuggestMessage}
                  title="Suggest another message style ✨"
                  className="absolute right-3 bottom-3 text-gold-300 hover:text-gold-100 hover:scale-110 active:scale-95 transition-all p-1.5 cursor-pointer glass-panel border border-white/10 rounded-md bg-black/60 shadow-lg"
                >
                  <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                </button>
              </div>
            </div>

            {/* Font Style */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-300 uppercase tracking-widest font-medium">Typography Vibe</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setFontStyle('traditional')}
                  className={`py-2.5 px-4 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    fontStyle === 'traditional'
                      ? 'bg-gold-500 border-gold-400 text-black shadow-md'
                      : 'glass-panel border-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  Traditional Serif
                </button>
                <button
                  onClick={() => setFontStyle('modern')}
                  className={`py-2.5 px-4 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    fontStyle === 'modern'
                      ? 'bg-gold-500 border-gold-400 text-black shadow-md'
                      : 'glass-panel border-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  Modern Sans
                </button>
              </div>
            </div>

            {/* Theme Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-300 uppercase tracking-widest font-medium">Backdrop Presets</label>
              <div className="grid grid-cols-2 gap-3">
                {Object.keys(themeCards).map((t) => {
                  const isSelected = cardTheme === t;
                  return (
                    <button
                      key={t}
                      onClick={() => setCardTheme(t as any)}
                      className={`py-3 px-4 rounded-xl text-xs font-semibold border capitalize transition-all cursor-pointer hover:scale-[1.02] ${
                        isSelected 
                          ? 'border-gold-400 ring-1 ring-gold-400/20 text-gold-300' 
                          : 'glass-panel border-white/5 text-gray-400 hover:text-white'
                      }`}
                    >
                      {t} Preset
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action buttons */}
            <div className="border-t border-white/10 pt-6 flex flex-col gap-3">
              <GoldenButton
                onClick={handleDownload}
                disabled={isDownloading || !receiverName.trim()}
                className="w-full flex items-center justify-center gap-2"
              >
                {isDownloading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Capturing Canvas Pixels...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Download HD Image (PNG)
                  </>
                )}
              </GoldenButton>

              <button
                onClick={handlePublish}
                disabled={isPublishing || !receiverName.trim()}
                className="glass-panel border border-white/10 hover:border-gold-300/30 text-white font-semibold py-3.5 rounded-lg text-sm transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isPublishing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
                Publish & Share Link
              </button>
            </div>

          </div>

          {/* Right Column: Live Card Canvas Preview */}
          <div className="lg:col-span-7 flex flex-col gap-6 items-center">
            
            {/* The exported canvas card */}
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={tiltStyle}
              className={`relative aspect-[4/3] w-full max-w-[480px] rounded-2xl border p-8 md:p-10 flex flex-col justify-between overflow-hidden ${currentTheme.bg} ${currentTheme.cardGlow} select-none cursor-pointer`}
            >
              {/* Islamic Pattern grid overlay */}
              <div 
                className={`absolute inset-0 arabic-pattern-overlay ${currentTheme.patternOpacity} pointer-events-none`}
                style={{ mixBlendMode: 'overlay' }}
              />

              {/* Card Corner Accents */}
              <div className="absolute top-4 left-4 text-gold-400/30 font-serif text-[10px] tracking-widest select-none pointer-events-none uppercase">
                🕌 EID
              </div>
              <div className="absolute top-4 right-4 text-gold-400/30 font-serif text-[10px] tracking-widest select-none pointer-events-none uppercase">
                ADHA 🕋
              </div>

              {/* Decorative center icon or moon */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 flex items-center justify-center pointer-events-none">
                <svg
                  viewBox="0 0 100 100"
                  className={`w-full h-full ${currentTheme.moonColor}`}
                >
                  <path d="M50,10 C62.5,10 74,15.5 82,24 C71.5,23.5 59.5,29.5 52,38.5 C44.5,47.5 43.5,59.5 48.5,69.5 C36.5,66 28,54.5 28,41 C28,24 37.5,10 50,10 Z" />
                </svg>
              </div>

              {/* Custom recipient slot */}
              <div className="relative z-10 text-center flex flex-col items-center">
                <span className="text-[10px] md:text-xs text-gold-300 font-serif tracking-[0.25em] uppercase font-semibold block mb-2">
                  Prepared Especially For
                </span>
                <h3 className={`font-serif text-2xl md:text-3xl font-bold tracking-wide ${currentTheme.titleColor}`}>
                  {receiverName || 'My Beloved Friend'}
                </h3>
                <div className="w-16 h-[1.5px] bg-gradient-to-r from-transparent via-gold-400 to-transparent mt-3" />
              </div>

              {/* Custom message slot */}
              <div className="relative z-10 text-center my-6">
                <p className={`text-xs md:text-sm leading-relaxed font-light ${
                  fontStyle === 'traditional' ? 'font-serif italic' : 'font-sans'
                }`}>
                  “{personalMessage || 'May Allah accept every prayer and bless you with infinite mercy.'}”
                </p>
              </div>

              {/* Custom footer slot */}
              <div className="relative z-10 text-center border-t border-gold-400/10 pt-4 flex flex-col items-center">
                {senderName && senderName !== 'Your Name' && (
                  <span className="text-[10px] text-gold-300 font-serif mb-1.5 block tracking-wide select-none">
                    With Love & Respect: {senderName}
                  </span>
                )}
                <span className="font-arabic text-xl text-gold-300 tracking-wider">عيد مبارك</span>
                <span className="text-[9px] uppercase tracking-widest text-gray-500 mt-1 font-light">
                  {config.type === 'eid-al-fitr' ? 'Eid al-Fitr' : 'Eid al-Adha'} • Created on EidVerse
                </span>
              </div>

            </div>

            {/* Published Link Overlay */}
            {shareUrl && (
              <div className="w-full max-w-[480px] glass-panel border border-gold-400/30 p-6 rounded-2xl flex flex-col gap-4 animate-fade-in">
                <div className="flex items-center gap-2 text-xs text-gold-300 font-serif tracking-widest uppercase">
                  <Sparkles className="w-4 h-4 text-amber-500 animate-bounce" />
                  Card Published Successfully!
                </div>
                
                <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg p-2.5">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="bg-transparent text-xs text-gray-300 w-full focus:outline-none select-all font-mono"
                  />
                  <button
                    onClick={handleCopy}
                    className="text-gold-300 hover:text-white p-1.5 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4.5 h-4.5" />}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleCopy}
                    className="btn-golden py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    Copy URL
                  </button>
                  <a
                    href={shareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-panel border border-white/10 text-white hover:border-gold-300/30 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-95 transition-all text-center"
                  >
                    <Send className="w-4 h-4" />
                    Open Card Page
                  </a>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
