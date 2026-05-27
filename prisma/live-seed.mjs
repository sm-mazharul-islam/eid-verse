import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Live MongoDB Database Seeding...');

  // 1. Clear any existing seed records to ensure clean slate (Optional, but let's just append or populate safely)
  console.log('🧹 Purging old data fields to guarantee a high-fidelity fresh deck...');
  await prisma.blessing.deleteMany({});
  await prisma.dua.deleteMany({});
  await prisma.globalMessage.deleteMany({});
  await prisma.qurbaniStory.deleteMany({});
  await prisma.wish.deleteMany({});
  await prisma.analytics.deleteMany({});

  // 2. Populate High-Fidelity Blessings Pool
  console.log('✨ Seeding authentic seasonal Blessings...');
  const blessings = [
    {
      text: 'May the beautiful sacrifice of Ibrahim (AS) inspire your heart with complete devotion, patience, and love. May Allah accept your Qurbani.',
      category: 'qurbani',
      language: 'en',
      eidType: 'eid-al-adha',
      isActive: true,
      usedCount: 142
    },
    {
      text: 'May your home be blessed with the warm laughter of family gathered together around a beautiful Eid feast. Eid Mubarak!',
      category: 'family',
      language: 'en',
      eidType: 'general',
      isActive: true,
      usedCount: 98
    },
    {
      text: 'May your heart find peace, your soul find strength, and your life be showered with everlasting barakah and mercy.',
      category: 'peace',
      language: 'en',
      eidType: 'general',
      isActive: true,
      usedCount: 110
    },
    {
      text: 'After a beautiful month of fasting and devotion, may this Eid al-Fitr wrap your heart in sweet, heavenly joy and laughter.',
      category: 'general',
      language: 'en',
      eidType: 'eid-al-fitr',
      isActive: true,
      usedCount: 125
    },
    {
      text: 'May the light of the mosque minarets shine softly in your heart tonight, answering every silent prayer and tear.',
      category: 'peace',
      language: 'en',
      eidType: 'general',
      isActive: true,
      usedCount: 65
    }
  ];

  for (const b of blessings) {
    await prisma.blessing.create({ data: b });
  }

  // 3. Populate Deep Duas & Invocations
  console.log('🕌 Seeding authentic Islamic Duas & calligraphies...');
  const duas = [
    {
      text: 'O Allah, accept our Qurbani, our prayers, and our devotion. You are indeed the All-Hearing, the All-Knowing.',
      arabic: 'اللَّهُمَّ تَقَبَّلْ مِنَّا إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ',
      meaning: 'O Allah, accept from us, indeed You are the All-Hearing, the All-Knowing.',
      category: 'sacrifice',
      duaType: 'after-sacrifice',
      eidType: 'eid-al-adha',
      isActive: true,
      usedCount: 88
    },
    {
      text: 'In the name of Allah, Allah is the Greatest! O Allah, this is from You and for You.',
      arabic: 'بِسْمِ اللَّهِ وَاللَّهُ أَكْبَرُ اللَّهُمَّ هَذَا مِنْكَ وَلَكَ',
      meaning: 'In the name of Allah, Allah is the Greatest! O Allah, this is from You and for You.',
      category: 'sacrifice',
      duaType: 'before-sacrifice',
      eidType: 'eid-al-adha',
      isActive: true,
      usedCount: 165
    },
    {
      text: 'May Allah accept it from us and from you.',
      arabic: 'تَقَبَّلَ اللَّهُ مِنَّا وَمِنْكُمْ',
      meaning: 'May Allah accept from us and from you.',
      category: 'gratitude',
      duaType: 'general',
      eidType: 'general',
      isActive: true,
      usedCount: 285
    },
    {
      text: 'O Allah, grant my family good health, everlasting peace, and protect them from all harm. You are the Best Protector.',
      arabic: 'اللَّهُمَّ احْفَظْ أَهْلِي وَبَارِكْ لَهُمْ فِيهَا',
      meaning: 'O Allah, protect my family and bless them in all things.',
      category: 'family',
      duaType: 'general',
      eidType: 'general',
      isActive: true,
      usedCount: 104
    }
  ];

  for (const d of duas) {
    await prisma.dua.create({ data: d });
  }

  // 4. Populate Community Board (Global Wall)
  console.log('🌐 Seeding global board messages with country flags...');
  const globalMessages = [
    {
      name: 'Tanvir Hossain',
      country: 'Bangladesh',
      flag: '🇧🇩',
      message: 'Eid Mubarak everyone! Wishing health, wealth, and countless blessings to all livestock farmers in the haat this Eid! 🐄🍖',
      isApproved: true,
      eidType: 'eid-al-adha'
    },
    {
      name: 'Aisha Al-Mansoor',
      country: 'Saudi Arabia',
      flag: '🇸🇦',
      message: 'A truly blessed Eid al-Adha. The atmosphere in Makkah is incredible! Taqabbalallahu minna wa minkum to the global Ummah! 🕋✨',
      isApproved: true,
      eidType: 'eid-al-adha'
    },
    {
      name: 'Zahra Patel',
      country: 'United Kingdom',
      flag: '🇬🇧',
      message: 'Taqabbalallahu minna wa minkum from London! Miss my extended family back in Chittagong so much! Sending sweet sheer khurma thoughts! ❤️',
      isApproved: true,
      eidType: 'general'
    },
    {
      name: 'Mohammad Firdaus',
      country: 'Malaysia',
      flag: '🇲🇾',
      message: 'Selamat Hari Raya Haji to all brothers and sisters! Sending love, prayers, and delicious beef rendang greetings from Kuala Lumpur! 🤝🍃',
      isApproved: true,
      eidType: 'eid-al-adha'
    }
  ];

  for (const gm of globalMessages) {
    await prisma.globalMessage.create({ data: gm });
  }

  // 5. Populate Qurbani Story (Memory Wall Grid)
  console.log('📸 Seeding gorgeous memory wall narratives...');
  const stories = [
    {
      animalName: 'Kalo (The Giant Black Cow)',
      memoryText: 'We purchased Kalo 4 days before Eid morning. The children spent the whole week feeding him fresh grass and apples. Saying goodbye on Eid morning was tough, but sharing the beef with 30 local low-income families made it truly sacred. We felt the pure spirit of sacrifice.',
      photoUrl: '',
      cloudinaryId: '',
      submitterName: 'Rashedul Hasan',
      city: 'Dhaka',
      country: 'BD',
      year: 2026,
      isApproved: true
    },
    {
      animalName: 'Laltu (The Mischievous Red Goat)',
      memoryText: 'Laltu was extremely hyperactive! He escaped the main gates twice on the eve of Eid and had the entire neighborhood chasing him down. Eid morning goat curry and gorom gorom ruti was absolutely legendary! A memory we will laugh about for years!',
      photoUrl: '',
      cloudinaryId: '',
      submitterName: 'Jannat Ara',
      city: 'Chittagong',
      country: 'BD',
      year: 2026,
      isApproved: true
    },
    {
      animalName: 'Mantu (The White Brahman Bull)',
      memoryText: 'We bought Mantu after a long search in the Gabtoli Haat. He had a beautiful, calm temperament and would eat right from our hands. The Qurbani was done in complete peace, and the neighbors collectively cooked three giant pots of beef mezban to share!',
      photoUrl: '',
      cloudinaryId: '',
      submitterName: 'Imran Chowdhury',
      city: 'Sylhet',
      country: 'BD',
      year: 2026,
      isApproved: true
    }
  ];

  for (const s of stories) {
    await prisma.qurbaniStory.create({ data: s });
  }

  // 6. Populate Published Cards & Dynamic Wishes
  console.log('💳 Seeding beautiful pre-published 3D greeting cards...');
  const cards = [
    {
      senderName: 'Tasnim Karim',
      receiverName: 'Uncle & Aunt',
      message: 'May Allah accept your silent prayers, your sacrifice, and fill your sweet home with endless comfort this Eid morning. Eid Mubarak!',
      theme: 'gold',
      slug: 'card-gold-3z8y',
      viewCount: 42,
      isPublic: true,
      country: 'BD',
      eidType: 'eid-al-adha'
    },
    {
      senderName: 'Samiul Islam',
      receiverName: 'My Sibling Fahad',
      message: 'Hey bro, glad to share another Eid with you! May Allah accept our family Qurbani and stop you from eating all the beef! 🐄🍖',
      theme: 'lantern',
      slug: 'card-lantern-7x1r',
      viewCount: 28,
      isPublic: true,
      country: 'BD',
      eidType: 'eid-al-adha'
    },
    {
      senderName: 'Nadia Chowdhury',
      receiverName: 'Dear Mother',
      message: 'Beloved mother, your love is the guiding lantern of our home. May Allah fill your life with eternal warmth and good health this Eid. Respectfully, Nadia.',
      theme: 'moon',
      slug: 'card-moon-9w2t',
      viewCount: 64,
      isPublic: true,
      country: 'GB',
      eidType: 'eid-al-fitr'
    }
  ];

  for (const c of cards) {
    await prisma.wish.create({ data: c });
  }

  // 7. Populate Statistics (Analytics Events)
  console.log('📊 Seeding vertical CSS stats charts events...');
  const events = [
    { event: 'page_view', country: 'BD', theme: 'gold', eidType: 'eid-al-adha', sessionId: 'sess-01' },
    { event: 'page_view', country: 'BD', theme: 'gold', eidType: 'eid-al-adha', sessionId: 'sess-02' },
    { event: 'page_view', country: 'GB', theme: 'moon', eidType: 'eid-al-fitr', sessionId: 'sess-03' },
    { event: 'page_view', country: 'SA', theme: 'mosque', eidType: 'eid-al-adha', sessionId: 'sess-04' },
    { event: 'page_view', country: 'MY', theme: 'lantern', eidType: 'eid-al-adha', sessionId: 'sess-05' },
    { event: 'wish_created', country: 'BD', theme: 'gold', eidType: 'eid-al-adha', sessionId: 'sess-01' },
    { event: 'wish_created', country: 'BD', theme: 'gold', eidType: 'eid-al-adha', sessionId: 'sess-02' },
    { event: 'wish_created', country: 'GB', theme: 'moon', eidType: 'eid-al-fitr', sessionId: 'sess-03' },
    { event: 'card_downloaded', country: 'BD', theme: 'gold', eidType: 'eid-al-adha', sessionId: 'sess-01' },
    { event: 'card_downloaded', country: 'GB', theme: 'lantern', eidType: 'eid-al-fitr', sessionId: 'sess-06' },
    { event: 'secret_moon_explorer', country: 'BD', theme: 'gold', eidType: 'eid-al-adha', sessionId: 'sess-02' }
  ];

  // Let's multiply analytics list to get good chart spreads
  for (let i = 0; i < 3; i++) {
    for (const e of events) {
      await prisma.analytics.create({
        data: {
          ...e,
          country: i === 1 ? 'GB' : i === 2 ? 'SA' : e.country,
          theme: i === 1 ? 'lantern' : i === 2 ? 'mosque' : e.theme
        }
      });
    }
  }

  console.log('🎉 Live Database Seeding Successfully Completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
