'use client';

import React from 'react';
import { Shield, Eye, Lock, Database, UserCheck, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
  const lastUpdated = "15 Ocak 2024";

  const sections = [
    {
      id: "toplanan-bilgiler",
      title: "Toplanan Bilgiler",
      icon: <Database className="w-6 h-6" />,
      content: [
        "Hesap oluşturma sırasında sağladığınız kişisel bilgiler (ad, soyad, e-posta)",
        "CV oluşturma sürecinde girdiğiniz profesyonel bilgiler",
        "Platform kullanımınıza dair teknik veriler (IP adresi, tarayıcı bilgileri)",
        "Çerezler ve benzer takip teknolojileri ile toplanan veriler"
      ]
    },
    {
      id: "kullanim-amaci",
      title: "Bilgilerin Kullanım Amacı",
      icon: <Eye className="w-6 h-6" />,
      content: [
        "Hesabınızı oluşturmak ve yönetmek",
        "CV oluşturma hizmetlerimizi sunmak",
        "Platform güvenliğini sağlamak ve dolandırıcılığı önlemek",
        "Kullanıcı deneyimini iyileştirmek ve kişiselleştirmek",
        "Yasal yükümlülüklerimizi yerine getirmek"
      ]
    },
    {
      id: "veri-guvenlik",
      title: "Veri Güvenliği",
      icon: <Lock className="w-6 h-6" />,
      content: [
        "Tüm verileriniz SSL/TLS şifreleme ile korunur",
        "Veritabanlarımız güvenli sunucularda saklanır",
        "Düzenli güvenlik denetimleri yapılır",
        "Sadece yetkili personel verilerinize erişebilir",
        "ISO 27001 güvenlik standardına uygun olarak çalışırız"
      ]
    },
    {
      id: "veri-paylasim",
      title: "Veri Paylaşımı",
      icon: <UserCheck className="w-6 h-6" />,
      content: [
        "Kişisel verilerinizi üçüncü taraflarla satmayız",
        "Sadece hizmet sağlayıcılarımızla sınırlı paylaşım yaparız",
        "Yasal zorunluluk olmadıkça verilerinizi paylaşmayız",
        "Sizin açık rızanız olmadan pazarlama için kullanmayız"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-20">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Gizlilik Politikası
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Kişisel verilerinizin korunması bizim için önemlidir. Bu politika, 
            verilerinizi nasıl topladığımızı, kullandığımızı ve koruduğumuzu açıklar.
          </p>
          <div className="mt-6 text-sm text-gray-500">
            Son güncelleme: {lastUpdated}
          </div>
        </div>

        {/* Hızlı Özet */}
        <div className="bg-blue-50 rounded-2xl p-8 mb-12 border-l-4 border-blue-500">
          <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Önemli Noktalar
          </h2>
          <ul className="space-y-2 text-blue-800">
            <li>• Verilerinizi üçüncü taraflarla satmıyoruz</li>
            <li>• Tüm veriler şifrelenerek güvenli olarak saklanır</li>
            <li>• İstediğiniz zaman hesabınızı ve verilerinizi silebilirsiniz</li>
            <li>• KVKK (Kişisel Verilerin Korunması Kanunu) uyumlu çalışırız</li>
          </ul>
        </div>

        {/* Ana İçerik Bölümleri */}
        <div className="space-y-12">
          {sections.map((section, index) => (
            <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="text-purple-600 mr-3">{section.icon}</div>
                {section.title}
              </h2>
              <ul className="space-y-3">
                {section.content.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Çerezler Bölümü */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Çerezler (Cookies)</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Web sitemizde kullanıcı deneyimini iyileştirmek için çerezler kullanırız. 
              Çerezler, tarayıcınızda saklanan küçük metin dosyalarıdır.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-green-50 p-4 rounded-xl">
                <h3 className="font-semibold text-green-900 mb-2">Zorunlu Çerezler</h3>
                <p className="text-green-700 text-sm">
                  Sitenin çalışması için gerekli olan çerezler. Bu çerezler olmadan site çalışmaz.
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-xl">
                <h3 className="font-semibold text-yellow-900 mb-2">Analitik Çerezler</h3>
                <p className="text-yellow-700 text-sm">
                  Site kullanımını anlamamızı sağlar. İsteğe bağlı olarak kabul edebilirsiniz.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Haklarınız */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Haklarınız</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <span className="text-purple-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Erişim Hakkı</h3>
                  <p className="text-gray-600 text-sm">Hangi verilerinizi sakladığımızı öğrenme hakkınız</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <span className="text-purple-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Düzeltme Hakkı</h3>
                  <p className="text-gray-600 text-sm">Yanlış verilerinizi düzeltme hakkınız</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <span className="text-purple-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Silme Hakkı</h3>
                  <p className="text-gray-600 text-sm">Verilerinizin silinmesini talep etme hakkınız</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <span className="text-purple-600 font-bold text-sm">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Taşınabilirlik Hakkı</h3>
                  <p className="text-gray-600 text-sm">Verilerinizi başka platforma taşıma hakkınız</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <span className="text-purple-600 font-bold text-sm">5</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">İtiraz Hakkı</h3>
                  <p className="text-gray-600 text-sm">Veri işleme sürecine itiraz etme hakkınız</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <span className="text-purple-600 font-bold text-sm">6</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Şikayet Hakkı</h3>
                  <p className="text-gray-600 text-sm">KVKK Kurulu'na şikayet etme hakkınız</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* İletişim */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-center text-white mt-12">
          <h2 className="text-2xl font-bold mb-4">Sorularınız mı var?</h2>
          <p className="mb-6 text-purple-100">
            Gizlilik politikamız hakkında herhangi bir sorunuz varsa, 
            bizimle iletişime geçmekten çekinmeyin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/iletisim"
              className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              İletişime Geç
            </Link>
            <a
              href="mailto:privacy@pratikcv.com"
              className="border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-purple-600 transition-all duration-300"
            >
              privacy@pratikcv.com
            </a>
          </div>
        </div>

        {/* Son Not */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>
            Bu gizlilik politikası, KVKK (Kişisel Verilerin Korunması Kanunu) ve 
            GDPR (Genel Veri Koruma Yönetmeliği) uyumlu olarak hazırlanmıştır.
          </p>
        </div>
      </div>
    </div>
  );
}
