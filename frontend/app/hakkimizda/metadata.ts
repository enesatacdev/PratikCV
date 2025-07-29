import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hakkımızda',
  description: 'PratikCV ekibi olarak, iş arayanların en iyi CV\'yi oluşturmalarına yardımcı olmak için modern teknolojiler ve AI destekli çözümler geliştiriyoruz.',
  keywords: [
    'pratikcv hakkında',
    'cv oluşturucu ekip',
    'pratikcv ekibi',
    'cv platformu',
    'teknoloji ekibi',
    'türkiye cv',
    'startup'
  ],
  openGraph: {
    title: 'Hakkımızda - PratikCV',
    description: 'İş arayanların en iyi CV\'yi oluşturmalarına yardımcı olmak için modern teknolojiler geliştiren ekibimizi tanıyın.',
    url: 'https://pratikcv.com/hakkimizda',
    images: [
      {
        url: '/og-about.jpg',
        width: 1200,
        height: 630,
        alt: 'Hakkımızda - PratikCV',
      },
    ],
  },
  twitter: {
    title: 'Hakkımızda - PratikCV',
    description: 'İş arayanların en iyi CV\'yi oluşturmalarına yardımcı olmak için modern teknolojiler geliştiren ekibimiz.',
  },
  alternates: {
    canonical: 'https://pratikcv.com/hakkimizda',
  },
};
