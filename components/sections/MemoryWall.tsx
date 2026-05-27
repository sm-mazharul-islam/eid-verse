'use client';

import React, { useState, useEffect, useRef } from 'react';
import GoldenButton from '../ui/GoldenButton';
import { Camera, BookOpen, Filter, Check, RefreshCw, Send, Sparkles, Heart } from 'lucide-react';

interface QurbaniStory {
  id: string;
  animalName: string;
  memoryText: string;
  photoUrl?: string;
  submitterName: string;
  city: string;
  country: string;
  year: number;
  createdAt: string;
}

export default function MemoryWall() {
  const [stories, setStories] = useState<QurbaniStory[]>([]);
  const [filterCity, setFilterCity] = useState('All');
  
  // Form states
  const [animalName, setAnimalName] = useState('');
  const [memoryText, setMemoryText] = useState('');
  const [photoBase64, setPhotoBase64] = useState('');
  const [submitterName, setSubmitterName] = useState('');
  const [city, setCity] = useState('Dhaka');
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch approved memories
  const fetchStories = async () => {
    try {
      const res = await fetch('/api/memory-photos');
      const data = await res.json();
      if (res.ok && data.success) {
        setStories(data.stories);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  // Handle local file reading into base64 for setup-less uploading
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!animalName.trim() || !memoryText.trim() || !submitterName.trim()) return;

    setIsUploading(true);
    setUploadSuccess(false);

    try {
      const res = await fetch('/api/memory-photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          animalName: animalName.trim(),
          memoryText: memoryText.trim(),
          photoUrl: photoBase64, // Base64 encoding provides robust out-of-the-box fallback uploading
          submitterName: submitterName.trim(),
          city: city,
          country: 'BD',
          year: 2026
        })
      });

      if (res.ok) {
        setUploadSuccess(true);
        setAnimalName('');
        setMemoryText('');
        setPhotoBase64('');
        setSubmitterName('');
        setTimeout(() => setUploadSuccess(false), 5000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  // Unique cities list for filtering
  const cities = ['All', ...Array.from(new Set(stories.map((s) => s.city).filter(Boolean)))];

  const filteredStories = filterCity === 'All' 
    ? stories 
    : stories.filter((s) => s.city === filterCity);

  return (
    <section id="memory-wall-section" className="relative py-24 w-full z-20 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-sm md:text-base text-gold-300 tracking-[0.2em] uppercase mb-3">
            Spiritual Archive
          </h2>
          <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-wide">
            My Qurbani Story Memory Wall
          </h1>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto mt-4" />
          <p className="text-gray-400 text-xs md:text-sm mt-4 max-w-lg mx-auto leading-relaxed">
            Every Eid al-Adha holds personal stories of devotion, laughter, and neighborly generosity. Read memories and upload your own story.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap gap-2 items-center justify-center mb-12 border-b border-white/5 pb-6">
          <span className="text-[10px] text-gray-500 font-serif uppercase tracking-widest flex items-center gap-1.5 mr-2">
            <Filter className="w-3.5 h-3.5 text-gold-400" />
            Filter District
          </span>
          {cities.map((c) => (
            <button
              key={c}
              onClick={() => setFilterCity(c)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                filterCity === c 
                  ? 'bg-gold-500 text-black shadow-md' 
                  : 'glass-panel border-white/5 text-gray-400 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Masonry Grid Story Feed */}
          <div className="lg:col-span-8">
            {filteredStories.length > 0 ? (
              // Masonry grid layout utilizing multi-columns for high visual impact
              <div className="columns-1 md:columns-2 gap-4 space-y-4">
                {filteredStories.map((story) => (
                  <div
                    key={story.id}
                    className="break-inside-avoid glass-panel border border-white/10 rounded-2xl overflow-hidden hover:scale-[1.01] active:scale-95 transition-all shadow-md group"
                  >
                    {/* Render uploaded image if present */}
                    {story.photoUrl && (
                      <div className="w-full relative overflow-hidden aspect-[4/3]">
                        <img
                          src={story.photoUrl}
                          alt={story.animalName}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                      </div>
                    )}

                    <div className="p-6 flex flex-col gap-3">
                      <div className="flex justify-between items-center text-[10px] text-gold-300 font-serif tracking-widest uppercase font-semibold">
                        <span>{story.animalName}</span>
                        <span>{story.year}</span>
                      </div>

                      <p className="text-white text-xs leading-relaxed font-light font-sans mb-2">
                        {story.memoryText}
                      </p>

                      <div className="border-t border-white/5 pt-4 flex justify-between items-center text-[10px] text-gray-400 font-light">
                        <span className="uppercase tracking-widest text-gold-400 font-serif font-medium">
                          {story.submitterName}
                        </span>
                        <span className="font-mono">
                          {story.city}, {story.country}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-panel border border-white/10 rounded-2xl p-12 text-center flex flex-col items-center justify-center border-dashed border-white/20">
                <BookOpen className="w-8 h-8 text-gold-400 mb-4 animate-pulse" />
                <p className="text-gray-400 text-xs font-light">No memories added under this district yet.</p>
              </div>
            )}
          </div>

          {/* Right Column: Submission Form Panel */}
          <div className="lg:col-span-4">
            <form
              onSubmit={handleSubmitStory}
              className="glass-panel p-8 rounded-2xl border border-white/10 flex flex-col gap-5 shadow-lg relative overflow-hidden"
            >
              {/* Islamic Pattern overlay */}
              <div className="absolute inset-0 arabic-pattern-overlay opacity-[0.015] pointer-events-none" />

              <div className="flex items-center gap-2 text-gold-300 font-serif border-b border-white/10 pb-4 mb-2 relative z-10">
                <Camera className="w-5 h-5 text-amber-500 animate-pulse" />
                Share Your Qurbani Story
              </div>

              {/* Animal Name */}
              <div className="flex flex-col gap-1.5 relative z-10">
                <label className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Animal Description / Name</label>
                <input
                  type="text"
                  required
                  value={animalName}
                  onChange={(e) => setAnimalName(e.target.value)}
                  placeholder="e.g. Kalo (The Giant Black Cow)"
                  className="w-full bg-black/40 border border-white/10 focus:border-gold-400/50 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none transition-all"
                />
              </div>

              {/* Submitter Name */}
              <div className="flex flex-col gap-1.5 relative z-10">
                <label className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Your Name</label>
                <input
                  type="text"
                  required
                  value={submitterName}
                  onChange={(e) => setSubmitterName(e.target.value)}
                  placeholder="e.g. Rashedul Hasan"
                  className="w-full bg-black/40 border border-white/10 focus:border-gold-400/50 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none transition-all"
                />
              </div>

              {/* City Selection */}
              <div className="flex flex-col gap-1.5 relative z-10">
                <label className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Select District</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-white/10 focus:border-gold-400/50 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none transition-all cursor-pointer"
                >
                  {['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh'].map((d) => (
                    <option key={d} value={d} className="bg-[#0a0a0c]">
                      {d} District
                    </option>
                  ))}
                </select>
              </div>

              {/* Photo Upload */}
              <div className="flex flex-col gap-1.5 relative z-10">
                <label className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Upload Animal Photo (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                {photoBase64 ? (
                  <div className="relative rounded-lg overflow-hidden border border-gold-400/30 aspect-video">
                    <img src={photoBase64} alt="Upload Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPhotoBase64('')}
                      className="absolute top-2 right-2 bg-black/80 text-white hover:text-red-400 px-2 py-0.5 rounded text-[8px] uppercase tracking-wider font-semibold border border-white/10 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border border-white/10 hover:border-gold-300/30 rounded-lg py-5 text-center flex flex-col items-center justify-center gap-2 bg-black/40 hover:scale-[1.01] transition-all cursor-pointer border-dashed"
                  >
                    <Camera className="w-5 h-5 text-gold-300 animate-pulse" />
                    <span className="text-[9px] uppercase tracking-widest text-gray-400">Select Image File</span>
                  </button>
                )}
              </div>

              {/* Memory Narrative */}
              <div className="flex flex-col gap-1.5 relative z-10">
                <div className="flex justify-between items-center text-[10px] text-gray-400 uppercase tracking-widest font-medium">
                  <span>Write Your Memory</span>
                  <span className="text-[9px] text-gray-500">{memoryText.length}/200</span>
                </div>
                <textarea
                  maxLength={200}
                  required
                  rows={3}
                  value={memoryText}
                  onChange={(e) => setMemoryText(e.target.value)}
                  placeholder="Tell us about buying the animal, naming it, sharing meat, or Eid morning biriyani!"
                  className="w-full bg-black/40 border border-white/10 focus:border-gold-400/50 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none transition-all resize-none leading-relaxed"
                />
              </div>

              <GoldenButton
                type="submit"
                disabled={isUploading || !animalName.trim() || !memoryText.trim() || !submitterName.trim()}
                className="w-full flex items-center justify-center gap-1.5 py-3 relative z-10"
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Archiving Story...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Submit Story to Wall
                  </>
                )}
              </GoldenButton>

              {uploadSuccess && (
                <div className="glass-panel border-green-500/20 bg-green-500/5 p-3 rounded-lg text-center flex items-center gap-2 justify-center text-[10px] text-green-400 font-semibold uppercase tracking-wider animate-bounce mt-2 relative z-10">
                  <Check className="w-4 h-4 text-green-500" />
                  Sent to Admin Moderation Queue!
                </div>
              )}
            </form>
          </div>

        </div>

      </div>
    </section>
  );
}
