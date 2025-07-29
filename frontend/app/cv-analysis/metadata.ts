import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CV Analizi',
  description: 'AI destekli CV analizi ile CV\'nizin güçlü ve zayıf yönlerini keşfedin. Detaylı raporlar, öneriler ve puanlama sistemi ile CV\'nizi iyileştirin.',
  keywords: [
    'cv analizi',
    'ai cv analizi',
    'cv değerlendirme',
    'cv puanlama',
    'cv raporu',
    'cv iyileştirme',
    'cv önerileri',
    'cv kontrolü'
  ],
  openGraph: {
    title: 'AI Destekli CV Analizi - PratikCV',
    description: 'CV\'nizin güçlü ve zayıf yönlerini keşfedin. Detaylı raporlar ve öneriler ile CV\'nizi iyileştirin.',
    url: 'https://pratikcv.com/cv-analysis',
    images: [
      {
        url: '/og-cv-analysis.jpg',
        width: 1200,
        height: 630,
        alt: 'CV Analizi - PratikCV',
      },
    ],
  },
  twitter: {
    title: 'AI Destekli CV Analizi - PratikCV',
    description: 'CV\'nizin güçlü ve zayıf yönlerini keşfedin.',
  },
  alternates: {
    canonical: 'https://pratikcv.com/cv-analysis',
  },
};
