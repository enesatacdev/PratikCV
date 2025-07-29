import React from "react";
import type { Metadata } from "next";
import HeroSection from "@/components/hero/heroSection";
import FAQ from "@/components/faq/faq";
import About from "@/components/about/about";
import Contact from "@/components/contact/contact";
import StatsSection from "@/components/stats/statsSection";
import StructuredData from "@/components/StructuredData";

export const metadata: Metadata = {
  title: 'Ana Sayfa',
  description: 'PratikCV ile profesyonel CV\'nizi ücretsiz oluşturun. AI destekli CV analizi, 50+ modern şablon, anında PDF indirme. Türkiye\'nin en kolay CV oluşturma platformu.',
  keywords: [
    'cv oluşturucu türkiye',
    'ücretsiz cv yapma',
    'online özgeçmiş',
    'cv şablonları',
    'iş başvurusu',
    'cv hazırlama',
    'profesyonel cv',
    'ai cv analizi'
  ],
  openGraph: {
    title: 'PratikCV - Türkiye\'nin En Kolay CV Oluşturma Platformu',
    description: 'Dakikalar içinde profesyonel CV\'nizi oluşturun. AI analizi, modern şablonlar ve ücretsiz PDF indirme imkanı.',
    url: 'https://pratikcv.com',
    images: [
      {
        url: '/og-home.jpg',
        width: 1200,
        height: 630,
        alt: 'PratikCV Ana Sayfa',
      },
    ],
  },
  twitter: {
    title: 'PratikCV - Ücretsiz CV Oluşturucu',
    description: 'Dakikalar içinde profesyonel CV\'nizi oluşturun. AI analizi ve modern şablonlar.',
  },
};

const HomePage = () => {
  return (
    <>
      <StructuredData 
        type="website" 
        data={{
          name: 'PratikCV',
          description: 'AI destekli ücretsiz CV oluşturucu platform',
        }} 
      />
      <StructuredData 
        type="organization" 
        data={{
          description: 'Türkiye\'nin önde gelen AI destekli CV oluşturma platformu',
        }} 
      />
      <HeroSection />
      <About />
      <StatsSection />
      <FAQ />
      <Contact />
    </>
  );
};

export default HomePage;
