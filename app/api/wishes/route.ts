import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateCustomWish } from '@/lib/wishTemplates';

export async function POST(req: NextRequest) {
  try {
    const { senderName, receiverName, relationship, theme, eidType } = await req.json();

    if (!senderName || !receiverName) {
      return NextResponse.json(
        { success: false, error: 'Sender and Receiver names are required' },
        { status: 400 }
      );
    }

    // 1. Generate customized wish content using the template compiler
    const message = generateCustomWish(senderName, receiverName, relationship, theme, eidType);

    // 2. Generate a highly unique shareable slug
    const cleanSender = senderName.trim().toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 15);
    const cleanReceiver = receiverName.trim().toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 15);
    const uniqueSalt = Math.random().toString(36).substring(2, 6);
    const slug = `${cleanSender}-${cleanReceiver}-${uniqueSalt}`;

    // 3. Create wish in database (MongoDB or Dynamic JSON fallback)
    const wish = await prisma.wish.create({
      data: {
        senderName: senderName.trim(),
        receiverName: receiverName.trim(),
        message,
        theme,
        slug,
        eidType,
        isPublic: true,
        viewCount: 0,
      }
    });

    // 4. Log event in analytics
    try {
      await prisma.analytics.create({
        data: {
          event: 'wish_created',
          theme,
          eidType,
          country: 'BD', // Approximate default, could parse headers
        }
      });
    } catch (e) {}

    return NextResponse.json({ success: true, wish }, { status: 201 });
  } catch (err: any) {
    console.error('Wishes API POST Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;
    const eidType = searchParams.get('eidType');

    const filter: any = { isPublic: true };
    if (eidType) {
      filter.eidType = eidType;
    }

    const wishes = await prisma.wish.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({ success: true, wishes });
  } catch (err: any) {
    console.error('Wishes API GET Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
