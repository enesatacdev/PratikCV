import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Premium',
  description: 'PratikCV Premium ile gelişmiş özellikler, sınırsız CV oluşturma, özel şablonlar ve öncelikli destek avantajlarından yararlanın.',
  keywords: [
    'pratikcv premium',
    'premium cv',
    'ücretli cv oluşturucu',
    'gelişmiş cv özellikler',
    'özel cv şablonları',
    'sınırsız cv',
    'premium abonelik'
  ],
  openGraph: {
    title: 'Premium Üyelik - PratikCV',
    description: 'Gelişmiş özellikler, sınırsız CV oluşturma ve özel şablonlar ile kariyerinizi hızlandırın.',
    url: 'https://pratikcv.com/premium',
    images: [
      {
        url: '/og-premium.jpg',
        width: 1200,
        height: 630,
        alt: 'Premium Üyelik - PratikCV',
      },
    ],
  },
  twitter: {
    title: 'Premium Üyelik - PratikCV',
    description: 'Gelişmiş özellikler ve sınırsız CV oluşturma ile kariyerinizi hızlandırın.',
  },
  alternates: {
    canonical: 'https://pratikcv.com/premium',
  },
};
