import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'İstatistikler',
  description: 'PratikCV platform istatistikleri. Oluşturulan CV sayısı, kullanıcı sayısı ve platform kullanım verileri.',
  keywords: [
    'pratikcv istatistikler',
    'cv istatistikleri',
    'platform verileri',
    'kullanıcı sayısı',
    'cv sayısı',
    'başarı oranları'
  ],
  openGraph: {
    title: 'Platform İstatistikleri - PratikCV',
    description: 'Oluşturulan CV sayısı, kullanıcı sayısı ve platform kullanım verileri.',
    url: 'https://pratikcv.com/istatistikler',
    images: [
      {
        url: '/og-stats.jpg',
        width: 1200,
        height: 630,
        alt: 'İstatistikler - PratikCV',
      },
    ],
  },
  twitter: {
    title: 'Platform İstatistikleri - PratikCV',
    description: 'PlatformCV kullanım verileri ve başarı istatistikleri.',
  },
  alternates: {
    canonical: 'https://pratikcv.com/istatistikler',
  },
};
