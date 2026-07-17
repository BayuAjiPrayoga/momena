/**
 * InvitationData — kontrak wajib yang semua komponen tema harus terima sebagai props.
 * Struktur ini harus stabil; perubahan di sini berdampak ke SEMUA tema.
 * Lihat: docs/02_ARSITEKTUR_DEVOPS.md §4
 */

export interface PersonInfo {
  name: string;
  fullName: string;
  parents: string;
  photo?: string;
  description?: string;
}

export interface EventDetail {
  name: string;       // "Akad Nikah", "Resepsi", "Aqiqah", dll
  date: string;       // ISO date string
  time: string;       // "08:00 - 10:00"
  venue: string;      // Nama gedung/tempat
  address: string;    // Alamat lengkap
  mapsUrl: string;    // Google Maps link
}

export interface GalleryItem {
  url: string;
  caption?: string;
}

export interface LoveStoryItem {
  date: string;
  title: string;
  description: string;
  photo?: string;
}

export interface BankAccount {
  bank: string;       // "BCA", "BNI", "Mandiri"
  number: string;
  name: string;       // Nama pemilik rekening
}

export interface GiftInfo {
  bankAccounts: BankAccount[];
  qrisUrl?: string;
  ewalletUrl?: string;
}

export interface GuestInfo {
  name: string;
  slug: string;
}

export interface GuestbookMessage {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

export interface FeatureFlags {
  rsvp: boolean;
  guestbook: boolean;
  music: boolean;
  gift: boolean;
  maps: boolean;
  calendar: boolean;
  countdown: boolean;
  gallery: boolean;
  loveStory: boolean;
}

export interface InvitationData {
  // Event info
  eventCategory: string;     // "wedding", "khitanan", "aqiqah", "ulang_tahun"
  eventTitle: string;         // "Pernikahan Ahmad & Fatimah"

  // Couple/Host info
  couple: {
    person1: PersonInfo;
    person2: PersonInfo;
  };

  // Event details (bisa multi: Akad + Resepsi, dll)
  events: EventDetail[];

  // Guest personalization
  guest: GuestInfo;

  // Media
  gallery: GalleryItem[];
  coverPhoto: string;
  musicUrl?: string;

  // Story/narrative
  loveStory?: LoveStoryItem[];

  // Gift/Amplop digital
  giftInfo?: GiftInfo;

  // Feature flags (dari Package yang dipilih klien)
  features: FeatureFlags;

  // RSVP/Guestbook endpoints & data
  rsvpEndpoint: string;
  guestbookEndpoint: string;
  guestbookMessages: GuestbookMessage[];

  // Order metadata
  orderSlug: string;
}

/**
 * Props yang diterima oleh setiap komponen tema
 */
export interface ThemeProps {
  data: InvitationData;
}
