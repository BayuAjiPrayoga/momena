import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL || '';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Event Categories ───
  const wedding = await prisma.eventCategory.upsert({
    where: { slug: 'wedding' },
    update: {},
    create: { name: 'Wedding', slug: 'wedding', icon: '💍' },
  });

  const khitanan = await prisma.eventCategory.upsert({
    where: { slug: 'khitanan' },
    update: {},
    create: { name: 'Khitanan', slug: 'khitanan', icon: '🎉' },
  });

  console.log('✅ Event categories created');

  // ─── Themes ───
  await prisma.theme.upsert({
    where: { slug: 'lux-art-1' },
    update: {},
    create: {
      name: 'Lux Art 1',
      slug: 'lux-art-1',
      categoryId: wedding.id,
      styleGroup: 'Lux Art',
      componentKey: 'lux-art-1',
      thumbnailUrl: '/images/themes/lux-art-1-thumb.jpg',
      basePrice: 150000,
      isActive: true,
      isBestSeller: true,
    },
  });

  await prisma.theme.upsert({
    where: { slug: 'rustik-1' },
    update: {},
    create: {
      name: 'Rustik 1',
      slug: 'rustik-1',
      categoryId: wedding.id,
      styleGroup: 'Rustik',
      componentKey: 'rustik-1',
      thumbnailUrl: '/images/themes/rustik-1-thumb.jpg',
      basePrice: 150000,
      isActive: true,
      isBestSeller: false,
    },
  });

  console.log('✅ Themes created');

  // ─── Admin ───
  const { hash } = await import('bcryptjs');
  const adminPassword = await hash('momenalabs2026', 10);
  
  await prisma.admin.upsert({
    where: { email: 'admin@momena.id' },
    update: {
      password: adminPassword,
    },
    create: {
      name: 'Super Admin',
      email: 'admin@momena.id',
      password: adminPassword,
      role: 'SUPER_ADMIN',
    }
  });
  await prisma.package.upsert({
    where: { id: 'pkg-starter' },
    update: {},
    create: {
      id: 'pkg-starter',
      name: 'Starter',
      price: 99000,
      maxGuests: 100,
      maxPhotos: 5,
      maxRevisions: 1,
      activeDays: 365,
      features: {
        rsvp: true, guestbook: true, music: true,
        gift: false, maps: true, calendar: true,
        countdown: true, gallery: true, loveStory: false,
      },
    },
  });

  await prisma.package.upsert({
    where: { id: 'pkg-populer' },
    update: {},
    create: {
      id: 'pkg-populer',
      name: 'Populer',
      price: 199000,
      maxGuests: 500,
      maxPhotos: 15,
      maxRevisions: 3,
      activeDays: 365,
      features: {
        rsvp: true, guestbook: true, music: true,
        gift: true, maps: true, calendar: true,
        countdown: true, gallery: true, loveStory: true,
      },
    },
  });

  await prisma.package.upsert({
    where: { id: 'pkg-premium' },
    update: {},
    create: {
      id: 'pkg-premium',
      name: 'Premium',
      price: 399000,
      maxGuests: 2000,
      maxPhotos: 30,
      maxRevisions: 10,
      activeDays: 365,
      features: {
        rsvp: true, guestbook: true, music: true,
        gift: true, maps: true, calendar: true,
        countdown: true, gallery: true, loveStory: true,
      },
    },
  });

  console.log('✅ Packages created');
  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
