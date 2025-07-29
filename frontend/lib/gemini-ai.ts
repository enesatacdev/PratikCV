interface CVData {
  userId?: string;
  title?: string;
  templateName?: string;
  status?: string;
  personalInfo?: {
    fullName?: string;
    firstName?: string;
    lastName?: string;
    birthday?: string;
    phones?: string[];
    emails?: string[];
    email?: string; // Backward compatibility
    phone?: string; // Backward compatibility
    address?: string;
    nationality?: string;
    drivingLicense?: string;
    profilePhoto?: string;
    summary?: string;
    title?: string; // Job title/position
  };
  aboutMe?: string;
  experience?: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    description: string;
    achievements?: string;
  }>;
  education?: Array<{
    school: string;
    department?: string;
    degree: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    gpa?: string;
    description?: string;
  }>;
  skills?: {
    technical?: string[];
    personal?: string[];
    languages?: Array<{
      language: string;
      level: string;
    }>;
  };
  socialMedia?: Array<{
    platform: string;
    url: string;
  }>;
  certificates?: Array<{
    name: string;
    issuer: string;
    date: string;
    url?: string;
    description?: string;
  }>;
  references?: Array<{
    name: string;
    position: string;
    company: string;
    phone?: string;
    email?: string;
    relationship?: string;
  }>;
  extras?: {
    hobbies?: string[];
    projects?: Array<{
      name: string;
      description?: string;
      url?: string;
      startDate?: string;
      endDate?: string;
    }>;
  };
  hobbies?: string[]; // Backward compatibility
  additionalInfo?: string;
}

interface ChatResponse {
  message: string;
  cvData?: Partial<CVData>;
  nextQuestions?: string[];
  isComplete?: boolean;
  currentStep?: string;
}

class GeminiAIService {
  private apiKey: string;
  private baseUrl: string = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
  }

  private createPrompt(userMessage: string, conversationHistory: string[], currentCVData: Partial<CVData>): string {
    const systemPrompt = `Sen bir CV oluşturma asistanısın. Türkçe konuşuyorsun ve kullanıcının CV'sini adım adım oluşturmasına yardım ediyorsun.

Görevin:
1. Kullanıcıdan kişisel bilgilerini al (ad, soyad, email, telefon, adres, unvan, özet)
2. İş deneyimlerini detaylı olarak öğren (pozisyon, şirket, tarihler, açıklama)
3. Eğitim bilgilerini topla (derece, okul, tarihler)
4. Yeteneklerini kategorize et (teknik, kişisel, dil becerileri)
5. Sertifikalarını kaydet

Mevcut CV Verisi: ${JSON.stringify(currentCVData, null, 2)}

Konuşma Geçmişi:
${conversationHistory.join('\n')}

Kullanıcının son mesajı: "${userMessage}"

Lütfen:
- Samimi ve yardımcı bir tonla cevap ver
- Bir seferde sadece 1-2 soru sor
- Kullanıcının verdiği bilgileri JSON formatında çıkar
- Hangi adımda olduğunu belirt
- Eksik bilgiler varsa nazikçe iste

Cevabını şu JSON formatında ver:
{
  "message": "Kullanıcıya verilecek mesaj",
  "cvData": {/* Çıkarılan CV verileri */},
  "nextQuestions": ["Önerilen soru 1", "Önerilen soru 2"],
  "currentStep": "hangi adımda",
  "isComplete": false
}`;

    return systemPrompt;
  }

  async generateResponse(
    userMessage: string, 
    conversationHistory: string[] = [], 
    currentCVData: Partial<CVData> = {}
  ): Promise<ChatResponse> {
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory,
          cvData: currentCVData
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data;

    } catch (error) {
      throw new Error('AI servis şu anda kullanılamıyor');
    }
  }

  // CV verilerini analiz et ve eksik kısımları belirle
  analyzeCVCompleteness(cvData: Partial<CVData>): { 
    completionPercentage: number; 
    missingFields: string[];
    nextStep: string;
  } {
    const requiredFields = [
      { key: 'personalInfo.fullName', weight: 15, name: 'Ad Soyad' },
      { key: 'personalInfo.email', weight: 10, name: 'E-posta' },
      { key: 'personalInfo.phone', weight: 10, name: 'Telefon' },
      { key: 'personalInfo.title', weight: 15, name: 'Unvan' },
      { key: 'personalInfo.summary', weight: 15, name: 'Özet' },
      { key: 'experience', weight: 25, name: 'İş Deneyimi' },
      { key: 'education', weight: 10, name: 'Eğitim' }
    ];

    let totalScore = 0;
    const missingFields: string[] = [];

    requiredFields.forEach(field => {
      const keys = field.key.split('.');
      let value = cvData as any;
      
      for (const key of keys) {
        value = value?.[key];
      }

      if (value && (Array.isArray(value) ? value.length > 0 : true)) {
        totalScore += field.weight;
      } else {
        missingFields.push(field.name);
      }
    });

    // Determine next step
    let nextStep = 'kisisel_bilgiler';
    if (cvData.personalInfo?.fullName) nextStep = 'is_deneyimi';
    if (cvData.experience?.length) nextStep = 'egitim';
    if (cvData.education?.length) nextStep = 'yetenekler';
    if (cvData.skills) nextStep = 'tamamlama';

    return {
      completionPercentage: Math.round(totalScore),
      missingFields,
      nextStep
    };
  }
}

export const geminiAI = new GeminiAIService();
export type { CVData, ChatResponse };
