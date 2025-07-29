'use client';

import React, { useState, useEffect } from 'react';
import { Star, AlertCircle, CheckCircle, TrendingUp, FileText, Award, User, Brain, Loader2, RefreshCw, Shield } from 'lucide-react';

interface CVReviewProps {
  cvData?: any;
  cvId?: string;
}

interface ReviewScore {
  category: string;
  score: number;
  maxScore: number;
  feedback: string;
  suggestions: string[];
  icon: React.ReactNode;
  color: string;
}

interface CVAnalysis {
  totalScore: number;
  maxTotalScore: number;
  grade: string;
  gradeColor: string;
  overallFeedback: string;
  scores: ReviewScore[];
  strengths: string[];
  improvements: string[];
  atsOptimization: string[]; // ATS optimizasyon önerileri
  industryComparison: {
    betterThan: number;
    industry: string;
  };
}

export default function CVReview({ cvData, cvId }: CVReviewProps) {
  const [analysis, setAnalysis] = useState<CVAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedCV, setSelectedCV] = useState<string>('');
  const [availableCVs, setAvailableCVs] = useState<any[]>([]);

  // Analysis state değişikliklerini debug et
  useEffect(() => {
    if (analysis) {
      console.log('Analysis state güncellendi:', analysis);
      console.log('ATS optimization array:', analysis.atsOptimization);
      console.log('ATS optimization length:', analysis.atsOptimization?.length);
    }
  }, [analysis]);

  useEffect(() => {
    // Kullanıcının CV'lerini getir
    fetchUserCVs();
  }, []);

  useEffect(() => {
    if (cvData || (cvId && selectedCV) || (selectedCV && !cvData)) {
      analyzeCV();
    }
  }, [cvData, cvId, selectedCV]);

  const fetchUserCVs = async () => {
    try {
      // Gerçek API çağrısı - sadece tamamlanan CV'leri getir
      const response = await fetch('/api/cv', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const cvs = await response.json();
        // Sadece tamamlanan CV'leri filtrele ve isim kontrolü yap
        const completedCVs = cvs.filter((cv: any) => 
          cv.isCompleted === true
        ).map((cv: any) => {
          // CV başlığını belirleme
          let title = 'İsimsiz CV';
          
          if (cv.title) {
            title = cv.title;
          } else if (cv.personalInfo) {
            const firstName = cv.personalInfo.firstName || '';
            const lastName = cv.personalInfo.lastName || '';
            const fullName = `${firstName} ${lastName}`.trim();
            if (fullName) {
              title = `${fullName} - CV`;
            }
          }
          
          return {
            id: cv.id,
            title: title,
            updatedAt: cv.updatedAt || cv.createdAt || new Date().toISOString()
          };
        });
        setAvailableCVs(completedCVs);
      } else {
        console.error('CV listesi alınamadı:', response.status);
        setAvailableCVs([]);
      }
    } catch (error) {
      console.error('CV listesi yüklenirken hata:', error);
      setAvailableCVs([]);
    }
  };

  const analyzeCV = async () => {
    setIsAnalyzing(true);
    console.log('CV analizi başlatılıyor...', {
      cvData: !!cvData,
      selectedCV,
      cvId
    });
    
    try {
      // Gerçek CV verisi varsa API'ye gönder
      if (cvData || selectedCV) {
        const requestBody = {
          cvData: cvData,
          cvId: selectedCV || cvId
        };
        console.log('API\'ye gönderilen veri:', requestBody);
        
        const response = await fetch('/api/cv-analysis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(requestBody)
        });
        
        console.log('API response status:', response.status);
        
        if (response.ok) {
          const analysisData = await response.json();
          console.log('API\'den gelen analiz verisi:', analysisData);
          console.log('ATS Optimizasyon önerileri:', analysisData.atsOptimization);
          setAnalysis(analysisData);
        } else {
          console.error('CV analizi başarısız:', response.status);
          const errorText = await response.text();
          console.error('Hata detayı:', errorText);
        }
      } else {
        console.log('CV verisi bulunamadı, analiz yapılamıyor');
      }
      
    } catch (error) {
      console.error('CV analizi sırasında hata:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeInfo = (totalScore: number) => {
    if (totalScore >= 90) return { grade: 'A+', color: 'text-green-600', bg: 'bg-green-100' };
    if (totalScore >= 80) return { grade: 'A', color: 'text-green-600', bg: 'bg-green-100' };
    if (totalScore >= 70) return { grade: 'B+', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (totalScore >= 60) return { grade: 'B', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (totalScore >= 50) return { grade: 'C+', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { grade: 'C', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const gradeInfo = analysis ? getGradeInfo(analysis.totalScore) : null;

  return (
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
          
          <button
            onClick={analyzeCV}
            disabled={isAnalyzing}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors flex items-center"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? 'Analiz Ediliyor' : 'Yeniden Analiz Et'}
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* CV Seçimi */}
        {!cvData && availableCVs.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Analiz Edilecek CV'yi Seçin
            </label>
            <select
              value={selectedCV}
              onChange={(e) => setSelectedCV(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">CV seçin...</option>
              {availableCVs.map((cv) => (
                <option key={cv.id} value={cv.id}>
                  {cv.title || 'İsimsiz CV'} - {new Date(cv.updatedAt).toLocaleDateString('tr-TR')}
                </option>
              ))}
            </select>
          </div>
        )}

        {isAnalyzing ? (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">CV Analiz Ediliyor</h3>
            <p className="text-gray-600">
              AI asistanımız CV'nizi detaylı bir şekilde inceliyor...
            </p>
          </div>
        ) : analysis ? (
          <div className="space-y-6">
            {/* Genel Puan */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Genel CV Puanı</h3>
                  <p className="text-gray-600">{analysis.overallFeedback}</p>
                </div>
                <div className="text-center">
                  <div className={`inline-flex items-center px-4 py-2 rounded-full ${gradeInfo?.bg} ${gradeInfo?.color} font-bold text-lg`}>
                    {gradeInfo?.grade}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mt-2">
                    {analysis.totalScore}/{analysis.maxTotalScore}
                  </div>
                </div>
              </div>

              {/* Puan Çubuğu */}
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 rounded-full transition-all duration-1000"
                  style={{ width: `${(analysis.totalScore / analysis.maxTotalScore) * 100}%` }}
                ></div>
              </div>

              <div className="text-center text-sm text-gray-600">
                Sektör ortalamasından <span className="font-semibold text-indigo-600">%{analysis.industryComparison.betterThan}</span> daha iyi 
                ({analysis.industryComparison.industry} sektörü)
              </div>
            </div>

            {/* Kategori Bazında Puanlar */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Kategori Bazında Analiz</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.scores.map((score, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 ${score.color} rounded-lg flex items-center justify-center text-white mr-3`}>
                          {score.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{score.category}</h4>
                          <p className="text-sm text-gray-600">{score.feedback}</p>
                        </div>
                      </div>
                      <div className={`text-lg font-bold ${getScoreColor(score.score, score.maxScore)}`}>
                        {score.score}/{score.maxScore}
                      </div>
                    </div>

                    {/* Kategori Puan Çubuğu */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div
                        className={`h-2 rounded-full transition-all duration-1000 ${score.color.replace('bg-', 'bg-')}`}
                        style={{ width: `${(score.score / score.maxScore) * 100}%` }}
                      ></div>
                    </div>

                    {/* Öneriler */}
                    {score.suggestions.length > 0 && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                        <p className="text-sm font-semibold text-blue-800 mb-2 flex items-center">
                          <span className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs mr-2">!</span>
                          Öneriler
                        </p>
                        <ul className="text-sm text-blue-700 space-y-2">
                          {score.suggestions.map((suggestion, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-blue-500 mr-2 font-bold">→</span>
                              <span className="leading-relaxed">{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Güçlü Yönler ve İyileştirme Alanları */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Güçlü Yönler */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 shadow-sm">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mr-4">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-green-800">Güçlü Yönleriniz</h3>
                    <p className="text-sm text-green-600">CV'nizde öne çıkan başarılı alanlar</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {analysis.strengths.map((strength, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-green-100 shadow-sm">
                      <div className="flex items-start">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                          <span className="text-green-600 text-sm font-bold">✓</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-green-800 font-medium leading-relaxed">{strength}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Güçlü Alanlar İstatistiği */}
                <div className="mt-6 p-4 bg-green-100 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-700">Güçlü Alanlar</span>
                    <span className="text-lg font-bold text-green-800">{analysis.strengths.length} alan</span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                    <div className="bg-green-500 h-2 rounded-full w-full"></div>
                  </div>
                </div>
              </div>

              {/* İyileştirme Alanları */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200 shadow-sm">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mr-4">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-orange-800">İyileştirme Alanları</h3>
                    <p className="text-sm text-orange-600">Geliştirebileceğiniz önemli noktalar</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {analysis.improvements.map((improvement, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-orange-100 shadow-sm">
                      <div className="flex items-start">
                        <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                          <span className="text-orange-600 text-sm font-bold">→</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-orange-800 font-medium leading-relaxed">{improvement}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* İyileştirme Alanları İstatistiği */}
                <div className="mt-6 p-4 bg-orange-100 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-orange-700">İyileştirme Gereken</span>
                    <span className="text-lg font-bold text-orange-800">{analysis.improvements.length} alan</span>
                  </div>
                  <div className="w-full bg-orange-200 rounded-full h-2 mt-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${Math.min((analysis.improvements.length / 5) * 100, 100)}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* ATS Optimizasyon Önerileri - Daha Görünür */}
            {analysis.atsOptimization && analysis.atsOptimization.length > 0 ? (
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-8 border-2 border-purple-200 shadow-lg">
                <div className="flex items-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mr-6 shadow-lg">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-purple-800 mb-2">🚀 ATS Optimizasyon Önerileri</h3>
                    <p className="text-lg text-purple-600">Başvuru takip sistemleri (ATS) için CV optimizasyonu</p>
                    <div className="mt-2 px-3 py-1 bg-purple-100 rounded-full inline-block">
                      <span className="text-sm font-semibold text-purple-700">
                        {analysis.atsOptimization.length} öneri mevcut
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {analysis.atsOptimization.map((suggestion, index) => (
                    <div key={index} className="bg-white rounded-xl p-5 border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-4 mt-1 shadow-sm">
                          <span className="text-white text-sm font-bold">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-purple-800 font-medium leading-relaxed text-base">{suggestion}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* ATS Uyumluluk Skoru */}
                <div className="bg-white rounded-xl p-6 border-2 border-purple-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Shield className="w-6 h-6 text-purple-600 mr-3" />
                      <span className="text-lg font-bold text-purple-700">ATS Geçiş Skoru</span>
                    </div>
                    <span className="text-2xl font-bold text-purple-800">
                      %{Math.min(85, Math.max(60, 100 - analysis.atsOptimization.length * 5))}
                    </span>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-3 mb-3">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-1000" 
                      style={{ width: `${Math.min(85, Math.max(60, 100 - analysis.atsOptimization.length * 5))}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-purple-600">
                    💡 Yukarıdaki önerileri uygulayarak ATS sistemlerde %95+ geçiş oranı elde edebilirsiniz
                  </p>
                </div>
              </div>
            ) : (
              /* API'den ATS önerileri gelmediğinde gösterilecek bölüm */
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-8 border-2 border-yellow-200 shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mr-6 shadow-lg">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-yellow-800 mb-2">⚠️ ATS Optimizasyon Önerileri</h3>
                    <p className="text-lg text-yellow-600">Başvuru takip sistemleri için öneriler yükleniyor...</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 border border-yellow-200">
                  <p className="text-yellow-700 text-center">
                    API'den ATS optimizasyon önerileri alınamadı. Lütfen tekrar deneyin veya destek ekibiyle iletişime geçin.
                  </p>
                </div>
              </div>
            )}

            {/* Detaylı Öneriler Bölümü */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center mr-4">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-indigo-800">AI Önerileri</h3>
                  <p className="text-sm text-indigo-600">Kategori bazında detaylı geliştirme önerileri</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.scores.filter(score => score.suggestions.length > 0).map((score, index) => (
                  <div key={index} className="bg-white rounded-lg p-5 border border-indigo-100 shadow-sm">
                    <div className="flex items-center mb-4">
                      <div className={`w-8 h-8 ${score.color} rounded-lg flex items-center justify-center text-white mr-3`}>
                        {score.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{score.category}</h4>
                        <p className="text-sm text-gray-600">Puan: {score.score}/{score.maxScore}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {score.suggestions.map((suggestion, idx) => (
                        <div key={idx} className="flex items-start p-3 bg-indigo-50 rounded-lg">
                          <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                            <span className="text-white text-xs font-bold">{idx + 1}</span>
                          </div>
                          <p className="text-indigo-800 text-sm leading-relaxed">{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Eylem Butonları */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center mr-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Önerilen Eylemler</h3>
                  <p className="text-sm text-gray-600">CV'nizi geliştirmek için atmanız gereken adımlar</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-4 rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 flex items-center justify-center group shadow-lg">
                  <FileText className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <div className="font-semibold">CV'yi Düzenle</div>
                    <div className="text-xs text-indigo-200">Önerileri uygula</div>
                  </div>
                </button>
                
                <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-4 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 flex items-center justify-center group shadow-lg">
                  <Star className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <div className="font-semibold">Yeni Analiz</div>
                    <div className="text-xs text-purple-200">Tekrar değerlendir</div>
                  </div>
                </button>
                
                <button className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center justify-center group shadow-lg">
                  <Award className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <div className="font-semibold">Raporu İndir</div>
                    <div className="text-xs text-green-200">PDF olarak kaydet</div>
                  </div>
                </button>
              </div>
              
              {/* Gelişim Önerisi */}
              <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 text-sm font-bold">💡</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Önerilen öncelik: <span className="text-blue-600 font-bold">İş deneyimi detaylarını güçlendirin</span>
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Bu değişiklik puanınızı yaklaşık 10-15 puan artırabilir
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">CV Analizi</h3>
            <p className="text-gray-600 mb-6">
              {availableCVs.length > 0 
                ? 'Yukarıdan bir CV seçin ve analiz başlasın' 
                : 'Önce bir CV oluşturun, sonra analizini yapın'
              }
            </p>
            {availableCVs.length === 0 && (
              <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
                CV Oluşturmaya Başla
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
