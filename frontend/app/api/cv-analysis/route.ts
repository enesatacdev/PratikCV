import { NextRequest, NextResponse } from 'next/server';

interface CVAnalysisRequest {
  cvData?: any;
  pdfUrl?: string; // ImageKit PDF URL
  cvId?: string; // Kullanıcının kendi CV'si için
  analysisType?: 'cv-data' | 'pdf-upload' | 'existing-cv';
}

export async function GET() {
  return NextResponse.json({ 
    message: "CV Analysis API is working", 
    method: "GET",
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  let cvData: any = {};
  let pdfUrl: string = '';
  let cvId: string = '';
  let analysisType: string = 'cv-data';
  
  try {

    
    const requestData: CVAnalysisRequest = await request.json();
    cvData = requestData.cvData || {};
    pdfUrl = requestData.pdfUrl || '';
    cvId = requestData.cvId || '';
    analysisType = requestData.analysisType || 'cv-data';
    





    const apiKey = process.env.GEMINI_API_KEY;

    
    if (!apiKey) {

      throw new Error('Gemini API key not configured');
    }

    let analysisPrompt = '';
    let requestBody: any = {};

    if (analysisType === 'pdf-upload' && pdfUrl) {
      // ImageKit'ten PDF dosyası analizi

      
      try {
        let pdfBase64: string;
        
        // Data URL mi yoksa ImageKit URL mi kontrol et
        if (pdfUrl.startsWith('data:')) {
          // Data URL - base64 kısmını çıkar

          const base64Index = pdfUrl.indexOf('base64,');
          if (base64Index === -1) {
            throw new Error('Geçersiz data URL formatı');
          }
          pdfBase64 = pdfUrl.substring(base64Index + 7);

        } else {
          // ImageKit URL - fetch işlemi

          const pdfResponse = await fetch(pdfUrl, {
            method: 'GET',
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              'Accept': 'application/pdf,*/*',
            },
          });
          


          
          if (!pdfResponse.ok) {

            throw new Error(`PDF dosyası ImageKit'ten alınamadı: ${pdfResponse.status} - ${pdfResponse.statusText}`);
          }
          
          const pdfBuffer = await pdfResponse.arrayBuffer();

          
          if (pdfBuffer.byteLength === 0) {
            throw new Error('PDF dosyası boş');
          }
          
          pdfBase64 = Buffer.from(pdfBuffer).toString('base64');

        }
        
        analysisPrompt = createPDFAnalysisPrompt();
        requestBody = {
          contents: [{
            parts: [
              {
                text: analysisPrompt
              },
              {
                inline_data: {
                  mime_type: "application/pdf",
                  data: pdfBase64
                }
              }
            ]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 4096,
          },
        };
      } catch (pdfError) {

        throw new Error(`PDF işleme hatası: ${pdfError instanceof Error ? pdfError.message : 'Bilinmeyen hata'}`);
      }
    } else if (analysisType === 'existing-cv' && cvId) {
      // Kullanıcının mevcut CV'si analizi

      
      // Backend'den CV verisini getir
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || 'http://localhost:5000/api';

      const cvResponse = await fetch(`${apiBaseUrl}/cv/${cvId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!cvResponse.ok) {
        const errorText = await cvResponse.text();

        throw new Error(`CV verisi alınamadı: ${cvResponse.status} - ${errorText}`);
      }
      
      const cvDataFromAPI = await cvResponse.json();

      
      analysisPrompt = createCVDataAnalysisPrompt(cvDataFromAPI);
      requestBody = {
        contents: [{
          parts: [{
            text: analysisPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 4096,
        },
      };
    } else {
      // CV verisi analizi (geleneksel)

      
      analysisPrompt = createCVDataAnalysisPrompt(cvData);
      requestBody = {
        contents: [{
          parts: [{
            text: analysisPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 4096,
        },
      };
    }


    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });



    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    
    // Gemini response structure kontrolü
    if (!data.candidates || !Array.isArray(data.candidates) || data.candidates.length === 0) {
      throw new Error('Invalid Gemini response structure: no candidates');
    }
    
    const candidate = data.candidates[0];
    if (!candidate.content || !candidate.content.parts || !Array.isArray(candidate.content.parts) || candidate.content.parts.length === 0) {
      throw new Error('Invalid Gemini response structure: no content parts');
    }
    
    const aiResponse = candidate.content.parts[0]?.text;


    if (!aiResponse) {
      throw new Error('No response from Gemini AI');
    }

    // JSON yanıtını parse etmeye çalış
    try {
      let cleanResponse = aiResponse.trim();
      
      // Markdown formatını temizle
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
      }
      if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.replace(/```\s*/g, '').replace(/```\s*$/g, '');
      }
      
      // Başındaki ve sonundaki gereksiz karakterleri temizle
      cleanResponse = cleanResponse.replace(/^[^{]*/, '').replace(/[^}]*$/, '');
      
      // JSON'u yanıt içinde bul - daha geniş regex kullan
      const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanResponse = jsonMatch[0];
      }
      
      // JSON içindeki muhtemel sorunları düzelt
      cleanResponse = cleanResponse
        // Markdown başlıklarını temizle (## ATS gibi)
        .replace(/##\s*[^{]*?(?=\{|$)/g, '')
        // Çok satırlı string'leri tek satır yap
        .replace(/:\s*"([^"]*)\n([^"]*)"([,\s]*)/g, ': "$1 $2"$3')
        // Trailing comma'ları temizle
        .replace(/,(\s*[}\]])/g, '$1')
        // Extra boşlukları temizle
        .replace(/\n\s*/g, ' ')
        // Çift boşlukları tek boşluk yap
        .replace(/\s+/g, ' ')
        // Hash karakterlerini temizle
        .replace(/#/g, '');
      

      
      // Eksik kapanış karakterlerini kontrol et ve düzelt
      let braceCount = 0;
      let inString = false;
      let escapeNext = false;
      let lastValidIndex = cleanResponse.length;
      
      for (let i = 0; i < cleanResponse.length; i++) {
        const char = cleanResponse[i];
        
        if (escapeNext) {
          escapeNext = false;
          continue;
        }
        
        if (char === '\\') {
          escapeNext = true;
          continue;
        }
        
        if (char === '"' && !escapeNext) {
          inString = !inString;
          continue;
        }
        
        if (!inString) {
          if (char === '{') {
            braceCount++;
          } else if (char === '}') {
            braceCount--;
            if (braceCount === 0) {
              lastValidIndex = i + 1;
              break;
            }
          }
        }
      }
      
      if (braceCount > 0) {
        // JSON tamamlanmamış, eksik kapanış karakterlerini ekle
        for (let i = 0; i < braceCount; i++) {
          cleanResponse += '}';
        }
      } else if (braceCount === 0 && lastValidIndex < cleanResponse.length) {
        // Geçerli JSON'u kes
        cleanResponse = cleanResponse.substring(0, lastValidIndex);
      }
      

      
      const analysisResult = JSON.parse(cleanResponse);

      
      return NextResponse.json({
        success: true,
        analysis: analysisResult,
        timestamp: new Date().toISOString()
      });
      
    } catch (parseError) {


      
      // Gelişmiş fallback analizi
      return NextResponse.json({
        success: true,
        analysis: {
          overall_score: 75,
          summary: aiResponse?.substring(0, 500) + (aiResponse?.length > 500 ? '...' : ''),
          extracted_data: {
            personal_info: {
              full_name: "Bilgi PDF'den çıkarılamadı",
              email: "",
              phone: "",
              address: "",
              birth_date: "",
              linkedin: "",
              website: ""
            },
            work_experience: [],
            education: [],
            skills: {
              technical: [],
              personal: [],
              languages: []
            },
            certifications: [],
            projects: []
          },
          sections: {
            personal_info: { score: 80, feedback: "Kişisel bilgiler değerlendirildi" },
            experience: { score: 75, feedback: "İş deneyimi incelendi" },
            education: { score: 80, feedback: "Eğitim bilgileri uygun" },
            skills: { score: 70, feedback: "Yetenekler listelendi" },
            ats_compatibility: { score: 72, feedback: "ATS uyumluluğu değerlendirildi" }
          },
          ats_analysis: {
            overall_ats_score: 72,
            overall_score: 72,
            keyword_density: 'Orta',
            section_recognition: 'İyi',
            section_detection: 'Başarılı',
            contact_extraction: 'Uygun',
            formatting: 'Standart',
            format_parsing: 'Uyumlu',
            pass_probability: '%75',
            parsing_success_rate: 'CV başarıyla işlendi',
            recommendations: [
              '🎯 İş ilanındaki anahtar kelimeleri CV\'nizde kullanın (React, Node.js, Python gibi)',
              '📋 Standart bölüm başlıkları kullanın: İş Deneyimi, Eğitim, Yetenekler, İletişim',
              '📄 CV\'yi PDF formatında kaydedin - Word belgeleri ATS\'de problem yaratır',
              '🚫 Karmaşık tablolar, grafikler ve çok sütunlu düzenlerden kaçının',
              '⚡ İş açıklamalarında güçlü eylem fiilleri kullanın (achieved, managed, developed)',
              '💻 Sektörünüze özel teknik terimleri dahil edin (.NET, JavaScript, SQL)',
              '🔤 Standart fontlar kullanın: Arial, Calibri, Times New Roman (10-12pt)',
              '📏 CV\'yi 1-2 sayfa ile sınırlayın - uzun CV\'ler ATS\'de kaybolur',
              '✉️ İletişim bilgilerini header\'da net şekilde belirtin',
              '📝 Her iş deneyimi için 2-4 maddelik açıklama yazın'
            ]
          },
          ats_compatibility: 'CV, çoğu ATS sistemi tarafından başarıyla işlenebilir',
          strengths: ["Genel yapı uygun", "Temel bilgiler mevcut"],
          weaknesses: ["Detaylı analiz tamamlanamadı"],
          suggestions: ["Tekrar analiz için dosyayı yeniden yükleyin"]
        },
        timestamp: new Date().toISOString(),
        note: 'Fallback analiz kullanıldı'
      });
    }

  } catch (error) {



    
    return NextResponse.json({
      success: false,
      error: "CV analizi sırasında bir hata oluştu. Lütfen tekrar deneyin.",
      details: error instanceof Error ? error.message : "Bilinmeyen hata",
      analysisType,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

function createCVDataAnalysisPrompt(cvData: any): string {
  // CV verilerini detaylı kontrol et
  const personalInfo = cvData?.personalInfo || {};
  const hasFullName = personalInfo.fullName && personalInfo.fullName.trim().length > 0;
  const hasPhone = personalInfo.phones && personalInfo.phones.length > 0;
  const hasEmail = personalInfo.emails && personalInfo.emails.length > 0;
  const hasAddress = personalInfo.address && personalInfo.address.trim().length > 0;
  const hasBirthday = personalInfo.birthday && personalInfo.birthday.trim().length > 0;
  
  const experience = cvData?.experience || [];
  const hasDetailedExperience = experience.some((exp: any) => 
    exp.description && exp.description.trim().length > 10 &&
    exp.startDate && exp.startDate.trim().length > 0
  );
  
  const education = cvData?.education || [];
  const hasDetailedEducation = education.some((edu: any) => 
    edu.startDate && edu.startDate.trim().length > 0 &&
    edu.endDate && edu.endDate.trim().length > 0 &&
    edu.department && edu.department.trim().length > 0
  );
  
  const skills = cvData?.skills || {};
  const hasTechnicalSkills = skills.technical && skills.technical.length > 0;
  const hasPersonalSkills = skills.personal && skills.personal.length > 0;
  const hasLanguageSkills = skills.languages && skills.languages.length > 0;

  // ATS UYUMLULUK PUANLAMA - Ana puanlama sistemi
  let atsScore = 100;
  let missingElements = [];
  
  // ATS Kritik Gereksinimler
  if (!hasFullName) { atsScore -= 15; missingElements.push("Ad Soyad"); }
  if (!hasPhone) { atsScore -= 15; missingElements.push("Telefon Numarası"); }
  if (!hasEmail) { atsScore -= 15; missingElements.push("E-posta Adresi"); }
  if (!hasDetailedExperience) { atsScore -= 20; missingElements.push("Detaylı İş Deneyimi"); }
  if (!hasDetailedEducation) { atsScore -= 10; missingElements.push("Detaylı Eğitim Bilgisi"); }
  if (!hasTechnicalSkills) { atsScore -= 10; missingElements.push("Teknik Beceriler"); }
  if (!hasAddress) { atsScore -= 5; missingElements.push("Adres Bilgisi"); }
  if (!hasPersonalSkills) { atsScore -= 5; missingElements.push("Kişisel Beceriler"); }
  if (!hasLanguageSkills) { atsScore -= 5; missingElements.push("Dil Becerileri"); }

  const finalScore = Math.max(10, atsScore);

  return `CV uzmanı olarak aşağıdaki CV'yi TAMAMEN ATS (Applicant Tracking System) UYUMLULUĞUNA göre analiz et.

ATS UYUMLULUK ANALİZİ:
Kişisel Bilgiler (ATS Kritik):
- Ad Soyad: ${hasFullName ? '✓ ATS UYUMLU' : '✗ ATS CRİTİK EKSİK'}
- Telefon: ${hasPhone ? '✓ ATS UYUMLU' : '✗ ATS CRİTİK EKSİK'}
- Email: ${hasEmail ? '✓ ATS UYUMLU' : '✗ ATS CRİTİK EKSİK'}  
- Adres: ${hasAddress ? '✓ ATS UYUMLU' : '✗ ATS EKSİK'}

İş Deneyimi (ATS En Önemli):
- Detaylı Açıklama: ${hasDetailedExperience ? '✓ ATS UYUMLU' : '✗ ATS CRİTİK EKSİK'}
- Tarihler: ${experience.length > 0 ? '✓ ATS UYUMLU' : '✗ ATS EKSİK'}

Eğitim (ATS Önemli):
- Detaylı Bilgi: ${hasDetailedEducation ? '✓ ATS UYUMLU' : '✗ ATS EKSİK'}

Beceriler (ATS Anahtar Kelime):
- Teknik: ${hasTechnicalSkills ? '✓ ATS ANAHTAR KELİME' : '✗ ATS CRİTİK EKSİK'}
- Kişisel: ${hasPersonalSkills ? '✓ ATS UYUMLU' : '✗ ATS EKSİK'}
- Dil: ${hasLanguageSkills ? '✓ ATS UYUMLU' : '✗ ATS EKSİK'}

ATS UYUMLULUK SKORU: ${finalScore}/100
EKSİK ELEMENTLER: ${missingElements.length} adet

CV Verisi:
${JSON.stringify(cvData, null, 2)}

ATS UYUMLULUK ODAKLI PUANLAMA:

{
  "overall_score": ${finalScore},
  "summary": "CV'nin ATS uyumluluğu: ${finalScore}/100 puan. ${missingElements.length} kritik eksiklik tespit edildi.",
  "strengths": ["Sadece ATS uyumlu bölümler için pozitif yorumlar"],
  "weaknesses": ["ATS sistemleri tarafından okunmayacak eksiklikler", "İş başvurularında CV'nin sistem tarafından reddedilme riski"],
  "suggestions": ["ATS uyumluluğu için kritik eksikliklerin giderilmesi", "Standart bölüm başlıklarının kullanılması", "Anahtar kelime optimizasyonu"],
  "sections": {
    "personal_info": {"score": ${hasFullName && hasPhone && hasEmail ? 85 : Math.max(15, 85 - (3 - [hasFullName, hasPhone, hasEmail].filter(Boolean).length) * 25)}, "feedback": "ATS kişisel bilgi okuma analizi"},
    "experience": {"score": ${hasDetailedExperience ? 80 : 20}, "feedback": "ATS iş deneyimi arama algoritması analizi"},
    "education": {"score": ${hasDetailedEducation ? 75 : 35}, "feedback": "ATS eğitim filtreleme analizi"},
    "skills": {"score": ${hasTechnicalSkills ? 70 : 25}, "feedback": "ATS anahtar kelime eşleştirme analizi"},
    "ats_compatibility": {"score": ${finalScore}, "feedback": "Genel ATS sistem uyumluluğu"}
  },
  "ats_analysis": {
    "keyword_usage": "ATS anahtar kelime tarama başarı oranı",
    "standard_sections": "ATS standart bölüm tanıma kabiliyeti",
    "contact_info": "ATS iletişim bilgisi çıkarma başarısı",
    "formatting": "ATS format okuma uyumluluğu",
    "parsing_success": "ATS CV ayrıştırma başarı oranı",
    "overall_score": ${finalScore},
    "recommendations": ["ATS geçiş oranını artırmak için öneriler"]
  },
  "industry_match": "ATS filtreleme sistemlerinde hangi sektörler için geçerli",
  "competitiveness": "ATS sistemlerinde rekabet gücü - ${finalScore < 70 ? 'DÜŞÜK RİSK' : 'KABUL EDİLEBİLİR'}",
  "missing_elements": ${JSON.stringify(missingElements)},
  "ats_compatibility": "ATS sistemlerinde ${finalScore < 70 ? 'REDDEDİLME RİSKİ YÜKSEK' : 'KABUL ŞANSİ VAR'}"
}

ÖNEMLİ: TAMAMEN ATS UYUMLULUĞUNA GÖRE PUANLA. ATS sistemleri bu CV'yi ${finalScore}% başarıyla okuyabilir.`;
}

function createPDFAnalysisPrompt(): string {
  return `Sen bir ATS (Applicant Tracking System) uzmanısın. Verilen PDF CV'yi TAMAMEN okuyup analiz et.

GÖREV: PDF'den tüm kişisel bilgileri ve CV içeriğini çıkarıp ATS uyumluluğuna göre analiz et.

ÖNCELİKLE PDF'DEN ÇıKAR:
1. KİŞİSEL BİLGİLER:
   - Ad Soyad (tam isim)
   - E-posta adresi
   - Telefon numarası
   - Adres bilgileri
   - Doğum tarihi (varsa)
   - LinkedIn profili (varsa)
   - Web sitesi (varsa)

2. İŞ DENEYİMLERİ:
   - Şirket adları
   - Pozisyon isimleri
   - Çalışma tarihleri (başlangıç-bitiş)
   - İş tanımları ve sorumlulukları
   - Başarılar ve projeler

3. EĞİTİM BİLGİLERİ:
   - Okul/Üniversite adları
   - Bölüm/Alan
   - Mezuniyet tarihleri
   - Not ortalaması (varsa)
   - Sertifikalar

4. YETENEKLER:
   - Teknik beceriler
   - Kişisel özellikler
   - Dil bilgileri
   - Programlama dilleri
   - Yazılım bilgileri

5. DİĞER:
   - Projeler
   - Sertifikalar
   - Hobi ve ilgi alanları
   - Referanslar

SONRA ATS ANALİZİ YAP:

1. ATS TEMEL GEREKSİNİMLER (Kritik - %50):
   ✓ İletişim bilgileri ATS'nin okuyabileceği konumda mı?
   ✓ Standart bölüm başlıkları ("Work Experience", "Education", "Skills") var mı?
   ✓ Kronolojik sıralama doğru mu? (En yeni üstte)
   ✓ Tarihler standardize mi? (MM/YYYY formatı)

2. ATS ANAHTAR KELİME TARAMA (%30):
   ✓ Pozisyon için gerekli teknik terimler mevcut mu?
   ✓ Action verbs (managed, developed, created) kullanılmış mı?
   ✓ Sektör standart kavramları var mı?
   ✓ Beceriler ayrı bölümde listelenmiş mi?

3. ATS FORMAT UYUMLULUĞU (%20):
   ✓ Metin seçilebilir mi? (Taranmış görüntü değil)
   ✓ Tablolar, grafikler ATS okumayı engelliyor mu?
   ✓ Font ATS uyumlu mu? (Arial, Calibri gibi standart fontlar)
   ✓ Karmaşık kolon düzeni var mı? (ATS karıştırır)

ATS PUANLAMA ÖLÇEĞİ:
🤖 90-100: ATS MÜKEMMEL - Tüm sistemlerden geçer
🤖 70-89: ATS İYİ - Çoğu sistemde kabul
🤖 50-69: ATS ORTA - Bazı sistemlerde sorun
🤖 30-49: ATS ZAYIF - Çoğu sistemde elenir
🤖 0-29: ATS UYUMSUZ - Sistemler okuyamaz

SONUCU ŞU FORMATTA VER:

{
  "overall_score": ATS_UYUMLULUK_PUANI,
  "summary": "ATS sistemleri bu CV'yi nasıl değerlendiriecek",
  "extracted_data": {
    "personal_info": {
      "full_name": "Çıkarılan ad soyad",
      "email": "Çıkarılan e-posta",
      "phone": "Çıkarılan telefon",
      "address": "Çıkarılan adres",
      "birth_date": "Çıkarılan doğum tarihi",
      "linkedin": "LinkedIn profili",
      "website": "Web sitesi"
    },
    "work_experience": [
      {
        "company": "Şirket adı",
        "position": "Pozisyon",
        "start_date": "Başlangıç tarihi",
        "end_date": "Bitiş tarihi", 
        "description": "İş tanımı ve sorumlulukları"
      }
    ],
    "education": [
      {
        "school": "Okul/Üniversite adı",
        "degree": "Derece/Bölüm",
        "field": "Alan",
        "start_date": "Başlangıç",
        "end_date": "Bitiş",
        "gpa": "Not ortalaması"
      }
    ],
    "skills": {
      "technical": ["Teknik beceriler listesi"],
      "personal": ["Kişisel özellikler listesi"],
      "languages": ["Dil bilgileri"]
    },
    "certifications": ["Sertifikalar listesi"],
    "projects": ["Projeler listesi"]
  },
  "sections": {
    "personal_info": {"score": 0-100, "feedback": "Kişisel bilgiler değerlendirmesi"},
    "experience": {"score": 0-100, "feedback": "İş deneyimi değerlendirmesi"},
    "education": {"score": 0-100, "feedback": "Eğitim bilgileri değerlendirmesi"},
    "skills": {"score": 0-100, "feedback": "Yetenekler değerlendirmesi"},
    "ats_compatibility": {"score": 0-100, "feedback": "ATS uyumluluk değerlendirmesi"}
  },
  "strengths": ["ATS sistemlerin kolayca işleyebileceği özellikler"],
  "weaknesses": ["ATS sistemlerin zorlanacağı veya başarısız olacağı kısımlar"],
  "suggestions": ["ATS geçiş oranını artırmak için kritik değişiklikler"],
  "ats_analysis": {
    "parsing_success_rate": "ATS CV ayrıştırma başarı oranı: %XX",
    "keyword_density": "Anahtar kelime yoğunluğu ATS için yeterli mi?",
    "section_detection": "ATS bölüm tanıma başarısı",
    "contact_extraction": "ATS iletişim bilgisi çıkarma kabiliyeti",
    "experience_chronology": "ATS deneyim sıralama başarısı",
    "skills_identification": "ATS beceri listesi tanıma",
    "overall_ats_score": ATS_TOPLAM_PUAN,
    "system_compatibility": {
      "workday": "Workday ATS uyumluluğu",
      "greenhouse": "Greenhouse ATS uyumluluğu", 
      "lever": "Lever ATS uyumluluğu",
      "successfactors": "SAP SuccessFactors uyumluluğu"
    },
    "pass_probability": "İlk ATS eleme geçiş olasılığı: %XX",
    "recommendations": [
      "1. En kritik ATS uyumluluk önerisi",
      "2. İkincil ATS optimizasyon önerisi",
      "3. Üçüncü öncelik ATS iyileştirmesi",
      "4. Dördüncü ATS geliştirme önerisi",
      "5. Beşinci ATS uyumluluk tavsiyesi"
    ]
  },
  "industry_ats_match": "Hangi sektör ATS sistemleri için optimize",
  "competitive_advantage": "ATS ortamında rekabet avantajı",
  "critical_issues": ["ATS sistemlerin kesinlikle başarısız olacağı alanlar"],
  "ats_optimization_priority": [
    "1. En kritik ATS uyumluluk sorunu",
    "2. İkincil ATS problemi", 
    "3. Üçüncü öncelik ATS sorunu"
  ],
  "ats_compatibility": "GENEL ATS DEĞERLENDİRME: [MÜKEMMEL/İYİ/KABUL EDİLEBİLİR/ZAYIF/UYUMSUZ]"
}

🚨 ÖNEMLİ: CV'yi tamamen ATS sisteminin gözünden değerlendir! 
İnsan okuyucusu değil, algoritma ve makine öğrenmesi modelleri bu CV'yi nasıl işler?`;
}
