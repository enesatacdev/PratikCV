'use client';

import React, { useState } from 'react';
import { Check, Eye, Download, Crown, Lock, X } from 'lucide-react';
import { TEMPLATE_DEFINITIONS, TemplateId } from '@/lib/types/templates';
import { useAuth } from '@/lib/auth-context';

interface TemplatePickerProps {
  selectedTemplate: TemplateId;
  onTemplateSelect: (templateId: TemplateId) => void;
  onNext?: () => void;
  className?: string;
}

const TemplatePicker: React.FC<TemplatePickerProps> = ({
  selectedTemplate,
  onTemplateSelect,
  onNext,
  className = ''
}) => {
  const [hoveredTemplate, setHoveredTemplate] = useState<TemplateId | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateId | null>(null);
  const { user } = useAuth();

  const templates = Object.values(TEMPLATE_DEFINITIONS);

  const handleTemplateClick = (templateId: TemplateId, isPremium: boolean) => {
    if (isPremium && (!user?.premiumCredits || user.premiumCredits < 1)) {
      // Premium template ama kullanıcı kredisi yok - modal ile preview göster
      setPreviewTemplate(templateId);
      setShowPremiumModal(true);
      return;
    }
    onTemplateSelect(templateId);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          CV Şablonunu Seçin
        </h2>
        <p className="text-gray-600">
          CV'nizin görünümünü belirleyecek şablonu seçin. Dilerseniz daha sonra değiştirebilirsiniz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`relative group cursor-pointer transition-all duration-300 ${
              selectedTemplate === template.id
                ? 'ring-2 ring-blue-500 ring-offset-2'
                : hoveredTemplate === template.id
                ? 'ring-2 ring-gray-300 ring-offset-2'
                : ''
            }`}
            onClick={() => handleTemplateClick(template.id as TemplateId, template.isPremium)}
            onMouseEnter={() => setHoveredTemplate(template.id as TemplateId)}
            onMouseLeave={() => setHoveredTemplate(null)}
          >
            {/* Template Preview Card */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm relative">
              {/* Premium Badge */}
              {template.isPremium && (
                <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center space-x-1">
                  <Crown className="w-3 h-3" />
                  <span>PREMIUM</span>
                </div>
              )}
              
              {/* Preview Image Placeholder */}
              <div 
                className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
                style={{ backgroundColor: `${template.color}15` }}
              >
                <div 
                  className="w-32 h-40 bg-white rounded shadow-lg border-l-4 flex flex-col"
                  style={{ borderLeftColor: template.color }}
                >
                  {/* Mini header */}
                  <div 
                    className="h-12 flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: template.color }}
                  >
                    {template.name}
                  </div>
                  {/* Mini content lines */}
                  <div className="p-2 space-y-1">
                    <div className="h-1 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-1 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-1 bg-gray-300 rounded w-full"></div>
                    <div className="h-1 bg-gray-200 rounded w-2/3"></div>
                    <div className="mt-2 space-y-1">
                      <div className="h-1 bg-gray-400 rounded w-1/3"></div>
                      <div className="h-1 bg-gray-200 rounded w-full"></div>
                      <div className="h-1 bg-gray-200 rounded w-4/5"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Template Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {template.name}
                    </h3>
                    {template.isPremium && (
                      <div className="flex items-center space-x-1">
                        <Crown className="w-4 h-4 text-yellow-500" />
                        <span className="text-xs font-semibold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                          PREMIUM
                        </span>
                      </div>
                    )}
                  </div>
                  {selectedTemplate === template.id && (
                    <div className="flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 mb-3">
                  {template.description}
                </p>

                {/* Features */}
                <div className="space-y-1">
                  {template.features.slice(0, 2).map((feature, index) => (
                    <div key={index} className="flex items-center text-xs text-gray-500">
                      <div 
                        className="w-2 h-2 rounded-full mr-2"
                        style={{ backgroundColor: template.color }}
                      ></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Hover Actions */}
              <div className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center space-x-3 transition-opacity duration-300 ${
                hoveredTemplate === template.id ? 'opacity-100' : 'opacity-0'
              }`}>
                {template.isPremium && (!user?.premiumCredits || user.premiumCredits < 1) ? (
                  <button
                    className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-yellow-600 hover:to-yellow-700 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewTemplate(template.id as TemplateId);
                      setShowPremiumModal(true);
                    }}
                  >
                    <Crown className="w-4 h-4" />
                    <span>Premium Önizle</span>
                  </button>
                ) : (
                  <button
                    className="flex items-center space-x-2 bg-white text-gray-800 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Preview functionality
                    }}
                  >
                    <Eye className="w-4 h-4" />
                    <span>Önizle</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Template Summary */}
      {selectedTemplate && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: TEMPLATE_DEFINITIONS[selectedTemplate].color }}
            ></div>
            <div>
              <h4 className="font-medium text-blue-900">
                Seçilen Şablon: {TEMPLATE_DEFINITIONS[selectedTemplate].name}
              </h4>
              <p className="text-sm text-blue-700">
                {TEMPLATE_DEFINITIONS[selectedTemplate].description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Next Button */}
      {onNext && selectedTemplate && (
        <div className="flex justify-center pt-4">
          <button
            onClick={onNext}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <span>Şablonla Devam Et</span>
            <Check className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Premium Template Preview Modal */}
      {showPremiumModal && previewTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-7xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-8 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <Crown className="w-8 h-8 text-yellow-500" />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {TEMPLATE_DEFINITIONS[previewTemplate].name}
                  </h3>
                  <p className="text-base text-gray-600 mt-1">
                    {TEMPLATE_DEFINITIONS[previewTemplate].description}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowPremiumModal(false);
                  setPreviewTemplate(null);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 overflow-y-auto max-h-[75vh]">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                {/* Template Preview */}
                <div className="space-y-6">
                  <h4 className="text-xl font-semibold text-gray-900">Şablon Önizlemesi</h4>
                  <div className={`p-8 rounded-lg border ${
                    previewTemplate === 'executive' 
                      ? 'bg-gradient-to-br from-gray-900 to-black border-yellow-400' 
                      : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200'
                  }`}>
                    {/* Premium template iframe preview */}
                    <div className={`rounded-lg shadow-lg overflow-hidden relative ${
                      previewTemplate === 'executive' ? 'bg-black' : 'bg-white'
                    }`}>
                      {/* Premium Badge */}
                      <div className={`absolute top-3 right-3 z-10 px-3 py-1 rounded-full text-sm font-bold ${
                        previewTemplate === 'executive' 
                          ? 'bg-black border-2 border-yellow-400 text-yellow-400'
                          : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white'
                      }`}>
                        {previewTemplate === 'executive' ? 'EXECUTIVE' : 'PREMIUM ELİTE'}
                      </div>
                      
                      {/* PDF Template Preview */}
                      <div className="p-6 space-y-6 min-h-[500px]">
                        {/* Header Section */}
                        <div className={`p-8 rounded-lg ${
                          previewTemplate === 'executive' 
                            ? 'bg-gradient-to-r from-black to-gray-900 text-white border-b-2 border-yellow-400'
                            : 'bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white'
                        }`}>
                          <h3 className="text-2xl font-bold mb-3">Ahmet Yılmaz</h3>
                          <p className={`text-base opacity-90 mb-4 ${
                            previewTemplate === 'executive' ? 'text-yellow-300' : ''
                          }`}>Kıdemli Yazılım Geliştirici</p>
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div className="flex items-center space-x-2">
                              <span>📧</span>
                              <span>ahmet@example.com</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span>📱</span>
                              <span>+90 555 123 45 67</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span>📍</span>
                              <span>İstanbul, Türkiye</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span>🌐</span>
                              <span>linkedin.com/in/ahmet</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Content sections */}
                        <div className="grid grid-cols-3 gap-4">
                          {/* Left sidebar */}
                          <div className="bg-gray-800 text-white p-4 rounded-lg space-y-4">
                            <div>
                              <h4 className="text-sm font-bold mb-2 text-blue-300">YETENEKLER</h4>
                              <div className="space-y-2">
                                <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs">React</div>
                                <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs">Node.js</div>
                                <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs">TypeScript</div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-bold mb-2 text-blue-300">DİLLER</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-xs">Türkçe</span>
                                  <div className="flex space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                      <div key={i} className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                    ))}
                                  </div>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-xs">İngilizce</span>
                                  <div className="flex space-x-1">
                                    {[...Array(4)].map((_, i) => (
                                      <div key={i} className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                    ))}
                                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Main content */}
                          <div className="col-span-2 space-y-4">
                            <div>
                              <h4 className="text-sm font-bold text-gray-800 mb-2 border-b-2 border-blue-500 pb-1">DENEYİM</h4>
                              <div className="space-y-3">
                                <div className="border-l-3 border-blue-500 pl-3">
                                  <h5 className="text-sm font-semibold">Kıdemli Yazılım Geliştirici</h5>
                                  <p className="text-xs text-blue-600 font-medium">TechCorp A.Ş.</p>
                                  <p className="text-xs text-gray-600">2022 - Devam Ediyor</p>
                                  <p className="text-xs mt-1">React ve Node.js ile kurumsal uygulamalar geliştiriyorum...</p>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-bold text-gray-800 mb-2 border-b-2 border-blue-500 pb-1">EĞİTİM</h4>
                              <div className="border-l-3 border-blue-500 pl-3">
                                <h5 className="text-sm font-semibold">Bilgisayar Mühendisliği</h5>
                                <p className="text-xs text-blue-600 font-medium">İstanbul Teknik Üniversitesi</p>
                                <p className="text-xs text-gray-600">2018 - 2022</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Premium Features */}
                <div className="space-y-8">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-6">Premium Özellikler</h4>
                    <div className="space-y-4">
                      {TEMPLATE_DEFINITIONS[previewTemplate].features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full flex-shrink-0"></div>
                          <span className="text-base text-gray-700 font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Crown className="w-6 h-6 text-yellow-600" />
                      <h5 className="text-lg font-semibold text-yellow-800">Premium Üyelik Gerekli</h5>
                    </div>
                    <p className="text-yellow-700 text-base mb-5">
                      Bu şablonu kullanmak için premium üyeliğe ihtiyacınız var.
                    </p>
                    <div className="space-y-3 text-base text-yellow-700">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">✨</span>
                        <span>Sınırsız premium şablon erişimi</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">🎨</span>
                        <span>Gelişmiş tasarım özellikleri</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">🚀</span>
                        <span>Öncelikli müşteri desteği</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-4 px-6 rounded-xl text-lg font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-lg hover:shadow-xl">
                      💳 Kredi Satın Al
                    </button>
                    <button 
                      onClick={() => {
                        setShowPremiumModal(false);
                        setPreviewTemplate(null);
                      }}
                      className="w-full bg-gray-100 text-gray-700 py-4 px-6 rounded-xl text-base font-medium hover:bg-gray-200 transition-colors"
                    >
                      Ücretsiz Şablonlarla Devam Et
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplatePicker;
