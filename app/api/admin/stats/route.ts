import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    // 1. Gather primary metrics from the database models
    const totalWishes = await prisma.wish.count({
      where: { NOT: { senderName: 'Eid Card Generator' } }
    });

    const totalCards = await prisma.wish.count({
      where: { senderName: 'Eid Card Generator' }
    });

    const pendingMessages = await prisma.globalMessage.count({
      where: { isApproved: false }
    });

    const approvedMessages = await prisma.globalMessage.count({
      where: { isApproved: true }
    });

    const pendingStories = await prisma.qurbaniStory.count({
      where: { isApproved: false }
    });

    const approvedStories = await prisma.qurbaniStory.count({
      where: { isApproved: true }
    });

    // 2. Fetch wishes to compile visual theme analytics
    const allWishes = await prisma.wish.findMany({ select: { theme: true, country: true } });
    
    const themeCount: Record<string, number> = { moon: 0, mosque: 0, lantern: 0, gold: 0 };
    const countryCount: Record<string, number> = {};

    allWishes.forEach((w: any) => {
      if (w.theme in themeCount) themeCount[w.theme]++;
      if (w.country) {
        countryCount[w.country] = (countryCount[w.country] || 0) + 1;
      }
    });

    // Convert theme popularity to clean chart formats
    const themeStats = Object.keys(themeCount).map((k) => ({
      name: k.charAt(0).toUpperCase() + k.slice(1),
      count: themeCount[k]
    }));

    // Convert country popularity to clean sorted lists
    const countryStats = Object.keys(countryCount)
      .map((k) => ({ country: k, count: countryCount[k] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 3. Fetch active blessings to show utilization ranks
    const blessings = await prisma.blessing.findMany({
      select: { id: true, text: true, category: true, usedCount: true },
      orderBy: { usedCount: 'desc' },
      take: 5
    });

    // 4. Fetch list of pending global wishes and stories for immediate moderation loading
    const pendingGlobalMessages = await prisma.globalMessage.findMany({
      where: { isApproved: false },
      orderBy: { createdAt: 'desc' }
    });

    const pendingStoryEntries = await prisma.qurbaniStory.findMany({
      where: { isApproved: false },
      orderBy: { createdAt: 'desc' }
    });

    // Fetch lists of wishes & blessings for full CRUD management
    const allWishesList = await prisma.wish.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    const allBlessingsList = await prisma.blessing.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const allDuasList = await prisma.dua.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      metrics: {
        totalWishes,
        totalCards,
        pendingMessages,
        approvedMessages,
        pendingStories,
        approvedStories
      },
      charts: {
        themeStats,
        countryStats,
        blessingsUsage: blessings
      },
      moderation: {
        pendingGlobalMessages,
        pendingStoryEntries
      },
      management: {
        wishes: allWishesList,
        blessings: allBlessingsList,
        duas: allDuasList
      }
    });
  } catch (err: any) {
    console.error('Admin Stats API GET Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
