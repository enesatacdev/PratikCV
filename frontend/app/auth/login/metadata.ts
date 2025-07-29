import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Giriş Yap',
  description: 'PratikCV hesabınıza giriş yapın. CV\'lerinizi yönetin, yeni CV\'ler oluşturun ve AI analizi ile CV\'nizi geliştirin.',
  keywords: [
    'pratikcv giriş',
    'cv giriş',
    'özgeçmiş giriş',
    'hesap girişi',
    'cv yönetimi',
    'kullanıcı girişi'
  ],
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: 'Giriş Yap - PratikCV',
    description: 'PratikCV hesabınıza giriş yapın ve CV\'lerinizi yönetin.',
    url: '/auth/login',
  },
  twitter: {
    title: 'Giriş Yap - PratikCV',
    description: 'PratikCV hesabınıza giriş yapın ve CV\'lerinizi yönetin.',
  },
};
