export interface FieldProcessingResult {
  improvedText: string;
  suggestions?: string[];
  confidence: number;
}

export class GeminiService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = process.env.NEXT_PUBLIC_FRONTEND_API_URL || 'http://localhost:3000/api';
  }

  /**
   * CV alanını AI ile geliştirir - Token tasarruflu tek alan işleme
   */
  async improveField(fieldName: string, userInput: string, instruction?: string): Promise<string> {
    try {
      const response = await fetch(`${this.apiUrl}/ai/improve-field`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fieldName,
          userInput,
          instruction
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'AI ile alan işleme başarısız oldu');
      }

      return data.improvedText;
    } catch (error) {
      throw new Error('AI ile alan işleme başarısız oldu');
    }
  }

  /**
   * Alanlar arası öneri sistemi
   */
  async getSuggestions(fieldName: string, currentData: any): Promise<string[]> {
    try {
      const response = await fetch(`${this.apiUrl}/ai/get-suggestions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fieldName,
          currentData
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        return [];
      }

      return data.suggestions || [];
    } catch (error) {
      return [];
    }
  }

  /**
   * Voice AI için mesaj işleme
   */
  async processVoiceMessage(message: string, cvData: string, chatHistory: any[]): Promise<{
    message: string;
    cvData?: any;
    suggestedQuestions?: string[];
  }> {
    try {
      const response = await fetch(`${this.apiUrl}/ai/voice-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          cvData,
          chatHistory
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Sesli AI ile iletişim başarısız oldu');
      }

      return {
        message: data.message,
        cvData: data.cvData,
        suggestedQuestions: data.suggestedQuestions
      };
    } catch (error) {
      throw new Error('Sesli AI ile iletişim başarısız oldu');
    }
  }

  /**
   * API durumunu kontrol et
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/ai/test-connection`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

// Singleton instance
export const geminiService = new GeminiService();
