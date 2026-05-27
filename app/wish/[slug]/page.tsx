import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import StarField from '@/components/animation/StarField';
import FloatingLanterns from '@/components/animation/FloatingLanterns';
import GoldenButton from '@/components/ui/GoldenButton';
import AudioControl from '@/components/ui/AudioControl';
import { Sparkles, Heart } from 'lucide-react';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate dynamic server-side Open Graph metadata for rich social previews on WhatsApp/Facebook
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const wish = await prisma.wish.findUnique({
    where: { slug: resolvedParams.slug },
  });

  if (!wish) {
    return {
      title: 'Eid Greetings | EidVerse',
      description: 'Open a beautiful cinematic greeting prepared especially for you.',
    };
  }

  return {
    title: `Special Eid Wishes for ${wish.receiverName} | From ${wish.senderName}`,
    description: `“${wish.message.slice(0, 100)}...” Click to unlock your full animated cinematic Eid al-Adha greeting on EidVerse.`,
    openGraph: {
      title: `Cinematic Eid Wishes for ${wish.receiverName}`,
      description: wish.message,
      type: 'website',
    }
  };
}

export default async function WishPage({ params }: Props) {
  const resolvedParams = await params;
  const wish = await prisma.wish.findUnique({
    where: { slug: resolvedParams.slug },
  });

  if (!wish) {
    notFound();
  }

  // Increment viewCount in background
  try {
    await prisma.wish.update({
      where: { id: wish.id },
      data: { viewCount: { increment: 1 } },
    });
  } catch (err) {}

  // Map theme variables
  const isAdha = wish.eidType === 'eid-al-adha';
  
  const themeClasses: Record<string, string> = {
    moon: 'bg-gradient-to-b from-[#09121F] to-[#03070C] text-[#FFF8E7] border-blue-500/20 shadow-[0_0_40px_rgba(59,130,246,0.15)]',
    mosque: 'bg-gradient-to-tr from-[#1E1B29] to-[#0A0812] text-[#FFF8E7] border-purple-500/20 shadow-[0_0_40px_rgba(168,85,247,0.15)]',
    lantern: 'bg-gradient-to-b from-[#1C160E] to-[#080603] text-[#FFF3D4] border-amber-500/20 shadow-[0_0_40px_rgba(245,158,11,0.15)]',
    gold: 'bg-gradient-to-tr from-[#0F0F0B] via-[#050503] to-[#14120D] text-[#FFF8E7] border-gold-500/30 shadow-[0_0_40px_rgba(184,134,11,0.25)]'
  };

  const titleColors: Record<string, string> = {
    moon: 'text-blue-200 filter drop-shadow-[0_0_10px_rgba(147,197,253,0.3)]',
    mosque: 'text-purple-300 filter drop-shadow-[0_0_10px_rgba(216,180,254,0.3)]',
    lantern: 'text-amber-400 filter drop-shadow-[0_0_10px_rgba(252,211,77,0.3)]',
    gold: 'text-gold-300 filter drop-shadow-[0_0_12px_#B8860B]'
  };

  const resolvedThemeClass = themeClasses[wish.theme] || themeClasses.gold;
  const resolvedTitleColor = titleColors[wish.theme] || titleColors.gold;

  return (
    <div 
      className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 overflow-hidden"
      style={{
        backgroundColor: '#070708',
      }}
    >
      {/* 1. Drift star background based on the chosen theme */}
      <StarField density={130} speed={0.06} theme={wish.theme === 'moon' ? 'fitr' : 'adha'} />

      {/* Floating lanterns */}
      <FloatingLanterns count={wish.theme === 'lantern' ? 15 : 6} />

      {/* Islamic geometric patterns */}
      <div className="absolute inset-0 arabic-pattern-overlay opacity-[0.02] pointer-events-none" />

      {/* 2. Full screen glassmorphic layout card */}
      <div className={`relative z-20 max-w-xl w-full border p-8 md:p-12 rounded-2xl flex flex-col justify-between min-h-[460px] text-center ${resolvedThemeClass} transition-all duration-700 animate-fade-in`}>
        
        {/* Top visual accents */}
        <div className="flex items-center justify-between text-[10px] text-gold-400 uppercase tracking-widest font-serif border-b border-white/5 pb-4 mb-8">
          <span>Cinematic Dedication</span>
          <span>EidVerse Card</span>
        </div>

        {/* Sender details */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-[0.25em] text-gray-400 block mb-2 font-medium">
            Prepared Especially For You
          </span>
          <h1 className={`font-serif text-3xl md:text-4xl font-bold tracking-wide ${resolvedTitleColor}`}>
            {wish.receiverName}
          </h1>
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-gold-400 to-transparent mt-3" />
        </div>

        {/* Customized message prompt */}
        <div className="my-10">
          <p className="font-serif text-lg md:text-xl leading-relaxed italic text-white/95 font-light">
            “{wish.message}”
          </p>
        </div>

        {/* Signed off signature */}
        <div className="border-t border-gold-400/10 pt-6 flex flex-col items-center gap-1.5">
          <span className="text-[9px] uppercase tracking-widest text-gray-500 font-light block">With Infinite Love & Respect</span>
          <span className="font-serif text-lg font-semibold text-gold-300">
            — {wish.senderName}
          </span>
        </div>

        {/* Shareback Call To Action links */}
        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/"
            className="btn-golden py-3.5 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-95 transition-all text-center w-full"
          >
            <Heart className="w-4 h-4" />
            Send Eid Wishes to Someone You Love
          </Link>
          
          <span className="text-[8px] text-gray-600 uppercase tracking-widest block font-light">
            {wish.viewCount} views • Created on EidVerse
          </span>
        </div>

      </div>

      {/* Floating sound controllers */}
      <AudioControl />

    </div>
  );
}
