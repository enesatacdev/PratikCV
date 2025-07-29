'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import TemplatePicker from '@/components/cv/TemplatePicker';
import { TemplateId } from '@/lib/types/templates';
import { ArrowLeft, Sparkles, PenTool } from 'lucide-react';
import Link from 'next/link';
import Breadcrumb from '@/components/ui/breadcrumb';

function CreateCVContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('modern');
  
  // URL'den method parametresini al
  const methodFromUrl = searchParams.get('method') as 'manual' | 'ai' | null;

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Şablon Seçimi', current: true }
  ];

  const handleTemplateSelect = (templateId: TemplateId) => {
    setSelectedTemplate(templateId);
  };

  const handleProceed = () => {
    if (methodFromUrl && selectedTemplate) {
      // Template ID'yi URL parameter olarak gönder
      if (methodFromUrl === 'ai') {
        router.push(`/create-cv/ai-chat?template=${selectedTemplate}`);
      } else {
        router.push(`/create-cv/${methodFromUrl}?template=${selectedTemplate}`);
      }
    }
  };

  // Eğer method parametresi yoksa dashboard'a yönlendir
  useEffect(() => {
    if (!methodFromUrl) {
      router.push('/dashboard');
    }
  }, [methodFromUrl, router]);

  // Method yoksa loading göster
  if (!methodFromUrl) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Yönlendiriliyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 mt-23">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        
        {/* Header */}
        <div className="text-center mb-8">
         
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Şablon Seçimi
          </h1>
          <p className="text-lg text-gray-600">
            {methodFromUrl === 'manual' ? 'Manuel CV oluşturma' : 'AI ile CV oluşturma'} için şablon seçin
          </p>
          
          {/* Selected Method Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-gray-200 mt-4">
            {methodFromUrl === 'manual' ? (
              <>
                <PenTool className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-600">Manuel Oluşturma</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-purple-600 mr-2" />
                <span className="text-sm font-medium text-purple-600">AI ile Oluşturma</span>
              </>
            )}
          </div>
        </div>

        {/* Template Selection */}
        <div className="max-w-6xl mx-auto">
          <TemplatePicker
            selectedTemplate={selectedTemplate}
            onTemplateSelect={handleTemplateSelect}
            onNext={handleProceed}
          />
        </div>
      </div>
    </div>
  );
}

export default function CreateCVPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Yükleniyor...</span>
        </div>
      </div>
    }>
      <CreateCVContent />
    </Suspense>
  );
}
