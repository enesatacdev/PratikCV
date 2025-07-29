'use client';

import React, { useState, useEffect } from 'react';
import { Users, FileText, Building, TrendingUp, Star, Award, Globe, Zap, Clock, CheckCircle } from 'lucide-react';

export default function IstatistiklerPage() {
  const [animatedStats, setAnimatedStats] = useState({
    users: 0,
    cvs: 0,
    companies: 0,
    satisfaction: 0
  });

  const finalStats = {
    users: 52847,
    cvs: 184263,
    companies: 1247,
    satisfaction: 96
  };

  // Animasyon efekti
  useEffect(() => {
    const duration = 2000; // 2 saniye
    const interval = 50; // 50ms aralıklarla güncelle
    const steps = duration / interval;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setAnimatedStats({
        users: Math.floor(finalStats.users * progress),
        cvs: Math.floor(finalStats.cvs * progress),
        companies: Math.floor(finalStats.companies * progress),
        satisfaction: Math.floor(finalStats.satisfaction * progress)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedStats(finalStats);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const mainStats = [
    {
      icon: <Users className="w-12 h-12" />,
      title: 'Toplam Kullanıcı',
      value: animatedStats.users,
      suffix: '+',
      color: 'purple',
      description: 'Platformumuza kayıtlı aktif kullanıcı sayısı'
    },
    {
      icon: <FileText className="w-12 h-12" />,
      title: 'Oluşturulan CV',
      value: animatedStats.cvs,
      suffix: '+',
      color: 'blue',
      description: 'Şimdiye kadar oluşturulan toplam CV sayısı'
    },
    {
      icon: <Building className="w-12 h-12" />,
      title: 'Ortak Şirket',
      value: animatedStats.companies,
      suffix: '+',
      color: 'green',
      description: 'Platformumuzla entegre çalışan şirket sayısı'
    },
    {
      icon: <Star className="w-12 h-12" />,
      title: 'Memnuniyet',
      value: animatedStats.satisfaction,
      suffix: '%',
      color: 'orange',
      description: 'Kullanıcı memnuniyet oranımız'
    }
  ];

  const monthlyGrowth = [
    { month: 'Ocak', users: 12500, cvs: 28000 },
    { month: 'Şubat', users: 15800, cvs: 34500 },
    { month: 'Mart', users: 19200, cvs: 42000 },
    { month: 'Nisan', users: 23100, cvs: 51200 },
    { month: 'Mayıs', users: 27800, cvs: 62800 },
    { month: 'Haziran', users: 33400, cvs: 76500 },
    { month: 'Temmuz', users: 39900, cvs: 92100 },
    { month: 'Ağustos', users: 44200, cvs: 108600 },
    { month: 'Eylül', users: 48700, cvs: 126800 },
    { month: 'Ekim', users: 52847, cvs: 147300 },
    { month: 'Kasım', users: 56200, cvs: 169500 },
    { month: 'Aralık', users: 60100, cvs: 184263 }
  ];

  const achievements = [
    {
      icon: <Award className="w-8 h-8" />,
      title: 'En İyi Startup Ödülü',
      year: '2023',
      description: 'TechCrunch tarafından yılın en iyi startup\'ı seçildik'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Uluslararası Genişleme',
      year: '2024',
      description: '5 farklı ülkede hizmet vermeye başladık'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'AI Entegrasyonu',
      year: '2024',
      description: 'Yapay zeka destekli CV analizi özelliğini hayata geçirdik'
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: 'ISO 27001 Sertifikası',
      year: '2024',
      description: 'Bilgi güvenliği yönetim sistemi sertifikası aldık'
    }
  ];

  const liveStats = [
    { label: 'Şu an aktif kullanıcı', value: '2,847', icon: <Users className="w-6 h-6" /> },
    { label: 'Bugün oluşturulan CV', value: '1,263', icon: <FileText className="w-6 h-6" /> },
    { label: 'Bu ay yeni kayıt', value: '8,492', icon: <TrendingUp className="w-6 h-6" /> },
    { label: 'Ortalama işlem süresi', value: '3.2 dk', icon: <Clock className="w-6 h-6" /> }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      purple: 'from-purple-500 to-purple-600 text-purple-600',
      blue: 'from-blue-500 to-blue-600 text-blue-600',
      green: 'from-green-500 to-green-600 text-green-600',
      orange: 'from-orange-500 to-orange-600 text-orange-600'
    };
    return colors[color as keyof typeof colors] || colors.purple;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Platform İstatistikleri
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            PratikCV'nin büyüme hikayesi ve kullanıcılarımızla birlikte elde ettiğimiz başarıları keşfedin.
          </p>
        </div>

        {/* Ana İstatistikler */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {mainStats.map((stat, index) => (
            <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl text-center hover:shadow-2xl transition-all duration-300">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${getColorClasses(stat.color)} bg-white/20 mb-6`}>
                <div className={`${getColorClasses(stat.color).split(' ')[2]}`}>
                  {stat.icon}
                </div>
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {stat.value.toLocaleString()}{stat.suffix}
              </div>
              <div className="text-lg font-semibold text-gray-700 mb-2">{stat.title}</div>
              <div className="text-sm text-gray-500">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Canlı İstatistikler */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            🔴 Canlı İstatistikler
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {liveStats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-white/50 rounded-xl">
                <div className="text-green-600 mb-3 flex justify-center">{stat.icon}</div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Aylık Büyüme Grafiği */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            2024 Büyüme Trendi
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Kullanıcı Büyümesi */}
            <div>
              <h3 className="text-lg font-semibold text-purple-600 mb-4">Kullanıcı Sayısı</h3>
              <div className="space-y-3">
                {monthlyGrowth.slice(-6).map((data, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">{data.month}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-purple-100 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${(data.users / 60000) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-16 text-right">
                        {data.users.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CV Oluşturma Sayısı */}
            <div>
              <h3 className="text-lg font-semibold text-blue-600 mb-4">Oluşturulan CV</h3>
              <div className="space-y-3">
                {monthlyGrowth.slice(-6).map((data, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">{data.month}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-blue-100 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${(data.cvs / 200000) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-16 text-right">
                        {data.cvs.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Başarılarımız */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Başarılarımız
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white">
                      {achievement.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{achievement.title}</h3>
                      <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs font-semibold">
                        {achievement.year}
                      </span>
                    </div>
                    <p className="text-gray-600">{achievement.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-6">
            Sen de Bu Başarının Parçası Ol!
          </h2>
          <p className="text-purple-100 text-lg mb-8 max-w-2xl mx-auto">
            50.000+ kullanıcımızın güvendiği platformda sen de profesyonel CV'ni oluştur 
            ve kariyerinde yeni kapılar aç.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/auth/register"
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg"
            >
              Hemen Başla
            </a>
            <a
              href="/create-cv"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-purple-600 transition-all duration-300"
            >
              CV Oluştur
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
