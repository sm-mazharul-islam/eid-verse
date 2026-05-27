import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { action, type, id, activeState } = await req.json();

    if (!action || !type || !id) {
      return NextResponse.json(
        { success: false, error: 'Action, Type, and ID are required' },
        { status: 400 }
      );
    }

    let result: any = null;

    // 1. Moderate Global Broadcast Wishes
    if (type === 'global-message') {
      if (action === 'approve') {
        result = await prisma.globalMessage.update({
          where: { id },
          data: { isApproved: true }
        });
      } else if (action === 'reject') {
        result = await prisma.globalMessage.delete({
          where: { id }
        });
      }
    } 
    // 2. Moderate Memory Wall Stories
    else if (type === 'story') {
      if (action === 'approve') {
        result = await prisma.qurbaniStory.update({
          where: { id },
          data: { isApproved: true }
        });
      } else if (action === 'reject') {
        result = await prisma.qurbaniStory.delete({
          where: { id }
        });
      }
    }
    // 3. Delete inappropriate wishes or cards
    else if (type === 'wish') {
      if (action === 'delete') {
        result = await prisma.wish.delete({
          where: { id }
        });
      }
    }
    // 4. Manage Blessings CRUD
    else if (type === 'blessing') {
      if (action === 'delete') {
        result = await prisma.blessing.delete({
          where: { id }
        });
      } else if (action === 'toggle') {
        result = await prisma.blessing.update({
          where: { id },
          data: { isActive: activeState }
        });
      }
    }
    // 5. Manage Duas CRUD
    else if (type === 'dua') {
      if (action === 'delete') {
        result = await prisma.dua.delete({
          where: { id }
        });
      }
    }

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Invalid moderation action or type' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    console.error('Moderation API Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
