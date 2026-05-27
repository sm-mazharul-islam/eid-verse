import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const eidType = searchParams.get('eidType'); // "eid-al-fitr" | "eid-al-adha"

    // Fetch active blessings matching the current Eid or tagged as general
    const blessings = await prisma.blessing.findMany({
      where: {
        isActive: true,
        OR: [
          { eidType: 'general' },
          { eidType: eidType || 'eid-al-adha' }
        ]
      }
    });

    if (blessings.length === 0) {
      // Return a default mock blessing if nothing in the database yet
      return NextResponse.json({
        success: true,
        blessing: {
          id: 'default',
          text: 'May Allah accept your sacrifices, answer your prayers, and protect your loved ones with His infinite mercy. Eid Mubarak!',
          category: 'general',
          language: 'en',
          eidType: 'general',
          usedCount: 0
        }
      });
    }

    // Pick a random blessing
    const randomIndex = Math.floor(Math.random() * blessings.length);
    const selected = blessings[randomIndex];

    // Increment usedCount in the background
    try {
      await prisma.blessing.update({
        where: { id: selected.id },
        data: { usedCount: { increment: 1 } }
      });
    } catch (err) {}

    return NextResponse.json({ success: true, blessing: selected });
  } catch (err: any) {
    console.error('Blessings API GET Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { text, category, language, eidType } = await req.json();

    if (!text) {
      return NextResponse.json(
        { success: false, error: 'Blessing text is required' },
        { status: 400 }
      );
    }

    const blessing = await prisma.blessing.create({
      data: {
        text,
        category: category || 'general',
        language: language || 'en',
        eidType: eidType || 'general',
        isActive: true,
        usedCount: 0
      }
    });

    return NextResponse.json({ success: true, blessing }, { status: 201 });
  } catch (err: any) {
    console.error('Blessings API POST Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
