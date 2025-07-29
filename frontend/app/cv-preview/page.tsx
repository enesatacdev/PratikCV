'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CVTemplate from '@/components/cv/CVTemplate';
import { TemplateId } from '@/lib/types/templates';

function CVPreviewContent() {
  const searchParams = useSearchParams();
  
  // URL'den CV verisini al
  const cvDataParam = searchParams.get('data');
  const template = (searchParams.get('template') || 'modern') as TemplateId;
  
  if (!cvDataParam) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">CV verisi bulunamadı</h2>
          <p className="text-gray-600">Lütfen CV oluşturma sayfasından tekrar deneyin.</p>
        </div>
      </div>
    );
  }

  let cvData;
  try {
    cvData = JSON.parse(decodeURIComponent(cvDataParam));
  } catch (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">CV verisi geçersiz</h2>
          <p className="text-gray-600">CV verisi okunamadı. Lütfen tekrar deneyin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <style jsx global>{`
        /* Hide all navigation and UI elements */
        nav, header, footer, .navbar, .header, .footer {
          display: none !important;
        }
        
        /* Ensure consistent layout */
        .grid {
          display: grid !important;
        }
        
        .grid-cols-1 {
          grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
        }
        
        @media (min-width: 1024px) {
          .lg\\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
        
        .gap-8 {
          gap: 2rem !important;
        }
        
        .space-y-4 > * + * {
          margin-top: 1rem !important;
        }
        
        .space-y-6 > * + * {
          margin-top: 1.5rem !important;
        }
        
        .flex-wrap {
          flex-wrap: wrap !important;
        }
        
        .gap-2 {
          gap: 0.5rem !important;
        }
        
        .gap-4 {
          gap: 1rem !important;
        }
        
        @media print {
          body { 
            margin: 0; 
            padding: 0; 
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          @page { 
            margin: 0; 
            size: A4; 
          }
          
          /* Hide all possible UI elements */
          nav, header, footer, .navbar, .header, .footer,
          .navigation, .menu, .sidebar, .topbar {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            overflow: hidden !important;
          }
          
          /* Force single page layout */
          html, body {
            width: 210mm;
            height: 297mm;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden;
          }
          
          /* Force layout consistency in print */
          .grid {
            display: grid !important;
          }
          
          .lg\\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
          
          * {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
      <CVTemplate data={cvData} template={template} />
    </div>
  );
}

export default function CVPreviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Yükleniyor...</span>
        </div>
      </div>
    }>
      <CVPreviewContent />
    </Suspense>
  );
}
