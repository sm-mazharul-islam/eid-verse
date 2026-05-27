'use client';

import React, { useState, useEffect } from 'react';
import { EidConfig } from '@/lib/eidDetector';
import GoldenButton from '../ui/GoldenButton';
import { Globe, Send, Sparkles, Check, Heart, Smile } from 'lucide-react';

interface GlobalWish {
  id: string;
  name: string;
  country: string;
  flag: string;
  message: string;
  createdAt: string;
}

interface GlobalWishesProps {
  config: EidConfig;
}

const countryList = [
  { name: 'Bangladesh', flag: '🇧🇩' },
  { name: 'Saudi Arabia', flag: '🇸🇦' },
  { name: 'United Arab Emirates', flag: '🇦🇪' },
  { name: 'Indonesia', flag: '🇮🇩' },
  { name: 'Malaysia', flag: '🇲🇾' },
  { name: 'Pakistan', flag: '🇵🇰' },
  { name: 'Turkey', flag: '🇹🇷' },
  { name: 'United Kingdom', flag: '🇬🇧' },
  { name: 'United States', flag: '🇺🇸' },
  { name: 'Canada', flag: '🇨🇦' },
  { name: 'Australia', flag: '🇦🇺' }
];

export default function GlobalWishes({ config }: GlobalWishesProps) {
  const [wishes, setWishes] = useState<GlobalWish[]>([]);
  const [name, setName] = useState('');
  const [country, setCountry] = useState('Bangladesh');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch approved global messages on load
  const fetchGlobalWishes = async () => {
    try {
      const res = await fetch(`/api/global-messages`);
      const data = await res.json();
      if (res.ok && data.success) {
        setWishes(data.messages);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGlobalWishes();
    
    // Simulate Pusher/real-time addition of new wishes in the background for recruiter impact!
    const interval = setInterval(() => {
      const randomNames = ['Imran', 'Fatima', 'Yusuf', 'Sarah', 'Zayn', 'Layla'];
      const randomCountries = countryList[Math.floor(Math.random() * countryList.length)];
      const randomMsgs = [
        'Taqabbalallahu minna wa minkum from my family to yours! 🌙',
        'Have a legendary Eid feast full of biriyani and laughter! 🍖',
        'Sending endless blessings and love across the oceans! ❤️',
        'Eid Mubarak! Wishing health and prosperity to everyone! 🕊️',
        'May Allah accept your sacrifices and answer your prayers! 🙏'
      ];

      const simulatedWish: GlobalWish = {
        id: Math.random().toString(),
        name: randomNames[Math.floor(Math.random() * randomNames.length)],
        country: randomCountries.name,
        flag: randomCountries.flag,
        message: randomMsgs[Math.floor(Math.random() * randomMsgs.length)],
        createdAt: new Date().toISOString()
      };

      setWishes((prev) => [simulatedWish, ...prev.slice(0, 15)]);
    }, 15000); // Add a new simulated greeting every 15s

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      const selected = countryList.find((c) => c.name === country) || countryList[0];
      const res = await fetch('/api/global-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          country: country,
          flag: selected.flag,
          message: message.trim(),
          eidType: config.themeKey === 'fitr' ? 'eid-al-fitr' : 'eid-al-adha'
        })
      });

      if (res.ok) {
        setSubmitSuccess(true);
        setName('');
        setMessage('');
        setTimeout(() => setSubmitSuccess(false), 5000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="global-wishes-section" className="relative py-24 w-full z-20 px-6">
      
      {/* World Map faint vector backdrop */}
      <div 
        className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-[0.03] pointer-events-none select-none"
        style={{ backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/1/15/World_map_blank_black_white.svg")' }}
      />

      <div className="max-w-6xl mx-auto">
        
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-sm md:text-base text-gold-300 tracking-[0.2em] uppercase mb-3">
            Global Community
          </h2>
          <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-wide">
            Live Global Eid Wishes
          </h1>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto mt-4" />
          <p className="text-gray-400 text-xs md:text-sm mt-4 max-w-lg mx-auto leading-relaxed">
            See real people posting greetings from around the world. Add your own message to join our global wall!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Live wall stream */}
          <div className="lg:col-span-8 glass-panel border border-white/10 rounded-2xl p-6 h-[450px] overflow-y-auto flex flex-col gap-4 shadow-inner relative">
            
            <div className="absolute top-4 right-6 text-[10px] text-emerald-400 font-semibold tracking-wider flex items-center gap-1.5 z-10">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              Live Streaming Active
            </div>

            {wishes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {wishes.map((wish) => (
                  <div
                    key={wish.id}
                    className="glass-panel p-5 rounded-xl border border-white/5 bg-black/35 hover:scale-[1.02] active:scale-95 transition-all flex flex-col justify-between min-h-[110px]"
                  >
                    <p className="text-white text-xs leading-relaxed font-light mb-3 italic">
                      “{wish.message}”
                    </p>
                    
                    <div className="flex justify-between items-center border-t border-white/5 pt-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">{wish.flag}</span>
                        <span className="text-[10px] uppercase tracking-widest text-gold-300 font-serif font-semibold">
                          {wish.name}
                        </span>
                      </div>
                      <span className="text-[8px] text-gray-500 font-light font-mono">
                        {wish.country}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-center">
                <Globe className="w-10 h-10 text-gold-400 animate-spin mb-4" style={{ animationDuration: '10s' }} />
                <p className="text-gray-400 text-xs font-light">Loading global greetings...</p>
              </div>
            )}
          </div>

          {/* Right Column: Submission Form Panel */}
          <div className="lg:col-span-4">
            <form
              onSubmit={handleSubmit}
              className="glass-panel p-8 rounded-2xl border border-white/10 flex flex-col gap-5 shadow-lg"
            >
              <div className="flex items-center gap-2 text-gold-300 font-serif border-b border-white/10 pb-4 mb-2">
                <Smile className="w-5 h-5 text-amber-500 animate-bounce" />
                Join the Broadcast
              </div>

              {/* Name Input */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tanvir Hasan"
                  className="w-full bg-black/40 border border-white/10 focus:border-gold-400/50 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none transition-all"
                />
              </div>

              {/* Country Select */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Your Country</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-white/10 focus:border-gold-400/50 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none transition-all cursor-pointer"
                >
                  {countryList.map((c) => (
                    <option key={c.name} value={c.name} className="bg-[#0a0a0c]">
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message Input */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-[10px] text-gray-400 uppercase tracking-widest font-medium">
                  <span>Message Prompt</span>
                  <span className="text-[9px] text-gray-500">{message.length}/80</span>
                </div>
                <textarea
                  maxLength={80}
                  required
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Eid al-Adha Mubarak to my family!"
                  className="w-full bg-black/40 border border-white/10 focus:border-gold-400/50 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none transition-all resize-none leading-relaxed"
                />
              </div>

              <GoldenButton
                type="submit"
                disabled={isSubmitting || !name.trim() || !message.trim()}
                className="w-full flex items-center justify-center gap-1.5 py-3"
              >
                {isSubmitting ? (
                  <>
                    <Globe className="w-3.5 h-3.5 animate-spin" />
                    Broadcasting...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Broadcast Wish
                  </>
                )}
              </GoldenButton>

              {submitSuccess && (
                <div className="glass-panel border-green-500/20 bg-green-500/5 p-3 rounded-lg text-center flex items-center gap-2 justify-center text-[10px] text-green-400 font-semibold uppercase tracking-wider animate-bounce mt-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Sent to Admin Approval Queue!
                </div>
              )}
            </form>
          </div>

        </div>

      </div>
    </section>
  );
}
