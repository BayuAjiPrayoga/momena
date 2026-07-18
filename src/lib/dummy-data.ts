import type { InvitationData } from '@/lib/types';

/**
 * Data dummy untuk preview tema.
 * Dipakai di route /themes-preview/[themeKey]
 */
export function getDummyInvitationData(guestName?: string): InvitationData {
  return {
    eventCategory: 'wedding',
    eventTitle: 'Pernikahan Ahmad & Fatimah',

    couple: {
      person1: {
        name: 'Ahmad',
        fullName: 'Ahmad Rizky Pratama, S.Kom',
        parents: 'Putra dari Bpk. Hendra Pratama & Ibu Sri Wahyuni',
        description: 'Anak kedua dari tiga bersaudara',
        photo: '/images/themes/sunda/cowo.png',
      },
      person2: {
        name: 'Fatimah',
        fullName: 'Fatimah Azzahra, S.Pd',
        parents: 'Putri dari Bpk. Muhammad Yusuf & Ibu Aisyah Rahmawati',
        description: 'Anak pertama dari dua bersaudara',
        photo: '/images/themes/sunda/cewe.png',
      },
    },

    events: [
      {
        name: 'Akad Nikah',
        date: '2025-03-15T08:00:00.000Z',
        time: '08:00 - 10:00 WIB',
        venue: 'Masjid Agung Al-Azhar',
        address: 'Jl. Sisingamangaraja, Kebayoran Baru, Jakarta Selatan 12110',
        mapsUrl: 'https://maps.google.com/?q=-6.2445,106.8014',
      },
      {
        name: 'Resepsi',
        date: '2025-03-15T11:00:00.000Z',
        time: '11:00 - 14:00 WIB',
        venue: 'Balai Kartini',
        address: 'Jl. Gatot Subroto Kav. 37, Jakarta Selatan 12950',
        mapsUrl: 'https://maps.google.com/?q=-6.2272,106.8333',
      },
    ],

    guest: {
      name: guestName || 'Nama Tamu',
      slug: 'nama-tamu',
    },

    gallery: [
      { url: '/images/themes/sunda/1.png', caption: 'Pre-wedding' },
      { url: '/images/themes/sunda/2.png', caption: 'Momen bahagia' },
      { url: '/images/themes/sunda/3.png', caption: 'Bersama' },
      { url: '/images/themes/sunda/4.png', caption: 'Senyum' },
      { url: '/images/themes/sunda/1.png', caption: 'Pre-wedding' },
      { url: '/images/themes/sunda/2.png', caption: 'Momen bahagia' },
    ],

    coverPhoto: '/images/themes/sunda/foto-utama.jpg',
    musicUrl: '/audio/sunda-music.mp3',

    loveStory: [
      {
        date: '2019-08-15',
        title: 'Pertama Bertemu',
        description: 'Kami pertama kali bertemu di acara seminar kampus. Senyummu yang pertama kali menyapa, dan sejak saat itu, hatiku tak pernah sama.',
      },
      {
        date: '2020-02-14',
        title: 'Mulai Berkenalan',
        description: 'Setelah beberapa kali bertemu di berbagai kesempatan, akhirnya kami mulai saling bertukar pesan dan mengenal satu sama lain lebih dalam.',
      },
      {
        date: '2021-06-20',
        title: 'Menjalin Hubungan',
        description: 'Dengan restu kedua orang tua, kami resmi menjalin hubungan. Perjalanan yang penuh suka duka, tapi selalu dipenuhi cinta.',
      },
      {
        date: '2024-12-25',
        title: 'Lamaran',
        description: 'Di malam Natal yang penuh keajaiban, Ahmad memberanikan diri untuk melamar Fatimah. Dan jawaban "Ya" itu mengubah segalanya.',
      },
    ],

    giftInfo: {
      bankAccounts: [
        { bank: 'BCA', number: '1234567890', name: 'Ahmad Rizky Pratama' },
        { bank: 'BNI', number: '0987654321', name: 'Fatimah Azzahra' },
      ],
      qrisUrl: '/images/placeholder/qris.png',
      shippingAddress: 'Jalan Kembangan No 4 Jakarta'
    },

    features: {
      rsvp: true,
      guestbook: true,
      music: true,
      gift: true,
      maps: true,
      calendar: true,
      countdown: true,
      gallery: true,
      loveStory: true,
      streaming: true,
    },

    rsvpEndpoint: '/api/orders/demo/rsvp',
    guestbookEndpoint: '/api/orders/demo/guestbook',
    streamingUrl: 'https://youtube.com/live/your_live_streaming',
    guestbookMessages: [
      {
        id: '1',
        name: 'Budi Santoso',
        message: 'Barakallahu lakuma wa baraka alaikuma. Semoga menjadi keluarga sakinah, mawaddah, warahmah. Aamiin! 🤲',
        createdAt: '2025-03-10T08:00:00.000Z',
      },
      {
        id: '2',
        name: 'Siti Nurhaliza',
        message: 'Selamat menempuh hidup baru! Semoga selalu diberi kebahagiaan dan kelancaran. Happy wedding! 🎉💕',
        createdAt: '2025-03-11T10:30:00.000Z',
      },
      {
        id: '3',
        name: 'Rudi Hartono',
        message: 'Selamat ya Ahmad & Fatimah! Semoga pernikahannya lancar dan diberkahi. See you di hari H! 🥳',
        createdAt: '2025-03-12T14:00:00.000Z',
      },
      {
        id: '4',
        name: 'Dewi Lestari',
        message: 'MasyaAllah, akhirnya! Bahagia banget lihat kalian berdua. Semoga jadi pasangan yang saling melengkapi 💐',
        createdAt: '2025-03-13T09:15:00.000Z',
      },
      {
        id: '5',
        name: 'Andi Prasetyo',
        message: 'Congratulations! Wishing you both a lifetime of love and happiness. Semoga langgeng ya! 🎊',
        createdAt: '2025-03-14T16:45:00.000Z',
      },
    ],

    orderSlug: 'ahmad-fatimah',
  };
}
