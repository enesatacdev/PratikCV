import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { userName, userEmail } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Sen bir CV uzmanı AI asistanısın. Kullanıcı için hoş geldin mesajı oluştur.

Kullanıcı: ${userName || 'Değerli kullanıcı'}

YANITINI ŞU FORMATTA VER:
🌟 Kişiselleştirilmiş selamlama

📋 CV oluşturma sürecini kısaca tanıt

🤖 AI asistan olduğunu belirt

🎯 Meslek alanı sorusu sor

KURALLAR:
• Her satır ayrı paragraf olsun
• Satır sonlarında \\n kullan
• 3-4 cümle yaz
• Emoji kullan ama abartma
• Türkçe yaz
• Sadece mesajı ver, açıklama ekleme`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const welcomeMessage = response.text();

    // Önerilen sorular - sabit kalabilir
    const suggestedQuestions = [
      "Yazılım geliştirme alanında çalışmak istiyorum",
      "Mimarlık alanında uzmanlaşmak istiyorum", 
      "Grafik tasarım ve kreatif işlerle ilgileniyorum",
      "Pazarlama ve dijital medya alanında ilerlemek istiyorum",
      "Farklı bir alanda çalışıyorum, söyleyeyim"
    ];

    return NextResponse.json({ 
      message: welcomeMessage.trim(),
      suggestedQuestions,
      success: true 
    });

  } catch (error) {

    
    // userName değişkenine erişmek için request'i yeniden parse et
    const { userName } = await request.json().catch(() => ({ userName: null }));
    
    // Fallback message - satır atlamalı format
    const fallbackMessage = `🌟 Merhaba ${userName || 'değerli kullanıcı'}! 👋 

📋 Ben senin AI CV asistanınım. Birlikte profesyonel bir CV hazırlayalım! 

🤖 Doğal dilde konuşabilir, tüm sorularını yanıtlayabilirim.

🎯 Hangi alanda kariyer yapmak istiyorsun?`;
    
    return NextResponse.json({ 
      message: fallbackMessage,
      suggestedQuestions: [
        "Yazılım geliştirme alanında çalışmak istiyorum",
        "Mimarlık alanında uzmanlaşmak istiyorum",
        "Grafik tasarım ve kreatif işlerle ilgileniyorum",
        "Pazarlama ve dijital medya alanında ilerlemek istiyorum",
        "Farklı bir alanda çalışıyorum, söyleyeyim"
      ],
      success: false,
      error: 'AI mesaj üretimi başarısız, fallback kullanıldı'
    });
  }
}
