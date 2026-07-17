import bcrypt from 'bcryptjs';
import { prisma } from '../src/lib/prisma';

async function main() {
  console.log("Seeding database...");

  // 1. Seed Admin
  const hashedAdminPassword = await bcrypt.hash('momenalabs2026', 10);
  await prisma.admin.upsert({
    where: { email: 'admin@momena.id' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@momena.id',
      password: hashedAdminPassword,
      role: 'SUPER_ADMIN'
    }
  });

  // 2. Seed Category
  const category = await prisma.eventCategory.upsert({
    where: { slug: 'wedding' },
    update: {},
    create: {
      name: 'Wedding',
      slug: 'wedding',
      icon: 'Heart'
    }
  });

  // 3. Seed Themes
  const themes = [
    {
      name: 'Lux Art 1',
      slug: 'lux-art-1',
      categoryId: category.id,
      styleGroup: 'Lux Art',
      componentKey: 'lux-art-1',
      thumbnailUrl: '/images/themes/lux-art-1-thumb.jpg',
      basePrice: 150000,
      isBestSeller: true,
      isActive: true
    },
    {
      name: 'Rustik 1',
      slug: 'rustik-1',
      categoryId: category.id,
      styleGroup: 'Rustik',
      componentKey: 'rustik-1',
      thumbnailUrl: '/images/themes/rustik-1-thumb.jpg',
      basePrice: 150000,
      isBestSeller: false,
      isActive: true
    },
    {
      name: 'Elegant Dark',
      slug: 'elegant-dark',
      categoryId: category.id,
      styleGroup: 'Elegant Dark',
      componentKey: 'elegant-dark',
      thumbnailUrl: '/images/themes/elegant-dark-thumb.jpg',
      basePrice: 250000,
      isBestSeller: true,
      isActive: true
    },
    {
      name: 'Adat Sunda',
      slug: 'sunda',
      categoryId: category.id,
      styleGroup: 'Tradisional',
      componentKey: 'sunda',
      thumbnailUrl: '/images/themes/sunda-thumb.png',
      basePrice: 200000,
      isBestSeller: true,
      isActive: true
    }
  ];

  for (const t of themes) {
    await prisma.theme.upsert({
      where: { slug: t.slug },
      update: {},
      create: t
    });
  }

  // 4. Seed Packages
  const packages = [
    {
      name: 'Starter',
      price: 99000,
      maxGuests: 100,
      maxPhotos: 5,
      maxRevisions: 1,
      features: JSON.stringify({
        desc: "Untuk yang butuh undangan simpel & elegan.",
        included: [
          "RSVP",
          "Buku Ucapan",
          "Musik Latar",
          "Peta Lokasi",
          "Kalender",
          "Countdown",
          "Galeri Foto"
        ],
        excluded: ["Amplop Digital", "Love Story"]
      })
    },
    {
      name: 'Populer',
      price: 199000,
      maxGuests: 500,
      maxPhotos: 15,
      maxRevisions: 3,
      features: JSON.stringify({
        desc: "Paling banyak dipilih — fitur lengkap.",
        included: [
          "RSVP",
          "Buku Ucapan",
          "Musik Latar",
          "Peta Lokasi",
          "Kalender",
          "Countdown",
          "Galeri Foto",
          "Amplop Digital",
          "Love Story"
        ],
        excluded: []
      })
    },
    {
      name: 'Premium',
      price: 399000,
      maxGuests: 2000,
      maxPhotos: 30,
      maxRevisions: 10,
      features: JSON.stringify({
        desc: "Pengalaman paling premium untuk hari spesial.",
        included: [
          "RSVP",
          "Buku Ucapan",
          "Musik Latar",
          "Peta Lokasi",
          "Kalender",
          "Countdown",
          "Galeri Foto",
          "Amplop Digital",
          "Love Story",
          "Prioritas Support"
        ],
        excluded: []
      })
    }
  ];

  for (const p of packages) {
    // Cannot easily upsert by name because name is not unique in schema, but for seed we can try findFirst
    const existing = await prisma.package.findFirst({ where: { name: p.name } });
    if (!existing) {
      await prisma.package.create({ data: p });
    }
  }

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
