"use client";
import { Users, FileText, Building, Trophy } from "lucide-react";
import { useEffect, useState } from "react";

interface Stats {
  totalUsers: number;
  totalCVs: number;
  totalCompanies: number;
  successRate: number;
}

export default function StatsSection() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalCVs: 0,
    totalCompanies: 0,
    successRate: 0
  });

  const [isVisible, setIsVisible] = useState(false);

  // Sayıları animasyonlu olarak artıran fonksiyon
  const animateCounter = (target: number, setter: (value: number) => void) => {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setter(target);
        clearInterval(timer);
      } else {
        setter(Math.floor(current));
      }
    }, 20);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          // Animasyonları başlat
          setTimeout(() => animateCounter(15247, (val) => setStats(prev => ({ ...prev, totalUsers: val }))), 100);
          setTimeout(() => animateCounter(8932, (val) => setStats(prev => ({ ...prev, totalCVs: val }))), 300);
          setTimeout(() => animateCounter(2400, (val) => setStats(prev => ({ ...prev, totalCompanies: val }))), 500);
          setTimeout(() => animateCounter(94, (val) => setStats(prev => ({ ...prev, successRate: val }))), 700);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('stats-section');
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [isVisible]);

  return (
    <section id="stats" className="py-20 bg-gradient-to-br from-yellow-50 to-amber-50">
      <div id="stats-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Rakamlarla PratikCV
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Binlerce kullanıcı PratikCV ile hayallerindeki işe kavuştu. Sen de aramıza katıl!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Toplam Kullanıcı */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {stats.totalUsers.toLocaleString('tr-TR')}+
            </div>
            <p className="text-gray-600 font-medium">Mutlu Kullanıcı</p>
            <p className="text-sm text-gray-500 mt-1">Aktif kullanıcı sayımız</p>
          </div>

          {/* Oluşturulan CV */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <FileText className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {stats.totalCVs.toLocaleString('tr-TR')}+
            </div>
            <p className="text-gray-600 font-medium">Oluşturulan CV</p>
            <p className="text-sm text-gray-500 mt-1">Başarıyla tamamlanan CV</p>
          </div>

          {/* İş Veren Şirket */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <Building className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {stats.totalCompanies.toLocaleString('tr-TR')}+
            </div>
            <p className="text-gray-600 font-medium">Partner Şirket</p>
            <p className="text-sm text-gray-500 mt-1">Güvenilir iş verenler</p>
          </div>

          {/* Başarı Oranı */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
              <Trophy className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">
              %{stats.successRate}
            </div>
            <p className="text-gray-600 font-medium">Başarı Oranı</p>
            <p className="text-sm text-gray-500 mt-1">İş bulma başarı oranı</p>
          </div>
        </div>

        {/* Alt Açıklama */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Neden PratikCV?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">⚡ Hızlı & Kolay</h4>
                <p className="text-gray-600 text-sm">
                  AI destekli sistemimiz ile 5 dakikada profesyonel CV oluşturun
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">🎯 Hedef Odaklı</h4>
                <p className="text-gray-600 text-sm">
                  İş ilanlarına özel optimize edilmiş CV'ler ile öne çıkın
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">📈 Sürekli Gelişim</h4>
                <p className="text-gray-600 text-sm">
                  CV'nizi sürekli güncelleyin ve kariyerinizi ilerletin
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
