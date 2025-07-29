'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useAuth } from "@/lib/auth-context";
import { imageKitService } from "@/lib/imagekit";
import { useSearchParams } from 'next/navigation';
import { 
  Upload, Star, AlertCircle, CheckCircle, TrendingUp, Award, 
  Brain, Loader2, RefreshCw, ArrowLeft, Download, X, Plus,
  Briefcase, GraduationCap, User,
  Zap, Target, Shield, Rocket, BarChart, Globe, Settings, ChevronRight,
  Home, BarChart3, Sparkles, Gauge, Clock, Users
} from 'lucide-react';
import Link from "next/link";

function CVAnalysisContent() {
  const { user, isLoading, deductPremiumCredit } = useAuth();
  
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analysisCategories = [
    {
      key: 'personal_info',
      title: 'Kişisel Bilgiler',
      icon: <User className="w-5 h-5" />,
      color: 'blue'
    },
    {
      key: 'experience',
      title: 'İş Deneyimi',
      icon: <Award className="w-5 h-5" />,
      color: 'green'
    },
    {
      key: 'education',
      title: 'Eğitim',
      icon: <Star className="w-5 h-5" />,
      color: 'purple'
    },
    {
      key: 'skills',
      title: 'Yetenekler',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'orange'
    },
    {
      key: 'ats_compatibility',
      title: 'ATS Uyumluluğu',
      icon: <Shield className="w-5 h-5" />,
      color: 'red'
    }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        setUploadedFile(file);
        setError(null);
      } else {
        setError('Lütfen PDF veya resim dosyası seçin.');
      }
    }
  };

  const performAnalysis = async () => {
    if (!uploadedFile) {
      setError('Lütfen analiz edilecek bir PDF dosyası yükleyin.');
      return;
    }

    if (!user?.premiumCredits || user.premiumCredits <= 0) {
      setError('Premium krediniz bulunmamaktadır. Lütfen kredi satın alın.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // PDF dosyasını ImageKit'e yükle
      try {
        const pdfUrl = await imageKitService.uploadCV(uploadedFile);
        
        const response = await fetch('/api/cv-analysis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            analysisType: 'pdf-upload',
            pdfUrl: pdfUrl,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Analiz hatası: ${response.status} - Lütfen tekrar deneyin`);
        }

        const analysisResponse = await response.json();
        
        if (analysisResponse?.success && analysisResponse?.analysis) {
          setAnalysisResult(analysisResponse.analysis);
          setShowResults(true);
          
          // Premium kredi düş
          await deductPremiumCredit();
        } else {
          throw new Error(analysisResponse?.error || 'Analiz sonucu alınamadı');
        }
        
      } catch (uploadError) {
        throw new Error(`CV analizi hatası: ${uploadError instanceof Error ? uploadError.message : 'Bilinmeyen hata. Lütfen dosyanızı kontrol edip tekrar deneyin.'}`);
      }

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Analiz sırasında bir hata oluştu');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Navigation */}
     

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-25">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-30"></div>
            <div className="relative w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <Rocket className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI CV Analizi
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            🚀 Next-Gen yapay zeka ile CV'nizi <span className="text-blue-600 font-semibold">ATS sistemleri</span> için optimize edin. 
            Gelişmiş algoritma ile <span className="text-purple-600 font-semibold">rekabet avantajı</span> kazanın.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-12">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">97%</div>
              <div className="text-gray-600 text-sm">ATS Geçiş Oranı</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">15K+</div>
              <div className="text-gray-600 text-sm">Analiz Edilen CV</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
              <div className="text-3xl font-bold text-pink-600 mb-2">4.9/5</div>
              <div className="text-gray-600 text-sm">Kullanıcı Puanı</div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center">
              <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Analysis Mode Selection */}
        {!showResults && (
          <div className="mb-12">
            <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-xl">
              <div className="text-center mb-8">
                <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-2">CV Dosyası Yükleyin</h2>
                <p className="text-gray-600">PDF formatında CV'nizi yükleyerek AI analizi başlatın</p>
              </div>

              {/* PDF Upload Content */}
              <div className="bg-purple-50 rounded-2xl p-8 border border-purple-200">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">CV Dosyası Yükleyin</h3>
                  <p className="text-gray-600">PDF formatında CV'nizi yükleyerek analiz edin</p>
                </div>

                <div className="max-w-md mx-auto">
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="cv-file-upload"
                  />
                  <label
                    htmlFor="cv-file-upload"
                    className={`block w-full py-8 px-6 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all duration-200 ${
                      uploadedFile 
                        ? 'border-purple-500 bg-purple-100' 
                        : 'border-gray-300 bg-white hover:border-purple-400 hover:bg-purple-50'
                    }`}
                  >
                    {uploadedFile ? (
                      <div className="text-purple-700">
                        <CheckCircle className="w-12 h-12 mx-auto mb-4" />
                        <p className="font-semibold text-lg">{uploadedFile.name}</p>
                        <p className="text-sm text-purple-600 mt-1">Dosya başarıyla yüklendi</p>
                        <p className="text-xs text-purple-500 mt-2">Farklı dosya yüklemek için tıklayın</p>
                      </div>
                    ) : (
                      <div className="text-gray-600">
                        <Upload className="w-12 h-12 mx-auto mb-4" />
                        <p className="font-semibold text-lg">CV dosyanızı buraya sürükleyin</p>
                        <p className="text-sm mt-1">veya dosya seçmek için tıklayın</p>
                        <p className="text-xs text-gray-500 mt-3">PDF, JPG veya PNG formatı desteklenir</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Analysis Button */}
              <div className="text-center mt-10">
                <button
                  onClick={performAnalysis}
                  disabled={isAnalyzing || !uploadedFile}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-xl"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                      AI Analiz Yapıyor...
                    </>
                  ) : (
                    <>
                      <Zap className="w-6 h-6 mr-3" />
                      AI Analizini Başlat
                    </>
                  )}
                </button>
                
                {user?.premiumCredits !== undefined && (
                  <p className="mt-4 text-sm text-gray-600">
                    Kalan Premium Krediniz: <span className="font-semibold text-blue-600">{user.premiumCredits}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {showResults && analysisResult && (
          <div className="space-y-8">
            {/* Overall Score - ATS odaklı */}
            <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-2xl">
              <div className="text-center mb-8">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-30"></div>
                  <div className="relative w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
                    <span className="text-4xl font-bold text-white">{analysisResult?.overall_score || 0}</span>
                  </div>
                </div>
                
                <h2 className="text-4xl font-bold text-gray-900 mb-4">ATS UYUMLULUK SKORU</h2>
                <p className="text-xl text-gray-600 font-medium mb-6">
                  Applicant Tracking Systems için optimize edilmiş puanlama
                </p>
                
                <div className={`inline-block px-8 py-4 rounded-2xl font-bold text-xl ${
                  (analysisResult?.overall_score || 0) >= 70 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                    : (analysisResult?.overall_score || 0) >= 50
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                    : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                }`}>
                  {(analysisResult?.overall_score || 0) >= 70 
                    ? '🎯 ATS SİSTEMLERİNDE BAŞARILI GEÇİŞ BEKLENİR' 
                    : (analysisResult?.overall_score || 0) >= 50
                    ? '⚠️ ATS SİSTEMLERİNDE İYİLEŞTİRME GEREKİYOR'
                    : '❌ ATS SİSTEMLERİNDE REDDEDİLME RİSKİ YÜKSEK'}
                </div>
              </div>

              {/* Category Scores */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {analysisCategories.map((category) => {
                  const score = analysisResult?.sections?.[category.key]?.score || 0;
                  const feedback = analysisResult?.sections?.[category.key]?.feedback || '';
                  
                  return (
                    <div key={category.key} className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mr-4">
                          {category.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{category.title}</h3>
                          <p className="text-sm text-gray-600">Puan: {score}/100</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div 
                          className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000"
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600">{feedback}</p>
                    </div>
                  );
                })}
              </div>

              {/* Extracted Data from PDF - Yeni Bölüm */}
              {analysisResult?.extracted_data && (
                <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-lg mb-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">📄 PDF'den Çıkarılan Veriler</h3>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Kişisel Bilgiler */}
                    {analysisResult.extracted_data.personal_info && (
                      <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                          <User className="w-5 h-5 mr-2 text-green-600" />
                          Kişisel Bilgiler
                        </h4>
                        <div className="space-y-3">
                          {analysisResult.extracted_data.personal_info.full_name && (
                            <div>
                              <span className="text-sm font-medium text-gray-600">Ad Soyad:</span>
                              <p className="text-gray-900 font-medium">{analysisResult.extracted_data.personal_info.full_name}</p>
                            </div>
                          )}
                          {analysisResult.extracted_data.personal_info.email && (
                            <div>
                              <span className="text-sm font-medium text-gray-600">E-posta:</span>
                              <p className="text-gray-900">{analysisResult.extracted_data.personal_info.email}</p>
                            </div>
                          )}
                          {analysisResult.extracted_data.personal_info.phone && (
                            <div>
                              <span className="text-sm font-medium text-gray-600">Telefon:</span>
                              <p className="text-gray-900">{analysisResult.extracted_data.personal_info.phone}</p>
                            </div>
                          )}
                          {analysisResult.extracted_data.personal_info.address && (
                            <div>
                              <span className="text-sm font-medium text-gray-600">Adres:</span>
                              <p className="text-gray-900">{analysisResult.extracted_data.personal_info.address}</p>
                            </div>
                          )}
                          {analysisResult.extracted_data.personal_info.linkedin && (
                            <div>
                              <span className="text-sm font-medium text-gray-600">LinkedIn:</span>
                              <p className="text-gray-900">{analysisResult.extracted_data.personal_info.linkedin}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* İş Deneyimi */}
                    {analysisResult.extracted_data.work_experience && analysisResult.extracted_data.work_experience.length > 0 && (
                      <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                          <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                          İş Deneyimi
                        </h4>
                        <div className="space-y-4">
                          {analysisResult.extracted_data.work_experience.slice(0, 3).map((exp: any, index: number) => (
                            <div key={index} className="border-l-4 border-blue-400 pl-4">
                              <h5 className="font-semibold text-gray-900">{exp.position}</h5>
                              <p className="text-sm text-blue-600 font-medium">{exp.company}</p>
                              <p className="text-xs text-gray-600">{exp.start_date} - {exp.end_date}</p>
                              {exp.description && (
                                <p className="text-sm text-gray-700 mt-2 line-clamp-2">{exp.description}</p>
                              )}
                            </div>
                          ))}
                          {analysisResult.extracted_data.work_experience.length > 3 && (
                            <p className="text-sm text-gray-600 italic">+ {analysisResult.extracted_data.work_experience.length - 3} deneyim daha...</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Eğitim */}
                    {analysisResult.extracted_data.education && analysisResult.extracted_data.education.length > 0 && (
                      <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
                        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                          <GraduationCap className="w-5 h-5 mr-2 text-purple-600" />
                          Eğitim
                        </h4>
                        <div className="space-y-3">
                          {analysisResult.extracted_data.education.map((edu: any, index: number) => (
                            <div key={index} className="border-l-4 border-purple-400 pl-4">
                              <h5 className="font-semibold text-gray-900">{edu.degree}</h5>
                              <p className="text-sm text-purple-600 font-medium">{edu.school}</p>
                              <p className="text-xs text-gray-600">{edu.start_date} - {edu.end_date}</p>
                              {edu.field && (
                                <p className="text-sm text-gray-700">{edu.field}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Yetenekler */}
                    {analysisResult.extracted_data.skills && (
                      <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200">
                        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                          <Award className="w-5 h-5 mr-2 text-orange-600" />
                          Yetenekler
                        </h4>
                        <div className="space-y-4">
                          {analysisResult.extracted_data.skills.technical && analysisResult.extracted_data.skills.technical.length > 0 && (
                            <div>
                              <span className="text-sm font-medium text-gray-600 block mb-2">Teknik Beceriler:</span>
                              <div className="flex flex-wrap gap-2">
                                {analysisResult.extracted_data.skills.technical.slice(0, 8).map((skill: string, index: number) => (
                                  <span key={index} className="px-3 py-1 bg-orange-200 text-orange-800 rounded-full text-xs font-medium">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {analysisResult.extracted_data.skills.languages && analysisResult.extracted_data.skills.languages.length > 0 && (
                            <div>
                              <span className="text-sm font-medium text-gray-600 block mb-2">Diller:</span>
                              <div className="flex flex-wrap gap-2">
                                {analysisResult.extracted_data.skills.languages.map((lang: string, index: number) => (
                                  <span key={index} className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-medium">
                                    {lang}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Summary */}
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">📋 Analiz Özeti</h3>
                <p className="text-gray-700 leading-relaxed">{analysisResult?.summary || 'Analiz özeti yükleniyor...'}</p>
              </div>
            </div>

            {/* ATS Analysis - Ana görüntü haline getirildi */}
            {analysisResult?.ats_analysis && (
              <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-2xl">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mr-4">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900">🤖 ATS UYUMLULUK DEĞERLENDİRMESİ</h3>
                    <p className="text-gray-600 font-medium">Applicant Tracking Systems için detaylı analiz</p>
                  </div>
                </div>

                {/* ATS Skor - Büyük gösterim */}
                <div className="mb-8 p-8 bg-blue-50 rounded-2xl border border-blue-200">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-blue-600 mb-4">
                      {analysisResult.ats_analysis.overall_ats_score || analysisResult.ats_analysis.overall_score || 0}
                    </div>
                    <div className="text-2xl text-gray-900 mb-6">ATS UYUMLULUK PUANI</div>
                    <div className="w-full bg-gray-200 rounded-full h-6 mb-6">
                      <div 
                        className={`h-6 rounded-full transition-all duration-1000 ${
                          (analysisResult.ats_analysis.overall_ats_score || analysisResult.ats_analysis.overall_score || 0) >= 70 
                            ? 'bg-gradient-to-r from-green-500 to-green-600' 
                            : (analysisResult.ats_analysis.overall_ats_score || analysisResult.ats_analysis.overall_score || 0) >= 50
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                            : 'bg-gradient-to-r from-red-500 to-red-600'
                        }`}
                        style={{ width: `${analysisResult.ats_analysis.overall_ats_score || analysisResult.ats_analysis.overall_score || 0}%` }}
                      ></div>
                    </div>
                    <div className={`font-bold text-xl ${
                      (analysisResult.ats_analysis.overall_ats_score || analysisResult.ats_analysis.overall_score || 0) >= 70 
                        ? 'text-green-600' 
                        : (analysisResult.ats_analysis.overall_ats_score || analysisResult.ats_analysis.overall_score || 0) >= 50
                        ? 'text-orange-600'
                        : 'text-red-600'
                    }`}>
                      {(analysisResult.ats_analysis.overall_ats_score || analysisResult.ats_analysis.overall_score || 0) >= 70 
                        ? '✅ ATS UYUMLU - Sistemlerden geçecek' 
                        : (analysisResult.ats_analysis.overall_ats_score || analysisResult.ats_analysis.overall_score || 0) >= 50
                        ? '⚠️ ATS ORTA - İyileştirme gerekli'
                        : '❌ ATS UYUMSUZ - Sistem tarafından reddedilir'}
                    </div>
                  </div>
                </div>

                {/* ATS Detayları */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-6 text-xl flex items-center">
                      <Target className="w-6 h-6 mr-2 text-blue-600" />
                      ATS Kritik Başarı Faktörleri
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Anahtar Kelime Yoğunluğu</span>
                        <span className="font-semibold text-blue-600">{analysisResult.ats_analysis.keyword_density || 'Değerlendiriliyor'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Bölüm Tanıma Başarısı</span>
                        <span className="font-semibold text-blue-600">{analysisResult.ats_analysis.section_recognition || analysisResult.ats_analysis.section_detection || 'Değerlendiriliyor'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">İletişim Bilgisi Çıkarma</span>
                        <span className="font-semibold text-blue-600">{analysisResult.ats_analysis.contact_extraction || 'Değerlendiriliyor'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Format Ayrıştırma</span>
                        <span className="font-semibold text-blue-600">{analysisResult.ats_analysis.formatting || analysisResult.ats_analysis.format_parsing || 'Değerlendiriliyor'}</span>
                      </div>
                      {analysisResult.ats_analysis.pass_probability && (
                        <div className="pt-4 border-t border-gray-200">
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-gray-900">Eleme Geçiş Olasılığı:</span>
                            <span className="text-green-600">{analysisResult.ats_analysis.pass_probability}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-6 text-xl flex items-center">
                      <Rocket className="w-6 h-6 mr-2 text-purple-600" />
                      ATS Optimizasyon Önerileri
                    </h4>
                    
                    {(analysisResult.ats_analysis?.recommendations && analysisResult.ats_analysis.recommendations.length > 0) ? (
                      <ul className="space-y-4">
                        {analysisResult.ats_analysis.recommendations.slice(0, 6).map((rec: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                              <span className="text-xs font-bold text-white">{index + 1}</span>
                            </div>
                            <span className="text-gray-700">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-gray-500 mb-4">
                          <Rocket className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>ATS optimizasyon önerileri yükleniyor...</p>
                        </div>
                        
                        {/* Fallback öneriler */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <p className="text-yellow-800 font-medium mb-3">Genel ATS Optimizasyon Önerileri:</p>
                          <ul className="space-y-2 text-left">
                            <li className="flex items-start">
                              <span className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                                <span className="text-xs font-bold text-white">1</span>
                              </span>
                              <span className="text-yellow-800 text-sm">İş ilanındaki anahtar kelimeleri CV'nizde kullanın</span>
                            </li>
                            <li className="flex items-start">
                              <span className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                                <span className="text-xs font-bold text-white">2</span>
                              </span>
                              <span className="text-yellow-800 text-sm">Standart bölüm başlıkları kullanın (İş Deneyimi, Eğitim, Yetenekler)</span>
                            </li>
                            <li className="flex items-start">
                              <span className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                                <span className="text-xs font-bold text-white">3</span>
                              </span>
                              <span className="text-yellow-800 text-sm">PDF formatında kaydedin, karmaşık tablolardan kaçının</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* ATS Uyumluluk Durumu */}
                <div className="mt-8 p-8 bg-gray-50 rounded-2xl border border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-4 text-xl flex items-center">
                    <BarChart className="w-6 h-6 mr-2 text-cyan-600" />
                    ATS Sistem Uyumluluğu
                  </h4>
                  <div className="text-center p-6 rounded-xl" style={{
                    backgroundColor: (analysisResult.ats_analysis.overall_ats_score || analysisResult.ats_analysis.overall_score || 0) >= 70 
                      ? 'rgba(34, 197, 94, 0.1)' : (analysisResult.ats_analysis.overall_ats_score || analysisResult.ats_analysis.overall_score || 0) >= 50 
                      ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    border: `2px solid ${(analysisResult.ats_analysis.overall_ats_score || analysisResult.ats_analysis.overall_score || 0) >= 70 
                      ? '#22c55e' : (analysisResult.ats_analysis.overall_ats_score || analysisResult.ats_analysis.overall_score || 0) >= 50 
                      ? '#f59e0b' : '#ef4444'}`
                  }}>
                    <div className="font-bold text-2xl mb-3 text-gray-900">
                      {analysisResult.ats_compatibility || 'ATS Değerlendirmesi yapılıyor...'}
                    </div>
                    {analysisResult.ats_analysis.parsing_success_rate && (
                      <div className="text-gray-700">
                        {analysisResult.ats_analysis.parsing_success_rate}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="text-center space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => {
                    setShowResults(false);
                    setAnalysisResult(null);
                    setUploadedFile(null);
                  }}
                  className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 border border-gray-200"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Yeni Analiz Yap
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CVAnalysisPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Yükleniyor...</span>
        </div>
      </div>
    }>
      <CVAnalysisContent />
    </Suspense>
  );
}
