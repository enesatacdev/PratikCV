'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, MessageSquare, Users, Headphones } from 'lucide-react';

export default function IletisimPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simülasyon - gerçek projede API çağrısı yapılacak
    setTimeout(() => {
      setIsSubmitted(true);
      setIsSubmitting(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'general'
      });
    }, 2000);
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'E-posta',
      details: 'info@pratikcv.com',
      description: 'Genel sorularınız için'
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Telefon',
      details: '+90 (212) 555-0123',
      description: 'Acil durumlar için'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Adres',
      details: 'Levent, İstanbul',
      description: 'Merkez ofisimiz'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Çalışma Saatleri',
      details: 'Pzt-Cum: 09:00-18:00',
      description: 'Destek saatleri'
    }
  ];

  const supportCategories = [
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: 'Genel Sorular',
      description: 'Platform hakkında genel bilgi almak için',
      responseTime: '2-4 saat'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Hesap Desteği',
      description: 'Hesap sorunları ve kullanıcı desteği',
      responseTime: '1-2 saat'
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: 'Teknik Destek',
      description: 'Teknik sorunlar ve hata bildirimleri',
      responseTime: '30 dakika'
    }
  ];

  const faqItems = [
    {
      question: 'CV oluşturma ücretsiz mi?',
      answer: 'Evet! Temel CV oluşturma özelliklerimiz tamamen ücretsizdir. Premium özellikler için uygun fiyatlı planlarımız mevcuttur.'
    },
    {
      question: 'Kaç adet CV oluşturabilirim?',
      answer: 'Ücretsiz hesapla 3 CV oluşturabilirsiniz. Premium üyelikle sınırsız CV oluşturabilirsiniz.'
    },
    {
      question: 'CV\'mi nasıl düzenleyebilirim?',
      answer: 'Dashboard\'dan CV\'nizi seçip düzenle butonuna tıklayarak istediğiniz değişiklikleri yapabilirsiniz.'
    },
    {
      question: 'Hangi dosya formatlarında indirebilirim?',
      answer: 'CV\'nizi PDF, DOCX ve PNG formatlarında indirebilirsiniz.'
    }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-20 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Mesajınız Gönderildi!
            </h2>
            <p className="text-gray-600 mb-6">
              En kısa sürede size geri dönüş yapacağız. Teşekkür ederiz!
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all duration-300"
            >
              Yeni Mesaj Gönder
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              İletişim
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Size nasıl yardımcı olabileceğimizi öğrenmek için bizimle iletişime geçin. 
            Ekibimiz size en iyi deneyimi sunmak için burada.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Bize Yazın
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Ad Soyad *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    placeholder="Adınızı ve soyadınızı girin"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    E-posta *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    placeholder="E-posta adresinizi girin"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                  Kategori
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="general">Genel Sorular</option>
                  <option value="account">Hesap Desteği</option>
                  <option value="technical">Teknik Destek</option>
                  <option value="business">İş Ortaklığı</option>
                  <option value="feedback">Geri Bildirim</option>
                </select>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                  Konu *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  placeholder="Mesaj konusunu girin"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  Mesaj *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="Mesajınızı detaylı olarak yazın..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Mesajı Gönder</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Info & Support */}
          <div className="space-y-8">
            {/* Contact Information */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                İletişim Bilgileri
              </h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                        {info.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{info.title}</h3>
                      <p className="text-purple-600 font-medium">{info.details}</p>
                      <p className="text-sm text-gray-500">{info.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Support Categories */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Destek Kategorileri
              </h2>
              <div className="space-y-4">
                {supportCategories.map((category, index) => (
                  <div key={index} className="p-4 bg-white/50 rounded-xl border border-gray-100">
                    <div className="flex items-start space-x-3">
                      <div className="text-purple-600 mt-1">{category.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{category.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                        <div className="text-xs text-purple-600 font-medium">
                          Ortalama yanıt süresi: {category.responseTime}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Sık Sorulan Sorular
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {faqItems.map((item, index) => (
                <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {item.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">
              Hala yardıma mı ihtiyacınız var?
            </h2>
            <p className="text-purple-100 mb-6">
              SSS bölümünde aradığınızı bulamadıysanız, detaylı yardım dökümanlarımıza göz atabilirsiniz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/faq"
                className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300"
              >
                Detaylı SSS
              </a>
              <a
                href="/help"
                className="border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-purple-600 transition-all duration-300"
              >
                Yardım Merkezi
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
