'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, ArrowRight, Gift } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';

function PaymentSuccessContent() {
  const [isProcessing, setIsProcessing] = useState(true);
  const [credits, setCredits] = useState(0);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Test modu kontrolü
        const isTestMode = searchParams.get('test') === 'true';
        
        if (isTestMode) {
          // Test modu için basit işlem
          const testCredits = parseInt(searchParams.get('credits') || '0');
          const planName = searchParams.get('plan_name') || 'Test Plan';
          
          setCredits(testCredits);
          setIsProcessing(false);
          
          return;
        }

        // Shopier'dan gelen parametreleri al
        const userId = searchParams.get('custom_field_1');
        const planId = searchParams.get('custom_field_2');
        const creditAmount = searchParams.get('custom_field_3');
        const transactionId = searchParams.get('transaction_id');

        if (!userId || !planId || !creditAmount) {
          setError('Ödeme bilgileri eksik');
          setIsProcessing(false);
          return;
        }

        // Backend'e ödeme onayını gönder
        const token = localStorage.getItem('authToken');
        if (token) {
          await api.confirmPayment(token, {
            userId,
            planId,
            credits: parseInt(creditAmount),
            transactionId
          });
          
          setCredits(parseInt(creditAmount));
        }
        
      } catch (error) {
        setError('Ödeme işlenirken bir hata oluştu');
      } finally {
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [searchParams]);

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Ödemeniz İşleniyor</h1>
          <p className="text-gray-600">Lütfen bekleyin...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Bir Hata Oluştu</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/premium"
            className="inline-flex items-center px-6 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
          >
            Premium Sayfasına Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-4">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🎉 Ödeme Başarılı!
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          Tebrikler! Premium krediniz hesabınıza başarıyla eklendi.
        </p>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl mb-8">
          <div className="flex items-center justify-center mb-4">
            <Gift className="w-8 h-8 text-purple-500 mr-3" />
            <span className="text-2xl font-bold text-gray-900">
              +{credits} Premium Kredi
            </span>
          </div>
          <p className="text-gray-600">
            Artık premium şablonları kullanarak profesyonel CV'ler oluşturabilirsin!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/create-cv"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg"
          >
            CV Oluşturmaya Başla
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
          
          <Link
            href="/dashboard"
            className="inline-flex items-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors border border-gray-200 shadow-lg"
          >
            Dashboard'a Git
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          Fatura ve ödeme detayları e-posta adresinize gönderilecektir.
        </p>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
