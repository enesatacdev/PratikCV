'use client';

import React from 'react';
import { Users, Target, Heart, Award, Zap, Shield, Globe, Star } from 'lucide-react';
import Link from 'next/link';

export default function HakkimizdaPage() {
  const teamMembers = [
    {
      name: 'Enes Ataç',
      role: 'Full-Stack Developer',
      image: '/team/enes.jpg',
      description: 'Modern web teknolojileri ve yapay zeka entegrasyonu uzmanı.',
      linkedin: '#'
    }
  ];

  const values = [
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Misyonumuz',
      description: 'Herkesi hayalindeki işe kavuşturmak için teknoloji ve insan deneyimini birleştiriyoruz.'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Değerlerimiz',
      description: 'Kalite, güvenilirlik ve kullanıcı deneyimi odaklı çözümler sunmayı değer biliyoruz.'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Vizyonumuz',
      description: 'Türkiye\'nin en büyük kariyer platformu olmak ve global pazarda öncü olmak.'
    }
  ];

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Yapay Zeka Destekli',
      description: 'Modern AI teknolojileri ile CV oluşturma'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Güvenli Platform',
      description: 'Verileriniz güvenli ve gizli tutulur'
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: 'Profesyonel Tasarımlar',
      description: 'HR uzmanları tarafından onaylanmış şablonlar'
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Kullanıcı Odaklı',
      description: 'Sürekli gelişen kullanıcı deneyimi'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-20">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Hakkımızda
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            PratikCV olarak, kariyerinizde yeni bir sayfa açmanız için gereken tüm araçları sunuyoruz. 
            Yapay zeka destekli teknolojimiz ile profesyonel CV'nizi dakikalar içinde oluşturun.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 text-center shadow-xl">
            <div className="text-4xl font-bold text-purple-600 mb-2">50K+</div>
            <div className="text-gray-600">Mutlu Kullanıcı</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 text-center shadow-xl">
            <div className="text-4xl font-bold text-blue-600 mb-2">200K+</div>
            <div className="text-gray-600">Oluşturulan CV</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 text-center shadow-xl">
            <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
            <div className="text-gray-600">İş Ortağı</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 text-center shadow-xl">
            <div className="text-4xl font-bold text-orange-600 mb-2">%95</div>
            <div className="text-gray-600">Memnuniyet Oranı</div>
          </div>
        </div>

        {/* Mission, Vision, Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {values.map((value, index) => (
            <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
              <div className="text-purple-600 mb-6">{value.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Neden PratikCV?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-purple-600 mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Story */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-12 shadow-xl mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Hikayemiz
          </h2>
          <div className="max-w-4xl mx-auto text-gray-600 text-lg leading-relaxed space-y-6">
            <p>
              2023 yılında kurulan PratikCV, Türkiye'de iş arayanların karşılaştığı en büyük 
              zorluklardan birine çözüm getirmek için doğdu. Geleneksel CV hazırlama süreçlerinin 
              ne kadar zaman alıcı ve karmaşık olduğunu gören ekibimiz, bu süreci devrim niteliğinde 
              değiştirmek için yola çıktı.
            </p>
            <p>
              Yapay zeka teknolojilerinin gücünü kullanarak, kullanıcılarımızın dakikalar içinde 
              profesyonel CV'ler oluşturabilmesini sağladık. Bugün 50.000'den fazla kullanıcımız 
              ile Türkiye'nin en sevilen CV oluşturma platformu haline geldik.
            </p>
            <p>
              Amacımız sadece CV oluşturmak değil, aynı zamanda kullanıcılarımızın kariyer 
              yolculuklarında en iyi rehber olmak. Bu yüzden sürekli olarak platformumuzu 
              geliştiriyor, yeni özellikler ekliyoruz.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Ekibimiz
          </h2>
          <div className="flex justify-center">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl text-center max-w-sm">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Users className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{teamMembers[0].name}</h3>
              <p className="text-purple-600 font-medium mb-4">{teamMembers[0].role}</p>
              <p className="text-gray-600 text-sm">{teamMembers[0].description}</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-6">
            Hemen Başlayın!
          </h2>
          <p className="text-purple-100 text-lg mb-8 max-w-2xl mx-auto">
            Profesyonel CV'nizi oluşturmak için sadece birkaç dakikanız var. 
            Hemen kaydolun ve kariyerinizde yeni bir sayfa açın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg"
            >
              Ücretsiz Kaydol
            </Link>
            <Link
              href="/create-cv"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-purple-600 transition-all duration-300"
            >
              CV Oluştur
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
