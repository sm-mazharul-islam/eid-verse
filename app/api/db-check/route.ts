import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    // Detect if we are using the Mock Fallback Client or the real Prisma Client
    const isMock = 'user' in prisma && 'wish' in prisma && !('$on' in prisma);
    const hasEnvUrl = !!process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('mongodb');

    if (isMock) {
      return NextResponse.json({
        connected: false,
        mode: 'Local Fallback JSON Mode (db-fallback.json)',
        details: 'DATABASE_URL environment variable is not configured or does not start with "mongodb". The application is gracefully operating in high-performance local JSON Fallback database mode.',
        setupInstructions: [
          '1. Create a MongoDB Atlas cluster at mongodb.com',
          '2. Add DATABASE_URL="..." to your .env file in the root directory.',
          '3. Make sure the connection string is valid and whitelist your IP (or 0.0.0.0/0 for global access) in MongoDB settings.',
          '4. Run "npx prisma db push" in your terminal to initialize the MongoDB collections and indexes.',
          '5. Restart the server and refresh this page.'
        ]
      });
    }

    // Attempt a lightweight test query to ensure live database connection response
    await prisma.user.findFirst();

    return NextResponse.json({
      connected: true,
      mode: 'Live MongoDB Database Mode',
      details: 'Prisma Client successfully established a connection with your MongoDB database! The schema is fully operational.',
      hasEnvUrl
    });
  } catch (err: any) {
    return NextResponse.json({
      connected: false,
      mode: 'Prisma Connection Error',
      error: err.message || 'Unable to communicate with the MongoDB instance',
      setupInstructions: [
        '1. Verify that your MongoDB connection string in the .env file has correct username and password credentials.',
        '2. Confirm that your MongoDB Atlas Network Access is whitelisted (ensure 0.0.0.0/0 is configured for global access during testing).',
        '3. Make sure you have run the command: npx prisma db push'
      ]
    }, { status: 500 });
  }
}
