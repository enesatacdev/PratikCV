import { NextRequest, NextResponse } from 'next/server';

interface ChatRequest {
  message: string;
  conversationHistory?: string[];
  cvData?: any;
}

export async function GET() {
  return NextResponse.json({ 
    message: "AI Chat API is working", 
    method: "GET",
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  let message = '';
  let cvData: any = {};
  let user: any = null;
  let conversationHistory: string[] = [];
  let apiKey: string | undefined;
  
  try {
    const requestData: ChatRequest = await request.json();
    message = requestData.message;
    conversationHistory = requestData.conversationHistory || [];
    cvData = requestData.cvData || {};
    user = (requestData as any).user || null;

    apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }

    // Simple Gemini API call
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: createSimplePrompt(message, cvData, user, conversationHistory)
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    const aiResponse = data.candidates[0]?.content?.parts[0]?.text;

    if (!aiResponse) {
      throw new Error('No response from Gemini AI');
    }

    // Try to parse JSON response
    try {
      let cleanResponse = aiResponse.trim();
      
      // Remove any markdown formatting
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
      }
      if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.replace(/```\s*/g, '').replace(/```\s*$/g, '');
      }
      
      // Find JSON in the response if it's mixed with other text
      const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanResponse = jsonMatch[0];
      }
      
      const jsonResponse = JSON.parse(cleanResponse);
      
      // Ensure we have valid structure
      const validResponse = {
        message: jsonResponse.message || "Anlayamadım, tekrar açıklayabilir misin?",
        cvData: {
          userId: jsonResponse.cvData?.userId || cvData.userId || "",
          title: jsonResponse.cvData?.title || cvData.title || "",
          templateName: jsonResponse.cvData?.templateName || cvData.templateName || "modern",
          status: jsonResponse.cvData?.status || cvData.status || "draft",
          personalInfo: {
            fullName: jsonResponse.cvData?.personalInfo?.fullName || user?.fullName || cvData.personalInfo?.fullName || "",
            birthday: jsonResponse.cvData?.personalInfo?.birthday || cvData.personalInfo?.birthday || "",
            phones: (() => {
              const existing = cvData.personalInfo?.phones || [];
              const newPhones = jsonResponse.cvData?.personalInfo?.phones || [];
              const phone = jsonResponse.cvData?.personalInfo?.phone || user?.phone || cvData.personalInfo?.phone;
              const combined = [...existing, ...newPhones];
              if (phone && !combined.includes(phone)) combined.push(phone);
              return [...new Set(combined)].filter(Boolean);
            })(),
            emails: (() => {
              const existing = cvData.personalInfo?.emails || [];
              const newEmails = jsonResponse.cvData?.personalInfo?.emails || [];
              const email = jsonResponse.cvData?.personalInfo?.email || user?.email || cvData.personalInfo?.email;
              const combined = [...existing, ...newEmails];
              if (email && !combined.includes(email)) combined.push(email);
              return [...new Set(combined)].filter(Boolean);
            })(),
            // Backward compatibility
            email: jsonResponse.cvData?.personalInfo?.email || user?.email || cvData.personalInfo?.email || "",
            phone: jsonResponse.cvData?.personalInfo?.phone || user?.phone || cvData.personalInfo?.phone || "",
            address: jsonResponse.cvData?.personalInfo?.address || cvData.personalInfo?.address || "",
            nationality: jsonResponse.cvData?.personalInfo?.nationality || cvData.personalInfo?.nationality || "",
            drivingLicense: jsonResponse.cvData?.personalInfo?.drivingLicense || cvData.personalInfo?.drivingLicense || "",
            profilePhoto: jsonResponse.cvData?.personalInfo?.profilePhoto || cvData.personalInfo?.profilePhoto || "",
            summary: jsonResponse.cvData?.personalInfo?.summary || cvData.personalInfo?.summary || "",
            title: jsonResponse.cvData?.personalInfo?.title || cvData.personalInfo?.title || ""
          },
          aboutMe: jsonResponse.cvData?.aboutMe || cvData.aboutMe || "",
          // Preserve existing data and merge with new data
          experience: (() => {
            const existing = cvData.experience || [];
            const newExp = jsonResponse.cvData?.experience || [];
            // Merge arrays, avoiding duplicates
            const combined = [...existing];
            newExp.forEach((exp: any) => {
              if (exp && exp.position && exp.company && !combined.some((e: any) => e.position === exp.position && e.company === exp.company)) {
                combined.push(exp);
              }
            });
            return combined;
          })(),
          education: (() => {
            const existing = cvData.education || [];
            const newEdu = jsonResponse.cvData?.education || [];
            const combined = [...existing];
            newEdu.forEach((edu: any) => {
              if (edu && edu.degree && edu.school && !combined.some((e: any) => e.degree === edu.degree && e.school === edu.school)) {
                combined.push(edu);
              }
            });
            return combined;
          })(),
          skills: {
            technical: (() => {
              const existing = cvData.skills?.technical || [];
              const newSkills = jsonResponse.cvData?.skills?.technical || [];
              return [...new Set([...existing, ...newSkills])].filter(Boolean);
            })(),
            personal: (() => {
              const existing = cvData.skills?.personal || [];
              const newSkills = jsonResponse.cvData?.skills?.personal || [];
              return [...new Set([...existing, ...newSkills])].filter(Boolean);
            })(),
            languages: (() => {
              const existing = cvData.skills?.languages || [];
              const newLanguages = jsonResponse.cvData?.skills?.languages || [];
              const combined = [...existing];
              newLanguages.forEach((lang: any) => {
                if (lang && (typeof lang === 'string' || (lang.language && lang.level))) {
                  // Handle both string format (backward compatibility) and object format
                  if (typeof lang === 'string') {
                    if (!combined.some((l: any) => 
                      (typeof l === 'string' && l === lang) || 
                      (typeof l === 'object' && l.language === lang)
                    )) {
                      combined.push({ language: lang, level: 'Intermediate' });
                    }
                  } else {
                    if (!combined.some((l: any) => 
                      (typeof l === 'object' && l.language === lang.language) ||
                      (typeof l === 'string' && l === lang.language)
                    )) {
                      combined.push(lang);
                    }
                  }
                }
              });
              return combined;
            })()
          },
          socialMedia: (() => {
            const existing = cvData.socialMedia || [];
            const newSocial = jsonResponse.cvData?.socialMedia || [];
            const combined = [...existing];
            newSocial.forEach((social: any) => {
              if (social && social.platform && social.url && !combined.some((s: any) => s.platform === social.platform)) {
                combined.push(social);
              }
            });
            return combined;
          })(),
          certificates: (() => {
            const existing = cvData.certificates || [];
            const newCerts = jsonResponse.cvData?.certificates || [];
            const combined = [...existing];
            newCerts.forEach((cert: any) => {
              if (cert && cert.name && !combined.some((c: any) => c.name === cert.name)) {
                combined.push(cert);
              }
            });
            return combined;
          })(),
          references: (() => {
            const existing = cvData.references || [];
            const newRefs = jsonResponse.cvData?.references || [];
            const combined = [...existing];
            newRefs.forEach((ref: any) => {
              if (ref && ref.name && !combined.some((r: any) => r.name === ref.name)) {
                combined.push(ref);
              }
            });
            return combined;
          })(),
          hobbies: (() => {
            const existing = cvData.hobbies || [];
            const newHobbies = jsonResponse.cvData?.hobbies || [];
            return [...new Set([...existing, ...newHobbies])].filter(Boolean);
          })(),
          additionalInfo: jsonResponse.cvData?.additionalInfo || cvData.additionalInfo || ""
        },
        nextQuestions: jsonResponse.nextQuestions || ["Devam et", "Daha detay ver", "CV'yi oluştur"],
        currentStep: jsonResponse.currentStep || "conversation",
        isComplete: jsonResponse.isComplete || false
      };
      
      return NextResponse.json(validResponse);
    } catch (parseError) {

      
      // Try to extract meaningful text from AI response
      let cleanMessage = aiResponse;
      
      // Remove any JSON-like content that might confuse users
      cleanMessage = cleanMessage.replace(/\{[\s\S]*\}/g, '').trim();
      
      // If there's no meaningful content left, provide a default message
      if (!cleanMessage || cleanMessage.length < 10) {
        cleanMessage = "Anlayamadım, tekrar açıklayabilir misin? Daha basit bir şekilde söyleyebilirsin.";
      }
      
      return NextResponse.json({
        message: cleanMessage,
        cvData: cvData,
        nextQuestions: ["Devam et", "Daha detay ver", "CV'yi oluştur"],
        currentStep: "conversation",
        isComplete: false
      });
    }

  } catch (error) {

    
    // Check if user wants to create CV and return a completion response
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('oluştur') || lowerMessage.includes('hazırla') || lowerMessage.includes('tamamla')) {
      return NextResponse.json({
        message: "CV'niz hazır! Mevcut bilgilerle CV'niz oluşturuldu. 🎉",
        cvData: {
          personalInfo: {
            fullName: user?.fullName || cvData.personalInfo?.fullName || "",
            email: user?.email || cvData.personalInfo?.email || "",
            phone: user?.phone || cvData.personalInfo?.phone || "",
            address: cvData.personalInfo?.address || "",
            title: cvData.personalInfo?.title || "",
            summary: cvData.personalInfo?.summary || ""
          },
          experience: cvData.experience || [],
          education: cvData.education || [],
          skills: cvData.skills || { technical: [], personal: [], languages: [] }
        },
        nextQuestions: ["CV'mi önizle", "PDF olarak indir", "Düzenlemeler yap"],
        currentStep: "tamamlandi",
        isComplete: true
      });
    }
    
    // Generate AI-powered fallback response
    try {
      if (apiKey) {
        const fallbackResponse = await generateAIFallback(message, cvData, user, conversationHistory, apiKey);
        return NextResponse.json(fallbackResponse);
      } else {
        // No API key, go to simple fallback
        return generateSimpleFallback(message, cvData, user, conversationHistory);
      }
    } catch (fallbackError) {

      
      // Ultimate fallback - simple logic
      return generateSimpleFallback(message, cvData, user, conversationHistory);
    }
  }
}

function createSimplePrompt(userMessage: string, currentCVData: any, userInfo: any = null, conversationHistory: string[] = []): string {
  const userDataInfo = userInfo ? `
Mevcut Kullanıcı Bilgileri (otomatik doldurulacak):
- Ad Soyad: ${userInfo.fullName}
- Email: ${userInfo.email}
- Telefon: ${userInfo.phone || 'Belirtilmemiş'}
` : '';

  // Check if user has already introduced themselves
  const hasIntroduced = conversationHistory.some((msg: string) => {
    const lowerMsg = msg.toLowerCase();
    return (
      lowerMsg.includes('pozisyon') || 
      lowerMsg.includes('iş') || 
      lowerMsg.includes('için cv') ||
      lowerMsg.includes('başvuru') ||
      lowerMsg.includes('çalış') ||
      msg.length > 30 // Uzun mesajlar genelde tanıtım içerir
    );
  });

  // Also check if we already have position info from previous interactions
  const hasPositionInfo = currentCVData.personalInfo?.title && currentCVData.personalInfo.title.trim().length > 0;

  // Determine current step based on existing data and conversation
  let currentStep = 'kisisel_bilgiler';
  
  if (hasIntroduced || hasPositionInfo) {
    if (!currentCVData.personalInfo?.address || !currentCVData.personalInfo?.summary) {
      currentStep = 'kisisel_detaylar';
    } else if (!currentCVData.experience || currentCVData.experience.length === 0) {
      currentStep = 'deneyim';
    } else if (!currentCVData.education || currentCVData.education.length === 0) {
      currentStep = 'egitim';
    } else if (!currentCVData.skills || (!currentCVData.skills.technical?.length && !currentCVData.skills.personal?.length)) {
      currentStep = 'yetenekler';
    } else if (!currentCVData.certificates || currentCVData.certificates.length === 0) {
      currentStep = 'sertifikalar';
    } else {
      currentStep = 'son_kontrol';
    }
  }

  // Advanced steps for detailed CV completion
  const conversationContext = conversationHistory.length > 0 ? `
Önceki Konuşma:
${conversationHistory.slice(-3).map((msg, i) => `- ${msg}`).join('\n')}

BU ÖNEMLİ: Yukarıdaki konuşma geçmişine göre, kullanıcı zaten tanıştı mı kontrol et.
Eğer kullanıcı pozisyonunu belirttiyse, ASLA tekrar giriş sorusu sorma!
` : '';

  return `Sen bir CV oluşturma asistanısın. Türkçe konuşuyorsun ve kullanıcının CV'sini adım adım oluşturmasına yardım ediyorsun.

ÖNEMLI: Cevabını SADECE JSON formatında ver. Hiçbir açıklama, markdown veya ek metin kullanma.
${userDataInfo}
${conversationContext}

Şu anki Adım: ${currentStep}

ÖNEMLİ KURALLAR:
- Eğer conversation history'de pozisyon bilgisi varsa, ASLA giriş sorusu sorma
- Kullanıcı zaten kendini tanıttıysa, bir sonraki adıma geç
- Conversation history'yi dikkate alarak uygun soruları sor

Görevin:
1. Eğer kisisel_bilgiler adımındaysa: Kullanıcının hangi pozisyon için CV hazırladığını öğren
2. Eğer kisisel_detaylar adımındaysa: Adres, özet ve ek kişisel bilgileri al
3. Eğer deneyim adımındaysa: İş deneyimlerini detaylı olarak öğren
4. Eğer egitim adımındaysa: Eğitim bilgilerini topla
5. Eğer yetenekler adımındaysa: Teknik, kişisel ve dil becerilerini kategorize et
6. Eğer sertifikalar adımındaysa: Sertifika ve kursları öğren
7. Eğer son_kontrol adımındaysa: Profil fotoğrafı tercihi, referanslar, hobiler sor

ÖZEL KURALLAR:
- Eğer kullanıcı zaten pozisyonunu belirttiyse, adres ve özet iste
- Conversation history'de geçen bilgileri tekrar sorma
- Mevcut verileri ASLA silme, sadece ekle veya güncelle
- Her adımda sadece 1-2 soru sor
- son_kontrol adımında: "Profil fotoğrafı eklemek ister misin?", "Referansların var mı?" gibi sorular sor
- Kullanıcı "oluştur", "hazırla", "tamamla", "bitir" derse isComplete: true yap

Mevcut CV Verisi: ${JSON.stringify(currentCVData, null, 2)}

Kullanıcının son mesajı: "${userMessage}"

ZORUNLU JSON FORMAT:
{
  "message": "Kullanıcıya verilecek samimi ve adıma özel mesaj",
  "cvData": {
    "personalInfo": {
      "fullName": "${userInfo?.fullName || currentCVData.personalInfo?.fullName || ''}",
      "email": "${userInfo?.email || currentCVData.personalInfo?.email || ''}",
      "phone": "${userInfo?.phone || currentCVData.personalInfo?.phone || ''}",
      "address": "Mevcut veya yeni adres",
      "title": "Mevcut veya yeni pozisyon/unvan",
      "summary": "Mevcut veya yeni özet"
    },
    "experience": "Mevcut deneyimleri koru, yenilerini ekle",
    "education": "Mevcut eğitimleri koru, yenilerini ekle",
    "skills": {
      "technical": "Mevcut teknikleri koru, yenilerini ekle",
      "personal": "Mevcut kişiselleri koru, yenilerini ekle",
      "languages": "Mevcut dilleri koru, yenilerini ekle"
    },
    "certificates": "Sertifikaları ekle veya mevcut array",
    "references": "Referansları ekle veya mevcut array",
    "profilePhoto": "Profil fotoğrafı tercihi"
  },
  "nextQuestions": ["Adıma özel önerilen cevap 1", "Önerilen cevap 2", "Önerilen cevap 3"],
  "currentStep": "${currentStep}",
  "isComplete": false
}`;
}

// AI-powered fallback response generator
async function generateAIFallback(
  userMessage: string, 
  cvData: any, 
  user: any, 
  conversationHistory: string[], 
  apiKey: string
) {
  const fallbackPrompt = createFallbackPrompt(userMessage, cvData, user, conversationHistory);
  
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: fallbackPrompt
        }]
      }],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 512,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`AI Fallback failed: ${response.status}`);
  }

  const data = await response.json();
  const aiResponse = data.candidates[0]?.content?.parts[0]?.text;
  
  if (!aiResponse) {
    throw new Error('No AI fallback response');
  }

  // Try to parse JSON response
  try {
    let cleanResponse = aiResponse.trim();
    
    if (cleanResponse.startsWith('```json')) {
      cleanResponse = cleanResponse.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
    }
    if (cleanResponse.startsWith('```')) {
      cleanResponse = cleanResponse.replace(/```\s*/g, '').replace(/```\s*$/g, '');
    }
    
    const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanResponse = jsonMatch[0];
    }
    
    const jsonResponse = JSON.parse(cleanResponse);
    
    return {
      message: jsonResponse.message || aiResponse,
      cvData: {
        ...cvData,
        ...jsonResponse.cvData
      },
      nextQuestions: jsonResponse.nextQuestions || ["Devam et", "Daha detay ver", "CV'yi oluştur"],
      currentStep: jsonResponse.currentStep || "conversation",
      isComplete: jsonResponse.isComplete || false
    };
  } catch (parseError) {
    // If JSON parsing fails, use the text response
    return {
      message: aiResponse,
      cvData: cvData,
      nextQuestions: ["Devam et", "Daha detay ver", "CV'yi oluştur"],
      currentStep: "conversation",
      isComplete: false
    };
  }
}

// Simple fallback without AI
function generateSimpleFallback(
  userMessage: string, 
  cvData: any, 
  user: any, 
  conversationHistory: string[]
) {
  // Check conversation history to determine if this is a returning conversation
  const hasIntroduced = conversationHistory.some((msg: string) => {
    const lowerMsg = msg.toLowerCase();
    return (
      lowerMsg.includes('pozisyon') || 
      lowerMsg.includes('iş') || 
      lowerMsg.includes('için cv') ||
      lowerMsg.includes('başvuru') ||
      lowerMsg.includes('çalış') ||
      msg.length > 30
    );
  });
  
  const hasPositionInfo = cvData.personalInfo?.title && cvData.personalInfo.title.trim().length > 0;
  
  let fallbackMessage = "";
  let fallbackQuestions: string[] = [];
  let fallbackStep = "kisisel_bilgiler";
  
  if (hasIntroduced || hasPositionInfo) {
    if (!cvData.personalInfo?.address) {
      fallbackMessage = `Merhaba ${user?.fullName || 'tekrardan'}! Adres bilgini alabilir miyim?`;
      fallbackQuestions = ["İstanbul, Türkiye", "Ankara, Türkiye", "İzmir, Türkiye"];
      fallbackStep = "kisisel_detaylar";
    } else if (!cvData.experience || cvData.experience.length === 0) {
      fallbackMessage = "İş deneyimlerini konuşalım. Çalıştığın yerler var mı?";
      fallbackQuestions = ["Çalışıyorum", "Deneyim var", "Yeni mezunum"];
      fallbackStep = "deneyim";
    } else if (!cvData.education || cvData.education.length === 0) {
      fallbackMessage = "Eğitim geçmişini öğrenelim. Okul bilgilerini paylaşır mısın?";
      fallbackQuestions = ["Üniversite", "Lise", "Yüksek lisans"];
      fallbackStep = "egitim";
    } else {
      fallbackMessage = "CV'n neredeyse hazır! Son kontroller yapalım.";
      fallbackQuestions = ["Tamamla", "Düzenle", "Önizle"];
      fallbackStep = "son_kontrol";
    }
  } else {
    fallbackMessage = user?.fullName 
      ? `Merhaba ${user.fullName}! Hangi pozisyon için CV hazırlıyorsun?`
      : "Merhaba! Hangi pozisyon için CV hazırlıyorsun?";
    fallbackQuestions = ["Developer", "Designer", "Marketing"];
  }
  
  return NextResponse.json({
    message: fallbackMessage,
    cvData: {
      personalInfo: {
        fullName: user?.fullName || cvData.personalInfo?.fullName || "",
        email: user?.email || cvData.personalInfo?.email || "",
        phone: user?.phone || cvData.personalInfo?.phone || "",
        address: cvData.personalInfo?.address || "",
        title: cvData.personalInfo?.title || "",
        summary: cvData.personalInfo?.summary || ""
      },
      experience: cvData.experience || [],
      education: cvData.education || [],
      skills: cvData.skills || { technical: [], personal: [], languages: [] }
    },
    nextQuestions: fallbackQuestions,
    currentStep: fallbackStep,
    isComplete: false
  });
}

// Create prompt for AI fallback
function createFallbackPrompt(
  userMessage: string, 
  currentCVData: any, 
  userInfo: any, 
  conversationHistory: string[]
): string {
  const userDataInfo = userInfo ? `
Kullanıcı Bilgileri:
- Ad: ${userInfo.fullName}
- Email: ${userInfo.email}
- Telefon: ${userInfo.phone || 'Yok'}
` : '';

  const conversationContext = conversationHistory.length > 0 ? `
Son Konuşmalar:
${conversationHistory.slice(-2).map(msg => `- ${msg}`).join('\n')}
` : '';

  return `Sen bir CV asistanısın. Ana sistem çalışmıyor, bu yüzden basit fallback modundasın.

${userDataInfo}
${conversationContext}

Mevcut CV Durumu: ${JSON.stringify(currentCVData, null, 1)}

Kullanıcının son mesajı: "${userMessage}"

GÖREV: Kullanıcının mevcut durumuna göre en uygun sonraki adımı belirle ve 3 akıllı soru öner.

CEVAP FORMATI (SADECE JSON):
{
  "message": "Kısa ve samimi bir CV asistan mesajı",
  "cvData": {
    "personalInfo": {
      "fullName": "${userInfo?.fullName || currentCVData.personalInfo?.fullName || ''}",
      "email": "${userInfo?.email || currentCVData.personalInfo?.email || ''}",
      "phone": "${userInfo?.phone || currentCVData.personalInfo?.phone || ''}",
      "address": "mevcut adres veya yeni",
      "title": "mevcut pozisyon veya yeni",
      "summary": "mevcut özet veya yeni"
    }
  },
  "nextQuestions": ["Akıllı soru 1", "Akıllı soru 2", "Akıllı soru 3"],
  "currentStep": "uygun_adim",
  "isComplete": false
}`;
}
