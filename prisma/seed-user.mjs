import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('👤 Seeding Test User Profile to MongoDB Atlas...');

  // Upsert the test user profile
  const user = await prisma.user.upsert({
    where: { slug: 'admin-chief' },
    update: {
      name: 'Admin Chief',
      email: 'admin@eidverse.com',
      favoriteTheme: 'gold',
      greetingCount: 12
    },
    create: {
      name: 'Admin Chief',
      slug: 'admin-chief',
      email: 'admin@eidverse.com',
      favoriteTheme: 'gold',
      greetingCount: 12
    }
  });

  console.log('🎉 User successfully registered in MongoDB:', user);
}

main()
  .catch((e) => {
    console.error('❌ User Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
