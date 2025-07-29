"use client";
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, Clock, Shield, Zap, Download, Users } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      icon: <FileText className="w-5 h-5" />,
      question: "CV oluşturmak ne kadar sürer?",
      answer: "PratikCV ile ortalama 5 dakikada profesyonel CV'nizi oluşturabilirsiniz. Hızlı form doldurma sistemi ve AI destekli öneriler sayesinde, bilgilerinizi girdikten sonra anında sonuç alırsınız."
    },
    {
      icon: <Clock className="w-5 h-5" />,
      question: "CV'mi daha sonra düzenleyebilir miyim?",
      answer: "Elbette! Oluşturduğunuz CV'yi istediğiniz zaman düzenleyebilirsiniz. Bilgilerinizi güncelleyebilir, yeni deneyimler ekleyebilir ve farklı iş başvuruları için optimize edebilirsiniz."
    },
    {
      icon: <Shield className="w-5 h-5" />,
      question: "Verilerim güvende mi?",
      answer: "Kişisel verilerinizin güvenliği bizim önceliğimizdir. Tüm verileriniz şifrelenmiş bir şekilde saklanır ve sadece sizin erişebileceğiniz şekilde korunur. KVKK ve GDPR uyumlu çalışıyoruz."
    },
    {
      icon: <Zap className="w-5 h-5" />,
      question: "AI önerileri nasıl çalışır?",
      answer: "Yapay zeka sistemimiz, sektörünüz ve pozisyonunuza göre en uygun içerik önerilerini sunar. Binlerce başarılı CV'yi analiz ederek, size özel anahtar kelimeler ve ifadeler önerir."
    },
    {
      icon: <Download className="w-5 h-5" />,
      question: "CV'mi hangi formatlarda indirebilirim?",
      answer: "CV'nizi PDF formatında yüksek kalitede indirebilirsiniz. PDF formatı tüm iş başvuru platformlarında kabul edilir ve baskı kalitesi mükemmeldir."
    },
    {
      icon: <Users className="w-5 h-5" />,
      question: "Öğrenciler ve yeni mezunlar için uygun mu?",
      answer: "Kesinlikle! PratikCV, her seviyeden kullanıcı için uygundur. Öğrenciler ve yeni mezunlar için özel şablonlar ve rehberlik sunuyoruz. Deneyiminiz az olsa bile etkili bir CV oluşturabilirsiniz."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Sıkça Sorulan Sorular
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            PratikCV hakkında merak ettiğiniz her şey burada. Sorunuzun cevabını bulamazsanız bizimle iletişime geçin.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Column */}
          <div className="lg:sticky lg:top-8">
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Hala sorularınız mı var?
              </h3>
              <p className="text-gray-600 mb-6">
                Size yardımcı olmaktan mutluluk duyarız. Destek ekibimiz 7/24 hizmetinizde.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-900">?</span>
                  </div>
                  <span className="text-gray-700">Canlı destek hattı</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-900">@</span>
                  </div>
                  <span className="text-gray-700">E-posta desteği</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-900">📱</span>
                  </div>
                  <span className="text-gray-700">WhatsApp desteği</span>
                </div>
              </div>
              <button className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 py-3 rounded-xl transition-colors">
                İletişime Geç
              </button>
            </div>
          </div>

          {/* Right Column - FAQ Items */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <button
                  className="w-full px-6 py-6 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                      {faq.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 text-lg">{faq.question}</h3>
                  </div>
                  <div className="flex-shrink-0">
                    {openIndex === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </button>
                
                {openIndex === index && (
                  <div className="px-6 pb-6">
                    <div className="pl-14">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-3xl p-8 lg:p-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Hemen CV'nizi Oluşturmaya Başlayın
            </h3>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Binlerce kişi PratikCV ile hayallerindeki işe kavuştu. Sıra sizde!
            </p>
            <button className="bg-white hover:bg-gray-100 text-gray-900 font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all">
              Ücretsiz CV Oluştur
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;