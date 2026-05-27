import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import StarField from '@/components/animation/StarField';
import FloatingLanterns from '@/components/animation/FloatingLanterns';
import AudioControl from '@/components/ui/AudioControl';
import { Send, Heart, Sparkles } from 'lucide-react';
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

  const themeCards = {
    moon: {
      bg: 'bg-gradient-to-b from-[#09121F] to-[#03070C] border-blue-500/20 text-[#FFF8E7]',
      moonColor: 'text-blue-300/40 filter drop-shadow-[0_0_15px_rgba(147,197,253,0.3)]',
      cardGlow: 'shadow-[0_0_35px_rgba(59,130,246,0.18)]',
      patternOpacity: 'opacity-5',
      titleColor: 'text-gold-200',
    },
    mosque: {
      bg: 'bg-gradient-to-tr from-[#1E1B29] to-[#0A0812] border-purple-500/20 text-[#FFF8E7]',
      moonColor: 'text-purple-300/30 filter drop-shadow-[0_0_15px_rgba(216,180,254,0.3)]',
      cardGlow: 'shadow-[0_0_35px_rgba(168,85,247,0.18)]',
      patternOpacity: 'opacity-5',
      titleColor: 'text-purple-300',
    },
    lantern: {
      bg: 'bg-gradient-to-b from-[#1C160E] to-[#080603] border-amber-500/20 text-[#FFF3D4]',
      moonColor: 'text-amber-300/30 filter drop-shadow-[0_0_15px_rgba(252,211,77,0.3)]',
      cardGlow: 'shadow-[0_0_35px_rgba(245,158,11,0.18)]',
      patternOpacity: 'opacity-5',
      titleColor: 'text-amber-400',
    },
    gold: {
      bg: 'bg-gradient-to-tr from-[#0F0F0B] via-[#050503] to-[#14120D] border-gold-500/30 text-[#FFF8E7]',
      moonColor: 'text-gold-400/40 filter drop-shadow-[0_0_15px_#B8860B]',
      cardGlow: 'shadow-[0_0_40px_rgba(184,134,11,0.3)]',
      patternOpacity: 'opacity-10',
      titleColor: 'text-gold-300',
    }
  }[card.theme as 'moon' | 'mosque' | 'lantern' | 'gold'] || {
    bg: 'bg-gradient-to-tr from-[#0F0F0B] via-[#050503] to-[#14120D] border-gold-500/30 text-[#FFF8E7]',
    moonColor: 'text-gold-400/40 filter drop-shadow-[0_0_15px_#B8860B]',
    cardGlow: 'shadow-[0_0_40px_rgba(184,134,11,0.3)]',
    patternOpacity: 'opacity-10',
    titleColor: 'text-gold-300',
  };

  return (
    <div 
      className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 overflow-hidden"
      style={{ backgroundColor: '#070708' }}
    >
      {/* Dynamic Star background */}
      <StarField density={120} speed={0.06} theme={card.theme === 'moon' ? 'fitr' : 'adha'} />

      {/* Floating lanterns */}
      <FloatingLanterns count={card.theme === 'lantern' ? 14 : 6} />

      {/* Islamic geometric pattern backdrop overlay */}
      <div className="absolute inset-0 arabic-pattern-overlay opacity-[0.02] pointer-events-none" />

      {/* High density Card Preview wrapper */}
      <div className="relative z-20 w-full max-w-[480px] flex flex-col gap-6 items-center animate-fade-in">
        
        {/* Actual Glowing Card Container */}
        <div
          className={`relative aspect-[4/3] w-full rounded-2xl border p-8 md:p-10 flex flex-col justify-between overflow-hidden shadow-2xl transition-transform duration-500 hover:scale-[1.01] ${themeCards.bg} ${themeCards.cardGlow}`}
        >
          {/* Geometric overlay */}
          <div 
            className={`absolute inset-0 arabic-pattern-overlay ${themeCards.patternOpacity} pointer-events-none`}
            style={{ mixBlendMode: 'overlay' }}
          />

          {/* Corner visual stamps */}
          <div className="absolute top-4 left-4 text-gold-400/30 font-serif text-[10px] tracking-widest uppercase">
            🕌 EID
          </div>
          <div className="absolute top-4 right-4 text-gold-400/30 font-serif text-[10px] tracking-widest uppercase">
            {card.eidType === 'eid-al-fitr' ? 'FITR 🌙' : 'ADHA 🕋'}
          </div>

          {/* Core themed vector logo moon */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 flex items-center justify-center pointer-events-none">
            <svg
              viewBox="0 0 100 100"
              className={`w-full h-full ${themeCards.moonColor}`}
            >
              <path d="M50,10 C62.5,10 74,15.5 82,24 C71.5,23.5 59.5,29.5 52,38.5 C44.5,47.5 43.5,59.5 48.5,69.5 C36.5,66 28,54.5 28,41 C28,24 37.5,10 50,10 Z" />
            </svg>
          </div>

          {/* Recipient Slot */}
          <div className="relative z-10 text-center flex flex-col items-center">
            <span className="text-[10px] md:text-xs text-gold-300 font-serif tracking-[0.25em] uppercase font-semibold block mb-2">
              Prepared Especially For
            </span>
            <h3 className={`font-serif text-2xl md:text-3xl font-bold tracking-wide ${themeCards.titleColor}`}>
              {card.receiverName}
            </h3>
            <div className="w-16 h-[1.5px] bg-gradient-to-r from-transparent via-gold-400 to-transparent mt-3" />
          </div>

          {/* Blessing Message Slot */}
          <div className="relative z-10 text-center my-6">
            <p className="text-xs md:text-sm leading-relaxed font-serif italic text-white/95">
              “{card.message}”
            </p>
          </div>

          {/* Card Footer branding */}
          <div className="relative z-10 text-center border-t border-gold-400/10 pt-4 flex flex-col items-center">
            {card.senderName && card.senderName !== 'Eid Card Generator' && (
              <span className="text-[9px] uppercase tracking-widest text-gold-300 font-serif mb-1 block">
                With Love & Respect: {card.senderName}
              </span>
            )}
            <span className="font-arabic text-xl text-gold-300 tracking-wider">عيد مبارك</span>
            <span className="text-[9px] uppercase tracking-widest text-gray-500 mt-1 font-light">
              {card.eidType === 'eid-al-fitr' ? 'Eid al-Fitr' : 'Eid al-Adha'} • Created on EidVerse
            </span>
          </div>
        </div>

        {/* Dynamic CTA Backlink Panel */}
        <div className="w-full glass-panel border border-white/10 p-6 rounded-2xl flex flex-col gap-3 shadow-lg">
          <Link
            href="/"
            className="btn-golden py-3.5 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-95 transition-all text-center w-full"
          >
            <Heart className="w-4 h-4" />
            Create a Customized Card For Someone You Love
          </Link>
          <span className="text-[8px] text-gray-600 uppercase tracking-widest block text-center font-light mt-1">
            {card.viewCount} views • Created on EidVerse
          </span>
        </div>

      </div>

      {/* Sound manager panel */}
      <AudioControl />

    </div>
  );
}
