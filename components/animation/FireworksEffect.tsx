'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Award, Sparkles, X } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
  gravity: number;
  friction: number;
}

export default function FireworksEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particles: Particle[] = [];
    const colors = ['#E2C07D', '#FFD700', '#DAA520', '#FFFFFF', '#4ADE80', '#60A5FA', '#F472B6'];

    const createExplosion = (x: number, y: number) => {
      // Create 80-120 particles per burst
      const count = 100;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 2;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1.0,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 3 + 1,
          gravity: 0.08,
          friction: 0.96,
        });
      }
    };

    const animate = () => {
      if (!active) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.fillStyle = 'rgba(7, 7, 8, 0.2)'; // Fading trail
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles = particles.filter((p) => {
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.015;

        if (p.alpha <= 0) return false;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        return true;
      });

      // Random secondary bursts for duration
      if (Math.random() < 0.08 && particles.length < 300) {
        createExplosion(
          Math.random() * canvas.width,
          Math.random() * (canvas.height * 0.7)
        );
      }

      animId = requestAnimationFrame(animate);
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    // Trigger explosion handler
    const handleTrigger = () => {
      setActive(true);
      setShowOverlay(true);
      
      // Multi-center bursts representing moon fireworks
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      createExplosion(w / 2, h / 3); // Center from moon
      setTimeout(() => createExplosion(w * 0.3, h * 0.4), 300);
      setTimeout(() => createExplosion(w * 0.7, h * 0.4), 600);
      setTimeout(() => createExplosion(w * 0.5, h * 0.5), 950);

      // Play secret chime if available
      try {
        const chime = new Audio('/sounds/chime.mp3');
        chime.volume = 0.5;
        chime.play();
      } catch (err) {}

      // Trigger animation
      animate();

      // Shut off animation after 8 seconds
      setTimeout(() => {
        setActive(false);
      }, 7000);
    };

    window.addEventListener('secret-moon-explorer', handleTrigger);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('secret-moon-explorer', handleTrigger);
    };
  }, [active]);

  if (!showOverlay) return null;

  return (
    <>
      {/* Absolute fullscreen fireworks canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-[9999]"
      />

      {/* Floating interactive achievement modal */}
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
        <div className="relative max-w-md w-full glass-panel border border-gold-400/30 p-8 rounded-2xl text-center flex flex-col items-center shadow-[0_0_50px_rgba(226,192,125,0.4)]">
          
          {/* Close button */}
          <button 
            onClick={() => { setShowOverlay(false); setActive(false); }}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Pulsating explorer badge */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-gold-600 to-gold-300 flex items-center justify-center shadow-[0_0_20px_#B8860B] animate-bounce mb-6">
            <Award className="w-10 h-10 text-black stroke-[2]" />
          </div>

          <h3 className="font-serif text-3xl font-semibold text-gold-300 mb-2 flex items-center gap-2">
            <Sparkles className="w-6 h-6 animate-pulse text-gold-400" />
            MashaAllah!
          </h3>
          <p className="text-white text-lg font-medium mb-4">
            You found the Hidden Moon Secret!
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mb-6">
            May Allah bless your curiosity. You have unlocked the rare <span className="text-gold-300 font-semibold font-serif">"Moon Explorer"</span> atmospheric status badge.
          </p>

          <button
            onClick={() => setShowOverlay(false)}
            className="btn-golden w-full py-3 rounded-lg text-sm font-semibold transition-all"
          >
            Alhamdulillah
          </button>
        </div>
      </div>
    </>
  );
}
