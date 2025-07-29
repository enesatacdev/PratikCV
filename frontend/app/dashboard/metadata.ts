import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'CV\'lerinizi yönetin, düzenleyin ve indirin. Oluşturduğunuz tüm CV\'leri tek bir yerden kontrol edin. Yeni CV oluşturun veya mevcut CV\'lerinizi güncelleyin.',
  keywords: [
    'cv dashboard',
    'cv yönetimi',
    'cv düzenleme',
    'cv listesi',
    'cv indirme',
    'cv güncelleme',
    'cv kontrol paneli'
  ],
  openGraph: {
    title: 'Dashboard - PratikCV',
    description: 'CV\'lerinizi yönetin, düzenleyin ve indirin. Oluşturduğunuz tüm CV\'leri tek bir yerden kontrol edin.',
    url: 'https://pratikcv.com/dashboard',
    images: [
      {
        url: '/og-dashboard.jpg',
        width: 1200,
        height: 630,
        alt: 'Dashboard - PratikCV',
      },
    ],
  },
  twitter: {
    title: 'Dashboard - PratikCV',
    description: 'CV\'lerinizi yönetin, düzenleyin ve indirin.',
  },
  alternates: {
    canonical: 'https://pratikcv.com/dashboard',
  },
  robots: {
    index: false, // Dashboard sayfası arama motorlarında görünmemeli
    follow: true,
  },
};
