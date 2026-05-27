'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, MessageCircle, MapPin, X, Info } from 'lucide-react';
import { Howl } from 'howler';

interface Hotspot {
  id: string;
  name: string;
  x: number; // Percent
  y: number; // Percent
  title: string;
  fact: string;
  culturalDetail: string;
  quote?: string;
}

export default function CattleMarket() {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [soundActive, setSoundActive] = useState(false);
  const marketSoundRef = useRef<Howl | null>(null);

  const hotspots: Hotspot[] = [
    {
      id: 'cow',
      name: 'The Big Bull (Goru)',
      x: 32,
      y: 44,
      title: 'The Prized Giant Bulls',
      fact: 'In Bangladesh, grand cattle are raised months in advance. Families spend significant time visiting multiple haats to inspect health, posture, and teeth to find the perfect Qurbani animal.',
      culturalDetail: 'Cows are often named affectionate titles like "Kalo Pahar" (Black Mountain) or "Lal Bahadur" (Red Brave). Children feed them apples and grass in parking garages or building lobbies, forming temporary bonds that make the sacrifice deeply felt.',
      quote: '"We named him Sultan. He ate 5 kg of fresh bananas every single morning!" — Hasan, 9 years old.'
    },
    {
      id: 'goat',
      name: 'The Playful Goats (Khashi)',
      x: 74,
      y: 56,
      title: 'The Energetic Goat Stalls',
      fact: 'Goats and sheep represent single-share obligations and are particularly beloved by children because of their energetic sways and mischievous behaviors.',
      culturalDetail: 'Traditional markets feature massive row blocks of colorful goats wearing floral garlands. Many middle-class families purchase goats early so they can roam the garden terraces.',
      quote: '"Our goat escaped the garage twice last night! The entire street was laughing as we chased him down." — Riaz, Dhaka.'
    },
    {
      id: 'farmer',
      name: 'The Rural Farmers',
      x: 18,
      y: 62,
      title: 'The Backbone of rural economy',
      fact: 'Cattle farming represents the ultimate economic life cycle of rural Bangladesh. Farmers invest their whole year’s savings into feeding these animals, relying entirely on Eid markets for livelihood.',
      culturalDetail: 'Farmers travel for days on massive river barges packed with cattle from remote districts like Kushtia, Pabna, and Sirajganj to reach Dhaka’s urban haats. The earnings support their families for the entire winter season.',
      quote: '"I raised Lalbabu like my own child. The money from his sale will pay for my daughter\'s college admission next month." — Fazlu Miah, Pabna.'
    },
    {
      id: 'lanterns',
      name: 'The Night Haat Lights',
      x: 52,
      y: 18,
      title: 'The Glowing Night Markets',
      fact: 'Cattle haats stay open 24 hours a day during the final three days before Eid morning. The glowing of thousands of warm lanterns under the midnight sky creates a carnival-like festival.',
      culturalDetail: 'Going to the haat at 2 AM is a massive cultural bonding event for young friends and fathers. The smell of hot tea, the sounds of bells, cattle calls, and loud bargaining under high-voltage stadium lights is unforgettable.',
    },
    {
      id: 'biriyani',
      name: 'The Morning Biriyani',
      x: 88,
      y: 35,
      title: 'Legendary Eid-Day Feasts',
      fact: 'The ultimate reward of Eid al-Adha. Freshly prepared Qurbani meat is cooked immediately on Eid afternoon to prepare legendary beef biriyani or traditional bhuna gorosh.',
      culturalDetail: 'The distinct aroma of wood-fire cooked fresh beef mixed with hot spices is the signature smell of Bangladeshi streets on Eid afternoon. Neighbors exchange plates, ensuring everyone, regardless of wealth, enjoys a premium feast.',
      quote: '"Nothing in this world beats the taste of grandmother\'s wood-fired Eid morning fresh beef biriyani." — Sadiya, Sylhet.'
    }
  ];

  useEffect(() => {
    // Looping ambient market noise
    marketSoundRef.current = new Howl({
      src: ['https://assets.mixkit.co/active_storage/sfx/2289/2289-84.wav'], // Falling back to a clean ambient crowd/chatter/bells WAV
      loop: true,
      volume: 0.2,
      html5: true,
    });

    return () => {
      marketSoundRef.current?.unload();
    };
  }, []);

  const handleSoundToggle = () => {
    if (!marketSoundRef.current) return;
    if (soundActive) {
      marketSoundRef.current.fade(0.2, 0, 500);
      setTimeout(() => marketSoundRef.current?.pause(), 500);
    } else {
      marketSoundRef.current.play();
      marketSoundRef.current.fade(0, 0.2, 500);
    }
    setSoundActive(!soundActive);
  };

  return (
    <section id="cattle-market-section" className="relative py-24 w-full z-20 px-6 bg-[#030304]/80">
      <div className="max-w-6xl mx-auto">
        
        {/* Title */}
        <div className="text-center mb-16 flex flex-col items-center">
          <h2 className="font-serif text-sm md:text-base text-gold-300 tracking-[0.2em] uppercase mb-3">
            Lived Cultural Experience
          </h2>
          <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-wide">
            The Traditional Cattle Haat
          </h1>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto mt-4 mb-4" />
          <p className="text-gray-400 text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
            Visiting the animal market (Haat) at dawn is a landmark memory of Eid al-Adha in Bangladesh. Click the glowing hotspots on our illustrated haat below to explore stories.
          </p>

          {/* Sound Toggle Button */}
          <button
            onClick={handleSoundToggle}
            className={`mt-6 inline-flex items-center gap-2 border px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all ${
              soundActive 
                ? 'bg-gold-500 border-gold-400 text-black shadow-[0_0_15px_var(--eid-glow)]' 
                : 'glass-panel border-white/10 text-gold-300 hover:border-gold-300/30'
            } cursor-pointer`}
          >
            {soundActive ? <Volume2 className="w-4 h-4 animate-bounce" /> : <VolumeX className="w-4 h-4" />}
            {soundActive ? 'Haat Ambient Sound Active' : 'Enable Haat Atmosphere Audio'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Interactive Map Grid */}
          <div className="lg:col-span-8 relative rounded-2xl border border-white/10 overflow-hidden bg-gradient-to-b from-[#0a0f0d] to-[#040605] p-2 md:p-4 aspect-video shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
            
            {/* Visual Vector Silhouette Vector Map backdrop */}
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(226,192,125,0.15) 0%, transparent 70%)' }} />

            {/* Simulated Vector Haat Illustration Grid */}
            <div className="relative w-full h-full flex items-center justify-center min-h-[300px] border border-white/5 rounded-xl bg-black/40">
              
              <div className="font-arabic text-[6vw] lg:text-[4vw] font-bold text-white/5 select-none pointer-events-none uppercase">
                হাট কোলাহল
              </div>

              {/* Glowing Interactive Hotspots */}
              {hotspots.map((spot) => {
                const isActive = selectedHotspot?.id === spot.id;
                return (
                  <button
                    key={spot.id}
                    onClick={() => setSelectedHotspot(spot)}
                    className="absolute group flex items-center justify-center cursor-pointer transition-all focus:outline-none"
                    style={{
                      left: `${spot.x}%`,
                      top: `${spot.y}%`,
                    }}
                  >
                    {/* Ring layers */}
                    <span className={`absolute inline-flex rounded-full opacity-75 ${
                      isActive ? 'w-10 h-10 bg-gold-400 animate-ping' : 'w-8 h-8 bg-gold-500/20 group-hover:animate-ping'
                    }`} />
                    
                    <span className={`relative rounded-full flex items-center justify-center transition-all ${
                      isActive 
                        ? 'w-6 h-6 bg-gold-300 text-black shadow-[0_0_15px_#B8860B]' 
                        : 'w-5 h-5 bg-[#0a0a0d] text-gold-300 border border-gold-400/50 group-hover:scale-110 group-hover:border-gold-300'
                    }`}>
                      <Info className="w-3 h-3" />
                    </span>

                    {/* Tooltip on hover */}
                    <span className="absolute bottom-7 bg-black border border-gold-400/30 text-gold-300 text-[10px] uppercase font-serif tracking-widest font-semibold px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                      {spot.name}
                    </span>
                  </button>
                );
              })}
            </div>
            
          </div>

          {/* Right Column: Fact / Story Card Reader */}
          <div className="lg:col-span-4 h-full flex items-center">
            {selectedHotspot ? (
              <div className="glass-panel border border-gold-400/30 p-8 rounded-2xl w-full flex flex-col justify-between min-h-[350px] shadow-[0_0_30px_rgba(184,134,11,0.1)] relative animate-fade-in">
                
                {/* Close Button */}
                <button
                  onClick={() => setSelectedHotspot(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex flex-col gap-4">
                  
                  {/* Badge */}
                  <span className="text-[10px] text-gold-300 font-serif tracking-[0.25em] uppercase font-semibold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    Haat Hotspot Map
                  </span>

                  <h2 className="font-serif text-xl md:text-2xl font-bold text-white leading-tight">
                    {selectedHotspot.title}
                  </h2>

                  <p className="text-gray-300 text-xs leading-relaxed font-light">
                    {selectedHotspot.fact}
                  </p>

                  <p className="text-gold-200/80 text-xs leading-relaxed border-t border-white/5 pt-4">
                    {selectedHotspot.culturalDetail}
                  </p>
                </div>

                {/* Submitter Quotation */}
                {selectedHotspot.quote && (
                  <div className="border-l-2 border-amber-500/40 pl-3 py-1 mt-6">
                    <p className="text-[11px] text-gray-300 italic font-serif leading-relaxed">
                      {selectedHotspot.quote}
                    </p>
                  </div>
                )}

              </div>
            ) : (
              <div className="glass-panel border border-white/10 p-8 rounded-2xl w-full flex flex-col items-center justify-center text-center min-h-[350px] border-dashed border-white/20">
                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gold-300 mb-4 animate-pulse">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-medium text-white mb-2">Explore Haat Blueprint</h3>
                <p className="text-gray-400 text-xs max-w-xs leading-relaxed">
                  Click any pulsating hotspot circle on the map grid to read details, quotes, and cultural memories of Bangladesh.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
