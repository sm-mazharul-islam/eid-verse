import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const stories = await prisma.qurbaniStory.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, stories });
  } catch (err: any) {
    console.error('QurbaniStory GET API Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { animalName, memoryText, photoUrl, submitterName, city, country, year } = await req.json();

    if (!animalName || !memoryText || !submitterName) {
      return NextResponse.json(
        { success: false, error: 'Animal description, Memory text, and Submitter name are required' },
        { status: 400 }
      );
    }

    const story = await prisma.qurbaniStory.create({
      data: {
        animalName: animalName.trim(),
        memoryText: memoryText.trim(),
        photoUrl: photoUrl || '', // Directly saves base64 locally in JSON DB mode or MongoDB
        submitterName: submitterName.trim(),
        city: city || 'Dhaka',
        country: country || 'BD',
        year: year || 2026,
        isApproved: false // Requires admin moderation before displaying
      }
    });

    return NextResponse.json({ success: true, story }, { status: 201 });
  } catch (err: any) {
    console.error('QurbaniStory POST API Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
