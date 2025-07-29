import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini AI configuration
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Initialize Gemini model with timeout - 2.5-flash daha hızlı!
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp', // En yeni ve hızlı model
      generationConfig: {
        temperature: 0.7,
        topK: 1,
        topP: 1,
        maxOutputTokens: 800, // Daha az token = daha hızlı yanıt
      },
    });

    // Create chat with history
    const chat = model.startChat({
      history: conversationHistory || [],
    });

    // Send message to Gemini with timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 5000); // 5 saniye timeout - 2.0-flash çok hızlı
    });

    const result = await Promise.race([
      chat.sendMessage(message),
      timeoutPromise
    ]) as any;
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      response: text,
      success: true
    });

  } catch (error: any) {


    // Specific error handling based on error type
    let errorMessage = 'Üzgünüm, şu anda AI servisi kullanılamıyor. Lütfen manuel olarak devam edin.';
    let statusCode = 500;

    if (error.message?.includes('overloaded') || error.message?.includes('503')) {
      errorMessage = 'AI servisi şu anda yoğun. Birkaç saniye bekleyip tekrar deneyin.';
      statusCode = 503;
    } else if (error.message?.includes('quota') || error.message?.includes('429')) {
      errorMessage = 'AI servisi günlük limitine ulaştı. Lütfen yarın tekrar deneyin.';
      statusCode = 429;
    } else if (error.message?.includes('API_KEY') || error.message?.includes('401')) {
      errorMessage = 'AI servisi yapılandırması eksik. Lütfen yönetici ile iletişime geçin.';
      statusCode = 401;
    } else if (error.message?.includes('network') || error.message?.includes('timeout')) {
      errorMessage = 'Bağlantı sorunu yaşanıyor. İnternet bağlantınızı kontrol edin.';
      statusCode = 502;
    }

    // Return fallback response with specific error handling
    return NextResponse.json({
      response: errorMessage,
      success: false,
      error: error.message,
      retry: statusCode === 503 // Sadece overload durumunda retry öner
    }, { status: statusCode });
  }
}
