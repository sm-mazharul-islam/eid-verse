import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const eidType = searchParams.get('eidType');

    // Fetch active supplications matching current Eid or tagged as general
    const duas = await prisma.dua.findMany({
      where: {
        isActive: true,
        OR: [
          { eidType: 'general' },
          { eidType: eidType || 'eid-al-adha' }
        ]
      }
    });

    if (duas.length === 0) {
      // In-memory fallback if JSON DB / Mongo is empty
      return NextResponse.json({
        success: true,
        duas: [
          {
            id: 'd-fallback-1',
            text: 'May Allah accept it from us and from you.',
            arabic: 'تَقَبَّلَ اللَّهُ مِنَّا وَمِنْكُمْ',
            meaning: 'May Allah accept from us and from you.',
            category: 'gratitude',
            duaType: 'general',
            eidType: 'general'
          }
        ]
      });
    }

    return NextResponse.json({ success: true, duas });
  } catch (err: any) {
    console.error('Duas GET API Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { text, arabic, meaning, category, duaType, eidType } = await req.json();

    if (!text) {
      return NextResponse.json(
        { success: false, error: 'Dua text is required' },
        { status: 400 }
      );
    }

    const newDua = await prisma.dua.create({
      data: {
        text,
        arabic: arabic || '',
        meaning: meaning || '',
        category: category || 'general',
        duaType: duaType || 'general',
        eidType: eidType || 'general',
        isActive: true,
        usedCount: 0
      }
    });

    return NextResponse.json({ success: true, dua: newDua }, { status: 201 });
  } catch (err: any) {
    console.error('Duas POST API Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
