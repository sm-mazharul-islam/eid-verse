'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function MoonScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [clickCount, setClickCount] = useState(0);
  const [isSecretTriggered, setIsSecretTriggered] = useState(false);

  // Easter Egg click tracker
  const handleMoonClick = () => {
    if (isSecretTriggered) return;
    
    setClickCount((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        setIsSecretTriggered(true);
        // Trigger a custom event that components like FireworksEffect will listen to!
        const event = new CustomEvent('secret-moon-explorer');
        window.dispatchEvent(event);
        
        // Reset after 5 seconds
        setTimeout(() => {
          setIsSecretTriggered(false);
          setClickCount(0);
        }, 8000);
        return 0;
      }
      
      // Auto-reset click count if not clicked fast enough (e.g. within 3s)
      return next;
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (clickCount > 0) setClickCount(0);
    }, 3000);
    return () => clearTimeout(timer);
  }, [clickCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // 1. Create Procedural Lunar Texture
    const generateLunarTexture = (): HTMLCanvasElement => {
      const texCanvas = document.createElement('canvas');
      texCanvas.width = 1024;
      texCanvas.height = 512;
      const ctx = texCanvas.getContext('2d')!;

      // Base lunar gray-golden dust
      ctx.fillStyle = '#1A1A1E';
      ctx.fillRect(0, 0, texCanvas.width, texCanvas.height);

      // Add Maria (dark plains)
      for (let i = 0; i < 8; i++) {
        const x = Math.random() * texCanvas.width;
        const y = Math.random() * texCanvas.height;
        const radius = Math.random() * 120 + 60;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
        grad.addColorStop(0, '#0F0F12');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Add Highlands (bright patches)
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * texCanvas.width;
        const y = Math.random() * texCanvas.height;
        const radius = Math.random() * 80 + 30;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
        grad.addColorStop(0, '#2D2924');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Add Craters with shadows (white highlight + black depth shadow)
      for (let i = 0; i < 150; i++) {
        const x = Math.random() * texCanvas.width;
        const y = Math.random() * texCanvas.height;
        const radius = Math.random() * 8 + 1.5;

        // Shadow rim (black)
        ctx.fillStyle = '#050505';
        ctx.beginPath();
        ctx.arc(x + 1, y + 1, radius, 0, Math.PI * 2);
        ctx.fill();

        // Light rim (gold/white)
        ctx.fillStyle = '#5A4E38';
        ctx.beginPath();
        ctx.arc(x - 0.8, y - 0.8, radius, 0, Math.PI * 2);
        ctx.fill();

        // Inside crater bowl
        ctx.fillStyle = '#100E0A';
        ctx.beginPath();
        ctx.arc(x, y, radius - 0.7, 0, Math.PI * 2);
        ctx.fill();
      }

      return texCanvas;
    };

    // 2. Initialize Three.js Scene
    let width = container.clientWidth;
    let height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true, // Transparent bg
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 3. Create Lunar Sphere Mesh
    const geometry = new THREE.SphereGeometry(2.3, 64, 64);
    
    // Generate and link texture
    const textureCanvas = generateLunarTexture();
    const mapTexture = new THREE.CanvasTexture(textureCanvas);
    
    // Material with high-end lighting properties
    const material = new THREE.MeshStandardMaterial({
      map: mapTexture,
      bumpMap: mapTexture,
      bumpScale: 0.08,
      roughness: 0.9,
      metalness: 0.1,
    });

    const moon = new THREE.Mesh(geometry, material);
    scene.add(moon);

    // 4. Lights Setup
    // Soft blue ambient light (fills dark shadows)
    const ambientLight = new THREE.AmbientLight('#0F172A', 0.8);
    scene.add(ambientLight);

    // Dynamic warm gold sunlight
    const sunLight = new THREE.DirectionalLight('#F59E0B', 4.5);
    sunLight.position.set(6, 3, 5);
    scene.add(sunLight);

    // Subtle blue rim light from behind
    const blueRimLight = new THREE.DirectionalLight('#3B82F6', 1.8);
    blueRimLight.position.set(-6, -3, -5);
    scene.add(blueRimLight);

    // 5. Parallax Control
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized mouse positions (-1 to 1)
      const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      const mouseY = (e.clientY / window.innerHeight) * 2 - 1;
      
      targetRotationY = mouseX * 0.25;
      targetRotationX = mouseY * 0.25;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize camera configuration
    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // 6. Animation Frame Loop
    let animId: number;
    const animate = () => {
      // Constant slow self-rotation
      moon.rotation.y += 0.0015;

      // Smooth mouse parallax interpolation
      currentRotationX += (targetRotationX - currentRotationX) * 0.05;
      currentRotationY += (targetRotationY - currentRotationY) * 0.05;

      moon.rotation.x = currentRotationX;
      moon.rotation.z = -currentRotationY * 0.5; // Subtle tilt

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      mapTexture.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[320px] md:h-[450px] flex items-center justify-center cursor-pointer select-none"
      onClick={handleMoonClick}
    >
      {/* Outer pulsing neon crescent glow */}
      <div 
        className={`absolute rounded-full pointer-events-none transition-all duration-1000 ${
          isSecretTriggered 
            ? 'w-[280px] h-[280px] bg-gold-400 opacity-60 blur-3xl scale-125' 
            : 'w-[250px] h-[250px] bg-gold-500 opacity-20 blur-2xl animate-pulse'
        }`}
      />
      <canvas ref={canvasRef} className="z-10 w-full h-full max-w-[450px] max-h-[450px]" />
    </div>
  );
}
