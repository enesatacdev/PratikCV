export type TemplateId = 'modern' | 'classic' | 'minimal' | 'premium' | 'executive';

export interface CVTemplate {
  id: string;
  name: string;
  description: string;
  category: 'professional' | 'creative' | 'modern' | 'classic';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  preview: string; // Preview image URL
  color: string; // Primary color
  features: string[];
  isPremium: boolean;
}

export const TEMPLATE_DEFINITIONS: Record<TemplateId, CVTemplate> = {
  modern: {
    id: 'modern',
    name: 'Modern Profesyonel',
    description: 'Kurumsal ortamlar için modern ve şık tasarım',
    category: 'modern',
    difficulty: 'beginner',
    preview: '/templates/modern-preview.png',
    color: '#3B82F6',
    features: ['Temiz tasarım', 'ATS uyumlu', 'Gradyan header'],
    isPremium: false
  },
  classic: {
    id: 'classic',
    name: 'Klasik Profesyonel',
    description: 'Geleneksel ve formal CV tasarımı',
    category: 'classic',
    difficulty: 'beginner',
    preview: '/templates/classic-preview.png',
    color: '#6B7280',
    features: ['Resmi tasarım', 'Geleneksel düzen', 'Konservatif'],
    isPremium: false
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal Temiz',
    description: 'Sade ve temiz minimalist tasarım',
    category: 'modern',
    difficulty: 'beginner',
    preview: '/templates/minimal-preview.png',
    color: '#2C3E50',
    features: ['Minimalist', 'Temiz çizgiler', 'Sade'],
    isPremium: false
  },
  premium: {
    id: 'premium',
    name: 'Premium Elite Şablonu',
    description: 'Üst düzey yöneticiler ve elit profesyoneller için lüks gradient tasarım',
    category: 'professional',
    difficulty: 'advanced',
    preview: '/templates/premium-preview.png',
    color: '#F59E0B',
    features: ['Lüks Tasarım', 'Gradient Efektleri', 'Yönetici Seviyesi', 'Premium Rozet'],
    isPremium: true
  },
  executive: {
    id: 'executive',
    name: 'Executive Black',
    description: 'Üst düzey yöneticiler için karanlık tema premium tasarım',
    category: 'professional',
    difficulty: 'advanced',
    preview: '/templates/executive-preview.png',
    color: '#000000',
    features: ['Karanlık Tema', 'Lüks Tasarım', 'Executive Level', 'Premium Siyah'],
    isPremium: true
  }
};

export interface TemplateConfig {
  template: CVTemplate;
  customizations: {
    primaryColor?: string;
    fontSize?: 'small' | 'medium' | 'large';
    spacing?: 'compact' | 'normal' | 'spacious';
    showPhoto?: boolean;
    sectionsOrder?: string[];
  };
}

export interface CVGenerationRequest {
  templateId: string;
  cvData: any; // CV form data
  config: TemplateConfig;
  method: 'manual' | 'ai';
}

export interface CVGenerationResponse {
  success: boolean;
  pdfUrl?: string;
  previewUrl?: string;
  error?: string;
}

export const CV_TEMPLATES: CVTemplate[] = [
  {
    id: 'modern-professional',
    name: 'Modern Profesyonel',
    description: 'Kurumsal ortamlar için modern ve şık tasarım',
    category: 'professional',
    difficulty: 'beginner',
    preview: '/templates/modern-professional.png',
    color: '#3B82F6',
    features: ['Temiz tasarım', 'ATS uyumlu', 'Minimalist'],
    isPremium: false
  },
  {
    id: 'creative-designer',
    name: 'Kreatif Tasarımcı',
    description: 'Yaratıcı sektörler için özgün tasarım',
    category: 'creative',
    difficulty: 'intermediate',
    preview: '/templates/creative-designer.png',
    color: '#8B5CF6',
    features: ['Renkli tasarım', 'Portfolio alanı', 'Grafik elementler'],
    isPremium: true
  },
  {
    id: 'minimal-classic',
    name: 'Minimal Klasik',
    description: 'Her sektör için uygun klasik tasarım',
    category: 'classic',
    difficulty: 'beginner',
    preview: '/templates/minimal-classic.png',
    color: '#6B7280',
    features: ['Sade tasarım', 'Evrensel uyum', 'Okunabilir'],
    isPremium: false
  },
  {
    id: 'tech-innovator',
    name: 'Teknoloji Uzmanı',
    description: 'IT ve teknoloji sektörü için özel tasarım',
    category: 'modern',
    difficulty: 'intermediate',
    preview: '/templates/tech-innovator.png',
    color: '#059669',
    features: ['Teknik odaklı', 'Proje gösterimi', 'Beceri grafikleri'],
    isPremium: true
  },
  {
    id: 'executive-leadership',
    name: 'Yönetici Liderlik',
    description: 'Üst düzey yönetici pozisyonları için',
    category: 'professional',
    difficulty: 'advanced',
    preview: '/templates/executive-leadership.png',
    color: '#DC2626',
    features: ['Prestijli görünüm', 'Başarı odaklı', 'Liderlik vurgusu'],
    isPremium: true
  },
  {
    id: 'fresh-graduate',
    name: 'Yeni Mezun',
    description: 'Kariyere yeni başlayanlar için ideal',
    category: 'modern',
    difficulty: 'beginner',
    preview: '/templates/fresh-graduate.png',
    color: '#F59E0B',
    features: ['Gençlik odaklı', 'Eğitim vurgusu', 'Potansiyel gösterimi'],
    isPremium: false
  }
];
