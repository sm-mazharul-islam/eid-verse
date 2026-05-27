import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    // Fetch all approved global greetings
    const messages = await prisma.globalMessage.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    return NextResponse.json({ success: true, messages });
  } catch (err: any) {
    console.error('GlobalMessages GET API Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, country, flag, message, eidType } = await req.json();

    if (!name || !country || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, Country, and Message are required' },
        { status: 400 }
      );
    }

    const newMessage = await prisma.globalMessage.create({
      data: {
        name: name.trim(),
        country,
        flag: flag || '🇧🇩',
        message: message.trim(),
        eidType: eidType || 'eid-al-adha',
        isApproved: false // Requires admin verification
      }
    });

    return NextResponse.json({ success: true, message: newMessage }, { status: 201 });
  } catch (err: any) {
    console.error('GlobalMessages POST API Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
