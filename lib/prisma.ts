import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// File-based JSON Database fallback configuration
const FALLBACK_DB_PATH = path.join(process.cwd(), 'lib', 'db-fallback.json');

// Interface representing the fallback database structure
interface FallbackData {
  users: any[];
  wishes: any[];
  blessings: any[];
  duas: any[];
  reactions: any[];
  globalMessages: any[];
  qurbaniStories: any[];
  analytics: any[];
}

// Initial seed data to populate the JSON database
const INITIAL_SEED: FallbackData = {
  users: [
    { id: 'u1', name: 'Rahim', slug: 'rahim', email: 'rahim@eidverse.com', greetingCount: 5, favoriteTheme: 'moon', createdAt: new Date().toISOString() },
    { id: 'u2', name: 'Karim', slug: 'karim', email: 'karim@eidverse.com', greetingCount: 2, favoriteTheme: 'lantern', createdAt: new Date().toISOString() }
  ],
  wishes: [
    { id: 'w1', senderName: 'Rahim', receiverName: 'Aria', message: 'May your Eid al-Adha be filled with devotion, peace, and legendary fresh beef biriyani! Eid Mubarak!', theme: 'gold', slug: 'rahim-aria-eid', viewCount: 15, isPublic: true, country: 'BD', emoji: '🐄', eidType: 'eid-al-adha', createdAt: new Date().toISOString(), senderId: 'u1' },
    { id: 'w2', senderName: 'Karim', receiverName: 'Sami', message: 'Wishing you the sweet relief of Eid and countless boxes of sheer khurma! Eid Mubarak!', theme: 'lantern', slug: 'karim-sami-eid', viewCount: 7, isPublic: true, country: 'BD', emoji: '🌙', eidType: 'eid-al-fitr', createdAt: new Date().toISOString(), senderId: 'u2' }
  ],
  blessings: [
    { id: 'b1', text: 'May the sacrifice of Ibrahim (AS) inspire your heart with complete devotion and love. May Allah accept your Qurbani.', category: 'qurbani', language: 'en', eidType: 'eid-al-adha', isActive: true, usedCount: 120, createdAt: new Date().toISOString() },
    { id: 'b2', text: 'May your home be blessed with the warm laughter of family gathered together around a beautiful Eid feast.', category: 'family', language: 'en', eidType: 'general', isActive: true, usedCount: 84, createdAt: new Date().toISOString() },
    { id: 'b3', text: 'May your heart find peace, your soul find strength, and your life be showered with endless barakah.', category: 'peace', language: 'en', eidType: 'general', isActive: true, usedCount: 96, createdAt: new Date().toISOString() },
    { id: 'b4', text: 'After a beautiful month of fasting and patience, may this Eid al-Fitr wrap your heart in sweet, heavenly joy.', category: 'general', language: 'en', eidType: 'eid-al-fitr', isActive: true, usedCount: 110, createdAt: new Date().toISOString() },
    { id: 'b5', text: 'May the light of the mosque minarets shine softly in your heart tonight, answering every silent prayer.', category: 'peace', language: 'en', eidType: 'general', isActive: true, usedCount: 52, createdAt: new Date().toISOString() }
  ],
  duas: [
    {
      id: 'd1',
      text: 'O Allah, accept our Qurbani, our prayers, and our devotion. You are indeed the All-Hearing, the All-Knowing.',
      arabic: 'اللَّهُمَّ تَقَبَّلْ مِنَّا إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ',
      meaning: 'O Allah, accept from us, indeed You are the All-Hearing, the All-Knowing.',
      category: 'sacrifice',
      duaType: 'after-sacrifice',
      eidType: 'eid-al-adha',
      isActive: true,
      usedCount: 75,
      createdAt: new Date().toISOString()
    },
    {
      id: 'd2',
      text: 'In the name of Allah, Allah is the Greatest! O Allah, this is from You and for You.',
      arabic: 'بِسْمِ اللَّهِ وَاللَّهُ أَكْبَرُ اللَّهُمَّ هَذَا مِنْكَ وَلَكَ',
      meaning: 'In the name of Allah, Allah is the Greatest! O Allah, this is from You and for You.',
      category: 'sacrifice',
      duaType: 'before-sacrifice',
      eidType: 'eid-al-adha',
      isActive: true,
      usedCount: 140,
      createdAt: new Date().toISOString()
    },
    {
      id: 'd3',
      text: 'May Allah accept it from us and from you.',
      arabic: 'تَقَبَّلَ اللَّهُ مِنَّا وَمِنْكُمْ',
      meaning: 'May Allah accept from us and from you.',
      category: 'gratitude',
      duaType: 'general',
      eidType: 'general',
      isActive: true,
      usedCount: 220,
      createdAt: new Date().toISOString()
    },
    {
      id: 'd4',
      text: 'O Allah, grant my family good health, everlasting peace, and protect them from all harm. You are the Best Protector.',
      arabic: 'اللَّهُمَّ احْفَظْ أَهْلِي وَبَارِكْ لَهُمْ فِيهَا',
      meaning: 'O Allah, protect my family and bless them in all things.',
      category: 'family',
      duaType: 'general',
      eidType: 'general',
      isActive: true,
      usedCount: 95,
      createdAt: new Date().toISOString()
    }
  ],
  reactions: [],
  globalMessages: [
    { id: 'gm1', name: 'Tanvir', country: 'Bangladesh', flag: '🇧🇩', message: 'Eid Mubarak everyone! Wishing health and wealth to all cattle farmers this Eid! 🐄', isApproved: true, eidType: 'eid-al-adha', createdAt: new Date().toISOString() },
    { id: 'gm2', name: 'Aisha', country: 'United Kingdom', flag: '🇬🇧', message: 'Taqabbalallahu minna wa minkum from London! Miss my family back home so much! ❤️', isApproved: true, eidType: 'general', createdAt: new Date().toISOString() },
    { id: 'gm3', name: 'Faisal', country: 'Saudi Arabia', flag: '🇸🇦', message: 'A truly blessed Eid al-Adha. The atmosphere in Makkah is incredible! 🕋', isApproved: true, eidType: 'eid-al-adha', createdAt: new Date().toISOString() }
  ],
  qurbaniStories: [
    {
      id: 'qs1',
      animalName: 'Kalo (The Giant Black Cow)',
      memoryText: 'We bought Kalo 4 days before Eid. The children spent the whole day feeding him grass and apples in the parking lot. Saying goodbye on Eid morning was tough, but sharing the meat with 30 local families who could not afford it made it truly sacred.',
      photoUrl: '',
      cloudinaryId: '',
      submitterName: 'Rashedul Hasan',
      city: 'Dhaka',
      country: 'BD',
      year: 2026,
      isApproved: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'qs2',
      animalName: 'Laltu (The Majestic Red Goat)',
      memoryText: 'Laltu was extremely mischievous! He escaped the gates twice on the eve of Eid and had the entire neighborhood chasing him down. Eid morning beef biriyani and goat curry was absolutely legendary! Eid Mubarak!',
      photoUrl: '',
      cloudinaryId: '',
      submitterName: 'Jannat Ara',
      city: 'Chittagong',
      country: 'BD',
      year: 2026,
      isApproved: true,
      createdAt: new Date().toISOString()
    }
  ],
  analytics: [
    { id: 'a1', event: 'page_view', country: 'BD', theme: 'moon', eidType: 'eid-al-adha', sessionId: 's1', createdAt: new Date().toISOString() },
    { id: 'a2', event: 'wish_created', country: 'BD', theme: 'gold', eidType: 'eid-al-adha', sessionId: 's1', createdAt: new Date().toISOString() },
    { id: 'a3', event: 'card_downloaded', country: 'GB', theme: 'lantern', eidType: 'eid-al-fitr', sessionId: 's2', createdAt: new Date().toISOString() }
  ]
};

// Helper to read JSON DB
function readJsonDb(): FallbackData {
  try {
    if (!fs.existsSync(FALLBACK_DB_PATH)) {
      // Ensure folder exists
      const dir = path.dirname(FALLBACK_DB_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(FALLBACK_DB_PATH, JSON.stringify(INITIAL_SEED, null, 2), 'utf-8');
      return INITIAL_SEED;
    }
    const content = fs.readFileSync(FALLBACK_DB_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Fallback DB Read Error:', err);
    return INITIAL_SEED;
  }
}

// Helper to write JSON DB
function writeJsonDb(data: FallbackData) {
  try {
    const dir = path.dirname(FALLBACK_DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(FALLBACK_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Fallback DB Write Error:', err);
  }
}

// Create a highly robust Mock Prisma Client to intercept DB calls in JSON fallback mode
class MockPrismaModel {
  private key: keyof FallbackData;
  constructor(key: keyof FallbackData) {
    this.key = key;
  }

  async findMany(args?: { where?: any; orderBy?: any; take?: number; skip?: number }) {
    const db = readJsonDb();
    let list = db[this.key] || [];

    if (args?.where) {
      list = list.filter((item: any) => {
        for (const k in args.where) {
          const val = args.where[k];
          if (val && typeof val === 'object' && 'equals' in val) {
            if (item[k] !== val.equals) return false;
          } else if (val && typeof val === 'object') {
            // Skip complex deep queries or approximate
            continue;
          } else if (item[k] !== val) {
            return false;
          }
        }
        return true;
      });
    }

    // Sort order by createdAt desc (default simulation)
    if (args?.orderBy) {
      list = [...list].sort((a: any, b: any) => {
        const ad = new Date(a.createdAt || 0).getTime();
        const bd = new Date(b.createdAt || 0).getTime();
        return bd - ad;
      });
    }

    if (args?.take) {
      list = list.slice(0, args.take);
    }

    return list;
  }

  async findUnique(args: { where: any }) {
    const db = readJsonDb();
    const list = db[this.key] || [];
    const found = list.find((item: any) => {
      for (const k in args.where) {
        if (item[k] !== args.where[k]) return false;
      }
      return true;
    });
    return found || null;
  }

  async findFirst(args?: { where?: any }) {
    const db = readJsonDb();
    const list = db[this.key] || [];
    if (!args?.where) return list[0] || null;
    const found = list.find((item: any) => {
      for (const k in args.where) {
        if (item[k] !== args.where[k]) return false;
      }
      return true;
    });
    return found || null;
  }

  async create(args: { data: any }) {
    const db = readJsonDb();
    const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const newRecord = {
      id,
      createdAt: new Date().toISOString(),
      ...args.data
    };
    db[this.key].push(newRecord);
    writeJsonDb(db);
    return newRecord;
  }

  async update(args: { where: any; data: any }) {
    const db = readJsonDb();
    const list = db[this.key] || [];
    const index = list.findIndex((item: any) => {
      for (const k in args.where) {
        if (item[k] !== args.where[k]) return false;
      }
      return true;
    });

    if (index === -1) throw new Error(`Record not found in mock ${String(this.key)}`);
    
    // Simulate Prisma update operations
    const original = list[index];
    const updateData = { ...args.data };
    
    for (const k in updateData) {
      const val = updateData[k];
      if (val && typeof val === 'object' && 'increment' in val) {
        original[k] = (original[k] || 0) + val.increment;
      } else {
        original[k] = val;
      }
    }
    
    list[index] = original;
    db[this.key] = list;
    writeJsonDb(db);
    return original;
  }

  async delete(args: { where: any }) {
    const db = readJsonDb();
    const list = db[this.key] || [];
    const index = list.findIndex((item: any) => {
      for (const k in args.where) {
        if (item[k] !== args.where[k]) return false;
      }
      return true;
    });

    if (index === -1) throw new Error(`Record not found for delete in mock ${String(this.key)}`);
    const deleted = list.splice(index, 1)[0];
    db[this.key] = list;
    writeJsonDb(db);
    return deleted;
  }

  async count(args?: { where?: any }) {
    const list = await this.findMany(args);
    return list.length;
  }
}

// Full Mock Client wrapper reflecting PrismaClient interface
class MockPrismaClient {
  user = new MockPrismaModel('users');
  wish = new MockPrismaModel('wishes');
  blessing = new MockPrismaModel('blessings');
  dua = new MockPrismaModel('duas');
  reaction = new MockPrismaModel('reactions');
  globalMessage = new MockPrismaModel('globalMessages');
  qurbaniStory = new MockPrismaModel('qurbaniStories');
  analytics = new MockPrismaModel('analytics');

  $connect() {
    // Already loaded file database, resolving immediately
    return Promise.resolve();
  }

  $disconnect() {
    return Promise.resolve();
  }
}

// Global declaration to handle Next.js hot-reloading in dev servers
declare global {
  var prisma: PrismaClient | MockPrismaClient | undefined;
}

let prisma: PrismaClient | MockPrismaClient;

// Determine if we should fall back to JSON Local database based on active environment connection
const hasRealDatabase = !!process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('mongodb');

if (process.env.NODE_ENV === 'production') {
  if (hasRealDatabase) {
    prisma = new PrismaClient();
  } else {
    console.warn('⚠️ WARNING: DATABASE_URL not configured. Operating in high-performance local JSON Fallback database mode.');
    prisma = new MockPrismaClient();
  }
} else {
  if (!global.prisma) {
    if (hasRealDatabase) {
      global.prisma = new PrismaClient();
    } else {
      console.warn('⚠️ WARNING: DATABASE_URL not configured. Operating in high-performance local JSON Fallback database mode.');
      global.prisma = new MockPrismaClient();
    }
  }
  prisma = global.prisma;
}

export default prisma;
