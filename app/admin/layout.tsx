'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/navigation';
import StarField from '@/components/animation/StarField';
import { Lock, Unlock, ShieldAlert, Key } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  // Persist authentication state across page refreshes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAuth = localStorage.getItem('eidverse_admin_auth');
      if (savedAuth === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPasscode = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || 'admin';
    const correctPasscodeAlt = process.env.NEXT_PUBLIC_ADMIN_PASSCODE_ALT || 'eidverse';

    if (passcode === correctPasscode || passcode === correctPasscodeAlt) {
      setIsAuthenticated(true);
      localStorage.setItem('eidverse_admin_auth', 'true');
      setError('');
    } else {
      setError('Incorrect administrative passcode.');
    }
  };

  const handleBypass = () => {
    setIsAuthenticated(true);
    localStorage.setItem('eidverse_admin_auth', 'true');
    setError('');
  };

  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center p-6 bg-[#070708]">
        {/* Star drifting background */}
        <StarField density={100} speed={0.05} theme="adha" />
        
        {/* Geometric伊斯兰 pattern */}
        <div className="absolute inset-0 arabic-pattern-overlay opacity-[0.02] pointer-events-none" />

        {/* Lock Screen card */}
        <div className="relative z-20 max-w-sm w-full glass-panel border border-gold-400/30 p-8 rounded-2xl text-center flex flex-col items-center shadow-[0_0_35px_rgba(184,134,11,0.2)]">
          
          <div className="w-16 h-16 rounded-full bg-gold-500/10 border border-gold-400/30 flex items-center justify-center mb-6 text-gold-300 animate-pulse">
            <Lock className="w-7 h-7" />
          </div>

          <h3 className="font-serif text-2xl font-semibold text-white mb-2">
            EidVerse Console
          </h3>
          <p className="text-gray-400 text-xs leading-relaxed mb-6">
            Enter administrative passcode to unlock overview analytics, wish databases, and approval queues.
          </p>

          <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-1 text-left">
              <label className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Console Passcode</label>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter..."
                className="w-full bg-black/40 border border-white/10 focus:border-gold-400/50 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none transition-all placeholder:text-gray-600 text-center font-mono tracking-widest"
              />
            </div>

            {error && (
              <span className="text-[10px] text-red-400 font-medium uppercase tracking-wider flex items-center gap-1 justify-center animate-bounce">
                <ShieldAlert className="w-3.5 h-3.5" />
                {error}
              </span>
            )}

            <button
              type="submit"
              className="btn-golden w-full py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
            >
              <Key className="w-4 h-4" />
              Authenticate Console
            </button>

            {/* <div className="text-gray-500 text-[10px] uppercase tracking-widest my-2">— Or —</div>

            <button
              type="button"
              onClick={handleBypass}
              className="glass-panel border border-white/5 hover:border-gold-400/20 text-gold-300 hover:text-white py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all w-full cursor-pointer hover:scale-[1.01]"
            >
              Quick Guest Bypass (For Testers)
            </button> */}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-[#070708] text-white">
      {/* Background Star field */}
      <StarField density={100} speed={0.04} theme="adha" />
      <div className="relative z-10 flex-grow">{children}</div>
    </div>
  );
}
