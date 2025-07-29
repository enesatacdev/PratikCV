import { NextRequest, NextResponse } from 'next/server';

// Gemini AI API ile meslek analizi
export async function POST(request: NextRequest) {
  try {
    const { input, language = 'tr', retry = false, fallback = false, emergency = false } = await request.json();

    if (!input) {
      return NextResponse.json({ error: 'Input gerekli' }, { status: 400 });
    }

    // Gemini AI API Key kontrolü
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {

      return NextResponse.json({ error: 'AI servisi yapılandırılmamış' }, { status: 500 });
    }

    // Prompt türüne göre farklı yaklaşımlar
    let prompt = '';
    
    if (emergency) {
      prompt = `
Bu metinden kişinin mesleğini tahmin et: "${input}"

Sadece şu JSON formatında yanıt ver:
{
  "profession": "Tahmin edilen meslek",
  "confidence": 0.5,
  "category": "Genel kategori",
  "skills": {
    "technical": ["Temel yetenek 1", "Temel yetenek 2"],
    "soft": ["Kişisel özellik 1", "Kişisel özellik 2"],
    "languages": ["Türkçe", "İngilizce"]
  },
  "companies": ["Genel şirket türü 1", "Genel şirket türü 2"]
}
`;
    } else if (fallback) {
      prompt = `
Detaylı analiz için: "${input}"

Bu metinden mesleği belirle ve bu JSON formatında döndür:
{
  "profession": "Tespit edilen meslek adı",
  "confidence": 0.7,
  "category": "Ana kategori",
  "skills": {
    "technical": ["İlgili teknik yetenek 1", "Teknik yetenek 2", "Teknik yetenek 3"],
    "soft": ["Soft skill 1", "Soft skill 2", "Soft skill 3"],
    "languages": ["Gerekli dil 1", "Dil 2"]
  },
  "companies": ["Şirket türü 1", "Şirket türü 2", "Şirket türü 3"]
}
`;
    } else if (retry) {
      prompt = `
İkinci deneme - Bu kişi hangi alanda çalışıyor: "${input}"

Türkiye'deki tüm meslek alanlarını göz önünde bulundur. Modern ve geleneksel tüm meslekleri tanıyabilmelisin.
Sadece JSON döndür:

{
  "profession": "Tespit edilen meslek (Türkçe)",
  "confidence": 0.8,
  "category": "Sektör kategorisi",
  "skills": {
    "technical": ["Bu meslek için gereken teknik yetenek 1", "Teknik yetenek 2", "Teknik yetenek 3"],
    "soft": ["Bu meslek için önemli kişisel özellik 1", "Özellik 2", "Özellik 3"],
    "languages": ["Bu meslek için gerekli dil 1", "Dil 2"]
  },
  "companies": ["Bu meslekteki kişinin çalışabileceği şirket türü 1", "Tür 2", "Tür 3"]
}
`;
    } else {
      // Ana prompt - en detaylı
      prompt = `
Kullanıcı şu metni yazdı: "${input}"

Bu metinden kullanıcının mesleğini/kariyer alanını tespit et. 
Türkiye'deki tüm meslek gruplarını ve sektörleri göz önünde bulundur.
Geleneksel mesleklerden modern dijital kariyerlere kadar her türlü mesleği tanıyabilmelisin.

ÖRNEKLER:
- "Kod yazıyorum" → Yazılım Geliştirici
- "Hasta bakımı yapıyorum" → Hemşire/Sağlık Uzmanı  
- "Saç kesiyorum" → Berber/Kuaför
- "Yemek pişiriyorum" → Aşçı/Şef
- "Çizim yapıyorum" → Tasarımcı/İllüstratör
- "Araç tamiri" → Otomotiv Teknisyeni
- "Temizlik yapıyorum" → Temizlik Uzmanı

Aşağıdaki JSON formatında SADECE JSON döndür, başka hiçbir metin ekleme:

{
  "profession": "Tespit edilen tam meslek adı (Türkçe)",
  "confidence": 0.8,
  "category": "Ana sektör kategorisi",
  "skills": {
    "technical": ["Bu meslek için kritik teknik yetenek 1", "Teknik yetenek 2", "Teknik yetenek 3"],
    "soft": ["Bu meslek için önemli kişisel özellik 1", "Özellik 2", "Özellik 3"],
    "languages": ["Bu meslek için gerekli/faydalı dil 1", "Dil 2"]
  },
  "companies": ["Bu meslekteki kişinin çalışabileceği şirket/kurum türü 1", "Tür 2", "Tür 3"]
}

Eğer meslek tespit edemezsen:
{
  "profession": null,
  "confidence": 0,
  "category": null,
  "skills": null,
  "companies": null
}
`;
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!response.ok) {

      return NextResponse.json({ error: 'AI servisi hatası' }, { status: 500 });
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {

      return NextResponse.json({ error: 'AI servisi beklenmeyen yanıt' }, { status: 500 });
    }

    const aiText = data.candidates[0].content.parts[0].text;
    
    try {
      // JSON parse et
      const cleanText = aiText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const result = JSON.parse(cleanText);
      
      // Sonucu validate et
      if (result.profession && result.profession !== null) {
        return NextResponse.json({
          profession: result.profession,
          confidence: result.confidence || 0.8,
          category: result.category || 'Genel',
          skills: result.skills || {
            technical: ['Microsoft Office', 'Excel'],
            soft: ['İletişim', 'Takım Çalışması'],
            languages: ['İngilizce']
          },
          companies: result.companies || ['Şirket', 'Kurum', 'Organizasyon']
        });
      } else {
        // Meslek tespit edilemedi
        return NextResponse.json({
          profession: null,
          confidence: 0,
          category: null,
          skills: null,
          companies: null
        });
      }
    } catch (parseError) {


      return NextResponse.json({ error: 'AI yanıtı işlenemiyor' }, { status: 500 });
    }

  } catch (error) {

    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
