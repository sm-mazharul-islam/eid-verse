import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import StarField from '@/components/animation/StarField';
import FloatingLanterns from '@/components/animation/FloatingLanterns';
import AudioControl from '@/components/ui/AudioControl';
import SharedCardVisual from '@/components/sections/SharedCardVisual';
import { Send, Heart, Sparkles, Home, ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const card = await prisma.wish.findUnique({
    where: { slug: `card-${resolvedParams.id}` }
  });

  if (!card) {
    return {
      title: 'Eid Card | EidVerse',
      description: 'Open a beautiful animated greeting card prepared especially for you.',
    };
  }

  return {
    title: `Special Eid Card for ${card.receiverName} | EidVerse`,
    description: `“${card.message.slice(0, 100)}...” Open to unlock your custom animated HD Eid card on EidVerse.`,
    openGraph: {
      title: `Cinematic Eid Card for ${card.receiverName}`,
      description: card.message,
      type: 'website',
    }
  };
}

export default async function CardPage({ params }: Props) {
  const resolvedParams = await params;
  const card = await prisma.wish.findUnique({
    where: { slug: `card-${resolvedParams.id}` }
  });

  if (!card) {
    notFound();
  }

  // Increment view count in background
  try {
    await prisma.wish.update({
      where: { id: card.id },
      data: { viewCount: { increment: 1 } }
    });
  } catch (err) {}

  const themeAmbientGlows = {
    moon: 'from-[#0a192f]/80 via-[#03070c]/95 to-[#020406]',
    mosque: 'from-[#1b1429]/80 via-[#0a0712]/95 to-[#040307]',
    lantern: 'from-[#231709]/80 via-[#080503]/95 to-[#040201]',
    gold: 'from-[#1e190f]/80 via-[#070604]/95 to-[#020201]',
  }[card.theme as 'moon' | 'mosque' | 'lantern' | 'gold'] || 'from-[#1e190f]/80 via-[#070604]/95 to-[#020201]';

  return (
    <div 
      className={`relative min-h-screen w-full flex flex-col items-center justify-between p-6 overflow-hidden bg-gradient-to-b ${themeAmbientGlows}`}
    >
      {/* Dynamic Star background */}
      <StarField density={140} speed={0.05} theme={card.theme === 'moon' ? 'fitr' : 'adha'} />

      {/* Floating lanterns */}
      <FloatingLanterns count={card.theme === 'lantern' ? 12 : 6} />

      {/* Islamic geometric pattern backdrop overlay */}
      <div className="absolute inset-0 arabic-pattern-overlay opacity-[0.015] pointer-events-none" />

      {/* Header Brand Link */}
      <header className="relative z-20 w-full max-w-5xl flex justify-between items-center py-4 border-b border-white/5 mb-8">
        <Link 
          href="/" 
          className="font-serif text-sm md:text-base font-bold tracking-[0.2em] text-white hover:text-gold-300 transition-colors uppercase flex items-center gap-1.5 cursor-pointer"
        >
          EIDVERSE
          <span className="text-[8px] text-gold-400 font-sans tracking-widest bg-gold-500/10 px-2 py-0.5 rounded border border-gold-400/20 uppercase">
            {card.eidType === 'eid-al-fitr' ? 'Fitr Mode 🌙' : 'Adha Special 🕋'}
          </span>
        </Link>
        <Link
          href="/"
          className="glass-panel border border-white/5 hover:border-gold-400/30 text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-full flex items-center gap-1 transition-all"
        >
          <Home className="w-3.5 h-3.5" />
          Home
        </Link>
      </header>

      {/* High density Card Preview wrapper */}
      <div className="relative z-20 w-full max-w-[480px] flex flex-col gap-8 items-center my-auto animate-fade-in py-6">
        
        <div className="text-center">
          <span className="text-[10px] text-gold-300 font-serif tracking-[0.3em] uppercase block mb-1">
            ✨ Spiritual Blessing Unlocked ✨
          </span>
          <p className="text-[9px] text-gray-500 uppercase tracking-widest">
            Move your cursor or hover to interact with the 3D depth of the card
          </p>
        </div>

        {/* Dynamic Interactive Card Visual */}
        <SharedCardVisual card={{
          receiverName: card.receiverName,
          message: card.message,
          theme: card.theme,
          senderName: card.senderName,
          eidType: card.eidType,
        }} />

        {/* Dynamic CTA Backlink Panel */}
        <div className="w-full glass-panel border border-white/10 p-6 rounded-2xl flex flex-col gap-4 shadow-xl text-center">
          <div className="flex flex-col gap-1">
            <h4 className="text-xs text-gold-300 uppercase tracking-widest font-serif font-semibold">Want to make your own?</h4>
            <p className="text-[10px] text-gray-400 leading-relaxed">Create and share a highly customized, 3D animated card with standard soundscapes for friends, parents, or specific professions!</p>
          </div>
          <Link
            href="/"
            className="btn-golden py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-95 transition-all text-center w-full shadow-lg"
          >
            <Heart className="w-4 h-4 animate-pulse text-red-500" />
            Design Custom Card Now
          </Link>
          <span className="text-[8px] text-gray-600 uppercase tracking-widest block font-mono">
            {card.viewCount} views • Created with love on EidVerse
          </span>
        </div>

      </div>

      {/* Footer Branding */}
      <footer className="relative z-20 py-6 text-center w-full max-w-5xl border-t border-white/5 mt-8">
        <p className="text-[9px] text-gray-600 font-mono tracking-wider uppercase">
          An Emotional Cinematic Journey • Powered by Next.js & Web Audio API
        </p>
      </footer>

      {/* Sound manager panel */}
      <AudioControl />

    </div>
  );
}
