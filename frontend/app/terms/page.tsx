'use client';

import React from 'react';
import { FileText, AlertCircle, CheckCircle, XCircle, Scale, CreditCard } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
  const lastUpdated = "15 Ocak 2024";

  const sections = [
    {
      id: "kabul-edilebilir-kullanim",
      title: "Kabul Edilebilir Kullanım",
      icon: <CheckCircle className="w-6 h-6" />,
      type: "allowed",
      content: [
        "Kişisel CV oluşturma ve düzenleme",
        "Platformun sunduğu özellikleri kullanma",
        "Hesap bilgilerinizi güncelleme",
        "Premium özellikleri satın alma",
        "Platformu yasal amaçlar için kullanma"
      ]
    },
    {
      id: "yasak-faaliyetler",
      title: "Yasak Faaliyetler",
      icon: <XCircle className="w-6 h-6" />,
      type: "forbidden",
      content: [
        "Sahte veya yanıltıcı bilgiler girme",
        "Başkasının hesabını yetkisiz kullanma",
        "Platform güvenliğini tehlikeye sokma",
        "Telif hakkı ihlali yapma",
        "Spam veya zararlı içerik gönderme",
        "Ticari amaçlarla kötüye kullanma"
      ]
    }
  ];

  const paymentTerms = [
    "Tüm ödemeler güvenli ödeme sistemleri üzerinden yapılır",
    "Premium krediler satın alma anında hesabınıza tanımlanır",
    "Krediler iade edilebilir (7 gün içinde, kullanılmamışsa)",
    "Fiyatlar önceden haber verilmeksizin değiştirilebilir",
    "Faturalandırma Türk Lirası (TL) cinsinden yapılır"
  ];

  const liabilityTerms = [
    "Platform \"olduğu gibi\" sunulur, herhangi bir garanti verilmez",
    "Hizmet kesintilerinden doğan zararlardan sorumlu değiliz",
    "Kullanıcı verilerinin yedeklenmesi kullanıcının sorumluluğundadır",
    "Üçüncü taraf hizmetlerden kaynaklanan sorunlardan sorumlu değiliz",
    "Maksimum sorumluluk, ödenen ücretle sınırlıdır"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-20">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Kullanım Şartları
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            PratikCV platformunu kullanarak aşağıdaki şartları kabul etmiş sayılırsınız. 
            Lütfen bu şartları dikkatli bir şekilde okuyun.
          </p>
          <div className="mt-6 text-sm text-gray-500">
            Son güncelleme: {lastUpdated}
          </div>
        </div>

        {/* Hızlı Özet */}
        <div className="bg-orange-50 rounded-2xl p-8 mb-12 border-l-4 border-orange-500">
          <h2 className="text-xl font-bold text-orange-900 mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            Önemli Noktalar
          </h2>
          <ul className="space-y-2 text-orange-800">
            <li>• 18 yaşından büyük olmalısınız</li>
            <li>• Doğru ve güncel bilgiler vermelisiniz</li>
            <li>• Hesap güvenliğiniz sizin sorumluluğunuzdadır</li>
            <li>• Ticari kullanım için özel izin gereklidir</li>
          </ul>
        </div>

        {/* Genel Şartlar */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Scale className="w-6 h-6 mr-3 text-purple-600" />
            Genel Şartlar
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>
              <strong>1. Kabul:</strong> Bu hizmeti kullanarak, bu şartları kabul etmiş olursunuz. 
              Şartları kabul etmiyorsanız, platformu kullanmamalısınız.
            </p>
            <p>
              <strong>2. Yaş Sınırı:</strong> Platformumuzu kullanmak için en az 18 yaşında olmalısınız. 
              18 yaşından küçükseniz, ebeveyn veya vasi iznine ihtiyacınız vardır.
            </p>
            <p>
              <strong>3. Hesap Sorumluluğu:</strong> Hesabınızın güvenliğinden siz sorumlusunuz. 
              Şifrenizi kimseyle paylaşmamalı ve güvenli tutmalısınız.
            </p>
            <p>
              <strong>4. Doğru Bilgi:</strong> Platformda verdiğiniz tüm bilgilerin doğru, 
              güncel ve eksiksiz olması gerekmektedir.
            </p>
          </div>
        </div>

        {/* Kullanım Kuralları */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {sections.map((section, index) => (
            <div key={index} className={`rounded-2xl p-8 shadow-lg ${
              section.type === 'allowed' ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <h2 className={`text-xl font-bold mb-6 flex items-center ${
                section.type === 'allowed' ? 'text-green-900' : 'text-red-900'
              }`}>
                <div className={`mr-3 ${
                  section.type === 'allowed' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {section.icon}
                </div>
                {section.title}
              </h2>
              <ul className="space-y-3">
                {section.content.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start">
                    <div className={`w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 ${
                      section.type === 'allowed' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <span className={section.type === 'allowed' ? 'text-green-800' : 'text-red-800'}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Ödeme Şartları */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <CreditCard className="w-6 h-6 mr-3 text-purple-600" />
            Ödeme Şartları
          </h2>
          <ul className="space-y-3">
            {paymentTerms.map((term, index) => (
              <li key={index} className="flex items-start">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-700">{term}</span>
              </li>
            ))}
          </ul>
          
          <div className="mt-8 p-6 bg-blue-50 rounded-xl">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">İade Politikası</h3>
            <p className="text-blue-800 text-sm">
              Premium kredilerinizi, satın alma tarihinden itibaren 7 gün içinde ve 
              hiç kullanılmamış olması şartıyla iade edebilirsiniz. 
              İade talepleri için destek ekibimizle iletişime geçin.
            </p>
          </div>
        </div>

        {/* Fikri Mülkiyet */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Fikri Mülkiyet Hakları</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              <strong>Platform İçeriği:</strong> PratikCV platformu, şablonları, tasarımları, 
              logosu ve diğer tüm içerikleri PratikCV'nin fikri mülkiyetidir.
            </p>
            <p>
              <strong>Kullanıcı İçeriği:</strong> Platformda oluşturduğunuz CV'ler ve girdiğiniz 
              içerikler size aittir. Ancak, hizmeti sunmak için bu içerikleri kullanma hakkımız vardır.
            </p>
            <p>
              <strong>Şablon Kullanımı:</strong> Premium şablonları sadece kişisel kullanım için 
              kullanabilirsiniz. Ticari kullanım için ayrı lisans gereklidir.
            </p>
          </div>
        </div>

        {/* Sorumluluk Sınırları */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sorumluluk Sınırları</h2>
          <ul className="space-y-3">
            {liabilityTerms.map((term, index) => (
              <li key={index} className="flex items-start">
                <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-700">{term}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Değişiklikler */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Şartlarda Değişiklik</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Bu kullanım şartlarını dilediğimiz zaman değiştirme hakkımız saklıdır. 
              Önemli değişiklikler durumunda sizi e-posta ile bilgilendireceğiz.
            </p>
            <p>
              Değişiklikler yayınlandıktan sonra platformu kullanmaya devam etmeniz, 
              yeni şartları kabul ettiğiniz anlamına gelir.
            </p>
          </div>
        </div>

        {/* Hesap Sonlandırma */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Hesap Sonlandırma</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-3">Kullanıcı Tarafından</h3>
              <p className="text-gray-700 text-sm">
                Hesabınızı istediğiniz zaman silebilirsiniz. Hesap ayarlarından 
                "Hesabı Sil" seçeneğini kullanabilirsiniz.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-3">Platform Tarafından</h3>
              <p className="text-gray-700 text-sm">
                Kullanım şartlarını ihlal etmeniz durumunda hesabınızı 
                sonlandırma hakkımız saklıdır.
              </p>
            </div>
          </div>
        </div>

        {/* Uygulanacak Hukuk */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Uygulanacak Hukuk</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Bu kullanım şartları Türkiye Cumhuriyeti kanunlarına tabidir. 
              Herhangi bir uyuşmazlık durumunda İstanbul mahkemeleri yetkilidir.
            </p>
            <p>
              Avrupa Birliği vatandaşları için GDPR hakları saklıdır.
            </p>
          </div>
        </div>

        {/* İletişim */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Sorularınız mı var?</h2>
          <p className="mb-6 text-orange-100">
            Kullanım şartları hakkında herhangi bir sorunuz varsa, 
            hukuk ekibimizle iletişime geçebilirsiniz.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/iletisim"
              className="bg-white text-orange-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              İletişime Geç
            </Link>
            <a
              href="mailto:legal@pratikcv.com"
              className="border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-orange-600 transition-all duration-300"
            >
              legal@pratikcv.com
            </a>
          </div>
        </div>

        {/* Son Not */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>
            Bu kullanım şartları, Türk Ticaret Kanunu ve İnternet ortamında sunulan 
            hizmetlere ilişkin mevzuat uyarınca düzenlenmiştir.
          </p>
        </div>
      </div>
    </div>
  );
}
