// Akıllı Meslek Tespit Sistemi - Sınırsız Meslek Desteği

interface ProfessionResult {
  profession: string;
  confidence: number;
  category: string;
  isGeneral: boolean;
  suggestedSkills: {
    technical: string[];
    soft: string[];
    languages: string[];
  };
  suggestedCompanies: string[];
}

export class AIProfessionDetector {
  
  /**
   * Ana meslek tespit fonksiyonu - TAMAMEN AI TABANLI
   */
  static async detectProfession(input: string, context: string[] = []): Promise<ProfessionResult | null> {
    const combined = (input + ' ' + context.join(' ')).toLowerCase();
    
    try {
      // 1. Öncelik: AI API ile analiz (ana method)
      const aiResult = await this.aiProfessionAnalysis(combined);
      if (aiResult) return aiResult;

      // 2. AI başarısız olursa tekrar farklı prompt ile dene
      const aiRetryResult = await this.aiProfessionAnalysisRetry(combined);
      if (aiRetryResult) return aiRetryResult;

      // 3. Son çare: Türkçe meslek eki tespiti + AI'a sor
      return await this.fallbackWithAI(combined);

    } catch (error) {
      // Hata durumunda bile AI'a sor
      return await this.emergencyAIAnalysis(combined);
    }
  }

  /**
   * Hızlı yerel tespit - DEVRE DIŞI (AI öncelikli)
   */
  private static quickProfessionDetection(combined: string): ProfessionResult | null {
    // Hardcoded veriler kaldırıldı - AI'a yönlendir
    return null;
  }

  /**
   * AI API ile meslek analizi
   */
  private static async aiProfessionAnalysis(combined: string): Promise<ProfessionResult | null> {
    try {
      // Gerçek AI API entegrasyonu
      const response = await fetch('/api/ai/analyze-profession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: combined,
          language: 'tr'
        }),
      });

      if (!response.ok) {
        throw new Error('AI API hatası');
      }

      const result = await response.json();
      
      if (result && result.profession) {
        return {
          profession: result.profession,
          confidence: result.confidence || 0.8,
          category: result.category || 'Genel',
          isGeneral: false,
          suggestedSkills: result.skills || this.generateEmptySkills(),
          suggestedCompanies: result.companies || ['Şirket', 'Kurum', 'Organizasyon']
        };
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * AI Retry - Farklı prompt ile tekrar dene
   */
  private static async aiProfessionAnalysisRetry(combined: string): Promise<ProfessionResult | null> {
    try {
      const response = await fetch('/api/ai/analyze-profession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: combined,
          language: 'tr',
          retry: true // Farklı prompt için flag
        }),
      });

      if (!response.ok) return null;

      const result = await response.json();
      
      if (result && result.profession) {
        return {
          profession: result.profession,
          confidence: result.confidence || 0.7,
          category: result.category || 'Genel',
          isGeneral: false,
          suggestedSkills: result.skills || this.generateEmptySkills(),
          suggestedCompanies: result.companies || []
        };
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Kategori bazlı tespit - DEVRE DIŞI (AI öncelikli)
   */
  private static categoryBasedDetection(combined: string): ProfessionResult | null {
    // Hardcoded kategoriler kaldırıldı - AI'a yönlendir
    return null;
  }

  /**
   * AI ile fallback
   */
  private static async fallbackWithAI(combined: string): Promise<ProfessionResult | null> {
    // Türkçe meslek eki tespit et ve AI'a sor
    const words = combined.split(' ');
    const possibleProfession = words.find(word => 
      word.length > 4 && 
      (word.endsWith('cı') || word.endsWith('ci') || word.endsWith('çı') || word.endsWith('çi') || 
       word.endsWith('ör') || word.endsWith('ist') || word.endsWith('man'))
    );

    const prompt = possibleProfession 
      ? `Bu kişi "${possibleProfession}" mesleği ile ilgili konuşuyor. Detaylı analiz: ${combined}`
      : `Bu metni analiz et: ${combined}`;

    try {
      const response = await fetch('/api/ai/analyze-profession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: prompt,
          language: 'tr',
          fallback: true
        }),
      });

      if (!response.ok) return this.absoluteFallback();

      const result = await response.json();
      
      if (result && result.profession) {
        return {
          profession: result.profession,
          confidence: result.confidence || 0.6,
          category: result.category || 'Genel',
          isGeneral: true,
          suggestedSkills: result.skills || this.generateEmptySkills(),
          suggestedCompanies: result.companies || []
        };
      }

      return this.absoluteFallback();
    } catch (error) {
      return this.absoluteFallback();
    }
  }

  /**
   * Acil durum AI analizi
   */
  private static async emergencyAIAnalysis(combined: string): Promise<ProfessionResult | null> {
    try {
      // Basit AI prompt ile son deneme
      const response = await fetch('/api/ai/analyze-profession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: `Acil: Bu kişinin mesleğini tahmin et: ${combined}`,
          language: 'tr',
          emergency: true
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result && result.profession) {
          return {
            profession: result.profession,
            confidence: 0.5,
            category: 'Genel',
            isGeneral: true,
            suggestedSkills: this.generateEmptySkills(),
            suggestedCompanies: ['Şirket', 'Kurum']
          };
        }
      }

      return this.absoluteFallback();
    } catch (error) {
      return this.absoluteFallback();
    }
  }

  /**
   * Son çare tespit - Minimal fallback
   */
  private static fallbackDetection(combined: string): ProfessionResult | null {
    return this.absoluteFallback();
  }

  /**
   * Mutlak son çare - En minimal yanıt
   */
  private static absoluteFallback(): ProfessionResult {
    return {
      profession: 'Profesyonel',
      confidence: 0.3,
      category: 'Genel',
      isGeneral: true,
      suggestedSkills: this.generateEmptySkills(),
      suggestedCompanies: ['Şirket', 'Kurum', 'Organizasyon']
    };
  }

  /**
   * Boş yetenekler - AI başarısız olursa minimal fallback
   */
  private static generateEmptySkills() {
    return {
      technical: ['Microsoft Office'],
      soft: ['İletişim'],
      languages: ['Türkçe']
    };
  }

}
