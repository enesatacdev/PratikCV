import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gizlilik Politikası',
  description: 'PratikCV kullanıcı gizlilik politikası. Kişisel verilerinizin nasıl toplandığı, kullanıldığı ve korunduğu hakkında detaylı bilgiler.',
  keywords: [
    'gizlilik politikası',
    'kişisel veri',
    'kvkk',
    'veri koruma',
    'pratikcv gizlilik',
    'kullanıcı verileri'
  ],
  openGraph: {
    title: 'Gizlilik Politikası - PratikCV',
    description: 'Kişisel verilerinizin nasıl toplandığı, kullanıldığı ve korunduğu hakkında detaylı bilgiler.',
    url: 'https://pratikcv.com/privacy',
    images: [
      {
        url: '/og-privacy.jpg',
        width: 1200,
        height: 630,
        alt: 'Gizlilik Politikası - PratikCV',
      },
    ],
  },
  twitter: {
    title: 'Gizlilik Politikası - PratikCV',
    description: 'Kişisel verilerinizin korunması hakkında detaylı bilgiler.',
  },
  alternates: {
    canonical: 'https://pratikcv.com/privacy',
  },
  robots: {
    index: true,
    follow: false, // Gizlilik sayfası için follow'a gerek yok
  },
};
