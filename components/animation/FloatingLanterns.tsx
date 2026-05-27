'use client';

import React, { useEffect, useState } from 'react';

interface Lantern {
  id: number;
  left: number;
  bottom: number;
  size: number;
  delay: number;
  speed: number;
  swayWidth: number;
  swaySpeed: number;
  opacity: number;
}

export default function FloatingLanterns({ count = 12 }: { count?: number }) {
  const [lanterns, setLanterns] = useState<Lantern[]>([]);

  useEffect(() => {
    const list: Lantern[] = [];
    for (let i = 0; i < count; i++) {
      list.push({
        id: i,
        left: Math.random() * 90 + 5, // Percent
        bottom: -20, // Start offscreen
        size: Math.random() * 25 + 15, // Pixels
        delay: Math.random() * 15, // Seconds delay before launching
        speed: Math.random() * 1.5 + 0.8, // Upward speed
        swayWidth: Math.random() * 30 + 10, // Pixels
        swaySpeed: Math.random() * 2 + 1, // Seconds per sway loop
        opacity: Math.random() * 0.4 + 0.4,
      });
    }
    setLanterns(list);
  }, [count]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {lanterns.map((lantern) => {
        // We write dynamic CSS in style tags for infinite floating & swaying
        const keyframeName = `lantern-float-${lantern.id}`;
        const swayKeyframeName = `lantern-sway-${lantern.id}`;
        
        return (
          <div
            key={lantern.id}
            className="absolute flex flex-col items-center justify-center filter drop-shadow-[0_0_8px_rgba(226,192,125,0.6)]"
            style={{
              left: `${lantern.left}%`,
              width: `${lantern.size}px`,
              height: `${lantern.size * 1.5}px`,
              opacity: lantern.opacity,
              animation: `${keyframeName} ${35 / lantern.speed}s linear infinite ${lantern.delay}s, ${swayKeyframeName} ${4 + lantern.swaySpeed}s ease-in-out infinite alternate`,
            }}
          >
            {/* SVG Lantern */}
            <svg
              viewBox="0 0 100 150"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              {/* Lantern Cap */}
              <path d="M30 30 C 30 10, 70 10, 70 30 Z" fill="#B8860B" stroke="#825D08" strokeWidth="2" />
              <circle cx="50" cy="10" r="4" fill="#E2C07D" />
              
              {/* Glowing Body */}
              <rect x="25" y="30" width="50" height="80" rx="25" fill="url(#lantern-glow)" stroke="#B8860B" strokeWidth="2" />
              <rect x="35" y="35" width="30" height="70" rx="15" fill="url(#lantern-core)" />
              
              {/* Lattice Pattern overlay */}
              <line x1="25" y1="50" x2="75" y2="90" stroke="#825D08" strokeWidth="1" opacity="0.3" />
              <line x1="25" y1="90" x2="75" y2="50" stroke="#825D08" strokeWidth="1" opacity="0.3" />
              <line x1="50" y1="30" x2="50" y2="110" stroke="#825D08" strokeWidth="1.5" opacity="0.4" />
              
              {/* Bottom Tassel */}
              <path d="M48 110 L48 140 M52 110 L52 140" stroke="#B8860B" strokeWidth="2.5" />
              <path d="M45 138 L50 148 L55 138 Z" fill="#D2691E" />
              
              {/* Definitions for gorgeous radial gradients */}
              <defs>
                <radialGradient id="lantern-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFF3D4" />
                  <stop offset="60%" stopColor="#E2C07D" />
                  <stop offset="100%" stopColor="#8B5A00" />
                </radialGradient>
                <radialGradient id="lantern-core" cx="50%" cy="50%" r="40%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="50%" stopColor="#FFEFAA" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>
            </svg>
            
            {/* Style injector for floating and sway keyframes */}
            <style jsx>{`
              @keyframes ${keyframeName} {
                0% {
                  transform: translateY(110vh);
                }
                100% {
                  transform: translateY(-20vh);
                }
              }
              @keyframes ${swayKeyframeName} {
                0% {
                  margin-left: -${lantern.swayWidth}px;
                }
                100% {
                  margin-left: ${lantern.swayWidth}px;
                }
              }
            `}</style>
          </div>
        );
      })}
    </div>
  );
}
