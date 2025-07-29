import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/header/navbar_fixed";
import Footer from "@/components/footer/footer";
import { Figtree } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "react-hot-toast";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree", // isteğe bağlı
});

export const metadata: Metadata = {
  metadataBase: new URL('https://pratikcv.com'),
  title: {
    template: '%s | PratikCV - Ücretsiz CV Oluşturucu',
    default: 'PratikCV - Ücretsiz CV Oluşturucu ve İş Başvuru Aracı'
  },
  description: 'PratikCV ile profesyonel CV\'nizi ücretsiz oluşturun. AI destekli CV analizi, 50+ modern şablon, anında PDF indirme. Türkiye\'nin en kolay CV oluşturma platformu.',
  keywords: [
    'cv oluşturucu',
    'özgeçmiş hazırlama',
    'ücretsiz cv',
    'iş başvurusu',
    'cv şablonu',
    'ai cv analizi',
    'profesyonel cv',
    'cv yazma',
    'türkçe cv',
    'online cv',
    'cv maker',
    'resume builder'
  ],
  authors: [{ name: 'PratikCV Team' }],
  creator: 'PratikCV',
  publisher: 'PratikCV',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://pratikcv.com',
    siteName: 'PratikCV',
    title: 'PratikCV - Ücretsiz CV Oluşturucu ve İş Başvuru Aracı',
    description: 'Profesyonel CV\'nizi dakikalar içinde oluşturun. AI destekli analiz, modern şablonlar ve ücretsiz PDF indirme.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PratikCV - Profesyonel CV Oluşturucu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PratikCV - Ücretsiz CV Oluşturucu',
    description: 'Profesyonel CV\'nizi dakikalar içinde oluşturun. AI destekli analiz ve modern şablonlar.',
    images: ['/og-image.jpg'],
    creator: '@pratikcv',
  },
  verification: {
    google: 'your-google-site-verification',
  },
  alternates: {
    canonical: 'https://pratikcv.com',
  },
  category: 'business',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
    <html lang="tr">
      <body
        className={`${figtree.className}`}>
        <Navbar />
        {children}
        <Footer/>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
    </AuthProvider>
  );
}
