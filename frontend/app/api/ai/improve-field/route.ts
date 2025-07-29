import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { fieldName, userInput, instruction } = await request.json();

    if (!fieldName || !userInput) {
      return NextResponse.json({ 
        success: false, 
        error: 'fieldName ve userInput gerekli' 
      }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.9,
        maxOutputTokens: 1024,
      },
    });

    const prompt = createFieldPrompt(fieldName, userInput, instruction);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const improvedText = response.text().trim();

    return NextResponse.json({ 
      success: true,
      improvedText,
      fieldName,
      originalText: userInput
    });

  } catch (error) {

    
    // Error detaylarını logla
    if (error instanceof Error) {


    }
    
    // Fallback için request body'yi tekrar parse etmeye çalış
    let fallbackText = '';
    try {
      const body = await request.clone().json();
      fallbackText = body.userInput || '';
    } catch (parseError) {

    }
    
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'AI ile alan işleme başarısız oldu',
      improvedText: fallbackText // Fallback olarak orijinal metni döndür
    }, { status: 500 });
  }
}

/**
 * Alan tipine göre optimize edilmiş prompt oluşturma
 */
function createFieldPrompt(fieldName: string, userInput: string, instruction?: string): string {
  // Custom instruction varsa onu kullan
  if (instruction) {
    return `${instruction}

Kullanıcı girişi: "${userInput}"

Sadece geliştirilmiş metni döndür, açıklama yapma.`;
  }

  // Alan tipine göre özel promptlar
  switch (fieldName) {
    case 'aboutMe':
      return `Bu "Hakkımda" metnini CV formatında geliştir:

"${userInput}"

Şu formatta yaz:
• Kısa kişisel tanıtım
• Ana yetenek alanı
• Kariyer hedefi

Her madde ayrı satırda olsun.
Sadece geliştirilmiş metni döndür.`;

    case 'education_school':
      return `Bu okul/üniversite adını düzenle:

"${userInput}"

Sadece okul adını kısa ve net yaz.
Açıklama ekleme, sadece okul adını döndür.`;

    case 'education_department':
      return `Bu bölüm adını düzenle:

"${userInput}"

Sadece bölüm adını kısa ve net yaz.
Açıklama ekleme, sadece bölüm adını döndür.`;

    case 'education_startDate':
      return `Bu başlangıç tarihini düzenle:

"${userInput}"

Sadece yıl formatında yaz (örnek: 2020, 2018, 2021)
Açıklama ekleme, sadece yılı döndür.`;

    case 'education_endDate':
      return `Bu bitiş tarihini düzenle:

"${userInput}"

Sadece yıl formatında yaz (örnek: 2024, 2022, halen)
Açıklama ekleme, sadece yılı döndür.`;

    case 'education_gpa':
      return `Bu GPA/not ortalamasını düzenle:

"${userInput}"

Sadece sayısal değeri yaz (örnek: 3.52, 3.2, 2.8)
Açıklama ekleme, sadece not ortalamasını döndür.`;

    case 'experience_company':
      return `Bu şirket adını düzenle:

"${userInput}"

Sadece şirket adını kısa ve net yaz.
Gereksiz ekleme yapma, sadece şirket adını döndür.`;

    case 'experience_position':
      return `Bu pozisyon adını düzenle:

"${userInput}"

Sadece pozisyon adını kısa ve net yaz.
Gereksiz ekleme yapma, sadece pozisyon adını döndür.`;

    case 'experience_description':
      return `Bu iş deneyimini profesyonel hale getir:

"${userInput}"

Şu formatta yaz:
• Ana sorumluluklar
• Önemli başarılar
• Kullanılan teknolojiler

Her madde ayrı satırda olsun.
Sadece geliştirilmiş metni döndür.`;

    case 'education':
      return `Bu eğitim bilgisini kısa ve öz düzenle:

"${userInput}"

Şu formatta tek satırda yaz:
Üniversite Adı, Bölüm, Derece, Yıl

Örnek: Beykent Üniversitesi, Bilgisayar Mühendisliği, Lisans, 2024

Sadece bu format bilgiyi döndür, açıklama yapma.`;

    case 'experience':
      return `Bu iş deneyimini düzenle:

"${userInput}"

Format örneği:
• Şirket Adı
• Pozisyon
• Çalışma Süresi
• Kısa Açıklama

Her satır ayrı olsun.
Sadece düzenlenmiş bilgiyi döndür.`;

    case 'technicalSkills':
      return `Bu teknik becerileri kategorize et:

"${userInput}"

Şu formatta yaz:
• Programlama Dilleri: (listele)
• Framework/Kütüphaneler: (listele)
• Araçlar: (listele)

Her kategori ayrı satırda olsun.
Sadece beceri listesini döndür.`;

    case 'personalSkills':
      return `Bu kişisel becerileri düzenle:

"${userInput}"

Şu formatta yaz:
• İletişim becerileri
• Liderlik özellikleri  
• Problem çözme yetenekleri

Her beceri ayrı satırda olsun.
Sadece beceri listesini döndür.`;

    case 'languages':
      return `Bu dil bilgilerini düzenle:

"${userInput}"

Şu formatta yaz:
• Türkçe - Ana dil
• İngilizce - İleri seviye
• Diğer diller - Seviye

Her dil ayrı satırda olsun.
Sadece dil listesini döndür.`;

    case 'hobbies':
      return `Bu hobiler listesini düzenle:

"${userInput}"

Şu formatta yaz:
• Spor ve fiziksel aktiviteler
• Kültürel ve sanatsal ilgi alanları
• Teknoloji ve öğrenme

Her kategori ayrı satırda olsun.
Sadece hobi listesini döndür.`;

    default:
      return `Bu CV alanını düzenle:

Alan: ${fieldName}
İçerik: "${userInput}"

Kurallar:
• Orijinal anlam korunmalı
• Gereksiz kelime ekleme
• Sadece düzeltme yap
• Kısa ve net ol

Sadece düzeltilmiş metni döndür.`;
  }
}
