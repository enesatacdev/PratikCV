import { NextRequest, NextResponse } from 'next/server';

interface VoiceChatRequest {
  message: string;
  cvData: string;
  chatHistory: Array<{
    role: string;
    content: string;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const { message, cvData, chatHistory }: VoiceChatRequest = await request.json();
    
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'Gemini API key not configured'
      }, { status: 500 });
    }

    // CV verilerini parse et
    let parsedCvData: any;
    try {
      parsedCvData = typeof cvData === 'string' ? JSON.parse(cvData) : cvData;
    } catch (e) {
      parsedCvData = {};
    }

    // Sesli sohbet için özel prompt oluştur
    const prompt = createVoiceChatPrompt(message, parsedCvData, chatHistory);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
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
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid Gemini API response');
    }

    const aiResponse = data.candidates[0].content.parts[0].text;
    
    // Yanıtı parse et (JSON formatında dönebilir)
    let parsedResponse: any;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (e) {
      // Düz metin yanıtı
      parsedResponse = {
        message: aiResponse,
        cvData: parsedCvData,
        suggestedQuestions: generateSuggestedQuestions(message)
      };
    }

    return NextResponse.json({
      success: true,
      message: parsedResponse.message || aiResponse,
      cvData: parsedResponse.cvData || parsedCvData,
      suggestedQuestions: parsedResponse.suggestedQuestions || generateSuggestedQuestions(message)
    });

  } catch (error) {

    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata oluştu'
    }, { status: 500 });
  }
}

function createVoiceChatPrompt(message: string, cvData: any, chatHistory: any[]): string {
  // Önceki konuşma geçmişini hazırla
  const historyText = chatHistory
    .slice(-10) // Son 10 mesajı al
    .map(msg => `${msg.role === 'user' ? 'Kullanıcı' : 'Asistan'}: ${msg.content}`)
    .join('\n');

  return `Sen bir CV oluşturma asistanısın. Kullanıcının sesli mesajlarına Türkçe yanıt veriyorsun.

MEVCUT CV VERİLERİ:
${JSON.stringify(cvData, null, 2)}

KONUŞMA GEÇMİŞİ:
${historyText}

KULLANICININ MEVCUt MEsAJI: ${message}

GÖREVLER:
1. Kullanıcının sesli mesajına samimi ve yardımcı bir şekilde yanıt ver
2. CV verilerini güncellemek gerekiyorsa, güncellenmiş verileri de gönder
3. Sonraki adımlar için 3-4 adet önerilen soru üret

YANIT FORMATI (JSON):
{
  "message": "Kullanıcıya verilecek mesaj (Türkçe, samimi, yardımcı ton)",
  "cvData": {güncellenmiş CV verileri, değişiklik yoksa mevcut veriler},
  "suggestedQuestions": [
    "Önerilen soru 1",
    "Önerilen soru 2", 
    "Önerilen soru 3",
    "Önerilen soru 4"
  ]
}

KURALLAR:
- Türkçe yanıt ver
- Samimi ve destekleyici ol
- CV oluşturma sürecinde rehberlik et
- Kullanıcının sorularını tam olarak anlamaya çalış
- Gereksiz bilgi isteme, mevcut verileri kullan`;
}

function generateSuggestedQuestions(userMessage: string): string[] {
  const defaultQuestions = [
    "Kişisel bilgilerimi eklemek istiyorum",
    "İş deneyimlerimi anlatmak istiyorum",
    "Eğitim bilgilerimi paylaşmak istiyorum",
    "Yeteneklerimi eklemek istiyorum"
  ];

  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes('deneyim') || lowerMessage.includes('iş')) {
    return [
      "Hangi pozisyonlarda çalıştın?",
      "İş deneyimlerindeki başarılarını anlat",
      "Yeni bir iş deneyimi eklemek ister misin?",
      "Bu deneyimde hangi teknolojileri kullandın?"
    ];
  }

  if (lowerMessage.includes('eğitim') || lowerMessage.includes('okul') || lowerMessage.includes('üniversite')) {
    return [
      "Hangi bölümden mezun oldun?",
      "Üniversite notunu eklemek ister misin?",
      "Başka eğitim deneyimin var mı?",
      "Sertifika veya kursların var mı?"
    ];
  }

  if (lowerMessage.includes('yetenek') || lowerMessage.includes('skill') || lowerMessage.includes('beceri')) {
    return [
      "Teknik yeteneklerini say",
      "Kişisel özelliklerini anlat",
      "Hangi dilleri biliyorsun?",
      "En güçlü yanın nedir?"
    ];
  }

  return defaultQuestions;
}

export async function GET() {
  return NextResponse.json({ 
    message: "Voice AI Chat API is working", 
    method: "GET",
    timestamp: new Date().toISOString()
  });
}
