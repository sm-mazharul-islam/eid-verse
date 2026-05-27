'use client';

import React, { useEffect, useRef } from 'react';

interface StarFieldProps {
  density?: number;
  speed?: number;
  theme?: 'fitr' | 'adha';
}

export default function StarField({ density = 150, speed = 0.05, theme = 'adha' }: StarFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Star data structure
    const stars: Array<{
      x: number;
      y: number;
      size: number;
      opacity: number;
      fadeSpeed: number;
      depth: number;
      color: string;
    }> = [];

    // Color palettes
    const goldStars = ['#FFF8E7', '#F7EED9', '#EDDAAB', '#E2C07D', '#DAA520'];
    const silverStars = ['#FFFFFF', '#F0F3F4', '#E5E8E8', '#BDC3C7', '#A6ACAF'];
    const colors = theme === 'adha' ? goldStars : silverStars;

    // Initialize stars
    for (let i = 0; i < density; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.3,
        opacity: Math.random(),
        fadeSpeed: (Math.random() * 0.008 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
        depth: Math.random() * 0.8 + 0.2, // Depth factor for parallax
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Handle mouse movement for subtle parallax
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX - width / 2) * 0.04;
      mouseRef.current.targetY = (e.clientY - height / 2) * 0.04;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      stars.forEach((star) => {
        // Slowly update opacity (twinkle)
        star.opacity += star.fadeSpeed;
        if (star.opacity > 1 || star.opacity < 0.1) {
          star.fadeSpeed = -star.fadeSpeed;
        }

        // Slow upward drift
        star.y -= speed * star.depth;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }

        // Apply mouse parallax offset based on depth
        const parallaxX = star.x + mouseRef.current.x * star.depth;
        const parallaxY = star.y + mouseRef.current.y * star.depth;

        // Draw star
        ctx.beginPath();
        ctx.arc(parallaxX, parallaxY, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.opacity;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [density, speed, theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
