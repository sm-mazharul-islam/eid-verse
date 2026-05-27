'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BarChart3, ShieldCheck, Mail, BookOpen, AlertCircle, 
  Trash2, Check, X, ShieldAlert, Award, Sparkles, RefreshCw, 
  User, Plus, Eye, Globe, ArrowLeft, ToggleLeft, ToggleRight,
  LogOut
} from 'lucide-react';
import GoldenButton from '@/components/ui/GoldenButton';


type TabState = 'overview' | 'moderate' | 'wishes' | 'blessings';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabState>('overview');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Form states for creating new blessing
  const [newBlessingText, setNewBlessingText] = useState('');
  const [newBlessingCategory, setNewBlessingCategory] = useState('general');
  const [newBlessingEidType, setNewBlessingEidType] = useState('general');
  const [isSubmittingBlessing, setIsSubmittingBlessing] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/stats');
      const json = await res.json();
      if (res.ok && json.success) {
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [refreshTrigger]);

  const handleModerateAction = async (id: string, type: string, action: string, activeState?: boolean) => {
    try {
      const res = await fetch('/api/admin/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, type, id, activeState })
      });
      if (res.ok) {
        // Trigger reload
        setRefreshTrigger((prev) => prev + 1);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddBlessing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlessingText.trim()) return;

    setIsSubmittingBlessing(true);
    try {
      const res = await fetch('/api/blessings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: newBlessingText.trim(),
          category: newBlessingCategory,
          eidType: newBlessingEidType
        })
      });
      if (res.ok) {
        setNewBlessingText('');
        setRefreshTrigger((prev) => prev + 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingBlessing(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#070708]">
        <RefreshCw className="w-8 h-8 text-gold-400 animate-spin mb-4" />
        <p className="text-gray-400 text-xs font-light tracking-wider">Synchronizing Admin Decks...</p>
      </div>
    );
  }

  const { metrics, charts, moderation, management } = data || {};

  return (
    <div className="min-h-screen p-6 md:p-8 max-w-7xl mx-auto flex flex-col gap-8 pb-20">
      
      {/* 1. Header Banner */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/5 pb-6 gap-4">
        <div className="flex flex-col gap-1">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-gold-300 font-serif hover:text-white mb-2 cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Cinematic Experience
          </Link>
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-wide text-white">
            EidVerse Administrative Console
          </h1>
          <p className="text-gray-400 text-xs font-light">
            Monitor engagement metrics, explore global wishes, and moderate community story boards.
          </p>
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setRefreshTrigger((prev) => prev + 1)}
            className="glass-panel border border-white/5 hover:border-gold-300/30 text-gold-300 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh Stats
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('eidverse_admin_auth');
              window.location.reload();
            }}
            className="glass-panel border border-red-500/10 hover:border-red-500/30 text-red-400 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            Log Out
          </button>
        </div>
      </header>

      {/* 2. Key Metrics Grid summary cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-black/40 flex flex-col justify-between min-h-[110px]">
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold font-serif">Total Wishes Created</span>
          <span className="font-serif text-3xl font-bold text-gold-300 mt-2 block tracking-wide">
            {metrics?.totalWishes || 0}
          </span>
          <span className="text-[8px] text-gray-500 block mt-1">Staggered cinematic links</span>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-black/40 flex flex-col justify-between min-h-[110px]">
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold font-serif">Published HD Cards</span>
          <span className="font-serif text-3xl font-bold text-amber-500 mt-2 block tracking-wide">
            {metrics?.totalCards || 0}
          </span>
          <span className="text-[8px] text-gray-500 block mt-1">html2canvas PNG layouts</span>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-black/40 flex flex-col justify-between min-h-[110px] relative">
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold font-serif">Pending Broadcasts</span>
          <span className="font-serif text-3xl font-bold text-emerald-400 mt-2 block tracking-wide">
            {metrics?.pendingMessages || 0}
          </span>
          {metrics?.pendingMessages > 0 && (
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full absolute top-6 right-6 animate-ping" />
          )}
          <span className="text-[8px] text-gray-500 block mt-1">Pending admin approval queue</span>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-black/40 flex flex-col justify-between min-h-[110px]">
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold font-serif">Pending Wall Stories</span>
          <span className="font-serif text-3xl font-bold text-purple-400 mt-2 block tracking-wide">
            {metrics?.pendingStories || 0}
          </span>
          <span className="text-[8px] text-gray-500 block mt-1">Moderation queue list</span>
        </div>
      </section>

      {/* 3. Navigation tabs */}
      <div className="flex border-b border-white/5 pb-1 gap-2 overflow-x-auto">
        {(['overview', 'moderate', 'wishes', 'blessings'] as TabState[]).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-t-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                isActive 
                  ? 'border-b-2 border-gold-400 text-gold-300 font-serif' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab} Console
            </button>
          );
        })}
      </div>

      {/* 4. Tab Core Decks */}
      
      {/* 4A. Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Theme Popularity CSS charts */}
          <div className="lg:col-span-8 glass-panel p-8 rounded-2xl border border-white/10 flex flex-col gap-6">
            <h3 className="font-serif text-lg font-bold text-white border-b border-white/5 pb-3">
              Card Theme Popularity Chart
            </h3>
            
            <div className="flex flex-col gap-5">
              {charts?.themeStats?.map((stat: any) => {
                // Calculate percentage simulation
                const total = charts.themeStats.reduce((acc: number, cur: any) => acc + cur.count, 0) || 1;
                const percentage = Math.round((stat.count / total) * 100);

                return (
                  <div key={stat.name} className="flex flex-col gap-2">
                    <div className="flex justify-between text-xs font-medium text-gray-300">
                      <span>{stat.name} Preset</span>
                      <span className="text-gold-300">{stat.count} wishes ({percentage}%)</span>
                    </div>
                    {/* Visual Bar */}
                    <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-gold-600 to-gold-300 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${Math.max(5, percentage)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Top countries & top blessings */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Top Countries */}
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
              <h3 className="font-serif text-sm font-bold text-white mb-4 border-b border-white/5 pb-3">
                Top Countries by Engagement
              </h3>
              
              {charts?.countryStats?.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {charts.countryStats.map((c: any, idx: number) => (
                    <div key={c.country} className="flex justify-between items-center text-xs">
                      <span className="flex items-center gap-2">
                        <span className="text-gray-500 font-mono">#{idx+1}</span>
                        <span className="font-semibold text-gray-300">{c.country}</span>
                      </span>
                      <span className="text-gold-400 font-mono font-bold">{c.count} interactions</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-gray-500 italic">No country metadata logged yet.</p>
              )}
            </div>

            {/* Top Blessings Usage */}
            <div className="glass-panel p-6 rounded-2xl border border-white/5 flex-grow">
              <h3 className="font-serif text-sm font-bold text-white mb-4 border-b border-white/5 pb-3">
                High Resonance Blessings
              </h3>
              
              <div className="flex flex-col gap-4">
                {charts?.blessingsUsage?.map((b: any, idx: number) => (
                  <div key={b.id} className="flex flex-col gap-1 border-b border-white/5 pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center text-[9px] text-gray-500 uppercase tracking-widest">
                      <span>{b.category} category</span>
                      <span className="text-gold-300 font-semibold">{b.usedCount} envelope opens</span>
                    </div>
                    <p className="text-white text-xs leading-relaxed font-light italic truncate">
                      “{b.text}”
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 4B. Moderation Tab */}
      {activeTab === 'moderate' && (
        <div className="flex flex-col gap-10 animate-fade-in">
          
          {/* Moderation Queue - Global Wishes */}
          <div className="flex flex-col gap-6">
            <h3 className="font-serif text-xl font-bold text-white border-b border-white/5 pb-3 flex items-center gap-2">
              <Globe className="w-5 h-5 text-amber-500 animate-spin" style={{ animationDuration: '20s' }} />
              Global Broadcast Message Approvals
            </h3>

            {moderation?.pendingGlobalMessages?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {moderation.pendingGlobalMessages.map((msg: any) => (
                  <div 
                    key={msg.id}
                    className="glass-panel p-6 rounded-2xl border border-gold-400/20 bg-black/40 flex flex-col justify-between min-h-[160px]"
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg">{msg.flag}</span>
                        <span className="text-[10px] text-gold-300 uppercase tracking-widest font-serif font-bold">
                          {msg.name}
                        </span>
                      </div>
                      <p className="text-white text-xs leading-relaxed font-light italic">
                        “{msg.message}”
                      </p>
                    </div>

                    <div className="border-t border-white/5 pt-4 flex gap-2 justify-end mt-4">
                      <button
                        onClick={() => handleModerateAction(msg.id, 'global-message', 'reject')}
                        className="glass-panel border border-red-500/20 text-red-400 hover:text-white hover:bg-red-500/10 p-2 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                      >
                        <X className="w-4 h-4" /> Reject
                      </button>
                      <button
                        onClick={() => handleModerateAction(msg.id, 'global-message', 'approve')}
                        className="btn-golden py-2 px-4 rounded-lg text-xs font-semibold flex items-center gap-1"
                      >
                        <Check className="w-4 h-4" /> Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-panel border border-white/10 rounded-2xl p-12 text-center border-dashed">
                <ShieldCheck className="w-10 h-10 text-gold-400 mb-4 animate-pulse" />
                <p className="text-gray-400 text-xs font-light">Global Broadcast approval queue is empty.</p>
              </div>
            )}
          </div>

          {/* Moderation Queue - Memory Stories */}
          <div className="flex flex-col gap-6">
            <h3 className="font-serif text-xl font-bold text-white border-b border-white/5 pb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              Memory Wall & Story approvals
            </h3>

            {moderation?.pendingStoryEntries?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {moderation.pendingStoryEntries.map((story: any) => (
                  <div 
                    key={story.id}
                    className="glass-panel border border-gold-400/20 bg-black/40 rounded-2xl overflow-hidden flex flex-col justify-between shadow-lg"
                  >
                    {/* Render Image if exists */}
                    {story.photoUrl && (
                      <div className="w-full relative aspect-video overflow-hidden border-b border-white/5">
                        <img src={story.photoUrl} alt={story.animalName} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 pointer-events-none" />
                      </div>
                    )}

                    <div className="p-6 flex flex-col gap-4">
                      <div className="flex justify-between items-center text-[10px] text-gold-300 font-serif tracking-widest uppercase font-semibold">
                        <span>{story.animalName}</span>
                        <span>{story.year}</span>
                      </div>

                      <p className="text-white text-xs leading-relaxed font-light">
                        {story.memoryText}
                      </p>

                      <div className="border-t border-white/5 pt-4 flex justify-between items-center text-[10px] text-gray-400 font-light">
                        <span className="uppercase tracking-widest text-gold-400 font-serif font-medium">
                          {story.submitterName}
                        </span>
                        <span className="font-mono">{story.city}, BD</span>
                      </div>

                      {/* Moderation controls */}
                      <div className="border-t border-white/5 pt-4 flex gap-2 justify-end mt-2">
                        <button
                          onClick={() => handleModerateAction(story.id, 'story', 'reject')}
                          className="glass-panel border border-red-500/20 text-red-400 hover:text-white hover:bg-red-500/10 p-2 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                        >
                          <X className="w-4 h-4" /> Reject
                        </button>
                        <button
                          onClick={() => handleModerateAction(story.id, 'story', 'approve')}
                          className="btn-golden py-2 px-4 rounded-lg text-xs font-semibold flex items-center gap-1"
                        >
                          <Check className="w-4 h-4" /> Approve
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-panel border border-white/10 rounded-2xl p-12 text-center border-dashed">
                <ShieldCheck className="w-10 h-10 text-gold-400 mb-4 animate-pulse" />
                <p className="text-gray-400 text-xs font-light">Memory Wall approval queue is empty.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* 4C. Wishes Tab */}
      {activeTab === 'wishes' && (
        <div className="glass-panel border border-white/10 rounded-2xl overflow-hidden animate-fade-in shadow-lg">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0b0c10] border-b border-white/10 text-[10px] text-gold-300 font-serif uppercase tracking-widest">
                  <th className="py-4 px-6">Sender</th>
                  <th className="py-4 px-6">Recipient</th>
                  <th className="py-4 px-6">Type</th>
                  <th className="py-4 px-6">Theme</th>
                  <th className="py-4 px-6">Views</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {management?.wishes?.length > 0 ? (
                  management.wishes.map((w: any) => (
                    <tr key={w.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6 font-semibold text-white">{w.senderName}</td>
                      <td className="py-4 px-6 text-gray-300">{w.receiverName}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-widest font-semibold ${
                          w.senderName === 'Eid Card Generator' 
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                            : 'bg-gold-500/10 text-gold-300 border border-gold-400/20'
                        }`}>
                          {w.senderName === 'Eid Card Generator' ? 'HD Card' : 'Wish Link'}
                        </span>
                      </td>
                      <td className="py-4 px-6 capitalize text-gray-400">{w.theme}</td>
                      <td className="py-4 px-6 font-mono text-gray-400">{w.viewCount}</td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleModerateAction(w.id, 'wish', 'delete')}
                          className="text-red-400 hover:text-white hover:bg-red-500/10 p-2 rounded transition-all cursor-pointer"
                          title="Delete Wish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 px-6 text-center text-gray-500 italic">No wishes or cards in database.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4D. Blessings Tab */}
      {activeTab === 'blessings' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
          
          {/* Left Column: Create Form */}
          <form 
            onSubmit={handleAddBlessing}
            className="lg:col-span-5 glass-panel p-8 rounded-2xl border border-white/10 flex flex-col gap-5 shadow-lg"
          >
            <h3 className="font-serif text-lg font-bold text-gold-300 border-b border-white/5 pb-3">
              Add New Blessing Record
            </h3>

            {/* Text Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Blessing Message</label>
              <textarea
                required
                rows={4}
                value={newBlessingText}
                onChange={(e) => setNewBlessingText(e.target.value)}
                placeholder="Write your custom blessing text..."
                className="w-full bg-black/40 border border-white/10 focus:border-gold-400/50 rounded-lg px-4 py-3 text-xs text-white focus:outline-none transition-all resize-none leading-relaxed"
              />
            </div>

            {/* Category selection */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Category</label>
              <select
                value={newBlessingCategory}
                onChange={(e) => setNewBlessingCategory(e.target.value)}
                className="w-full bg-[#0a0a0c] border border-white/10 focus:border-gold-400/50 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none transition-all cursor-pointer"
              >
                <option value="qurbani">Qurbani / Sacrifice</option>
                <option value="general">General</option>
                <option value="family">Family</option>
                <option value="peace">Peace</option>
              </select>
            </div>

            {/* Eid Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Eid Campaign Mode</label>
              <select
                value={newBlessingEidType}
                onChange={(e) => setNewBlessingEidType(e.target.value)}
                className="w-full bg-[#0a0a0c] border border-white/10 focus:border-gold-400/50 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none transition-all cursor-pointer"
              >
                <option value="general">General (Shared both Eids)</option>
                <option value="eid-al-adha">Eid al-Adha Special</option>
                <option value="eid-al-fitr">Eid al-Fitr Special</option>
              </select>
            </div>

            <GoldenButton
              type="submit"
              disabled={isSubmittingBlessing || !newBlessingText.trim()}
              className="w-full flex items-center justify-center gap-1.5 py-3"
            >
              {isSubmittingBlessing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Saving record...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Save Blessing
                </>
              )}
            </GoldenButton>
          </form>

          {/* Right Column: Interactive List Table */}
          <div className="lg:col-span-7 glass-panel border border-white/10 rounded-2xl overflow-hidden shadow-lg h-[460px] overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0b0c10] border-b border-white/10 text-[10px] text-gold-300 font-serif uppercase tracking-widest">
                  <th className="py-3.5 px-5">Blessing</th>
                  <th className="py-3.5 px-5">Category</th>
                  <th className="py-3.5 px-5">Views</th>
                  <th className="py-3.5 px-5">Active</th>
                  <th className="py-3.5 px-5 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-[11px]">
                {management?.blessings?.length > 0 ? (
                  management.blessings.map((b: any) => (
                    <tr key={b.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-5 text-white max-w-xs truncate italic">“{b.text}”</td>
                      <td className="py-3.5 px-5 capitalize text-gold-400 font-serif font-semibold">{b.category}</td>
                      <td className="py-3.5 px-5 font-mono text-gray-400">{b.usedCount}</td>
                      <td className="py-3.5 px-5">
                        <button
                          onClick={() => handleModerateAction(b.id, 'blessing', 'toggle', !b.isActive)}
                          className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                        >
                          {b.isActive ? (
                            <span className="flex items-center gap-1 text-green-400 font-semibold">
                              <ToggleRight className="w-6 h-6 text-green-500" /> Yes
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-gray-500">
                              <ToggleLeft className="w-6 h-6 text-gray-600" /> No
                            </span>
                          )}
                        </button>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <button
                          onClick={() => handleModerateAction(b.id, 'blessing', 'delete')}
                          className="text-red-400 hover:text-white hover:bg-red-500/10 p-2 rounded transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 px-5 text-center text-gray-500 italic">No blessings in database.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
}
