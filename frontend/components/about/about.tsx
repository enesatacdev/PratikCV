"use client";
import React from "react";
import { CheckCircle, Zap, Target, Award, Users, Clock } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Neden PratikCV?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Yapay zeka destekli platformumuz ile CV oluşturma sürecini tamamen yeniden tasarladık. 
            Hızlı, kolay ve profesyonel sonuçlar garantili.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Content */}
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                CV Oluşturma Deneyimini Yeniden Tanımlıyoruz
              </h3>
              <p className="text-lg text-gray-600 mb-8">
                Geleneksel CV hazırlama yöntemlerini geride bırakın. AI destekli sistemimiz ile 
                dakikalar içinde profesyonel CV'nizi oluşturun ve hayallerinizdeki işe kavuşun.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">AI Destekli İçerik Önerileri</h4>
                  <p className="text-gray-600">Yapay zeka teknolojisi ile size özel içerik önerileri alın</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">5 Dakikada Hazır CV</h4>
                  <p className="text-gray-600">Hızlı form doldurma ile dakikalar içinde CV'nizi tamamlayın</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Target className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">İş İlanına Özel Optimizasyon</h4>
                  <p className="text-gray-600">CV'nizi hedef pozisyona göre optimize edin</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Profesyonel Tasarımlar</h4>
                  <p className="text-gray-600">HR uzmanları tarafından onaylanmış modern tasarımlar</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Content */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl p-6 text-white">
                  <Users className="w-8 h-8 mb-3" />
                  <div className="text-2xl font-bold">15K+</div>
                  <div className="text-yellow-100">Mutlu Kullanıcı</div>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                  <Clock className="w-8 h-8 mb-3" />
                  <div className="text-2xl font-bold">5 Dk</div>
                  <div className="text-blue-100">Ortalama Süre</div>
                </div>
              </div>
              <div className="mt-8 space-y-4">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
                  <Target className="w-8 h-8 mb-3" />
                  <div className="text-2xl font-bold">%94</div>
                  <div className="text-green-100">Başarı Oranı</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                  <Award className="w-8 h-8 mb-3" />
                  <div className="text-2xl font-bold">8K+</div>
                  <div className="text-purple-100">Oluşturulan CV</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Process Steps */}
        <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              3 Basit Adımda CV'niz Hazır
            </h3>
            <p className="text-gray-600 text-lg">
              Karmaşık süreçleri geride bırakın, basit adımlarla profesyonel CV'nize kavuşun
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Bilgilerinizi Girin</h4>
              <p className="text-gray-600">
                Kişisel bilgilerinizi, deneyimlerinizi ve becerilerinizi kolay formlarla ekleyin
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">AI ile Optimize Edin</h4>
              <p className="text-gray-600">
                Yapay zeka sistemimiz CV'nizi analiz eder ve iyileştirme önerileri sunar
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">İndirin ve Başvurun</h4>
              <p className="text-gray-600">
                Hazır CV'nizi PDF olarak indirin ve hemen iş başvurularında kullanmaya başlayın
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
