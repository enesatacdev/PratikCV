'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Download, Edit3, Share2 } from 'lucide-react';
import Link from 'next/link';

export default function CVPreviewPage() {
  const params = useParams();
  const cvId = params.id as string;
  const [cvData, setCvData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // CV verilerini getir
    fetchCVData();
  }, [cvId]);

  const fetchCVData = async () => {
    try {
      setLoading(true);
      // Mock CV data - gerçek projede API'den gelecek
      setTimeout(() => {
        const mockCV = {
          id: cvId,
          personalInfo: {
            fullName: 'Ahmet Yılmaz',
            email: 'ahmet@example.com',
            phone: '+90 555 123 4567',
            address: 'İstanbul, Türkiye',
            summary: 'Deneyimli frontend geliştirici'
          },
          experience: [
            {
              company: 'TechCorp',
              position: 'Senior Frontend Developer',
              startDate: '2022-01',
              endDate: 'current',
              description: 'React ve TypeScript ile modern web uygulamaları geliştirme'
            }
          ],
          education: [
            {
              school: 'İstanbul Teknik Üniversitesi',
              degree: 'Bilgisayar Mühendisliği',
              startDate: '2018',
              endDate: '2022'
            }
          ],
          skills: {
            technical: ['.NET', 'C#', 'React', 'TypeScript', 'SQL Server'],
            personal: ['Problem Çözme', 'Takım Çalışması', 'Liderlik'],
            languages: [
              { language: 'Türkçe', level: 5 },
              { language: 'İngilizce', level: 4 },
              { language: 'Almanca', level: 2 }
            ]
          },
          references: [
            {
              name: 'Ali Veli',
              position: 'Proje Yöneticisi',
              company: 'TechCorp',
              phone: '+90 555 987 6543',
              email: 'ali.veli@techcorp.com'
            }
          ]
        };
        setCvData(mockCV);
        setLoading(false);
      }, 1000);
    } catch (error) {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">CV yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!cvData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">CV Bulunamadı</h1>
          <Link href="/dashboard">
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
              Dashboard'a Dön
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/dashboard" className="mr-4">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                {cvData.personalInfo.fullName} - CV Önizleme
              </h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                <Share2 className="w-4 h-4 mr-2" />
                Paylaş
              </button>
              <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                PDF İndir
              </button>
              <Link href={`/create-cv/manual?edit=${cvId}`}>
                <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Düzenle
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* CV Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="aspect-[8.5/11] bg-white p-8" style={{ minHeight: '1100px' }}>
            {/* Modern CV Template */}
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="border-b-2 border-indigo-600 pb-6 mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {cvData.personalInfo.fullName}
                </h1>
                <div className="text-gray-600 space-y-1">
                  <p>{cvData.personalInfo.email}</p>
                  <p>{cvData.personalInfo.phone}</p>
                  <p>{cvData.personalInfo.address}</p>
                </div>
                {cvData.personalInfo.summary && (
                  <p className="mt-4 text-gray-700 leading-relaxed">
                    {cvData.personalInfo.summary}
                  </p>
                )}
              </div>

              {/* Experience */}
              {cvData.experience && cvData.experience.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-indigo-600 mb-4 border-b border-gray-200 pb-2">
                    İş Deneyimi
                  </h2>
                  <div className="space-y-4">
                    {cvData.experience.map((exp: any, index: number) => (
                      <div key={index}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                            <p className="text-indigo-600 font-medium">{exp.company}</p>
                          </div>
                          <span className="text-sm text-gray-500">
                            {exp.startDate} - {exp.endDate === 'current' ? 'Devam ediyor' : exp.endDate}
                          </span>
                        </div>
                        {exp.description && (
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {cvData.education && cvData.education.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-indigo-600 mb-4 border-b border-gray-200 pb-2">
                    Eğitim
                  </h2>
                  <div className="space-y-3">
                    {cvData.education.map((edu: any, index: number) => (
                      <div key={index} className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                          <p className="text-gray-600">{edu.school}</p>
                        </div>
                        <span className="text-sm text-gray-500">
                          {edu.startDate} - {edu.endDate}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {cvData.skills && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-indigo-600 mb-4 border-b border-gray-200 pb-2">
                    Yetenekler
                  </h2>
                  <div className="space-y-6">
                    {/* Technical Skills */}
                    {cvData.skills.technical && cvData.skills.technical.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Teknik Yetenekler</h3>
                        <div className="flex flex-wrap gap-2">
                          {cvData.skills.technical.map((skill: string, index: number) => (
                            <span
                              key={index}
                              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md font-medium border-2 border-blue-500"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Personal Skills */}
                    {cvData.skills.personal && cvData.skills.personal.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Kişisel Yetenekler</h3>
                        <div className="flex flex-wrap gap-2">
                          {cvData.skills.personal.map((skill: string, index: number) => (
                            <span
                              key={index}
                              className="px-4 py-2 bg-green-500 text-white text-sm rounded-md font-medium border-2 border-green-500"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Languages */}
                    {cvData.skills.languages && cvData.skills.languages.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Diller</h3>
                        <div className="space-y-3">
                          {cvData.skills.languages.map((language: any, index: number) => (
                            <div key={index} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border">
                              <span className="font-medium text-gray-900">
                                {typeof language === 'string' ? language : language.language}
                              </span>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((dot) => (
                                  <span
                                    key={dot}
                                    className={`w-3 h-3 rounded-full border-2 border-blue-500 ${
                                      dot <= (typeof language === 'object' ? language.level : 3)
                                        ? 'bg-blue-500'
                                        : 'bg-transparent'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* References */}
              {cvData.references && cvData.references.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-indigo-600 mb-4 border-b border-gray-200 pb-2">
                    Referanslar
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cvData.references.map((reference: any, index: number) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                        <h4 className="font-semibold text-gray-900 mb-2">{reference.name}</h4>
                        {reference.position && (
                          <p className="text-gray-700 font-medium text-sm mb-1">{reference.position}</p>
                        )}
                        {reference.company && (
                          <p className="text-gray-600 text-sm mb-2">{reference.company}</p>
                        )}
                        {reference.phone && (
                          <p className="text-gray-600 text-sm">Tel: {reference.phone}</p>
                        )}
                        {reference.email && (
                          <p className="text-gray-600 text-sm">Email: {reference.email}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
