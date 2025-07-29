import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { fieldName, currentData } = await request.json();

    if (!fieldName) {
      return NextResponse.json({ 
        success: false, 
        error: 'fieldName gerekli' 
      }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `CV'deki mevcut bilgilere göre "${fieldName}" alanı için 3 kısa öneri ver:

Mevcut CV verileri:
${JSON.stringify(currentData || {}, null, 2)}

Sadece önerileri liste olarak ver, açıklama yapma. Her öneri yeni satırda olsun:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const suggestions = text.split('\n')
      .filter((line: string) => line.trim())
      .slice(0, 3)
      .map((line: string) => line.replace(/^[-*•]\s*/, '').trim()); // Liste işaretlerini temizle

    return NextResponse.json({ 
      success: true,
      suggestions,
      fieldName
    });

  } catch (error) {

    
    return NextResponse.json({ 
      success: false,
      error: 'AI önerileri alınamadı',
      suggestions: []
    }, { status: 500 });
  }
}
