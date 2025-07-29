'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Search, MessageCircle, Zap, Users, CreditCard, Shield } from 'lucide-react';
import Link from 'next/link';

export default function SSSPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Tümü', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'general', name: 'Genel', icon: <MessageCircle className="w-4 h-4" /> },
    { id: 'account', name: 'Hesap', icon: <Users className="w-4 h-4" /> },
    { id: 'premium', name: 'Premium', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'technical', name: 'Teknik', icon: <Zap className="w-4 h-4" /> },
    { id: 'security', name: 'Güvenlik', icon: <Shield className="w-4 h-4" /> }
  ];

  const faqData = [
    {
      id: 1,
      category: 'general',
      question: 'PratikCV nedir ve nasıl çalışır?',
      answer: 'PratikCV, yapay zeka destekli bir CV oluşturma platformudur. Kullanıcılarımız birkaç dakika içinde profesyonel CV\'lerini oluşturabilir, farklı şablonlar arasından seçim yapabilir ve CV\'lerini PDF formatında indirebilirler.'
    },
    {
      id: 2,
      category: 'general',
      question: 'CV oluşturma süreci ne kadar sürer?',
      answer: 'Ortalama 4-5 dakika içinde profesyonel CV\'nizi oluşturabilirsiniz. AI destekli sistemimiz sayesinde bilgilerinizi hızlıca işler ve size uygun önerilerde bulunur.'
    },
    {
      id: 3,
      category: 'account',
      question: 'Hesap oluşturmak ücretsiz mi?',
      answer: 'Evet, PratikCV\'de hesap oluşturmak tamamen ücretsizdir. Temel CV oluşturma özelliklerini ücretsiz olarak kullanabilirsiniz.'
    },
    {
      id: 4,
      category: 'account',
      question: 'Şifremi unuttuğumda ne yapmalıyım?',
      answer: 'Giriş sayfasında "Şifremi Unuttum" linkine tıklayarak e-posta adresinizi girin. Size şifre sıfırlama linki göndereceğiz.'
    },
    {
      id: 5,
      category: 'premium',
      question: 'Premium krediler nasıl çalışır?',
      answer: 'Premium krediler, özel şablonları kullanmanızı ve AI analizinden faydalanmanızı sağlar. Her premium şablon kullanımında 1 kredi tüketilir. Kredileriniz hesabınızda birikir ve süresiz olarak kullanabilirsiniz.'
    },
    {
      id: 6,
      category: 'premium',
      question: 'Premium özellikler nelerdir?',
      answer: 'Premium üyelikle özel şablonlar, AI destekli içerik önerileri, sınırsız CV indirme, öncelikli destek ve gelişmiş CV analizi özelliklerine erişim sağlarsınız.'
    },
    {
      id: 7,
      category: 'technical',
      question: 'Hangi dosya formatlarında CV indirebilirim?',
      answer: 'CV\'nizi PDF, DOCX ve PNG formatlarında indirebilirsiniz. PDF formatı en çok tercih edilen format olup, tüm platformlarda uyumlu çalışır.'
    },
    {
      id: 8,
      category: 'technical',
      question: 'CV\'mi düzenleyebilir miyim?',
      answer: 'Evet, oluşturduğunuz CV\'yi istediğiniz zaman düzenleyebilirsiniz. Dashboard\'dan CV\'nizi seçip düzenle butonuna tıklayarak değişiklik yapabilirsiniz.'
    },
    {
      id: 9,
      category: 'security',
      question: 'Verilerim güvende mi?',
      answer: 'Evet, tüm verileriniz SSL şifreleme ile korunur. KVKK ve GDPR uyumlu olarak çalışır, verilerinizi üçüncü şahıslarla paylaşmayız.'
    },
    {
      id: 10,
      category: 'security',
      question: 'Hesabımı nasıl silebilirim?',
      answer: 'Hesap ayarlarından "Hesabı Sil" seçeneğini kullanabilirsiniz. Bu işlem geri alınamaz ve tüm verileriniz kalıcı olarak silinir.'
    },
    {
      id: 11,
      category: 'general',
      question: 'Kaç adet CV oluşturabilirim?',
      answer: 'Ücretsiz hesapla 3 CV oluşturabilirsiniz. Premium üyelikle sınırsız CV oluşturma hakkına sahip olursunuz.'
    },
    {
      id: 12,
      category: 'general',
      question: 'CV şablonları ücretsiz mi?',
      answer: 'Temel şablonlarımız ücretsizdir. Premium şablonlar için kredi kullanmanız gerekmektedir.'
    },
    {
      id: 13,
      category: 'technical',
      question: 'Mobil cihazlarda CV oluşturabilir miyim?',
      answer: 'Evet, platformumuz mobil uyumludur. Telefon ve tablet üzerinden CV oluşturabilir, düzenleyebilir ve indirebilirsiniz.'
    },
    {
      id: 14,
      category: 'account',
      question: 'E-posta adresimi değiştirebilir miyim?',
      answer: 'Hesap ayarlarından e-posta adresinizi değiştirebilirsiniz. Değişiklik için e-posta doğrulaması gereklidir.'
    },
    {
      id: 15,
      category: 'premium',
      question: 'Premium üyeliği nasıl iptal edebilirim?',
      answer: 'Hesap ayarlarından "Üyelik Yönetimi" bölümünden üyeliğinizi iptal edebilirsiniz. İptal sonrası mevcut dönem sonuna kadar premium özellikler aktif kalır.'
    }
  ];

  const toggleItem = (id: number) => {
    if (openItems.includes(id)) {
      setOpenItems(openItems.filter(item => item !== id));
    } else {
      setOpenItems([...openItems, id]);
    }
  };

  const filteredFAQ = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Sık Sorulan Sorular
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            PratikCV hakkında merak ettiklerinizin yanıtlarını burada bulabilirsiniz. 
            Aradığınızı bulamazsanız bizimle iletişime geçebilirsiniz.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl mb-12">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Soru veya anahtar kelime arayın..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                  }`}
                >
                  {category.icon}
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4 mb-16">
          {filteredFAQ.map((item) => (
            <div key={item.id} className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/50 transition-all duration-300"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {item.question}
                </h3>
                <div className="flex-shrink-0">
                  {openItems.includes(item.id) ? (
                    <ChevronUp className="w-5 h-5 text-purple-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>
              
              {openItems.includes(item.id) && (
                <div className="px-6 pb-4">
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-gray-600 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredFAQ.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aradığınız soru bulunamadı
            </h3>
            <p className="text-gray-600 mb-6">
              Farklı anahtar kelimeler deneyin veya bizimle doğrudan iletişime geçin.
            </p>
            <Link
              href="/iletisim"
              className="inline-flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all duration-300"
            >
              <MessageCircle className="w-5 h-5" />
              <span>İletişime Geç</span>
            </Link>
          </div>
        )}

        {/* Contact CTA */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">
            Hala yanıt bulamadınız mı?
          </h2>
          <p className="text-purple-100 mb-6">
            Bizimle doğrudan iletişime geçin, size yardımcı olmaktan mutluluk duyarız.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/iletisim"
              className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300"
            >
              Bizimle İletişime Geçin
            </Link>
            <Link
              href="/help"
              className="border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-purple-600 transition-all duration-300"
            >
              Yardım Merkezi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
