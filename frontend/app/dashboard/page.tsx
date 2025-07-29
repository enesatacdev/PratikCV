'use client';

import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useCVs } from "@/lib/hooks/use-cvs";
import { api, apiService } from "@/lib/api";
import { FileText, Zap, User, ArrowRight, Plus, Brain, Edit3, Calendar, Download, MoreVertical, Eye, Copy, Trash2, MessageCircle, Star, X, Crown } from "lucide-react";
import Link from "next/link";
import Breadcrumb from "@/components/ui/breadcrumb";
import { TEMPLATE_DEFINITIONS, TemplateId } from "@/lib/types/templates";

// Template bilgilerini almak için yardımcı fonksiyon
const getTemplateInfo = (templateId: string) => {
  return TEMPLATE_DEFINITIONS[templateId as TemplateId] || TEMPLATE_DEFINITIONS.modern;
};

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const { cvs, loading: cvsLoading, error: cvsError, deleteCV, duplicateCV } = useCVs();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const breadcrumbItems = [
    { label: 'Dashboard', current: true }
  ];

  const handleUpgradeToPremium = () => {
    // Premium sayfasına yönlendir
    window.location.href = '/premium';
  };

  const handleDeleteCV = async (id: string) => {
    if (window.confirm('Bu CV\'yi silmek istediğinizden emin misiniz?')) {
      try {
        const success = await deleteCV(id);
        if (success) {
          alert('CV başarıyla silindi.');
        } else {
          alert('CV silinirken bir hata oluştu.');
        }
      } catch (error) {
        alert('CV silinirken bir hata oluştu.');
      }
    }
  };

  const handleDuplicateCV = async (id: string) => {
    await duplicateCV(id);
  };

  const handlePreviewCV = async (cv: any) => {
    try {
      // Önce tam CV verisini al
      const { apiService } = await import('@/lib/api');
      const fullCVData = await apiService.getCVById(cv.id);
      
      if (!fullCVData) {
        alert('CV verisi bulunamadı.');
        return;
      }

      // PDF önizleme fonksiyonu - yeni sekmede aç
      const { previewPDF } = await import('@/lib/pdf-client');
      await previewPDF(fullCVData, cv.templateId || cv.template || 'modern');
    } catch (error) {
      alert('PDF önizlemesi sırasında bir hata oluştu.');
    }
  };

  const handleDownloadCV = async (cv: any) => {
    try {
      // Önce tam CV verisini al
      const { apiService } = await import('@/lib/api');
      const fullCVData = await apiService.getCVById(cv.id);
      
      if (!fullCVData) {
        alert('CV verisi bulunamadı.');
        return;
      }

      // PDF indirme fonksiyonu
      const { downloadPDF } = await import('@/lib/pdf-client');
      await downloadPDF(fullCVData, cv.templateId || cv.template || 'modern');
    } catch (error) {
      alert('PDF indirmesi sırasında bir hata oluştu.');
    }
  };

  // Dropdown menüsünü dışarda tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Giriş Yapmalısınız</h1>
          <p className="text-gray-600 mb-6">Dashboard'a erişmek için giriş yapmanız gerekiyor.</p>
          <a href="/auth/login" className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600">
            Giriş Yap
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Breadcrumb items={breadcrumbItems} />
          </div>

          {/* Welcome Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {user.name?.split(' ').map(word => word.charAt(0)).join('').slice(0, 2) || 'U'}
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Hoş geldin, {user.name?.split(' ')[0] || 'Kullanıcı'}! 👋
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              Profesyonel CV'ini oluşturmak için hazır mısın?
            </p>
            
            {/* Premium Credits Status */}
            <div className="flex items-center justify-center">
              {user.premiumCredits && user.premiumCredits > 0 ? (
                <div className="flex items-center bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-6 py-3 rounded-full shadow-lg">
                  <Crown className="w-5 h-5 mr-2" />
                  <span className="font-semibold">{user.premiumCredits} Kredi</span>
                </div>
              ) : (
                <button
                  onClick={handleUpgradeToPremium}
                  className="flex items-center bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Kredi Satın Al</span>
                </button>
              )}
            </div>
          </div>

          {/* CV Creation Options */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Manual CV Creation */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative p-8">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-blue-600">
                    <circle cx="50" cy="50" r="40" fill="currentColor" />
                    <circle cx="30" cy="30" r="20" fill="currentColor" />
                    <circle cx="70" cy="70" r="15" fill="currentColor" />
                  </svg>
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                      <Edit3 className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Manuel CV Oluştur</h2>
                      <p className="text-sm text-blue-600 font-medium">Kendi kontrolünde</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Kişisel bilgilerinden yeteneklerine kadar her detayı kendin ekle. 
                    Tam kontrol sende olsun.
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                      Adım adım rehberlik
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                      Canlı önizleme
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                      Çoklu şablon desteği
                    </div>
                  </div>

                  <Link href="/create-cv?method=manual" className="group">
                    <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center">
                      Başla
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>

                  {/* Quick Stats */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-sm text-gray-500">Süre</div>
                        <div className="font-semibold text-gray-900 flex items-center justify-center">
                          <Zap className="w-3 h-3 mr-1" />
                          10 dk
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Zorluk</div>
                        <div className="font-semibold text-gray-900">Kolay</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI CV Creation */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative p-8">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-purple-600">
                    <path d="M20,20 Q50,5 80,20 Q85,50 80,80 Q50,85 20,80 Q5,50 20,20" fill="currentColor" />
                    <circle cx="35" cy="35" r="8" fill="currentColor" />
                    <circle cx="65" cy="65" r="6" fill="currentColor" />
                  </svg>
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                      <Brain className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">AI ile CV Oluştur</h2>
                      <p className="text-sm text-purple-600 font-medium">Akıllı asistan</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    AI asistanı ile sohbet ederek CV'ni oluştur. Akıllı öneriler ve 
                    optimizasyonlar ile fark yarat.
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                      Akıllı soru-cevap
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                      Otomatik optimizasyon
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                      İçerik önerileri
                    </div>
                  </div>

                  <Link href="/create-cv?method=ai" className="group">
                    <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center">
                      AI ile Başla
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>

                  {/* Quick Stats */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-sm text-gray-500">Süre</div>
                        <div className="font-semibold text-gray-900 flex items-center justify-center">
                          <Zap className="w-3 h-3 mr-1" />
                          5 dk
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Zorluk</div>
                        <div className="font-semibold text-gray-900">Çok Kolay</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Voice Assistant - Geçici olarak devre dışı */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden opacity-60">
              <div className="relative p-8">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-600">
                    <circle cx="50" cy="20" r="15" fill="currentColor" />
                    <path d="M30,35 Q50,45 70,35 Q75,50 70,65 Q50,75 30,65 Q25,50 30,35" fill="currentColor" />
                    <circle cx="50" cy="80" r="10" fill="currentColor" />
                  </svg>
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                      <MessageCircle className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Sesli CV Asistanı</h2>
                      <p className="text-sm text-orange-600 font-medium">🚧 Güncelleniyor</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Sesli asistanımız şu anda güncelleniyor. Yakında daha gelişmiş özelliklerle karşınızda olacak!
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                      <span className="line-through">Sesli komutlar</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                      <span className="line-through">Türkçe destekli</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                      <span className="line-through">Anlık yanıtlar</span>
                    </div>
                  </div>

                  <button 
                    disabled
                    className="w-full bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg cursor-not-allowed flex items-center justify-center opacity-75"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Geçici olarak kapalı
                  </button>

                  {/* Quick Stats */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-sm text-gray-500">Yanıt Süresi</div>
                        <div className="font-semibold text-gray-900 flex items-center justify-center">
                          <Zap className="w-3 h-3 mr-1" />
                          &lt; 3 sn
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Dil</div>
                        <div className="font-semibold text-gray-900">Türkçe</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CV Review Section - Quick Access */}
          <div className="mb-12">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                      <Star className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">CV Analizi ve İnceleme</h2>
                      <p className="text-indigo-100">CV'nizi AI ile analiz edin ve puanlayın</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">CV'nizi Analiz Edin</h3>
                  <p className="text-gray-600 mb-6">
                    Mevcut CV'lerinizi veya yeni bir CV dosyası yükleyerek detaylı analiz yapın
                  </p>
                  
                  {user?.premiumCredits && user.premiumCredits > 0 ? (
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link href="/cv-analysis">
                        <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center">
                          <Star className="w-5 h-5 mr-2" />
                          CV Analizi Yap (1 Kredi)
                        </button>
                      </Link>
                      
                      <Link href="/cv-analysis?upload=true">
                        <button className="bg-white border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-lg hover:bg-indigo-50 transition-all duration-200 flex items-center">
                          <Plus className="w-5 h-5 mr-2" />
                          Dosya Yükle
                        </button>
                      </Link>
                    </div>
                  ) : (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                      <div className="flex items-center justify-center mb-4">
                        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                          <Crown className="w-6 h-6 text-amber-600" />
                        </div>
                        <div className="text-left">
                          <h4 className="text-lg font-semibold text-amber-900">Kredi Gerekli</h4>
                          <p className="text-amber-700 text-sm">Yapay zeka destekli CV analizi - 1 Kredi</p>
                        </div>
                      </div>
                      <p className="text-amber-800 text-sm mb-4 text-center">
                        AI ile CV'nizi analiz edin, detaylı geri bildirim alın ve sektörle karşılaştırın.
                      </p>
                      <Link href="/premium">
                        <button className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium">
                          Kredi Satın Al
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* My CVs Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">CV'lerim</h2>
              <Link href="/my-cvs" className="text-yellow-600 hover:text-yellow-700 font-medium flex items-center">
                Tümünü Gör
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {cvsLoading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">CV'ler yükleniyor...</p>
              </div>
            ) : cvsError ? (
              <div className="text-center py-8">
                <p className="text-red-600 mb-4">CV'ler yüklenirken bir hata oluştu</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="text-yellow-600 hover:text-yellow-700"
                >
                  Tekrar Dene
                </button>
              </div>
            ) : !cvs || cvs.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz CV'niz yok</h3>
                <p className="text-gray-600 mb-6">
                  İlk CV'nizi oluşturarak başlayın ve profesyonel kariyerinize adım atın
                </p>
                <Link href="/create-cv?method=manual">
                  <button className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white px-6 py-3 rounded-lg hover:from-yellow-600 hover:to-amber-700 transition-all duration-200 flex items-center mx-auto">
                    <Plus className="w-5 h-5 mr-2" />
                    İlk CV'ni Oluştur
                  </button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cvs.slice(0, 6).map((cv) => (
                  <div key={cv.id} className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-200 border border-gray-200">
                    {/* CV Header */}
                    <div className="p-6 pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          cv.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {cv.status === 'completed' ? 'Tamamlandı' : 'Taslak'}
                        </span>

                        {/* Dropdown Menu */}
                        <div className="relative group/menu">
                          <button 
                            onClick={() => setOpenDropdown(openDropdown === cv.id ? null : cv.id)}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {openDropdown === cv.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                              <Link
                                href={`/create-cv/manual?edit=${cv.id}&template=${cv.templateId || cv.template || 'modern'}`}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
                                onClick={() => setOpenDropdown(null)}
                              >
                                <Edit3 className="w-4 h-4 mr-2" />
                                Düzenle
                              </Link>
                              <button
                                onClick={() => {
                                  handlePreviewCV(cv);
                                  setOpenDropdown(null);
                                }}
                                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Önizle
                              </button>
                              <hr className="border-gray-200" />
                              <button
                                onClick={() => {
                                  handleDeleteCV(cv.id);
                                  setOpenDropdown(null);
                                }}
                                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Sil
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Template Mini Preview */}
                      <div className={`aspect-[3/4] rounded-lg mb-4 overflow-hidden relative border-2 ${
                        getTemplateInfo(cv.templateId || 'modern').isPremium 
                          ? 'border-yellow-300' 
                          : 'border-gray-200'
                      }`}>
                        {/* Template Background */}
                        <div 
                          className="w-full h-full"
                          style={{
                            background: getTemplateInfo(cv.templateId || 'modern').isPremium
                              ? getTemplateInfo(cv.templateId || 'modern').id === 'executive'
                                ? 'linear-gradient(135deg, #1a1a1a 0%, #000 100%)'
                                : 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
                              : getTemplateInfo(cv.templateId || 'modern').id === 'classic'
                              ? 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'
                              : getTemplateInfo(cv.templateId || 'modern').id === 'minimal'
                              ? 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
                              : 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)'
                          }}
                        >
                          {/* Mini Content Lines */}
                          <div className="p-4 h-full flex flex-col justify-between">
                            {/* Header Section */}
                            <div className="space-y-2">
                              <div 
                                className="h-3 rounded-full"
                                style={{ 
                                  backgroundColor: getTemplateInfo(cv.templateId || 'modern').color,
                                  width: '70%' 
                                }}
                              ></div>
                              <div 
                                className="h-2 rounded-full opacity-60"
                                style={{ 
                                  backgroundColor: getTemplateInfo(cv.templateId || 'modern').color,
                                  width: '50%' 
                                }}
                              ></div>
                            </div>
                            
                            {/* Content Section */}
                            <div className="space-y-3">
                              <div className="space-y-1">
                                <div 
                                  className="h-1.5 rounded-full opacity-50"
                                  style={{ 
                                    backgroundColor: getTemplateInfo(cv.templateId || 'modern').color,
                                    width: '90%' 
                                  }}
                                ></div>
                                <div 
                                  className="h-1.5 rounded-full opacity-50"
                                  style={{ 
                                    backgroundColor: getTemplateInfo(cv.templateId || 'modern').color,
                                    width: '80%' 
                                  }}
                                ></div>
                                <div 
                                  className="h-1.5 rounded-full opacity-50"
                                  style={{ 
                                    backgroundColor: getTemplateInfo(cv.templateId || 'modern').color,
                                    width: '75%' 
                                  }}
                                ></div>
                              </div>

                              <div className="space-y-1">
                                <div 
                                  className="h-1 rounded-full opacity-40"
                                  style={{ 
                                    backgroundColor: getTemplateInfo(cv.templateId || 'modern').color,
                                    width: '85%' 
                                  }}
                                ></div>
                                <div 
                                  className="h-1 rounded-full opacity-40"
                                  style={{ 
                                    backgroundColor: getTemplateInfo(cv.templateId || 'modern').color,
                                    width: '70%' 
                                  }}
                                ></div>
                                <div 
                                  className="h-1 rounded-full opacity-40"
                                  style={{ 
                                    backgroundColor: getTemplateInfo(cv.templateId || 'modern').color,
                                    width: '60%' 
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>

                          {/* Premium Badge */}
                          {getTemplateInfo(cv.templateId || 'modern').isPremium && (
                            <div className="absolute top-2 right-2">
                              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                                getTemplateInfo(cv.templateId || 'modern').id === 'executive'
                                  ? 'bg-black text-yellow-400 border border-yellow-400'
                                  : 'bg-yellow-500 text-white'
                              }`}>
                                <Crown className="w-3 h-3" />
                                <span>{getTemplateInfo(cv.templateId || 'modern').id === 'executive' ? 'EXECUTIVE' : 'PREMIUM'}</span>
                              </div>
                            </div>
                          )}

                          {/* Template Color Indicator */}
                          <div 
                            className="absolute bottom-2 left-2 w-3 h-3 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: getTemplateInfo(cv.templateId || 'modern').color }}
                          ></div>

                          {/* Template Name */}
                          <div className="absolute bottom-2 right-2">
                            <span className="text-xs font-medium text-gray-600 bg-white/80 px-2 py-1 rounded-full">
                              {getTemplateInfo(cv.templateId || 'modern').name}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* CV Info */}
                      <div className="space-y-2">
                        <h3 className="font-semibold text-gray-900 text-lg truncate">
                          {cv.title || `İsimsiz CV ${cvs.findIndex(c => c.id === cv.id) + 1}`}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          Son güncelleme: {new Date(cv.updatedAt).toLocaleDateString('tr-TR')}
                        </div>
                      </div>
                    </div>

                    {/* CV Actions */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Link
                            href={`/create-cv/manual?edit=${cv.id}&template=${cv.templateId || cv.template || 'modern'}`}
                            className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium"
                          >
                            <Edit3 className="w-4 h-4 mr-2" />
                            Düzenle
                          </Link>
                          <button
                            onClick={() => handleDownloadCV(cv)}
                            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            İndir
                          </button>
                        </div>

                        <div className="flex items-center text-xs text-gray-500">
                          <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                          {cv.templateId === 'premium' ? 'Premium' :
                           cv.templateId === 'classic' ? 'Classic' :
                           cv.templateId === 'minimal' ? 'Minimal' : 'Modern'} Şablon
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <User className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Profil Tamamlanma</h3>
              <p className="text-3xl font-bold text-green-600">85%</p>
              <p className="text-sm text-gray-500 mt-1">Neredeyse tamam!</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Aktif CV'ler</h3>
              <p className="text-3xl font-bold text-yellow-600">{cvs?.length || 0}</p>
              <p className="text-sm text-gray-500 mt-1">Toplam CV sayısı</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Download className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">İndirmeler</h3>
              <p className="text-3xl font-bold text-blue-600">12</p>
              <p className="text-sm text-gray-500 mt-1">Bu ay</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
