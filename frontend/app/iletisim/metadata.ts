import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'İletişim',
  description: 'PratikCV ile ilgili sorularınız, önerileriniz veya destek talepleriniz için bizimle iletişime geçin. 7/24 müşteri desteği.',
  keywords: [
    'pratikcv iletişim',
    'müşteri desteği',
    'cv yardım',
    'teknik destek',
    'iletişim formu',
    'pratikcv destek'
  ],
  openGraph: {
    title: 'İletişim - PratikCV',
    description: 'Sorularınız ve önerileriniz için bizimle iletişime geçin. 7/24 müşteri desteği hizmetinizdeyiz.',
    url: 'https://pratikcv.com/iletisim',
    images: [
      {
        url: '/og-contact.jpg',
        width: 1200,
        height: 630,
        alt: 'İletişim - PratikCV',
      },
    ],
  },
  twitter: {
    title: 'İletişim - PratikCV',
    description: 'Sorularınız ve önerileriniz için bizimle iletişime geçin.',
  },
  alternates: {
    canonical: 'https://pratikcv.com/iletisim',
  },
};
