import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function GET() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent("Test mesajı - sadece 'OK' yanıtla");
    const response = await result.response;
    const text = response.text();
    
    const isWorking = text.toLowerCase().includes('ok');
    
    return NextResponse.json({ 
      success: isWorking,
      status: isWorking ? 'Gemini AI bağlantısı başarılı' : 'Gemini AI bağlantısı test edildi',
      response: text.trim()
    });

  } catch (error) {

    
    return NextResponse.json({ 
      success: false,
      status: 'Gemini AI bağlantısı başarısız',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 });
  }
}
