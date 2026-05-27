import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { senderName, receiverName, message, theme, fontStyle, eidType } = await req.json();

    if (!receiverName || !message) {
      return NextResponse.json(
        { success: false, error: 'Recipient and Message content are required' },
        { status: 400 }
      );
    }

    // 1. Generate a highly unique card identifier (slug)
    const uniqueId = Math.random().toString(36).substring(2, 10);
    const slug = `card-${uniqueId}`;

    // 2. Create the card record in the Wish database model
    const card = await prisma.wish.create({
      data: {
        senderName: senderName ? senderName.trim() : 'Eid Card Generator',
        receiverName: receiverName.trim(),
        message: message.trim(),
        theme: theme || 'gold',
        slug,
        eidType: eidType || 'eid-al-adha',
        isPublic: true,
        viewCount: 0
      }
    });

    // 3. Log published action in analytics
    try {
      await prisma.analytics.create({
        data: {
          event: 'card_downloaded', // Logged as published card event
          theme: theme || 'gold',
          eidType: eidType || 'eid-al-adha'
        }
      });
    } catch (e) {}

    return NextResponse.json({ success: true, card }, { status: 201 });
  } catch (err: any) {
    console.error('Cards API POST Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
