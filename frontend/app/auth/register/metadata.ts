import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kayıt Ol',
  description: 'PratikCV\'ye ücretsiz kayıt olun. Dakikalar içinde profesyonel CV\'nizi oluşturun, AI analizi ile CV\'nizi geliştirin.',
  keywords: [
    'pratikcv kayıt',
    'ücretsiz cv kayıt',
    'cv hesabı oluştur',
    'özgeçmiş kayıt',
    'yeni hesap',
    'cv platformu kayıt'
  ],
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: 'Kayıt Ol - PratikCV',
    description: 'PratikCV\'ye ücretsiz kayıt olun ve profesyonel CV\'nizi oluşturmaya başlayın.',
    url: '/auth/register',
  },
  twitter: {
    title: 'Kayıt Ol - PratikCV',
    description: 'PratikCV\'ye ücretsiz kayıt olun ve profesyonel CV\'nizi oluşturmaya başlayın.',
  },
};
