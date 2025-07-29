'use client';

import React from 'react';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-4">
        <XCircle className="w-20 h-20 text-orange-500 mx-auto mb-6" />
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Ödeme İptal Edildi
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          Ödeme işlemini iptal ettiniz. Merak etmeyin, hesabınızdan herhangi bir ücret çekilmedi.
        </p>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl mb-8">
          <div className="text-left space-y-4">
            <div className="flex items-start">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-blue-600 text-sm font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Tekrar Deneyin</h3>
                <p className="text-gray-600 text-sm">Premium planlarımızı inceleyip tekrar ödeme yapabilirsiniz.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-green-600 text-sm font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Ücretsiz Kullanın</h3>
                <p className="text-gray-600 text-sm">Ücretsiz şablonlarla CV oluşturmaya devam edebilirsiniz.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-purple-600 text-sm font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Destek Alın</h3>
                <p className="text-gray-600 text-sm">Ödeme konusunda sorun yaşıyorsanız destek ekibimizle iletişime geçin.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/premium"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Tekrar Dene
          </Link>
          
          <Link
            href="/create-cv"
            className="inline-flex items-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors border border-gray-200 shadow-lg"
          >
            Ücretsiz CV Oluştur
          </Link>
          
          <Link
            href="/iletisim"
            className="inline-flex items-center px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors shadow-lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Destek Al
          </Link>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-xl">
          <p className="text-sm text-blue-800">
            💡 <strong>İpucu:</strong> Premium planlarımız ile profesyonel şablonlara erişebilir, 
            CV'nizi bir sonraki seviyeye taşıyabilirsiniz!
          </p>
        </div>
      </div>
    </div>
  );
}
