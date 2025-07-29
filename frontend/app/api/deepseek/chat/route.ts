import { NextRequest, NextResponse } from 'next/server';

// DeepSeek API configuration
const DEEPSEEK_API_KEY = 'sk-78152d97e4224ea4babdc0c6eb508b81';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // DeepSeek API'sine gönderilecek mesajları hazırla
    const messages = [
      {
        role: 'system',
        content: 'Sen Pratik AI adında Türkçe konuşan, samimi ve profesyonel bir CV danışmanısın. JSON formatında yanıt veriyorsun.'
      },
      // Conversation history varsa ekle
      ...(conversationHistory || []).map((msg: any) => ({
        role: msg.role === 'ai' ? 'assistant' : 'user',
        content: msg.content
      })),
      {
        role: 'user',
        content: message
      }
    ];

    // DeepSeek API'sine istek gönder - timeout ile
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 5000); // 5 saniye timeout
    });

    const apiPromise = fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat', // DeepSeek'in en hızlı modeli
        messages: messages,
        temperature: 0.7,
        max_tokens: 800, // Hızlı yanıt için düşük token
        stream: false
      }),
    });

    const response = await Promise.race([apiPromise, timeoutPromise]) as Response;

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // DeepSeek specific error handling
      if (response.status === 429) {
        return NextResponse.json(
          { error: 'DeepSeek API rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      } else if (response.status === 401) {
        return NextResponse.json(
          { error: 'DeepSeek API key is invalid.' },
          { status: 401 }
        );
      } else if (response.status === 503) {
        return NextResponse.json(
          { error: 'DeepSeek API is temporarily unavailable.' },
          { status: 503 }
        );
      }
      
      throw new Error(errorData.error?.message || 'DeepSeek API request failed');
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || 'Yanıt alınamadı';

    return NextResponse.json({
      response: aiResponse,
      success: true
    });

  } catch (error: any) {

    
    if (error.message === 'Request timeout') {
      return NextResponse.json(
        { error: 'DeepSeek API timeout. Please try again.' },
        { status: 408 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'DeepSeek API error occurred' },
      { status: 500 }
    );
  }
}
