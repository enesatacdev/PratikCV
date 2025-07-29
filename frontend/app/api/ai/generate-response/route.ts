import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { 
      userInput, 
      conversationHistory, 
      cvData, 
      detectedField, 
      currentStep, 
      responseType 
    } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Farklı yanıt türleri için farklı promptlar
    let prompt = '';
    
    switch (responseType) {
      case 'profession_detected':
        prompt = `Sen bir CV uzmanı AI asistanısın. Kullanıcı "${detectedField.profession}" alanında çalışmak istediğini belirtti.

Şu bilgileri kullan:
- Meslek: ${detectedField.profession}
- Güven skoru: ${detectedField.confidence}
- Kullanıcı girdisi: "${userInput}"

Bu duruma uygun, kişiselleştirilmiş ve samimi bir yanıt ver. Yanıt:
- Mesleği onaylayıcı ve destekleyici olsun
- Deneyim sorma yönünde yönlendirsin
- Empatik ve profesyonel olsun
- 1-2 cümle uzunluğunda olsun
- Emoji kullan ama abartma

Yanıtı doğrudan ver, ek açıklama yapma.`;
        break;

      case 'experience_added':
        prompt = `Sen bir CV uzmanı AI asistanısın. Kullanıcı iş deneyimi bilgilerini paylaştı.

Kullanıcı bilgileri:
- Meslek: ${cvData.personalInfo?.title || 'Profesyonel'}
- Deneyim girdisi: "${userInput}"
- Mevcut CV durumu: ${JSON.stringify(cvData.experience || [])}

Bu duruma uygun yanıt ver:
- Deneyimin eklediğini onaylayıcı
- Eğitim bilgileri için yönlendirici
- Pozitif ve motive edici
- 1-2 cümle uzunluğunda
- Uygun emoji kullan

Yanıtı doğrudan ver.`;
        break;

      case 'education_added':
        prompt = `Sen bir CV uzmanı AI asistanısın. Kullanıcı eğitim bilgilerini paylaştı.

Kullanıcı bilgileri:
- Meslek: ${cvData.personalInfo?.title || 'Profesyonel'}
- Eğitim girdisi: "${userInput}"
- Mevcut CV durumu: ${JSON.stringify(cvData.education || [])}

Bu duruma uygun yanıt ver:
- Eğitimin eklediğini onaylayıcı
- Yetenekler için yönlendirici
- Destekleyici ve profesyonel
- 1-2 cümle uzunluğunda
- Uygun emoji kullan

Yanıtı doğrudan ver.`;
        break;

      case 'skills_added':
        prompt = `Sen bir CV uzmanı AI asistanısın. Kullanıcı yetenek bilgilerini paylaştı.

Kullanıcı bilgileri:
- Meslek: ${cvData.personalInfo?.title || 'Profesyonel'}
- Yetenek girdisi: "${userInput}"
- CV tamamlanma oranı: ${currentStep}%

Bu duruma uygun yanıt ver:
- Yeteneklerin eklediğini onaylayıcı
- CV'nin güçlü olduğunu vurgulayıcı
- İlerleme durumunu kutlayıcı
- 1-2 cümle uzunluğunda
- Başarı odaklı emoji kullan

Yanıtı doğrudan ver.`;
        break;

      case 'completion':
        prompt = `Sen bir CV uzmanı AI asistanısın. Kullanıcının CV'si büyük ölçüde tamamlandı.

CV durumu:
- Meslek: ${cvData.personalInfo?.title || 'Profesyonel'}
- Son kullanıcı girdisi: "${userInput}"
- Tamamlanma oranı: ${currentStep}%

Bu duruma uygun yanıt ver:
- CV'nin harika göründüğünü belirt
- Kaydetmeye hazır olduğunu söyle
- Başarılı bir iş sürecinde takdir et
- Destekleyici ve kutlayıcı ol
- 2-3 cümle uzunluğunda
- Başarı emojileri kullan

Yanıtı doğrudan ver.`;
        break;

      case 'general':
      default:
        prompt = `Sen bir CV uzmanı AI asistanısın. Kullanıcıyla doğal bir CV oluşturma sohbeti yapıyorsun.

Kullanıcı bilgileri:
- Son mesaj: "${userInput}"
- Sohbet geçmişi: ${JSON.stringify(conversationHistory.slice(-3))}
- Mevcut CV durumu: ${JSON.stringify(cvData)}
- Mevcut adım: ${currentStep}

Bu duruma uygun, doğal ve yardımcı bir yanıt ver:
- Kullanıcının girdisini anlayışla karşıla
- CV geliştirme sürecine odaklı kal
- Sohbet havasını koru
- Yapıcı ve destekleyici ol
- 1-2 cümle uzunluğunda
- Uygun emoji kullan

Yanıtı doğrudan ver, ek açıklama yapma.`;
        break;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResponse = response.text();

    return NextResponse.json({ 
      response: aiResponse.trim(),
      success: true 
    });

  } catch (error) {

    
    // Fallback responses
    const fallbackResponses = {
      profession_detected: "Harika! Bu alanda birlikte mükemmel bir CV hazırlayalım! 🚀",
      experience_added: "Mükemmel! Deneyiminizi CV'nize ekledim. Şimdi eğitim bilgilerinizi alalım! 💼",
      education_added: "Süper! Eğitim bilgileriniz eklendi. Son olarak yeteneklerinizi belirtelim! 🎓",
      skills_added: "Harika! CV'niz gerçekten profesyonel görünüyor! 🌟",
      completion: "Tebrikler! CV'niz tamamlandı ve kaydetmeye hazır! 🎉",
      general: "Anlıyorum! CV'nizi geliştirmeye devam edelim! ⭐"
    };
    
    return NextResponse.json({ 
      response: fallbackResponses.general,
      success: false,
      error: 'AI yanıt üretimi başarısız, fallback kullanıldı'
    });
  }
}
