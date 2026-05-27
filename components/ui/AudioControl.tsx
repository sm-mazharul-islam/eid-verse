'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Music, HelpCircle } from 'lucide-react';
import { Howl } from 'howler';

type AudioState = 'off' | 'wind' | 'full';

export default function AudioControl() {
  const [audioState, setAudioState] = useState<AudioState>('off');
  const [synthSupport, setSynthSupport] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const synthNodesRef = useRef<{ oscillator: OscillatorNode; gain: GainNode }[]>([]);

  // Howler instances references
  const windHowlRef = useRef<Howl | null>(null);
  const takbirHowlRef = useRef<Howl | null>(null);

  // Initialize Howler sound layers
  useEffect(() => {
    // 1. Set up Web Audio API capability detection
    if (typeof window !== 'undefined' && (window.AudioContext || (window as any).webkitAudioContext)) {
      setSynthSupport(true);
    }

    // 2. Build Howler audio instances
    windHowlRef.current = new Howl({
      src: ['/sounds/wind-ambient.mp3'],
      loop: true,
      volume: 0.15,
      html5: true,
    });

    takbirHowlRef.current = new Howl({
      src: ['/sounds/takbir-soft.mp3'],
      loop: true,
      volume: 0.12,
      html5: true,
    });

    // Check localStorage preference
    const saved = localStorage.getItem('eidverse-audio-preference');
    if (saved === 'wind' || saved === 'full') {
      // Browsers require interaction, so we don't autoplay off the bat
      // but we wait for their first click on the document to activate it
      const initAudioOnInteraction = () => {
        handleAudioToggle(saved as AudioState);
        document.removeEventListener('click', initAudioOnInteraction);
      };
      document.addEventListener('click', initAudioOnInteraction);
    }

    return () => {
      windHowlRef.current?.unload();
      takbirHowlRef.current?.unload();
      stopWebAudioSynth();
    };
  }, []);

  // Web Audio Fallback: Synthesize soft background wind waves
  const startWebAudioSynth = () => {
    try {
      if (!audioContextRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContextClass();
      }

      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Create two low-frequency oscillators to create a beating wind effect
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.value = 65.41; // C2 key - deep, warm humming sound

      osc2.type = 'triangle';
      osc2.frequency.value = 65.8; // Slightly out of phase for nice beating acoustic wave

      gainNode.gain.setValueAtTime(0.02, ctx.currentTime); // Extremely quiet background hum

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start();
      osc2.start();

      synthNodesRef.current = [
        { oscillator: osc1, gain: gainNode },
        { oscillator: osc2, gain: gainNode }
      ];
    } catch (err) {
      console.warn('Web Audio Fallback failed to synthesize:', err);
    }
  };

  const stopWebAudioSynth = () => {
    synthNodesRef.current.forEach((node) => {
      try {
        node.oscillator.stop();
      } catch (err) {}
    });
    synthNodesRef.current = [];
  };

  // Sound triggering functions for application actions
  const triggerInteractionChime = () => {
    try {
      // Try Howler chime
      const chime = new Audio('/sounds/chime.mp3');
      chime.volume = 0.35;
      chime.play().catch(() => {
        // Fallback Web Audio API pentatonic synthetic chime
        if (audioContextRef.current) {
          const ctx = audioContextRef.current;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          // Beautiful high-frequency warm note (E5 = 659.25Hz)
          osc.frequency.setValueAtTime(659.25, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // Ramp up to A5

          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start();
          osc.stop(ctx.currentTime + 0.8);
        }
      });
    } catch (e) {}
  };

  const triggerEnvelopeSlideSound = () => {
    try {
      const audio = new Audio('/sounds/envelope-open.mp3');
      audio.volume = 0.4;
      audio.play().catch(() => {
        // Fallback synthetic sweep
        if (audioContextRef.current) {
          const ctx = audioContextRef.current;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(150, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.4);

          gain.gain.setValueAtTime(0.05, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start();
          osc.stop(ctx.currentTime + 0.4);
        }
      });
    } catch (e) {}
  };

  // Expose triggers globally for page events
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).triggerEidChime = triggerInteractionChime;
      (window as any).triggerEnvelopeSound = triggerEnvelopeSlideSound;
    }
  }, []);

  const handleAudioToggle = (targetState?: AudioState) => {
    let nextState: AudioState = 'off';
    
    if (targetState) {
      nextState = targetState;
    } else {
      if (audioState === 'off') nextState = 'wind';
      else if (audioState === 'wind') nextState = 'full';
      else nextState = 'off';
    }

    setAudioState(nextState);
    localStorage.setItem('eidverse-audio-preference', nextState);

    // Stop everything first
    windHowlRef.current?.stop();
    takbirHowlRef.current?.stop();
    stopWebAudioSynth();

    // Trigger state configurations
    if (nextState === 'wind') {
      const playPromise = windHowlRef.current?.play();
      if (!playPromise && synthSupport) {
        startWebAudioSynth();
      }
    } else if (nextState === 'full') {
      windHowlRef.current?.play();
      takbirHowlRef.current?.play();
      if (synthSupport) {
        startWebAudioSynth();
      }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end gap-2 animate-fade-in">
      {/* Dynamic sound indicator badge */}
      {audioState !== 'off' && (
        <div className="glass-panel text-[10px] text-gold-300 font-serif border border-gold-400/20 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-[0_0_10px_rgba(226,192,125,0.15)]">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
          {audioState === 'wind' ? 'Ambient breeze active' : 'Full Spiritual Audio active'}
        </div>
      )}

      {/* Primary Toggle button */}
      <button
        onClick={() => handleAudioToggle()}
        className="glass-panel w-12 h-12 rounded-full border border-gold-400/20 flex items-center justify-center text-gold-300 hover:text-white shadow-lg transition-all hover:scale-105 active:scale-95"
        title="Toggle Cinematic Background Audio"
      >
        {audioState === 'off' && <VolumeX className="w-5 h-5 opacity-70" />}
        {audioState === 'wind' && <Volume2 className="w-5 h-5 animate-pulse" />}
        {audioState === 'full' && (
          <div className="relative">
            <Music className="w-5 h-5 text-gold-400 animate-spin" style={{ animationDuration: '6s' }} />
            <Volume2 className="w-3 h-3 absolute -top-1 -right-2 text-white" />
          </div>
        )}
      </button>
    </div>
  );
}
