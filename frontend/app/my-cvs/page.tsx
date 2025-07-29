'use client';

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useCVs } from "@/lib/hooks/use-cvs";
import { PDFClient } from "@/lib/pdf-client";
import { api } from "@/lib/api";
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  Edit, 
  Copy, 
  Trash2, 
  Eye,
  Plus,
  Search,
  Filter,
  Calendar,
  MoreVertical,
  Brain,
  Users,
  Crown
} from "lucide-react";
import Link from "next/link";
import Breadcrumb from "@/components/ui/breadcrumb";
import { TEMPLATE_DEFINITIONS, TemplateId } from "@/lib/types/templates";

// Template bilgilerini almak için yardımcı fonksiyon
const getTemplateInfo = (templateId: string) => {
  return TEMPLATE_DEFINITIONS[templateId as TemplateId] || TEMPLATE_DEFINITIONS.modern;
};

export default function MyCVsPage() {
  const { user, isLoading } = useAuth();
  const { cvs, loading: cvsLoading, error: cvsError, deleteCV, duplicateCV } = useCVs();
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'draft'>('all');

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'CV\'lerim', current: true }
  ];

  const handleDeleteCV = async (id: string) => {
    if (window.confirm('Bu CV\'yi silmek istediğinizden emin misiniz?')) {
      await deleteCV(id);
    }
  };

  const handleDuplicateCV = async (id: string) => {
    await duplicateCV(id);
  };

  const handleDownloadCV = async (cv: any) => {
    try {
      setIsGenerating(true);
      // Backend'den CV verilerini al
      const response = await api.get(`/cv/${cv.id}`);
      const cvData = response.data;
      
      // Yeni PDF Client API'sini kullan
      await PDFClient.downloadPDF(cvData, cv.template || 'modern');
    } catch (error) {
      // Error downloading CV
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreviewCV = async (cv: any) => {
    try {
      setIsGenerating(true);
      // PDF önizleme fonksiyonu - yeni sekmede aç
      const { downloadPDF } = await import('@/lib/pdf-client');
      await downloadPDF(cv, cv.templateId || cv.template || 'modern');
    } catch (error) {
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Erişim Reddedildi</h1>
          <p className="text-gray-600 mb-4">Bu sayfayı görüntülemek için giriş yapmalısınız.</p>
          <Link href="/" className="text-yellow-600 hover:text-yellow-700">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  const filteredCVs = cvs.filter(cv => {
    const matchesSearch = cv.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || cv.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex items-center mb-4 lg:mb-0">
            <Link 
              href="/dashboard"
              className="mr-4 p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">CV'lerim</h1>
              <p className="text-gray-600 mt-1">
                {cvsLoading ? 'Yükleniyor...' : `${cvs.length} CV bulundu`}
              </p>
            </div>
          </div>
          
          <Link
            href="/create-cv"
            className="inline-flex items-center px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            Yeni CV Oluştur
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="CV ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'completed' | 'draft')}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="completed">Tamamlanan</option>
                <option value="draft">Taslak</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        {cvsLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-600">CV'ler yükleniyor...</p>
          </div>
        ) : cvsError ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-12 h-12 text-red-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Hata Oluştu</h3>
            <p className="text-gray-600 mb-6">{cvsError}</p>
          </div>
        ) : filteredCVs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filterStatus !== 'all' ? 'CV bulunamadı' : 'Henüz CV oluşturmamışsın'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== 'all' 
                ? 'Arama kriterlerinizi değiştirmeyi deneyin.' 
                : 'İlk CV\'ini oluşturarak başla!'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <Link
                href="/create-cv"
                className="inline-flex items-center px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                İlk CV'imi Oluştur
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCVs.map((cv) => (
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
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-200 z-10">
                        <Link
                          href={`/create-cv/manual?edit=${cv.id}&template=${cv.templateId || cv.template || 'modern'}`}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Düzenle
                        </Link>
                        <button
                          onClick={() => handlePreviewCV(cv)}
                          disabled={isGenerating}
                          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Önizle
                        </button>
                        <hr className="border-gray-200" />
                        <button
                          onClick={() => handleDeleteCV(cv.id)}
                          className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Sil
                        </button>
                      </div>
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
                            cv.templateId === 'executive' 
                              ? 'bg-black text-white border border-yellow-400' 
                              : 'bg-yellow-500 text-white'
                          }`}>
                            <Crown className="w-3 h-3" />
                            <span>PREMIUM</span>
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
                      {cv.title || `İsimsiz CV ${filteredCVs.findIndex(c => c.id === cv.id) + 1}`}
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
                        <Edit className="w-4 h-4 mr-2" />
                        Düzenle
                      </Link>
                      <button
                        onClick={() => handleDownloadCV(cv)}
                        disabled={isGenerating}
                        className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        İndir
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePreviewCV(cv)}
                        disabled={isGenerating}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Önizle"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCV(cv.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {cvs.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900">{cvs.length}</h4>
              <p className="text-gray-600">Toplam CV</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900">
                {cvs.filter(cv => cv.status === 'completed').length}
              </h4>
              <p className="text-gray-600">Tamamlanan</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Brain className="w-6 h-6 text-yellow-600" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900">
                {cvs.filter(cv => cv.status === 'draft').length}
              </h4>
              <p className="text-gray-600">Taslak</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
