/**
 * Design Tokens — Momena Labs
 * Semua warna, font, spacing, dan animasi terpusat di sini.
 * Tema individu boleh override via CSS variables, tapi harus merujuk token ini sebagai basis.
 */

export const designTokens = {
  colors: {
    // Wedding — Elegant Gold & Cream
    wedding: {
      gold: {
        50: '#FFF9E6',
        100: '#FFF0BF',
        200: '#FFE699',
        300: '#FFD966',
        400: '#FFCC33',
        500: '#D4A843',    // Primary gold
        600: '#B8922E',
        700: '#8C6D1F',
        800: '#604A15',
        900: '#3D2F0D',
      },
      cream: {
        50: '#FFFDF7',
        100: '#FFF8E8',
        200: '#FFF3D6',
        300: '#FFEEC4',
        400: '#FFE8B0',
        500: '#F5E6CC',    // Primary cream
      },
      rose: {
        50: '#FFF5F5',
        100: '#FFE3E3',
        200: '#FECDD3',
        300: '#FDA4AF',
        400: '#E8A0A0',
        500: '#D4756A',    // Accent rose
      },
    },

    // Rustik — Earth Tones & Botanical
    rustik: {
      sage: {
        50: '#F2F7F2',
        100: '#E0ECE0',
        200: '#C1D9C1',
        300: '#9FBF9F',
        400: '#7DA67D',
        500: '#6B8F6B',    // Primary sage
        600: '#577357',
        700: '#445844',
        800: '#2D3C2D',
        900: '#1A231A',
      },
      brown: {
        50: '#FAF5F0',
        100: '#F0E6D8',
        200: '#E0CEB3',
        300: '#CFB48E',
        400: '#B89B6E',
        500: '#8B7355',    // Primary brown
        600: '#6D5A42',
        700: '#504130',
        800: '#352B20',
        900: '#1C1610',
      },
      terracotta: {
        50: '#FDF2EE',
        100: '#F9DED3',
        200: '#F0BEA8',
        300: '#E49E7E',
        400: '#D4836A',
        500: '#C2694D',    // Accent terracotta
      },
    },

    // Neutral — shared across themes
    neutral: {
      white: '#FFFFFF',
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#E5E5E5',
      300: '#D4D4D4',
      400: '#A3A3A3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      black: '#0A0A0A',
    },
  },

  fonts: {
    display: "'Playfair Display', serif",        // Heading undangan
    body: "'Plus Jakarta Sans', sans-serif",      // Body text (lebih modern dari Inter, cocok untuk Indonesia)
    script: "'Great Vibes', cursive",             // Nama mempelai (kaligrafi)
    arabic: "'Amiri', serif",                     // Ayat/doa islami
    mono: "'JetBrains Mono', monospace",          // Nomor rekening (monospace agar mudah dibaca)
  },

  spacing: {
    section: '5rem',      // Jarak antar section
    sectionMobile: '3rem',
    container: '1.5rem',  // Padding container
    element: '1rem',
  },

  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },

  animation: {
    durations: {
      fast: '150ms',
      normal: '300ms',
      slow: '600ms',
      verySlow: '1000ms',
    },
    easings: {
      easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
      easeInOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
      spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
  },

  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
  },
} as const;

export type ThemeColorPalette = 'wedding' | 'rustik';
