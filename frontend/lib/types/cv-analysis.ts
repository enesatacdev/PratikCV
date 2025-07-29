// CV Analysis Types
export interface CVAnalysisRequest {
  cvData?: any;
  pdfFile?: string; // Base64 encoded PDF
  analysisType?: 'cv-data' | 'pdf-upload';
}

export interface SectionAnalysis {
  score: number;
  feedback: string;
}

export interface CVAnalysisResult {
  overall_score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  sections: {
    personal_info: SectionAnalysis;
    experience: SectionAnalysis;
    education: SectionAnalysis;
    skills: SectionAnalysis;
    design?: SectionAnalysis; // Only for PDF analysis
  };
  industry_match: string;
  competitiveness: string;
  missing_elements: string[];
  format_quality?: {
    readability: string;
    structure: string;
    length: string;
  }; // Only for PDF analysis
}

export interface CVAnalysisResponse {
  success: boolean;
  analysis?: CVAnalysisResult;
  error?: string;
  details?: string;
  timestamp: string;
}

// Helper functions for CV Analysis
export const analyzeCVData = async (cvData: any): Promise<CVAnalysisResponse> => {
  try {
    const response = await fetch('/api/cv-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cvData,
        analysisType: 'cv-data'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: 'CV analizi sırasında bir hata oluştu',
      timestamp: new Date().toISOString()
    };
  }
};

export const analyzePDFFile = async (file: File): Promise<CVAnalysisResponse> => {
  try {
    // PDF dosyasını base64'e çevir
    const base64String = await fileToBase64(file);
    
    const response = await fetch('/api/cv-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pdfFile: base64String,
        analysisType: 'pdf-upload'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: 'PDF analizi sırasında bir hata oluştu',
      timestamp: new Date().toISOString()
    };
  }
};

// PDF dosyasını base64'e çeviren yardımcı fonksiyon
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Data URL'den base64 kısmını al (data:application/pdf;base64, kısmını çıkar)
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

// Skor rengini belirleyen yardımcı fonksiyon
export const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

// Skor seviyesini belirleyen yardımcı fonksiyon
export const getScoreLevel = (score: number): string => {
  if (score >= 90) return 'Mükemmel';
  if (score >= 80) return 'Çok İyi';
  if (score >= 70) return 'İyi';
  if (score >= 60) return 'Orta';
  if (score >= 50) return 'Zayıf';
  return 'Çok Zayıf';
};
