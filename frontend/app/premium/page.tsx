'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { Crown, Star, Zap, Check, ArrowRight, Sparkles, Shield, Rocket, X, CreditCard } from 'lucide-react';
import Link from 'next/link';
import Breadcrumb from '@/components/ui/breadcrumb';

export default function PremiumPage() {
  const { user, isLoading } = useAuth();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'standard' | 'pro'>('standard');
  const [showModal, setShowModal] = useState(false);
  const [modalPlan, setModalPlan] = useState<'basic' | 'standard' | 'pro' | null>(null);

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Premium Şablon Kredisi', current: true }
  ];

  const plans = [
    {
      id: 'basic' as const,
      name: 'Başlangıç',
      description: 'Temel premium şablon deneyimi',
      price: 30,
      credits: 3,
      popular: false,
      features: [
        '3 Premium şablon kredisi',
        'Premium şablon kullanımı',
        'Yüksek kaliteli tasarımlar',
        'PDF indirme',
        'Temel destek'
      ]
    },
    {
      id: 'standard' as const,
      name: 'Standart',
      description: 'En popüler seçenek',
      price: 90,
      credits: 10,
      popular: true,
      originalPrice: 100,
      features: [
        '10 Premium şablon kredisi',
        'Tüm premium şablonlara erişim',
        'Profesyonel tasarımlar',
        'Sınırsız PDF indirme',
        'Öncelikli destek',
        '%10 indirim avantajı'
      ]
    },
    {
      id: 'pro' as const,
      name: 'Profesyonel',
      description: 'Maximum değer paketi',
      price: 400,
      credits: 50,
      popular: false,
      originalPrice: 500,
      features: [
        '50 Premium şablon kredisi',
        'Tüm premium özelliklere erişim',
        'Özel tasarım şablonları',
        'Sınırsız CV oluşturma',
        '7/24 premium destek',
        'Özel danışmanlık hizmeti',
        '%20 süper indirim'
      ]
    }
  ];

  const handleUpgrade = async (planId: 'basic' | 'standard' | 'pro') => {
    if (!user) return;
    
    try {
      setIsUpgrading(true);
      const plan = plans.find(p => p.id === planId);
      if (!plan) return;

      // LOCAL TEST MODU - Geliştirme için
      if (process.env.NODE_ENV === 'development' && window.location.hostname === 'localhost') {
        // Backend test endpoint'ini çağır
        const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000/api';
        
        const testResponse = await fetch(`${API_URL}/payment/test-payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify({
            userId: user.id,
            planId: plan.id,
            buyerName: user.name,
            buyerEmail: user.email
          })
        });

        const testResponseText = await testResponse.text();

        if (testResponse.ok) {
          const testResult = JSON.parse(testResponseText);
          
          // Success sayfasına yönlendir
          const testParams = new URLSearchParams({
            test: 'true',
            order_id: testResult.transactionId,
            status: 'success',
            credits: testResult.credits.toString(),
            plan_name: plan.name
          });
          
          window.location.href = `/premium/success?${testParams.toString()}`;
          return;
        } else {
          throw new Error(`Test ödeme başarısız: ${testResponse.status} - ${testResponseText}`);
        }
      }

      // Prodüksiyon için Shopier ödeme URL'ini oluştur
      const shopierPaymentUrl = createShopierPaymentUrl(plan, user);
      
      // Shopier ödeme sayfasına yönlendir
      window.location.href = shopierPaymentUrl;
      
    } catch (error) {
      alert('Ödeme işlemi başlatılamadı. Lütfen tekrar deneyin.');
    } finally {
      setIsUpgrading(false);
      setShowModal(false);
    }
  };

  const getShopierProductUrl = (planId: string) => {
    // Shopier'ın doğru URL formatı - ID'siz format
    const productUrls = {
      'basic': 'https://www.shopier.com/37967135',    // Başlangıç paketi (30 TL - 3 kredi)
      'standard': 'https://www.shopier.com/37967141', // Standart paketi (90 TL - 10 kredi)
      'pro': 'https://www.shopier.com/37967144'       // Profesyonel paketi (150 TL - 20 kredi)
    };
    
    return productUrls[planId as keyof typeof productUrls] || productUrls.standard;
  };

  const createShopierPaymentUrl = (plan: typeof plans[0], user: any) => {
    // LOCAL TEST MODU - Geliştirme için
    if (process.env.NODE_ENV === 'development' && window.location.hostname === 'localhost') {
      // Local test için success sayfasına yönlendir
      const testParams = new URLSearchParams({
        order_id: `test_${Date.now()}`,
        payment_id: `pay_${Date.now()}`,
        status: 'success',
        buyer_name: user.name || 'Test User',
        buyer_email: user.email || 'test@example.com',
        product_name: `PratikCV ${plan.name} Paketi`,
        amount: plan.price.toString(),
        custom_field_1: user.id || 'test_user_id',
        custom_field_2: plan.id,
        custom_field_3: plan.credits.toString()
      });
      
      return `/premium/success?${testParams.toString()}`;
    }
    
    // Prodüksiyon için Shopier ürün linkini döndür
    return getShopierProductUrl(plan.id);
  };

  const openModal = (planId: 'basic' | 'standard' | 'pro') => {
    setModalPlan(planId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalPlan(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-20">
      {/* Breadcrumb - Sadece giriş yapmış kullanıcılar için */}
      {user && (
        <div className="bg-white/80 backdrop-blur-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-6 shadow-lg">
            <Crown className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Premium Şablon <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Kredisi Al</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Profesyonel CV'lerini bir sonraki seviyeye taşı! Premium şablonlarla öne çık ve hayalindeki işi kap.
          </p>

          {/* Current Status */}
          {user ? (
            user.isPremium ? (
              <div className="inline-flex items-center bg-green-100 text-green-800 px-6 py-3 rounded-full font-medium">
                <Check className="w-5 h-5 mr-2" />
                Premium üye - {user.premiumCredits || 0} kredin var
              </div>
            ) : (
              <div className="inline-flex items-center bg-amber-100 text-amber-800 px-6 py-3 rounded-full font-medium">
                <Star className="w-5 h-5 mr-2" />
                Ücretsiz üye - Premium kredin yok
              </div>
            )
          ) : (
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-6 py-3 rounded-full font-medium">
              <Sparkles className="w-5 h-5 mr-2" />
              Premium fiyatları - Giriş yaparak satın alabilirsin
            </div>
          )}
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Premium Tasarımlar</h3>
            <p className="text-gray-600">
              Profesyonel tasarımcılar tarafından hazırlanmış, özel ve etkileyici CV şablonları.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center mb-6">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Öne Çıkan CV</h3>
            <p className="text-gray-600">
              Rekabetçi iş piyasasında seni diğer adaylardan ayıracak, dikkat çekici CV tasarımları.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Kalite Garantisi</h3>
            <p className="text-gray-600">
              HR uzmanları tarafından onaylanmış, işe alım süreçlerinde başarı garantili şablonlar.
            </p>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-3xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 ${
                plan.popular ? 'ring-4 ring-purple-500 ring-opacity-50' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-2 font-medium">
                  🔥 En Popüler
                </div>
              )}

              <div className={`p-8 ${plan.popular ? 'pt-16' : ''}`}>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-4">
                    {plan.originalPrice && (
                      <span className="text-lg text-gray-500 line-through mr-2">{plan.originalPrice} TL</span>
                    )}
                    <span className="text-4xl font-bold text-gray-900">{plan.price} TL</span>
                  </div>
                  
                  <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                    <Zap className="w-4 h-4 mr-1" />
                    {plan.credits} Kredi
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => user ? openModal(plan.id) : (window.location.href = '/auth/login')}
                  disabled={isUpgrading}
                  className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
                >
                  {isUpgrading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      {user ? 'Şimdi Al' : 'Giriş Yap ve Al'}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 bg-white/70 backdrop-blur-sm rounded-3xl p-12 shadow-xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Sıkça Sorulan Sorular
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Premium krediler nasıl çalışır?</h3>
              <p className="text-gray-600">
                Her premium şablon kullanımında 1 kredi tüketilir. Krediniz bittiğinde yeni kredi satın alabilirsiniz.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Kredilerim birikir mi?</h3>
              <p className="text-gray-600">
                Evet! Satın aldığınız tüm krediler hesabınızda birikir ve süresiz olarak kullanabilirsiniz.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">İade politikanız nedir?</h3>
              <p className="text-gray-600">
                Satın alma işleminden sonra 7 gün içinde, hiç kullanılmamış kredilerinizi iade edebilirsiniz.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Destek alabilir miyim?</h3>
              <p className="text-gray-600">
                Premium üyelerimize 7/24 öncelikli destek sağlıyoruz. Her türlü sorunuz için buradayız.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Dashboard'a Dön
          </Link>
        </div>
      </div>

      {/* Premium Upgrade Modal */}
      {showModal && modalPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-3xl p-6">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Premium Kredi Satın Al</h3>
                <p className="text-purple-100 mt-2">Ödemeni onaylayıp devam et</p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {(() => {
                const plan = plans.find(p => p.id === modalPlan);
                if (!plan) return null;

                return (
                  <>
                    {/* Plan Details */}
                    <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">{plan.name} Paketi</h4>
                        <div className="text-right">
                          {plan.originalPrice && (
                            <div className="text-sm text-gray-500 line-through">{plan.originalPrice} TL</div>
                          )}
                          <div className="text-xl font-bold text-gray-900">{plan.price} TL</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Premium Kredi:</span>
                        <div className="flex items-center">
                          <Zap className="w-4 h-4 text-yellow-500 mr-1" />
                          <span className="font-semibold text-gray-900">{plan.credits} Kredi</span>
                        </div>
                      </div>
                    </div>

                    {/* Benefits */}
                    <div className="mb-6">
                      <h5 className="text-sm font-medium text-gray-700 mb-3">Bu pakette neler var:</h5>
                      <ul className="space-y-2">
                        {plan.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="flex items-center text-sm">
                            <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            <span className="text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Current Credits */}
                    {user && user.isPremium && (
                      <div className="bg-blue-50 rounded-xl p-4 mb-6">
                        <div className="flex items-center justify-between">
                          <span className="text-blue-700 font-medium">Mevcut Kredin:</span>
                          <span className="text-blue-900 font-bold">{user.premiumCredits || 0} Kredi</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-blue-700 font-medium">Satın Alma Sonrası:</span>
                          <span className="text-blue-900 font-bold">{(user.premiumCredits || 0) + plan.credits} Kredi</span>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <button
                        onClick={closeModal}
                        className="flex-1 py-3 px-4 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        İptal
                      </button>
                      <button
                        onClick={() => handleUpgrade(plan.id)}
                        disabled={isUpgrading}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {isUpgrading ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4 mr-2" />
                            Ödemeyi Onayla
                          </>
                        )}
                      </button>
                    </div>

                    {/* Security Note */}
                    <p className="text-xs text-gray-500 text-center mt-4">
                      🔒 Güvenli ödeme • Anında aktivasyon
                    </p>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
