import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kullanım Şartları',
  description: 'PratikCV kullanım şartları ve hizmet koşulları. Platform kullanımı, kullanıcı hakları ve sorumlulukları hakkında detaylı bilgiler.',
  keywords: [
    'kullanım şartları',
    'hizmet koşulları',
    'pratikcv şartlar',
    'platform kuralları',
    'kullanıcı sözleşmesi',
    'terms of service'
  ],
  openGraph: {
    title: 'Kullanım Şartları - PratikCV',
    description: 'Platform kullanımı, kullanıcı hakları ve sorumlulukları hakkında detaylı bilgiler.',
    url: 'https://pratikcv.com/terms',
    images: [
      {
        url: '/og-terms.jpg',
        width: 1200,
        height: 630,
        alt: 'Kullanım Şartları - PratikCV',
      },
    ],
  },
  twitter: {
    title: 'Kullanım Şartları - PratikCV',
    description: 'Platform kullanım koşulları ve kullanıcı hakları.',
  },
  alternates: {
    canonical: 'https://pratikcv.com/terms',
  },
  robots: {
    index: true,
    follow: false, // Terms sayfası için follow'a gerek yok
  },
};
