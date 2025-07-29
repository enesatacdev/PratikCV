'use client';

import React, { useState, useRef, useEffect, Suspense } from "react";
import { useAuth } from "@/lib/auth-context";
import { useSearchParams, useRouter } from 'next/navigation';
import { TemplateId } from '@/lib/types/templates';
import { CVData, ChatResponse } from '@/lib/gemini-ai'; // AI entegrasyonu
import { geminiService } from '@/lib/gemini-service'; // Yeni Gemini servisi
import { api } from '@/lib/api';
import CVTemplate from "@/components/cv/CVTemplate";
import toast from 'react-hot-toast';
import { 
  ArrowLeft, 
  Send, 
  Bot, 
  User as UserIcon, 
  Sparkles,
  FileText,
  Download,
  RefreshCw,
  MessageCircle,
  Eye,
  Save,
  CheckCircle,
  Settings
} from "lucide-react";
import Link from "next/link";
import Breadcrumb from "@/components/ui/breadcrumb";

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  cvData?: any;
  suggestedQuestions?: string[];
}

// Message type alias for consistency
type Message = ChatMessage;

// CV JSON Şablonu - Pratik AI için
interface CVDataStructure {
  personalInfo: {
    fullName: string;
    phones: string[];
    emails: string[];
    address: string;
    profilePhoto: string;
    summary: string;
  };
  aboutMe: string;
  education: Array<{
    school: string;
    department: string;
    startDate: string;
    endDate: string;
    degree: string;
    gpa: string;
  }>;
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
    achievements: string;
  }>;
  skills: {
    technical: string[];
    personal: string[];
    languages: Array<{
      language: string;
      level: string;
    }>;
  };
  socialMedia: Array<{
    platform: string;
    url: string;
  }>;
  certificates: Array<{
    name: string;
    issuer: string;
    date: string;
    credentialId: string;
  }>;
  references: Array<{
    name: string;
    position: string;
    company: string;
    phone: string;
    email: string;
    relationship: string;
  }>;
  extras: {
    hobbies: string[];
    projects: Array<{
      name: string;
      description: string;
      technologies: string[];
      url: string;
    }>;
    volunteerWork: Array<{
      organization: string;
      role: string;
      startDate: string;
      endDate: string;
      description: string;
    }>;
    awards: Array<{
      name: string;
      issuer: string;
      date: string;
      description: string;
    }>;
  };
}

function AIChatCVContent() {
  const { user, isLoading } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedTemplate = (searchParams.get('template') as TemplateId) || 'modern';
  
  // Kullanıcıya özel başlangıç mesajı oluştur - Pratik AI
  const getInitialMessages = (): ChatMessage[] => {
    if (!user) {
      return [
        {
          id: '1',
          type: 'ai',
          content: 'Merhaba! Ben Pratik AI, CV asistanınızım. 🤖 Birlikte harika bir CV oluşturacağız! Öncelikle giriş yapmanız gerekiyor.',
          timestamp: new Date(),
          suggestedQuestions: []
        }
      ];
    }
    
    return []; // Boş array - İlk mesaj cvProcessor tarafından oluşturulacak
  };

  // Pratik AI state'leri
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // AI işleme durumu
  const [aiStatus, setAiStatus] = useState<'online' | 'slow' | 'offline'>('online');
  const [cvProgress, setCvProgress] = useState(0);
  const [cvData, setCvData] = useState<CVDataStructure | null>(null);
  const [currentField, setCurrentField] = useState<string>('');
  const [conversationStarted, setConversationStarted] = useState(false);
  const [isGeneratingCV, setIsGeneratingCV] = useState(false);
  const [isPDFGenerating, setIsPDFGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const cvRef = useRef<HTMLDivElement>(null);

  // Gelişmiş state'ler
  const [currentEducationIndex, setCurrentEducationIndex] = useState(0);
  const [currentExperienceIndex, setCurrentExperienceIndex] = useState(0);
  const [isAddingMoreEducation, setIsAddingMoreEducation] = useState(false);
  const [isAddingMoreExperience, setIsAddingMoreExperience] = useState(false);
  const [isUsingAI, setIsUsingAI] = useState(false);
  const [editMode, setEditMode] = useState<{field: string, originalValue: string} | null>(null);
  const [fieldHistory, setFieldHistory] = useState<Record<string, any>>({});
  
  // Dil ekleme state'leri
  const [currentLanguage, setCurrentLanguage] = useState('');
  const [currentLanguageLevel, setCurrentLanguageLevel] = useState('');
  const [isAddingLanguage, setIsAddingLanguage] = useState(false);
  const [languageStep, setLanguageStep] = useState<'name' | 'level' | 'more'>('name');

  // Sertifika ekleme state'leri
  const [currentCertificate, setCurrentCertificate] = useState({
    name: '',
    issuer: '',
    date: ''
  });
  const [isAddingCertificate, setIsAddingCertificate] = useState(false);
  const [certificateStep, setCertificateStep] = useState<'name' | 'issuer' | 'date' | 'more'>('name');

  // Sosyal medya ekleme state'leri
  const [currentSocialMedia, setCurrentSocialMedia] = useState({
    platform: '',
    url: ''
  });
  const [isAddingSocialMedia, setIsAddingSocialMedia] = useState(false);
  const [socialMediaStep, setSocialMediaStep] = useState<'platform' | 'url' | 'more'>('platform');

  // Referans ekleme state'leri
  const [currentReference, setCurrentReference] = useState({
    name: '',
    position: '',
    company: '',
    phone: '',
    email: ''
  });
  const [isAddingReference, setIsAddingReference] = useState(false);
  const [referenceStep, setReferenceStep] = useState<'name' | 'position' | 'company' | 'phone' | 'email' | 'more'>('name');



  // LocalStorage anahtar
  const STORAGE_KEY = `cv_data_${user?.id || 'temp'}`;

  // Inline field update handler
  const handleInlineFieldUpdate = (fieldPath: string, newValue: string) => {
    if (!cvData) return;
    
    const updatedData = { ...cvData };
        
    if (fieldPath.startsWith('skill.')) {
      // Handle skill updates: skill.{id}.name or skill.{id}.level
      const [_, skillIdWithPrefix, field] = fieldPath.split('.');
      
      if (field === 'level') {
        // Update language skill level
        if (skillIdWithPrefix.startsWith('lang-')) {
          const langIndex = parseInt(skillIdWithPrefix.replace('lang-', ''));
          if (updatedData.skills?.languages && updatedData.skills.languages[langIndex]) {
            // Convert numeric level back to string for data structure
            const levelValue = parseInt(newValue);
            let levelString = newValue;
            
            if (levelValue === 1) levelString = 'Başlangıç';
            else if (levelValue === 2) levelString = 'Orta';
            else if (levelValue === 3) levelString = 'İyi';
            else if (levelValue === 4) levelString = 'İleri';
            else if (levelValue === 5) levelString = 'Ana Dil';
            
            updatedData.skills.languages[langIndex].level = levelString;
          }
        }
      } else if (field === 'name') {
        // Update skill name
        if (skillIdWithPrefix.startsWith('lang-')) {
          const langIndex = parseInt(skillIdWithPrefix.replace('lang-', ''));
          if (updatedData.skills?.languages && updatedData.skills.languages[langIndex]) {
            updatedData.skills.languages[langIndex].language = newValue;
          }
        } else if (skillIdWithPrefix.startsWith('tech-')) {
          const techIndex = parseInt(skillIdWithPrefix.replace('tech-', ''));
          if (updatedData.skills?.technical && updatedData.skills.technical[techIndex]) {
            updatedData.skills.technical[techIndex] = newValue;
          }
        } else if (skillIdWithPrefix.startsWith('personal-')) {
          const personalIndex = parseInt(skillIdWithPrefix.replace('personal-', ''));
          if (updatedData.skills?.personal && updatedData.skills.personal[personalIndex]) {
            updatedData.skills.personal[personalIndex] = newValue;
          }
        }
      }
    } else {
      // Handle regular nested field paths like 'personalInfo.firstName'
      const pathParts = fieldPath.split('.');
      let current: any = updatedData;
      
      // Navigate to the parent object
      for (let i = 0; i < pathParts.length - 1; i++) {
        if (!current[pathParts[i]]) {
          current[pathParts[i]] = {};
        }
        current = current[pathParts[i]];
      }
      
      // Set the final value
      current[pathParts[pathParts.length - 1]] = newValue;
    }
    
    // Update CV data and save to storage (without adding chat message)
    setCvData(updatedData);
    saveCVToStorage(updatedData);
  };

  // Handle adding new items to sections
  const handleAddNew = (section: string) => {
    // Removed functionality as requested
  };

  // Field display names for inline editing feedback
  const getInlineFieldDisplayName = (fieldPath: string): string => {
    const fieldNames: Record<string, string> = {
      'personalInfo.title': 'Meslek/Pozisyon',
      'personalInfo.summary': 'Özet',
      'aboutMe': 'Hakkımda',
      // Add more field mappings as needed
    };
    return fieldNames[fieldPath] || fieldPath;
  };

  // Alan adlarını Türkçe karşılıkları ile eşleştir
  const getFieldDisplayName = (fieldName: string): string => {
    const fieldNames: Record<string, string> = {
      aboutMe: 'Hakkımda',
      education_school: 'Okul/Üniversite',
      education_department: 'Bölüm',
      education_degree: 'Derece',
      education_gpa: 'GPA',
      education_startDate: 'Başlangıç Yılı',
      education_endDate: 'Bitiş Yılı',
      experience_company: 'Şirket',
      experience_position: 'Pozisyon',
      experience_startDate: 'Başlangıç Yılı',
      experience_endDate: 'Bitiş Yılı',
      experience_description: 'İş Açıklaması',
      technicalSkills: 'Teknik Yetenekler',
      personalSkills: 'Kişisel Özellikler',
      language_name: 'Dil',
      language_level: 'Dil Seviyesi',
      languages: 'Diller',
      hobbies: 'Hobiler'
    };
    return fieldNames[fieldName] || fieldName;
  };

  // Soru sırası ve alan tanımları - User bilgileri hariç
  const fieldOrder = [
    'aboutMe',
    'education_confirm',
    'education_school',
    'education_department', 
    'education_degree',
    'education_gpa',
    'education_startDate',
    'education_endDate',
    'education_more',
    'experience_confirm',
    'experience_company',
    'experience_position',
    'experience_startDate',
    'experience_endDate',
    'experience_description',
    'experience_more',
    'skills_confirm',
    'technicalSkills',
    'personalSkills',
    'language_name',
    'language_level',
    'language_more',
    'certificates_confirm',
    'certificates_name',
    'certificates_issuer',
    'certificates_date',
    'certificates_more',
    'socialMedia_confirm',
    'socialMedia_platform',
    'socialMedia_url',
    'socialMedia_more',
    'references_confirm',
    'references_name',
    'references_position',
    'references_company',
    'references_phone',
    'references_email',
    'references_more',
    'hobbies',
    'color_selection',
    'completed'
  ];

  const fieldQuestions: Record<string, string> = {
    aboutMe: 'Kendinizden kısaca bahseder misiniz?',
    education_confirm: 'Eğitim bilgilerinizi eklemek ister misiniz?',
    education_school: 'Okul/Üniversite adınızı giriniz:',
    education_department: 'Bölümünüzü giriniz:',
    education_degree: 'Dereceniz (Lisans, Yüksek Lisans vb.):',
    education_gpa: 'Not ortalamanız (varsa):',
    education_startDate: 'Eğitime başlama yılınız:',
    education_endDate: 'Eğitimi bitirme yılınız (veya beklenen):',
    education_more: 'Başka bir eğitim kaydı eklemek ister misiniz?',
    experience_confirm: 'İş deneyimi bilgilerinizi eklemek ister misiniz?',
    experience_company: 'Çalıştığınız şirket adı:',
    experience_position: 'Pozisyonunuz:',
    experience_startDate: 'İşe başlama yılınız:',
    experience_endDate: 'İşten ayrılma yılınız (veya "halen"):',
    experience_description: 'Kısa iş tanımı veya başarılarınız:',
    experience_more: 'Başka bir iş deneyimi eklemek ister misiniz?',
    skills_confirm: 'Yetenek ve becerilerinizi eklemek ister misiniz?',
    technicalSkills: 'Teknik yeteneklerinizi giriniz (birden fazla ekleyebilirsiniz):',
    personalSkills: 'Kişisel yeteneklerinizi giriniz (birden fazla ekleyebilirsiniz):',
    language_name: 'Hangi dili biliyorsunuz?',
    language_level: 'Bu dildeki seviyeniz nedir?\n\n**Seçenekler:** Başlangıç, Temel, Orta, İyi, İleri, Çok İyi, Ana Dil',
    language_more: 'Başka bir dil eklemek ister misiniz?',
    certificates_confirm: 'Sertifikalarınızı eklemek ister misiniz?',
    certificates_name: 'Sertifika adını giriniz:',
    certificates_issuer: 'Sertifikayı veren kuruluş:',
    certificates_date: 'Sertifika alma tarihi (yıl):',
    certificates_more: 'Başka bir sertifika eklemek ister misiniz?',
    socialMedia_confirm: 'Sosyal medya hesaplarınızı eklemek ister misiniz?',
    socialMedia_platform: 'Platform adı (LinkedIn, GitHub, Portfolio vb.):',
    socialMedia_url: 'Profil URL\'inizi giriniz:',
    socialMedia_more: 'Başka bir sosyal medya hesabı eklemek ister misiniz?',
    references_confirm: 'Referanslarınızı eklemek ister misiniz?',
    references_name: 'Referans kişinin adı soyadı:',
    references_position: 'Referans kişinin pozisyonu:',
    references_company: 'Referans kişinin çalıştığı şirket:',
    references_phone: 'Referans kişinin telefon numarası:',
    references_email: 'Referans kişinin e-mail adresi:',
    references_more: 'Başka bir referans eklemek ister misiniz?',
    hobbies: 'Hobilerinizi giriniz (birden fazla ekleyebilirsiniz):',
    color_selection: 'CV\'nizin renk temasını seçiniz:'
  };

  // User bilgileri yüklendiğinde sistemi başlat
  useEffect(() => {
    if (user && !conversationStarted) {
      
      // Önce localStorage'dan veri yüklemeyi dene
      const existingData = loadCVFromStorage();
      
      let initialCvData: CVDataStructure;
      
      if (existingData) {
        // Mevcut veri varsa kullan
        initialCvData = existingData;
      } else {
        // Boş CV şablonunu oluştur
        initialCvData = {
          personalInfo: {
            fullName: user.name || '',
            phones: [(user as any)?.phones?.[0] || ''],
            emails: [user.email || ''],
            address: (user as any)?.address || '',
            profilePhoto: user.avatar || '',
            summary: ''
          },
          aboutMe: '',
          education: [],
          experience: [],
          skills: {
            technical: [],
            personal: [],
            languages: []
          },
          socialMedia: [],
          certificates: [],
          references: [],
          extras: {
            hobbies: [],
            projects: [],
            volunteerWork: [],
            awards: []
          }
        };
        
        // LocalStorage'a kaydet
        saveCVToStorage(initialCvData);
      }

      setCvData(initialCvData);
      setConversationStarted(true);
      
      // İlk soruyu gönder - User bilgileri hariç
      const welcomeMessage: ChatMessage = {
        id: '1',
        type: 'ai',
        content: `Merhaba ${user.name}! 👋 CV oluşturma sürecine başlayalım. Kişisel bilgileriniz zaten mevcut.\n\n🤖 **AI Özelliği:** Bilgilerinizi doğal dilde yazabilirsiniz, AI otomatik olarak düzenleyecek.\n📝 **Manuel Mod:** "atla" yazarak alanları atlayabilirsiniz.\n\n${fieldQuestions[fieldOrder[0]]}`,
        timestamp: new Date(),
        suggestedQuestions: ['Atla', 'AI ile doldur']
      };
      
      setMessages([welcomeMessage]);
      setCurrentField(fieldOrder[0]);
    }
  }, [user, conversationStarted]);

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'CV Oluştur', href: '/dashboard' },
    { label: 'AI Chat ile CV', current: true }
  ];

  // Progress hesaplama fonksiyonu - Esnek yaklaşım
  const calculateProgress = (data: CVDataStructure): number => {
    let score = 0;
    let totalPossible = 0;
    
    // Kişisel Bilgiler (otomatik olarak user'dan alınır, 40 puan)
    totalPossible += 40;
    if (data.personalInfo.fullName?.trim()) score += 15; // İsim daha önemli
    if (data.personalInfo.emails?.length > 0 && data.personalInfo.emails[0]?.trim()) score += 10;
    if (data.personalInfo.phones?.length > 0 && data.personalInfo.phones[0]?.trim()) score += 10;
    if (data.personalInfo.address?.trim()) score += 5; // Adres daha az önemli
    
    // About Me (10 puan) - Yeni eklenen
    totalPossible += 10;
    if (data.aboutMe?.trim()) score += 10;
    
    // İş Deneyimi (25 puan) - Önemli ama zorunlu değil
    totalPossible += 25;
    if (data.experience && data.experience.length > 0) score += 25;
    
    // Eğitim (15 puan) - Önemli ama zorunlu değil  
    totalPossible += 15;
    if (data.education && data.education.length > 0) score += 15;
    
    // Yetenekler (10 puan) - İyi olur ama zorunlu değil
    totalPossible += 10;
    if (data.skills && (data.skills.technical?.length || data.skills.personal?.length)) score += 10;
    
    // En az %20 varsa CV oluşturulabilir kabul et
    const percentage = Math.round((score / totalPossible) * 100);
    return Math.max(percentage, score > 0 ? 20 : 0); // En az bir bilgi varsa %20'den başlat
  };

  // LocalStorage yardımcı fonksiyonları
  const saveCVToStorage = (data: CVDataStructure) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      // Storage error handling
    }
  };

  const loadCVFromStorage = (): CVDataStructure | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        return parsed;
      }
    } catch (error) {

    }
    return null;
  };

  // Token tasarruflu AI alan işleme - Yeni Gemini servisi
  const processFieldWithAI = async (fieldName: string, userInput: string, instruction?: string): Promise<string> => {
    try {
      setIsProcessing(true);
      const improvedText = await geminiService.improveField(fieldName, userInput, instruction);
      return improvedText;
    } catch (error) {

      return userInput; // AI başarısız olursa orijinal metni döndür
    } finally {
      setIsProcessing(false);
    }
  };

  // Dil seviyesi seçenekleri
  const getLanguageLevelOptions = (): string[] => {
    return ['Başlangıç', 'Temel', 'Orta', 'İyi', 'İleri', 'Çok İyi', 'Ana Dil'];
  };

  // Renk seçenekleri
  const colorOptions = [
    { name: 'Mavi', value: 'blue', primary: '#3B82F6', secondary: '#DBEAFE' },
    { name: 'Yeşil', value: 'green', primary: '#10B981', secondary: '#D1FAE5' },
    { name: 'Mor', value: 'purple', primary: '#8B5CF6', secondary: '#EDE9FE' },
    { name: 'Kırmızı', value: 'red', primary: '#EF4444', secondary: '#FEE2E2' },
    { name: 'Turuncu', value: 'orange', primary: '#F59E0B', secondary: '#FEF3C7' },
    { name: 'Pembe', value: 'pink', primary: '#EC4899', secondary: '#FCE7F3' },
    { name: 'Turkuaz', value: 'teal', primary: '#14B8A6', secondary: '#CCFBF1' },
    { name: 'Gri', value: 'gray', primary: '#6B7280', secondary: '#F3F4F6' }
  ];

  // Kullanıcı dostu içerik formatı oluştur
  const formatFieldValueForDisplay = (fieldName: string, value: string): string => {
    switch (fieldName) {
      case 'languages':
        try {
          const languages = JSON.parse(value);
          if (Array.isArray(languages)) {
            return languages.map(lang => 
              typeof lang === 'object' ? `${lang.language} (${lang.level})` : lang
            ).join(', ');
          }
          return value;
        } catch {
          return value;
        }
      case 'language_level':
        // Dil seviyesi için mevcut değer + seçenekleri göster
        const levelOptions = getLanguageLevelOptions();
        const currentLevel = value || 'Henüz seçilmedi';
        return `${currentLevel}\n\n**Seçenekler:** ${levelOptions.join(', ')}`;
      case 'skills':
      case 'technicalSkills':
      case 'personalSkills':
        try {
          const skills = JSON.parse(value);
          if (Array.isArray(skills)) {
            return skills.join(', ');
          }
          return value;
        } catch {
          return value;
        }
      case 'hobbies':
        try {
          const hobbies = JSON.parse(value);
          if (Array.isArray(hobbies)) {
            return hobbies.join(', ');
          }
          return value;
        } catch {
          return value;
        }
      default:
        return value;
    }
  };

  // Düzenleme modu işleyicisi - Önizlemeden gelen düzenleme istekleri için
  const handleEditRequest = (fieldName: string, currentValue: string, editInstruction: string) => {
    // Düzenleme modunu aktifleştir
    setEditMode({ field: fieldName, originalValue: currentValue });
    
    // Mevcut değeri kullanıcı dostu formatta göster
    const displayValue = formatFieldValueForDisplay(fieldName, currentValue);
    const fieldDisplayName = getFieldDisplayName(fieldName);
    
    // Kullanıcıya düzenleme bilgisi ver ve girdi bekle
    const editMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'ai',
      content: `✏️ **${fieldDisplayName}** alanını düzenliyorsunuz.\n\n**Mevcut içerik:**\n${displayValue}\n\n**Yeni içeriği yazın:**`,
      timestamp: new Date(),
      suggestedQuestions: ['AI ile düzenle', 'Manuel düzenle', 'İptal']
    };
    
    setMessages(prev => [...prev, editMessage]);
    
    // Düzenleme alanını aktif hale getir
    setCurrentField(fieldName);
  };

  // Belirli alanı güncelleme - Tüm alanlar için tam destek
  const updateSpecificField = (data: CVDataStructure, fieldName: string, value: string): CVDataStructure => {
    const newData = { ...data };
    
    // Alan geçmişini kaydet
    setFieldHistory(prev => ({
      ...prev,
      [fieldName]: data
    }));
    
    switch (fieldName) {
      // Kişisel Bilgiler
      case 'fullName':
        newData.personalInfo.fullName = value;
        break;
      case 'email':
        if (!newData.personalInfo.emails) newData.personalInfo.emails = [];
        newData.personalInfo.emails[0] = value;
        break;
      case 'phone':
        if (!newData.personalInfo.phones) newData.personalInfo.phones = [];
        newData.personalInfo.phones[0] = value;
        break;
      case 'address':
        newData.personalInfo.address = value;
        break;
      case 'summary':
        newData.personalInfo.summary = value;
        break;
      case 'aboutMe':
        newData.aboutMe = value;
        break;
        
      // Eğitim Alanları
      case 'education':
        // Eğitim JSON string'ini parse et
        try {
          const educationData = JSON.parse(value);
          newData.education = educationData;
        } catch {
          // JSON değilse direkt eğitim bilgisi olarak işle
          const educationText = value.trim();
          // Basit parsing: "Üniversite, Bölüm, Derece, Tarih" formatı
          const parts = educationText.split(',').map(p => p.trim());
          
          if (!newData.education) newData.education = [];
          
          const newEducation = {
            school: parts[0] || educationText,
            department: parts[1] || '',
            degree: parts[2] || '',
            startDate: '',
            endDate: parts[3] || '',
            gpa: ''
          };
          
          // Mevcut eğitimi güncelle ya da yeni ekle
          if (newData.education.length > 0) {
            newData.education[0] = newEducation; // İlk eğitimi güncelle
          } else {
            newData.education.push(newEducation);
          }
        }
        break;
      case 'education_school':
        if (!newData.education[currentEducationIndex]) {
          newData.education[currentEducationIndex] = { school: '', department: '', startDate: '', endDate: '', degree: '', gpa: '' };
        }
        newData.education[currentEducationIndex].school = value;
        break;
      case 'education_department':
        if (!newData.education[currentEducationIndex]) {
          newData.education[currentEducationIndex] = { school: '', department: '', startDate: '', endDate: '', degree: '', gpa: '' };
        }
        newData.education[currentEducationIndex].department = value;
        break;
      case 'education_degree':
        if (!newData.education[currentEducationIndex]) {
          newData.education[currentEducationIndex] = { school: '', department: '', startDate: '', endDate: '', degree: '', gpa: '' };
        }
        newData.education[currentEducationIndex].degree = value;
        break;
      case 'education_gpa':
        if (!newData.education[currentEducationIndex]) {
          newData.education[currentEducationIndex] = { school: '', department: '', startDate: '', endDate: '', degree: '', gpa: '' };
        }
        newData.education[currentEducationIndex].gpa = value;
        break;
      case 'education_startDate':
        if (!newData.education[currentEducationIndex]) {
          newData.education[currentEducationIndex] = { school: '', department: '', startDate: '', endDate: '', degree: '', gpa: '' };
        }
        newData.education[currentEducationIndex].startDate = value;
        break;
      case 'education_endDate':
        if (!newData.education[currentEducationIndex]) {
          newData.education[currentEducationIndex] = { school: '', department: '', startDate: '', endDate: '', degree: '', gpa: '' };
        }
        newData.education[currentEducationIndex].endDate = value;
        break;
        
      // Deneyim Alanları
      case 'experience':
        // Deneyim JSON string'ini parse et
        try {
          const experienceData = JSON.parse(value);
          newData.experience = experienceData;
        } catch {
          // JSON değilse direkt deneyim bilgisi olarak işle
          const experienceText = value.trim();
          // Basit parsing: "Şirket, Pozisyon, Başlangıç, Bitiş, Açıklama" formatı
          const parts = experienceText.split(',').map(p => p.trim());
          
          if (!newData.experience) newData.experience = [];
          
          const newExperience = {
            company: parts[0] || experienceText,
            position: parts[1] || '',
            startDate: parts[2] || '',
            endDate: parts[3] || '',
            description: parts[4] || experienceText,
            achievements: ''
          };
          
          // Mevcut deneyimi güncelle ya da yeni ekle
          if (newData.experience.length > 0) {
            newData.experience[0] = newExperience; // İlk deneyimi güncelle
          } else {
            newData.experience.push(newExperience);
          }
        }
        break;
      case 'experience_company':
        if (!newData.experience[currentExperienceIndex]) {
          newData.experience[currentExperienceIndex] = { company: '', position: '', startDate: '', endDate: '', description: '', achievements: '' };
        }
        newData.experience[currentExperienceIndex].company = value;
        break;
      case 'experience_position':
        if (!newData.experience[currentExperienceIndex]) {
          newData.experience[currentExperienceIndex] = { company: '', position: '', startDate: '', endDate: '', description: '', achievements: '' };
        }
        newData.experience[currentExperienceIndex].position = value;
        break;
      case 'experience_startDate':
        if (!newData.experience[currentExperienceIndex]) {
          newData.experience[currentExperienceIndex] = { company: '', position: '', startDate: '', endDate: '', description: '', achievements: '' };
        }
        newData.experience[currentExperienceIndex].startDate = value;
        break;
      case 'experience_endDate':
        if (!newData.experience[currentExperienceIndex]) {
          newData.experience[currentExperienceIndex] = { company: '', position: '', startDate: '', endDate: '', description: '', achievements: '' };
        }
        newData.experience[currentExperienceIndex].endDate = value;
        break;
      case 'experience_description':
        if (!newData.experience[currentExperienceIndex]) {
          newData.experience[currentExperienceIndex] = { company: '', position: '', startDate: '', endDate: '', description: '', achievements: '' };
        }
        newData.experience[currentExperienceIndex].description = value;
        break;
      case 'experience_achievements':
        if (!newData.experience[currentExperienceIndex]) {
          newData.experience[currentExperienceIndex] = { company: '', position: '', startDate: '', endDate: '', description: '', achievements: '' };
        }
        newData.experience[currentExperienceIndex].achievements = value;
        break;
        
      // Yetenek Alanları
      case 'skills':
      case 'technicalSkills':
        // Yetenek JSON string'ini parse et
        try {
          const skillsData = JSON.parse(value);
          newData.skills = skillsData;
        } catch {
          // JSON değilse comma separated olarak işle
          const skillList = value.split(',').map(s => s.trim()).filter(Boolean);
          newData.skills.technical = [...(newData.skills.technical || []), ...skillList];
        }
        break;
      case 'personalSkills':
        try {
          const skillsData = JSON.parse(value);
          newData.skills.personal = skillsData;
        } catch {
          const skillList = value.split(',').map(s => s.trim()).filter(Boolean);
          newData.skills.personal = [...(newData.skills.personal || []), ...skillList];
        }
        break;
      case 'languages':
        // Dil JSON string'ini parse et
        try {
          const languagesData = JSON.parse(value);
          newData.skills.languages = languagesData;
        } catch {
          // JSON değilse comma separated olarak işle
          const langList = value.split(',').map(lang => ({ 
            language: lang.trim(), 
            level: 'Orta' 
          })).filter(l => l.language);
          newData.skills.languages = langList;
        }
        break;
        
      // Ekstra Alanlar
      case 'hobbies':
        // Hobi alanını güncelle
        const hobbiesList = value.split(',').map(h => h.trim()).filter(Boolean);
        newData.extras.hobbies = hobbiesList;
        break;
      case 'projects':
        try {
          const projectsData = JSON.parse(value);
          newData.extras.projects = projectsData;
        } catch {
          const projectsList = value.split(',').map(p => ({
            name: p.trim(),
            description: '',
            technologies: [],
            url: ''
          })).filter(p => p.name);
          newData.extras.projects = [...(newData.extras.projects || []), ...projectsList];
        }
        break;
      case 'certificates':
        try {
          const certificatesData = JSON.parse(value);
          newData.certificates = certificatesData;
        } catch {
          const certList = value.split(',').map(cert => ({
            name: cert.trim(),
            issuer: '',
            date: '',
            credentialId: ''
          })).filter(c => c.name);
          newData.certificates = [...(newData.certificates || []), ...certList];
        }
        break;
      case 'references':
        try {
          const referencesData = JSON.parse(value);
          newData.references = referencesData;
        } catch {
          const refList = value.split(',').map(ref => ({
            name: ref.trim(),
            position: '',
            company: '',
            phone: '',
            email: '',
            relationship: ''
          })).filter(r => r.name);
          newData.references = [...(newData.references || []), ...refList];
        }
        break;
      case 'socialMedia':
        try {
          const socialData = JSON.parse(value);
          newData.socialMedia = socialData;
        } catch {
          const socialList = value.split(',').map(social => ({
            platform: social.trim(),
            url: '',
            username: ''
          })).filter(s => s.platform);
          newData.socialMedia = [...(newData.socialMedia || []), ...socialList];
        }
        break;
      case 'volunteerWork':
        try {
          const volunteerData = JSON.parse(value);
          newData.extras.volunteerWork = volunteerData;
        } catch {
          const volunteerList = value.split(',').map(v => ({
            organization: v.trim(),
            role: '',
            startDate: '',
            endDate: '',
            description: ''
          })).filter(v => v.organization);
          newData.extras.volunteerWork = [...(newData.extras.volunteerWork || []), ...volunteerList];
        }
        break;
      case 'awards':
        try {
          const awardsData = JSON.parse(value);
          newData.extras.awards = awardsData;
        } catch {
          const awardsList = value.split(',').map(a => ({
            name: a.trim(),
            issuer: '',
            date: '',
            description: ''
          })).filter(a => a.name);
          newData.extras.awards = [...(newData.extras.awards || []), ...awardsList];
        }
        break;
      default:
        // Genel alan güncellemesi
        break;
    }
    
    return newData;
  };

  // Yardımcı fonksiyonlar - Tüm alanlar için mevcut değerleri al
  const getCurrentFieldValue = (data: CVDataStructure, fieldName: string): string => {
    switch (fieldName) {
      // Kişisel Bilgiler
      case 'fullName':
        return data.personalInfo?.fullName || '';
      case 'email':
        return data.personalInfo?.emails?.[0] || '';
      case 'phone':
        return data.personalInfo?.phones?.[0] || '';
      case 'address':
        return data.personalInfo?.address || '';
      case 'summary':
        return data.personalInfo?.summary || '';
      case 'aboutMe':
        return data.aboutMe || '';
        
      // Eğitim Alanları
      case 'education':
        return JSON.stringify(data.education || []);
      case 'education_school':
        return data.education?.[currentEducationIndex]?.school || '';
      case 'education_department':
        return data.education?.[currentEducationIndex]?.department || '';
      case 'education_degree':
        return data.education?.[currentEducationIndex]?.degree || '';
      case 'education_gpa':
        return data.education?.[currentEducationIndex]?.gpa || '';
      case 'education_startDate':
        return data.education?.[currentEducationIndex]?.startDate || '';
      case 'education_endDate':
        return data.education?.[currentEducationIndex]?.endDate || '';
        
      // Deneyim Alanları
      case 'experience':
        return JSON.stringify(data.experience || []);
      case 'experience_company':
        return data.experience?.[currentExperienceIndex]?.company || '';
      case 'experience_position':
        return data.experience?.[currentExperienceIndex]?.position || '';
      case 'experience_startDate':
        return data.experience?.[currentExperienceIndex]?.startDate || '';
      case 'experience_endDate':
        return data.experience?.[currentExperienceIndex]?.endDate || '';
      case 'experience_description':
        return data.experience?.[currentExperienceIndex]?.description || '';
      case 'experience_achievements':
        return data.experience?.[currentExperienceIndex]?.achievements || '';
        
      // Yetenek Alanları
      case 'skills':
      case 'technicalSkills':
        return data.skills?.technical?.join(', ') || '';
      case 'personalSkills':
        return data.skills?.personal?.join(', ') || '';
      case 'language_name':
        return currentLanguage || '';
      case 'language_level':
        return currentLanguageLevel || '';
      case 'languages':
        return data.skills?.languages?.map(l => typeof l === 'object' ? l.language : l).join(', ') || '';
        
      // Ekstra Alanlar
      case 'hobbies':
        return data.extras?.hobbies?.join(', ') || '';
      case 'projects':
        return JSON.stringify(data.extras?.projects || []);
      case 'certificates':
        return JSON.stringify(data.certificates || []);
      case 'references':
        return JSON.stringify(data.references || []);
      case 'socialMedia':
        return JSON.stringify(data.socialMedia || []);
      case 'volunteerWork':
        return JSON.stringify(data.extras?.volunteerWork || []);
      case 'awards':
        return JSON.stringify(data.extras?.awards || []);
        
      default:
        return '';
    }
  };

  // Manuel CV alanını güncelle - Tüm alanlar için tam destek
  const updateCVFieldManual = (data: CVDataStructure, field: string, value: string): CVDataStructure => {
    const newData = { ...data };
    
    // Kişisel bilgiler
    if (field === 'fullName') {
      newData.personalInfo.fullName = value;
    } else if (field === 'email') {
      if (!newData.personalInfo.emails) newData.personalInfo.emails = [];
      newData.personalInfo.emails[0] = value;
    } else if (field === 'phone') {
      if (!newData.personalInfo.phones) newData.personalInfo.phones = [];
      newData.personalInfo.phones[0] = value;
    } else if (field === 'address') {
      newData.personalInfo.address = value;
    } else if (field === 'summary') {
      newData.personalInfo.summary = value;
    } else if (field === 'aboutMe') {
      newData.aboutMe = value;
    } 
    // Eğitim alanları
    else if (field.startsWith('education_')) {
      const key = field.replace('education_', '');
      
      if (key === 'more') {
        // Eğitim ekleme durumu
        return newData;
      }
      
      // Mevcut eğitim indeksine göre işlem yap
      if (!newData.education[currentEducationIndex]) {
        newData.education[currentEducationIndex] = { 
          school: '', department: '', startDate: '', endDate: '', degree: '', gpa: '' 
        };
      }
      (newData.education[currentEducationIndex] as any)[key] = value;
      
    } 
    // Deneyim alanları
    else if (field.startsWith('experience_')) {
      const key = field.replace('experience_', '');
      
      if (key === 'more') {
        // Deneyim ekleme durumu
        return newData;
      }
      
      // Mevcut deneyim indeksine göre işlem yap
      if (!newData.experience[currentExperienceIndex]) {
        newData.experience[currentExperienceIndex] = { 
          company: '', position: '', startDate: '', endDate: '', description: '', achievements: '' 
        };
      }
      (newData.experience[currentExperienceIndex] as any)[key] = value;
      
    } 
    // Yetenek alanları
    else if (field === 'technicalSkills') {
      const newSkills = value.split(',').map(s => s.trim()).filter(Boolean);
      newData.skills.technical = [...(newData.skills.technical || []), ...newSkills];
    } else if (field === 'personalSkills') {
      const newSkills = value.split(',').map(s => s.trim()).filter(Boolean);
      newData.skills.personal = [...(newData.skills.personal || []), ...newSkills];
    } else if (field === 'language_name' || field === 'language_level') {
      // Bu alanlar processManualResponse'da özel olarak işleniyor
      return newData;
    } else if (field === 'languages') {
      const newLanguages = value.split(',').map(lang => ({ 
        language: lang.trim(), 
        level: 'Orta' 
      })).filter(l => l.language);
      newData.skills.languages = [...(newData.skills.languages || []), ...newLanguages];
    } 
    // Ekstra alanlar
    else if (field === 'hobbies') {
      const newHobbies = value.split(',').map(s => s.trim()).filter(Boolean);
      newData.extras.hobbies = [...(newData.extras.hobbies || []), ...newHobbies];
    } else if (field === 'projects') {
      const newProjects = value.split(',').map(p => ({
        name: p.trim(),
        description: '',
        technologies: [],
        url: ''
      })).filter(p => p.name);
      newData.extras.projects = [...(newData.extras.projects || []), ...newProjects];
    } else if (field === 'certificates') {
      const newCertificates = value.split(',').map(cert => ({
        name: cert.trim(),
        issuer: '',
        date: '',
        credentialId: ''
      })).filter(c => c.name);
      newData.certificates = [...(newData.certificates || []), ...newCertificates];
    } else if (field === 'socialMedia') {
      const newSocialMedia = value.split(',').map(social => ({
        platform: social.trim(),
        url: '',
        username: ''
      })).filter(s => s.platform);
      newData.socialMedia = [...(newData.socialMedia || []), ...newSocialMedia];
    } else if (field === 'volunteerWork') {
      const newVolunteerWork = value.split(',').map(v => ({
        organization: v.trim(),
        role: '',
        startDate: '',
        endDate: '',
        description: ''
      })).filter(v => v.organization);
      newData.extras.volunteerWork = [...(newData.extras.volunteerWork || []), ...newVolunteerWork];
    } else if (field === 'awards') {
      const newAwards = value.split(',').map(a => ({
        name: a.trim(),
        issuer: '',
        date: '',
        description: ''
      })).filter(a => a.name);
      newData.extras.awards = [...(newData.extras.awards || []), ...newAwards];
    }
    
    return newData;
  };

  // Manuel kullanıcı cevabını işle - Çoklu veri desteği ile
  const processManualResponse = async (userInput: string) => {
    if (!cvData) return;

    let updatedCvData = { ...cvData };
    let aiResponse = '';
    let nextField = '';
    let suggestions: string[] = ['Atla'];

    const currentIndex = fieldOrder.indexOf(currentField);
    
    // Düzenleme modunda mı kontrol et
    if (editMode) {
      const response = userInput.toLowerCase().trim();
      
      if (response === 'iptal') {
        setEditMode(null);
        aiResponse = '❌ Düzenleme iptal edildi.';
        suggestions = ['Devam et'];
        return { updatedCvData, aiResponse, nextField: currentField, suggestions };
      } else if (response === 'ai ile düzenle' || response.includes('ai ile')) {
        try {
          const improvedText = await processFieldWithAI(editMode.field, editMode.originalValue, "Bu alanı düzenle ve geliştir");
          updatedCvData = updateSpecificField(cvData, editMode.field, improvedText);
          saveCVToStorage(updatedCvData);
          aiResponse = `✅ **${getFieldDisplayName(editMode.field)}** güncellendi:\n\n${improvedText}`;
          suggestions = ['Uygun', 'Tekrar düzenle'];
          setEditMode(null);
          return { updatedCvData, aiResponse, nextField: currentField, suggestions };
        } catch (error) {
          aiResponse = '❌ Düzenleme hatası. Manuel deneyin.';
          suggestions = ['Tekrar dene', 'İptal'];
          return { updatedCvData, aiResponse, nextField: currentField, suggestions };
        }
      } else {
        // Manuel düzenleme - Languages alanı için özel işlem
        if (editMode.field === 'languages') {
          // Dil güncelleme için özel akış
          const newLanguageName = userInput.trim();
          
          if (newLanguageName) {
            // Yeni dil adını geçici olarak kaydet
            setCurrentLanguage(newLanguageName);
            setEditMode(null);
            setCurrentField('language_level');
            
            aiResponse = `✅ **Dil:** ${newLanguageName}\n\n${fieldQuestions['language_level']}`;
            suggestions = getLanguageLevelOptions();
            return { updatedCvData, aiResponse, nextField: 'language_level', suggestions };
          } else {
            aiResponse = '❌ Lütfen geçerli bir dil adı girin.';
            suggestions = ['İngilizce', 'Almanca', 'Fransızca', 'İptal'];
            return { updatedCvData, aiResponse, nextField: currentField, suggestions };
          }
        }
        
        // Diğer alanlar için normal manuel düzenleme
        try {
          const improvedText = await processFieldWithAI(editMode.field, userInput, "Bu metni düzenle ve geliştir");
          updatedCvData = updateSpecificField(cvData, editMode.field, improvedText);
          saveCVToStorage(updatedCvData);
          aiResponse = `✅ **${getFieldDisplayName(editMode.field)}** güncellendi:\n\n${improvedText}`;
          suggestions = ['Uygun', 'Tekrar düzenle'];
          setEditMode(null);
          return { updatedCvData, aiResponse, nextField: currentField, suggestions };
        } catch (error) {
          // AI başarısız olursa direkt kaydet
          updatedCvData = updateSpecificField(cvData, editMode.field, userInput);
          saveCVToStorage(updatedCvData);
          aiResponse = `✅ **${getFieldDisplayName(editMode.field)}** güncellendi:\n\n${userInput}`;
          suggestions = ['Uygun', 'Tekrar düzenle'];
          setEditMode(null);
          return { updatedCvData, aiResponse, nextField: currentField, suggestions };
        }
      }
    }
    
    // Dil alanları kontrolü - EditMode dışında da çalışmalı  
    if (currentField === 'language_name') {
      setCurrentLanguage(userInput.trim());
      nextField = 'language_level';
      aiResponse = `✅ **Dil:** ${userInput}\n\n${fieldQuestions['language_level']}`;
      suggestions = getLanguageLevelOptions();
      return { updatedCvData, aiResponse, nextField, suggestions };
    } else if (currentField === 'language_level') {
      setCurrentLanguageLevel(userInput.trim());
      
      // Dil ve seviyeyi CV'ye ekle
      if (!updatedCvData.skills.languages) updatedCvData.skills.languages = [];
      updatedCvData.skills.languages.push({
        language: currentLanguage,
        level: userInput.trim()
      });
      saveCVToStorage(updatedCvData);
      
      nextField = 'language_more';
      aiResponse = `✅ **${currentLanguage} (${userInput})** eklendi!\n\n${fieldQuestions['language_more']}`;
      suggestions = ['Evet', 'Hayır'];
      
      // Reset language states
      setCurrentLanguage('');
      setCurrentLanguageLevel('');
      return { updatedCvData, aiResponse, nextField, suggestions };
    } else if (currentField === 'language_more') {
      const response = userInput.toLowerCase().trim();
      if (response === 'evet' || response === 'yes' || response === 'e') {
        // Yeni dil ekleme
        nextField = 'language_name';
        aiResponse = `✅ Yeni dil ekleniyor...\n\n${fieldQuestions['language_name']}`;
        suggestions = ['İngilizce', 'Almanca', 'Fransızca', 'AI ile doldur'];
        return { updatedCvData, aiResponse, nextField, suggestions };
      } else {
        // Dil bölümünü bitir, sertifikalar'a geç
        nextField = 'certificates_confirm';
        aiResponse = `✅ Dil bilgileri tamamlandı.\n\n${fieldQuestions['certificates_confirm']}`;
        suggestions = ['Evet', 'Hayır'];
        return { updatedCvData, aiResponse, nextField, suggestions };
      }
    }
    
    // Sertifika alanları kontrolü
    if (currentField === 'certificates_name') {
      setCurrentCertificate(prev => ({ ...prev, name: userInput.trim() }));
      nextField = 'certificates_issuer';
      aiResponse = `✅ **Sertifika:** ${userInput}\n\n${fieldQuestions['certificates_issuer']}`;
      suggestions = ['Atla', 'AI ile doldur'];
      return { updatedCvData, aiResponse, nextField, suggestions };
    } else if (currentField === 'certificates_issuer') {
      setCurrentCertificate(prev => ({ ...prev, issuer: userInput.trim() }));
      nextField = 'certificates_date';
      aiResponse = `✅ **Kuruluş:** ${userInput}\n\n${fieldQuestions['certificates_date']}`;
      suggestions = ['Atla', '2024', '2023'];
      return { updatedCvData, aiResponse, nextField, suggestions };
    } else if (currentField === 'certificates_date') {
      setCurrentCertificate(prev => ({ ...prev, date: userInput.trim() }));
      
      // Sertifikayı CV'ye ekle
      if (!updatedCvData.certificates) updatedCvData.certificates = [];
      updatedCvData.certificates.push({
        name: currentCertificate.name,
        issuer: currentCertificate.issuer,
        date: userInput.trim(),
        credentialId: ''
      });
      saveCVToStorage(updatedCvData);
      
      nextField = 'certificates_more';
      aiResponse = `✅ **${currentCertificate.name}** sertifikası eklendi!\n\n${fieldQuestions['certificates_more']}`;
      suggestions = ['Evet', 'Hayır'];
      
      // Reset certificate state
      setCurrentCertificate({ name: '', issuer: '', date: '' });
      return { updatedCvData, aiResponse, nextField, suggestions };
    } else if (currentField === 'certificates_more') {
      const response = userInput.toLowerCase().trim();
      if (response === 'evet' || response === 'yes' || response === 'e') {
        nextField = 'certificates_name';
        aiResponse = `✅ Yeni sertifika ekleniyor...\n\n${fieldQuestions['certificates_name']}`;
        suggestions = ['Atla', 'AI ile doldur'];
        return { updatedCvData, aiResponse, nextField, suggestions };
      } else {
        nextField = 'socialMedia_confirm';
        aiResponse = `✅ Sertifikalar tamamlandı.\n\n${fieldQuestions['socialMedia_confirm']}`;
        suggestions = ['Evet', 'Hayır'];
        return { updatedCvData, aiResponse, nextField, suggestions };
      }
    }
    
    // Sosyal medya alanları kontrolü
    if (currentField === 'socialMedia_platform') {
      setCurrentSocialMedia(prev => ({ ...prev, platform: userInput.trim() }));
      nextField = 'socialMedia_url';
      aiResponse = `✅ **Platform:** ${userInput}\n\n${fieldQuestions['socialMedia_url']}`;
      suggestions = ['Atla', 'AI ile doldur'];
      return { updatedCvData, aiResponse, nextField, suggestions };
    } else if (currentField === 'socialMedia_url') {
      setCurrentSocialMedia(prev => ({ ...prev, url: userInput.trim() }));
      
      // Sosyal medyayı CV'ye ekle
      if (!updatedCvData.socialMedia) updatedCvData.socialMedia = [];
      updatedCvData.socialMedia.push({
        platform: currentSocialMedia.platform,
        url: userInput.trim()
      });
      saveCVToStorage(updatedCvData);
      
      nextField = 'socialMedia_more';
      aiResponse = `✅ **${currentSocialMedia.platform}** hesabı eklendi!\n\n${fieldQuestions['socialMedia_more']}`;
      suggestions = ['Evet', 'Hayır'];
      
      // Reset social media state
      setCurrentSocialMedia({ platform: '', url: '' });
      return { updatedCvData, aiResponse, nextField, suggestions };
    } else if (currentField === 'socialMedia_more') {
      const response = userInput.toLowerCase().trim();
      if (response === 'evet' || response === 'yes' || response === 'e') {
        nextField = 'socialMedia_platform';
        aiResponse = `✅ Yeni sosyal medya hesabı ekleniyor...\n\n${fieldQuestions['socialMedia_platform']}`;
        suggestions = ['LinkedIn', 'GitHub', 'Portfolio', 'AI ile doldur'];
        return { updatedCvData, aiResponse, nextField, suggestions };
      } else {
        nextField = 'references_confirm';
        aiResponse = `✅ Sosyal medya hesapları tamamlandı.\n\n${fieldQuestions['references_confirm']}`;
        suggestions = ['Evet', 'Hayır'];
        return { updatedCvData, aiResponse, nextField, suggestions };
      }
    }
    
    // Referans alanları kontrolü
    if (currentField === 'references_name') {
      setCurrentReference(prev => ({ ...prev, name: userInput.trim() }));
      nextField = 'references_position';
      aiResponse = `✅ **Referans:** ${userInput}\n\n${fieldQuestions['references_position']}`;
      suggestions = ['Atla', 'AI ile doldur'];
      return { updatedCvData, aiResponse, nextField, suggestions };
    } else if (currentField === 'references_position') {
      setCurrentReference(prev => ({ ...prev, position: userInput.trim() }));
      nextField = 'references_company';
      aiResponse = `✅ **Pozisyon:** ${userInput}\n\n${fieldQuestions['references_company']}`;
      suggestions = ['Atla', 'AI ile doldur'];
      return { updatedCvData, aiResponse, nextField, suggestions };
    } else if (currentField === 'references_company') {
      setCurrentReference(prev => ({ ...prev, company: userInput.trim() }));
      nextField = 'references_phone';
      aiResponse = `✅ **Şirket:** ${userInput}\n\n${fieldQuestions['references_phone']}`;
      suggestions = ['Atla', 'AI ile doldur'];
      return { updatedCvData, aiResponse, nextField, suggestions };
    } else if (currentField === 'references_phone') {
      setCurrentReference(prev => ({ ...prev, phone: userInput.trim() }));
      nextField = 'references_email';
      aiResponse = `✅ **Telefon:** ${userInput}\n\n${fieldQuestions['references_email']}`;
      suggestions = ['Atla', 'AI ile doldur'];
      return { updatedCvData, aiResponse, nextField, suggestions };
    } else if (currentField === 'references_email') {
      setCurrentReference(prev => ({ ...prev, email: userInput.trim() }));
      
      // Referansı CV'ye ekle
      if (!updatedCvData.references) updatedCvData.references = [];
      updatedCvData.references.push({
        name: currentReference.name,
        position: currentReference.position,
        company: currentReference.company,
        phone: currentReference.phone,
        email: userInput.trim(),
        relationship: 'İş Arkadaşı'
      });
      saveCVToStorage(updatedCvData);
      
      nextField = 'references_more';
      aiResponse = `✅ **${currentReference.name}** referansı eklendi!\n\n${fieldQuestions['references_more']}`;
      suggestions = ['Evet', 'Hayır'];
      
      // Reset reference state
      setCurrentReference({ name: '', position: '', company: '', phone: '', email: '' });
      return { updatedCvData, aiResponse, nextField, suggestions };
    } else if (currentField === 'references_more') {
      const response = userInput.toLowerCase().trim();
      if (response === 'evet' || response === 'yes' || response === 'e') {
        nextField = 'references_name';
        aiResponse = `✅ Yeni referans ekleniyor...\n\n${fieldQuestions['references_name']}`;
        suggestions = ['Atla', 'AI ile doldur'];
        return { updatedCvData, aiResponse, nextField, suggestions };
      } else {
        nextField = 'hobbies';
        aiResponse = `✅ Referanslar tamamlandı.\n\n${fieldQuestions['hobbies']}`;
        suggestions = ['Atla', 'Kitap okuma, Spor', 'AI ile doldur'];
        return { updatedCvData, aiResponse, nextField, suggestions };
      }
    }
    
    // Renk seçimi kontrolü
    if (currentField === 'color_selection') {
      const selectedColorOption = colorOptions.find(color => 
        color.name.toLowerCase() === userInput.toLowerCase().trim() ||
        color.value.toLowerCase() === userInput.toLowerCase().trim()
      );
      
      if (selectedColorOption) {
        setSelectedColor(selectedColorOption.value);
        nextField = 'completed';
        const progress = calculateProgress(updatedCvData);
        aiResponse = `🎨 **${selectedColorOption.name}** renk teması seçildi!\n\n🎉 CV'niz %${progress} tamamlandı! Artık kaydetmeye veya PDF olarak indirmeye hazırsınız.`;
        suggestions = ['CV\'yi kaydet', 'PDF olarak indir'];
        return { updatedCvData, aiResponse, nextField, suggestions };
      } else {
        aiResponse = `❌ Geçersiz renk seçimi. Lütfen şu seçeneklerden birini seçin:\n\n${colorOptions.map(c => `🎨 ${c.name}`).join('\n')}`;
        suggestions = colorOptions.map(color => color.name);
        return { updatedCvData, aiResponse, nextField: currentField, suggestions };
      }
    }
    
    // Bölüm onayı kontrolleri
    if (currentField === 'education_confirm') {
      const response = userInput.toLowerCase().trim();
      if (response === 'evet' || response === 'yes' || response === 'e' || response.includes('evet') || response.includes('ekle')) {
        nextField = 'education_school';
        aiResponse = `✅ Eğitim bilgilerinizi ekliyoruz.\n\n${fieldQuestions['education_school']}`;
        suggestions = ['Atla', 'AI ile doldur'];
      } else {
        // Eğitim bölümünü atla, deneyim onayına geç
        nextField = 'experience_confirm';
        aiResponse = `⏭️ Eğitim bölümü atlandı.\n\n${fieldQuestions['experience_confirm']}`;
        suggestions = ['Evet', 'Hayır'];
      }
    } else if (currentField === 'experience_confirm') {
      const response = userInput.toLowerCase().trim();
      if (response === 'evet' || response === 'yes' || response === 'e' || response.includes('evet') || response.includes('ekle')) {
        nextField = 'experience_company';
        aiResponse = `✅ İş deneyimi bilgilerinizi ekliyoruz.\n\n${fieldQuestions['experience_company']}`;
        suggestions = ['Atla', 'AI ile doldur'];
      } else {
        // Deneyim bölümünü atla, yetenekler onayına geç
        nextField = 'skills_confirm';
        aiResponse = `⏭️ Deneyim bölümü atlandı.\n\n${fieldQuestions['skills_confirm']}`;
        suggestions = ['Evet', 'Hayır'];
      }
    } else if (currentField === 'skills_confirm') {
      const response = userInput.toLowerCase().trim();
      if (response === 'evet' || response === 'yes' || response === 'e' || response.includes('evet') || response.includes('ekle')) {
        nextField = 'technicalSkills';
        aiResponse = `✅ Yetenek ve becerilerinizi ekliyoruz.\n\n${fieldQuestions['technicalSkills']}`;
        suggestions = ['Atla', 'JavaScript, React', 'AI ile doldur'];
      } else {
        // Yetenekler bölümünü atla, sertifikalar onayına geç
        nextField = 'certificates_confirm';
        aiResponse = `⏭️ Yetenekler bölümü atlandı.\n\n${fieldQuestions['certificates_confirm']}`;
        suggestions = ['Evet', 'Hayır'];
      }
    } else if (currentField === 'certificates_confirm') {
      const response = userInput.toLowerCase().trim();
      if (response === 'evet' || response === 'yes' || response === 'e' || response.includes('evet') || response.includes('ekle')) {
        nextField = 'certificates_name';
        aiResponse = `✅ Sertifikalarınızı ekliyoruz.\n\n${fieldQuestions['certificates_name']}`;
        suggestions = ['Atla', 'AI ile doldur'];
      } else {
        // Sertifikalar bölümünü atla, sosyal medya onayına geç
        nextField = 'socialMedia_confirm';
        aiResponse = `⏭️ Sertifikalar bölümü atlandı.\n\n${fieldQuestions['socialMedia_confirm']}`;
        suggestions = ['Evet', 'Hayır'];
      }
    } else if (currentField === 'socialMedia_confirm') {
      const response = userInput.toLowerCase().trim();
      if (response === 'evet' || response === 'yes' || response === 'e' || response.includes('evet') || response.includes('ekle')) {
        nextField = 'socialMedia_platform';
        aiResponse = `✅ Sosyal medya hesaplarınızı ekliyoruz.\n\n${fieldQuestions['socialMedia_platform']}`;
        suggestions = ['LinkedIn', 'GitHub', 'Portfolio', 'AI ile doldur'];
      } else {
        // Sosyal medya bölümünü atla, referanslar onayına geç
        nextField = 'references_confirm';
        aiResponse = `⏭️ Sosyal medya bölümü atlandı.\n\n${fieldQuestions['references_confirm']}`;
        suggestions = ['Evet', 'Hayır'];
      }
    } else if (currentField === 'references_confirm') {
      const response = userInput.toLowerCase().trim();
      if (response === 'evet' || response === 'yes' || response === 'e' || response.includes('evet') || response.includes('ekle')) {
        nextField = 'references_name';
        aiResponse = `✅ Referanslarınızı ekliyoruz.\n\n${fieldQuestions['references_name']}`;
        suggestions = ['Atla', 'AI ile doldur'];
      } else {
        // Referanslar bölümünü atla, hobilere geç
        nextField = 'hobbies';
        aiResponse = `⏭️ Referanslar bölümü atlandı.\n\n${fieldQuestions['hobbies']}`;
        suggestions = ['Atla', 'Kitap okuma, Spor', 'AI ile doldur'];
      }
    }
    // Atla komutu kontrolü
    else if (userInput.toLowerCase().trim() === 'atla') {
      aiResponse = `⏭️ "${fieldQuestions[currentField]}" atlandı.`;
    } else {
      // Özel durumlar: eğitim ve deneyim "more" soruları
      if (currentField === 'education_more') {
        const response = userInput.toLowerCase().trim();
        if (response === 'evet' || response === 'yes' || response === 'e') {
          // Yeni eğitim kaydı ekle
          setCurrentEducationIndex(prev => prev + 1);
          setIsAddingMoreEducation(true);
          nextField = 'education_school';
          aiResponse = `✅ Yeni eğitim kaydı ekleniyor...\n\n${fieldQuestions['education_school']}`;
          suggestions = ['Atla', 'AI ile doldur'];
        } else if (response === 'ai ile ekle' || response.includes('ai')) {
          // AI ile eğitim ekleme
          setIsUsingAI(true);
          aiResponse = `🤖 AI ile eğitim ekleme aktif! Eğitim bilgilerinizi doğal dilde yazın.\n\nÖrnek: "2018-2022 arası İstanbul Üniversitesi Bilgisayar Mühendisliği lisans, 3.2 GPA"`;
          suggestions = ['Manuel moda dön'];
          return { updatedCvData, aiResponse, nextField: currentField, suggestions };
        } else {
          // Eğitim bölümünü bitir, deneyim onayına geç
          setIsAddingMoreEducation(false);
          nextField = 'experience_confirm';
          aiResponse = `✅ Eğitim bilgileri tamamlandı.\n\n${fieldQuestions['experience_confirm']}`;
          suggestions = ['Evet', 'Hayır'];
        }
      } else if (currentField === 'experience_more') {
        const response = userInput.toLowerCase().trim();
        if (response === 'evet' || response === 'yes' || response === 'e') {
          // Yeni deneyim kaydı ekle
          setCurrentExperienceIndex(prev => prev + 1);
          setIsAddingMoreExperience(true);
          nextField = 'experience_company';
          aiResponse = `✅ Yeni iş deneyimi ekleniyor...\n\n${fieldQuestions['experience_company']}`;
          suggestions = ['Atla', 'AI ile doldur'];
        } else if (response === 'ai ile ekle' || response.includes('ai')) {
          // AI ile deneyim ekleme
          setIsUsingAI(true);
          aiResponse = `🤖 AI ile deneyim ekleme aktif! İş deneyiminizi doğal dilde yazın.\n\nÖrnek: "2020-2023 arası ABC Şirketi'nde Yazılım Geliştirici olarak React ve Node.js ile çalıştım"`;
          suggestions = ['Manuel moda dön'];
          return { updatedCvData, aiResponse, nextField: currentField, suggestions };
        } else {
          // Deneyim bölümünü bitir, yetenekler onayına geç
          setIsAddingMoreExperience(false);
          nextField = 'skills_confirm';
          aiResponse = `✅ İş deneyimleri tamamlandı.\n\n${fieldQuestions['skills_confirm']}`;
          suggestions = ['Evet', 'Hayır'];
        }
      } else if (userInput.toLowerCase().includes('ai ile') || isUsingAI) {
        // AI ile işleme - Tek alan için optimize edilmiş
        setIsUsingAI(true);
        try {
          const improvedText = await processFieldWithAI(currentField, userInput);
          updatedCvData = updateCVFieldManual(cvData, currentField, improvedText);
          saveCVToStorage(updatedCvData);
          aiResponse = `✅ **${getFieldDisplayName(currentField)}:** ${improvedText}`;
          setIsUsingAI(false);
        } catch (error) {
          updatedCvData = updateCVFieldManual(cvData, currentField, userInput);
          saveCVToStorage(updatedCvData);
          aiResponse = `✅ **${getFieldDisplayName(currentField)}:** ${userInput}`;
          setIsUsingAI(false);
        }
      } else {
        // Language alanları özel olarak yukarıda işleniyor
        if (currentField === 'language_name' || currentField === 'language_level' || currentField === 'language_more') {
          // Bu alanlar yukarıda özel olarak işlendi, burada bir şey yapma
          return { updatedCvData, aiResponse, nextField, suggestions };
        }
        
        // Normal veri kaydetme - AI ile geliştir
        try {
          const improvedText = await processFieldWithAI(currentField, userInput);
          updatedCvData = updateCVFieldManual(cvData, currentField, improvedText);
          saveCVToStorage(updatedCvData);
          aiResponse = `✅ **${getFieldDisplayName(currentField)}:** ${improvedText}`;
        } catch (error) {
          updatedCvData = updateCVFieldManual(cvData, currentField, userInput);
          saveCVToStorage(updatedCvData);
          aiResponse = `✅ **${getFieldDisplayName(currentField)}:** ${userInput}`;
        }
      }
    }

    // Normal alan geçişi (eğer yukarıda nextField set edilmediyse)
    if (!nextField) {
      const nextIndex = currentIndex + 1;
      
      // Eğitim bölümü kontrolü
      if (currentField === 'education_endDate') {
        nextField = 'education_more';
        aiResponse += `\n\n${fieldQuestions['education_more']}`;
        suggestions = ['Evet', 'Hayır'];
      }
      // Deneyim bölümü kontrolü
      else if (currentField === 'experience_description') {
        nextField = 'experience_more';
        aiResponse += `\n\n${fieldQuestions['experience_more']}`;
        suggestions = ['Evet', 'Hayır'];
      }
      // PersonalSkills'den sonra language_name'e geç
      else if (currentField === 'personalSkills') {
        nextField = 'language_name';
        aiResponse += `\n\n${fieldQuestions['language_name']}`;
        suggestions = ['İngilizce', 'Almanca', 'Fransızca', 'AI ile doldur'];
      }
      // Hobbies'den sonra renk seçimine geç
      else if (currentField === 'hobbies') {
        nextField = 'color_selection';
        aiResponse += `\n\n${fieldQuestions['color_selection']}`;
        suggestions = colorOptions.map(color => color.name);
      }
      // Normal ilerleyiş
      else if (nextIndex < fieldOrder.length - 1) {
        nextField = fieldOrder[nextIndex];
        
        // Özel öneriler
        if (nextField === 'education_confirm') {
          suggestions = ['Evet', 'Hayır'];
        } else if (nextField === 'experience_confirm') {
          suggestions = ['Evet', 'Hayır'];
        } else if (nextField === 'skills_confirm') {
          suggestions = ['Evet', 'Hayır'];
        } else if (nextField === 'technicalSkills') {
          suggestions = ['Atla', 'JavaScript, React', 'Python, Django', 'AI ile doldur'];
        } else if (nextField === 'personalSkills') {
          suggestions = ['Atla', 'Liderlik, Takım çalışması', 'AI ile doldur'];
        } else if (nextField === 'language_name') {
          suggestions = ['İngilizce', 'Almanca', 'Fransızca', 'AI ile doldur'];
        } else if (nextField === 'language_level') {
          suggestions = getLanguageLevelOptions();
        } else if (nextField === 'language_more') {
          suggestions = ['Evet', 'Hayır'];
        } else if (nextField === 'hobbies') {
          suggestions = ['Atla', 'Kitap okuma, Spor', 'AI ile doldur'];
        } else {
          suggestions = ['Atla', 'AI ile doldur'];
        }
        
        aiResponse += `\n\n${fieldQuestions[nextField]}`;
      } else {
        nextField = 'completed';
        const progress = calculateProgress(updatedCvData);
        aiResponse = `🎉 Tüm sorular tamamlandı! CV'niz %${progress} hazır. LocalStorage'da güvenli şekilde saklandı. Artık kaydetmeye veya PDF olarak indirmeye hazırsınız.`;
        suggestions = ['CV\'yi kaydet', 'PDF olarak indir', 'LocalStorage temizle'];
      }
    }

    return { updatedCvData, aiResponse, nextField, suggestions };
  };

  // CV alanını güncelle
  const updateCVField = (data: CVDataStructure, field: string, value: string) => {
    const newData = { ...data };
    let response = '';

    switch (field) {
      case 'fullName':
        newData.personalInfo.fullName = value.trim();
        response = `✨ Mükemmel! ${value} olarak kaydettim.`;
        break;
      case 'phone':
        if (newData.personalInfo.phones.length === 0) {
          newData.personalInfo.phones = [value.trim()];
        } else {
          newData.personalInfo.phones[0] = value.trim();
        }
        response = `📱 Telefon numaranızı kaydettim: ${value}`;
        break;
      case 'email':
        if (newData.personalInfo.emails.length === 0) {
          newData.personalInfo.emails = [value.trim()];
        } else {
          newData.personalInfo.emails[0] = value.trim();
        }
        response = `✉️ Email adresinizi aldım: ${value}`;
        break;
      case 'address':
        newData.personalInfo.address = value.trim();
        response = `🏠 Adresinizi kaydettim: ${value}`;
        break;
      case 'summary':
        newData.personalInfo.summary = value.trim();
        response = `✨ Mükemmel özet! Kendinizi çok güzel tanıtmışsınız.`;
        break;
      case 'aboutMe':
        newData.aboutMe = value.trim();
        response = `👤 Hakkınızda kısmını aldım. Çok etkileyici!`;
        break;
      case 'education':
        // Basit eğitim ekleme
        if (!newData.education) newData.education = [];
        newData.education.push({
          school: value.trim(),
          department: '',
          startDate: '',
          endDate: '',
          degree: '',
          gpa: ''
        });
        response = `🎓 Eğitim bilginizi kaydettim: ${value}`;
        break;
      case 'experience':
        // Basit deneyim ekleme
        if (!newData.experience) newData.experience = [];
        newData.experience.push({
          company: value.trim(),
          position: '',
          startDate: '',
          endDate: '',
          description: '',
          achievements: ''
        });
        response = `💼 İş deneyiminizi kaydettim: ${value}`;
        break;
      case 'technicalSkills':
        const techSkills = value.split(',').map(s => s.trim()).filter(s => s);
        newData.skills.technical = [...(newData.skills.technical || []), ...techSkills];
        response = `⚡ Teknik yeteneklerinizi kaydettim: ${techSkills.join(', ')}`;
        break;
      case 'personalSkills':
        const personalSkills = value.split(',').map(s => s.trim()).filter(s => s);
        newData.skills.personal = [...(newData.skills.personal || []), ...personalSkills];
        response = `🌟 Kişisel özelliklerinizi kaydettim: ${personalSkills.join(', ')}`;
        break;
      case 'languages':
        const languages = value.split(',').map(s => s.trim()).filter(s => s);
        newData.skills.languages = languages.map(lang => ({
          language: lang,
          level: 'Orta'
        }));
        response = `� Dil bilgilerinizi kaydettim: ${languages.join(', ')}`;
        break;
      case 'hobbies':
        const hobbies = value.split(',').map(s => s.trim()).filter(s => s);
        newData.extras.hobbies = hobbies;
        response = `🎯 Hobilerinizi kaydettim: ${hobbies.join(', ')}`;
        
        // Hobbies alanından sonra CV'yi otomatik tamamla
        const progress = calculateProgress(newData);
        if (progress >= 70) {
          response += ` 🎉 Harika! CV'niz %${progress} tamamlandı. Artık profesyonel CV'niz hazır!`;
        }
        break;
      default:
        response = `Bilginizi aldım: ${value}`;
    }

    return { data: newData, response };
  };

  // Sıradaki alanı belirle
  const getNextField = (currentField: string): string => {
    const fieldOrder = [
      'fullName', 'phone', 'email', 'address',
      'summary', 'aboutMe', 'education', 'experience', 'technicalSkills', 'personalSkills',
      'languages', 'hobbies', 'completed'
    ];
    
    const currentIndex = fieldOrder.indexOf(currentField);
    return currentIndex < fieldOrder.length - 1 ? fieldOrder[currentIndex + 1] : 'completed';
  };

  // Alan için soru oluştur
  const getFieldQuestion = (field: string): string => {
    const questions = {
      fullName: 'Öncelikle, tam adınızı öğrenebilir miyim?',
      phone: 'Telefon numaranızı paylaşır mısınız?',
      email: 'Email adresiniz nedir?',
      address: 'Adresinizi belirtir misiniz?',
      summary: 'Kendinizi 2-3 cümle ile nasıl tanımlarsınız?',
      aboutMe: 'Hakkınızda daha detaylı bilgi verir misiniz?',
      education: 'Eğitim geçmişinizden bahseder misiniz? (Okul/Üniversite adı)',
      experience: 'İş deneyimlerinizden bahseder misiniz? (Şirket adı)',
      technicalSkills: 'Teknik yetenekleriniz nelerdir? (Virgülle ayırın)',
      personalSkills: 'Kişisel özellikleriniz nelerdir? (Virgülle ayırın)',
      languages: 'Hangi dilleri biliyorsunuz? (Virgülle ayırın)',
      hobbies: 'Hobileriniz nelerdir? (Virgülle ayırın)'
    };
    
    return questions[field as keyof typeof questions] || 'Bir sonraki bilgiyi paylaşır mısınız?';
  };

  // Alan için öneriler
  const getFieldSuggestions = (field: string): string[] => {
    const suggestions = {
      technicalSkills: ['JavaScript, React, Node.js', 'Python, Django', 'Java, Spring'],
      personalSkills: ['Liderlik, Takım çalışması', 'Problem çözme, Analitik düşünme'],
      languages: ['İngilizce, Almanca', 'İngilizce, Fransızca'],
      hobbies: ['Kitap okuma, Spor', 'Müzik, Seyahat', 'Fotoğrafçılık, Yemek pişirme']
    };
    
    return suggestions[field as keyof typeof suggestions] || ['Atla', 'Devam et'];
  };

  const convertToNewFormat = (data: Partial<CVData>) => {
    // Veri boşsa veya eksikse template için güvenli varsayılan değerler kullan
    const safePersonalInfo = data.personalInfo || {} as any;
    const safeSkills = data.skills || { technical: [], personal: [], languages: [] };
    const safeExtras = (data as any).extras || { hobbies: [], references: [], additional: '', projects: [], volunteerWork: [], awards: [] };
    
    return {
      showProfilePhoto: (data as any).showProfilePhoto ?? false, // Kullanıcının tercihini al, yoksa false
      profilePhoto: safePersonalInfo.profilePhoto || user?.avatar || '', // En üst seviyede profilePhoto
      // Personal info alanları - template'ların beklediği format
      firstName: safePersonalInfo.fullName?.split(' ')[0] || safePersonalInfo.firstName || user?.name?.split(' ')[0] || '',
      lastName: safePersonalInfo.fullName?.split(' ').slice(1).join(' ') || safePersonalInfo.lastName || user?.name?.split(' ').slice(1).join(' ') || '',
      fullName: safePersonalInfo.fullName || user?.name || `${safePersonalInfo.firstName || ''} ${safePersonalInfo.lastName || ''}`.trim(),
      email: safePersonalInfo.emails?.[0] || safePersonalInfo.email || user?.email || '',
      phone: safePersonalInfo.phones?.[0] || safePersonalInfo.phone || (user as any)?.phones?.[0] || '',
      address: safePersonalInfo.address || (user as any)?.address || '',
      title: safePersonalInfo.title || '',
      summary: '', // Summary alanını boş bırak, sadece aboutMe kullanılacak
      personalInfo: {
        firstName: safePersonalInfo.fullName?.split(' ')[0] || safePersonalInfo.firstName || user?.name?.split(' ')[0] || '',
        lastName: safePersonalInfo.fullName?.split(' ').slice(1).join(' ') || safePersonalInfo.lastName || user?.name?.split(' ').slice(1).join(' ') || '',
        fullName: safePersonalInfo.fullName || user?.name || `${safePersonalInfo.firstName || ''} ${safePersonalInfo.lastName || ''}`.trim(),
        email: safePersonalInfo.emails?.[0] || safePersonalInfo.email || user?.email || '',
        phone: safePersonalInfo.phones?.[0] || safePersonalInfo.phone || (user as any)?.phones?.[0] || '',
        address: safePersonalInfo.address || (user as any)?.address || '',
        title: safePersonalInfo.title || '',
        summary: '', // Summary alanını boş bırak, sadece aboutMe kullanılacak
        profilePhoto: safePersonalInfo.profilePhoto || user?.avatar || '',
      },
      aboutMe: safePersonalInfo.summary || (data as any).aboutMe || '', // Summary alanından aboutMe'ye aktar
      experiences: (data.experience || []).map((exp: any, index: number) => ({
        id: exp.id || index.toString(),
        jobTitle: exp.position || '',
        company: exp.company || '',
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        isCurrentJob: !exp.endDate || exp.endDate === '',
        description: exp.description || '',
      })),
      educations: (data.education || []).map((edu: any, index: number) => ({
        id: edu.id || index.toString(),
        degree: edu.degree || '',
        school: edu.school || '',
        department: edu.department || '',
        startDate: edu.startDate || '',
        endDate: edu.endDate || '',
        isCurrentEducation: !edu.endDate || edu.endDate === '',
        gpa: edu.gpa || '',
      })),
      skills: [
        ...(data.skills?.technical || []).map((skill: any, index: number) => ({
          id: `tech-${index}`,
          name: skill,
          level: 3, // Default level
          category: 'Teknik',
        })),
        ...(data.skills?.languages || []).map((lang: any, index: number) => {
          // Ensure we have a proper language object
          const languageObj = typeof lang === 'object' ? lang : { language: lang || '', level: '3' };
          const languageName = languageObj.language || '';
          
          return {
            id: `lang-${index}`,
            name: languageName,
            level: languageObj.level === 'Başlangıç' || languageObj.level === '1' ? 1 : 
                   languageObj.level === 'Orta' || languageObj.level === '2' ? 2 : 
                   languageObj.level === 'İleri' || languageObj.level === '4' ? 4 : 
                   languageObj.level === 'Ana Dil' || languageObj.level === '5' ? 5 : 
                   parseInt(languageObj.level) || 3,
            category: 'Dil',
          };
        }),
        ...(data.skills?.personal || []).map((skill: any, index: number) => ({
          id: `personal-${index}`,
          name: skill,
          level: 3,
          category: 'Kişisel',
        }))
      ],
      certificates: (data.certificates || []).map((cert: any, index: number) => ({
        id: cert.id || index.toString(),
        name: cert.name || '',
        issuer: cert.issuer || '',
        issueDate: cert.issueDate || cert.date || '',
        expiryDate: cert.expiryDate || '',
        credentialId: cert.credentialId || '',
      })),
      socialMedia: (data as any).socialMedia || [],
      references: (data.references || []).map((ref: any, index: number) => ({
        id: ref.id || index.toString(),
        name: ref.name || '',
        position: ref.position || '',
        company: ref.company || '',
        phone: ref.phone || '',
        email: ref.email || '',
        relationship: ref.relationship || '',
      })),
      hobbies: safeExtras.hobbies || [],
      projects: safeExtras.projects || [],
      volunteerWork: safeExtras.volunteerWork || [],
      awards: safeExtras.awards || [],
      extras: {
        hobbies: safeExtras.hobbies || [],
        references: safeExtras.references || [],
        additional: safeExtras.additional || '',
        projects: safeExtras.projects || [],
        volunteerWork: safeExtras.volunteerWork || [],
        awards: safeExtras.awards || []
      },
    };
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Otomatik scroll'u devre dışı bırak - kullanıcı istemediğinde scroll yapmasın
  // useEffect(() => {
  //   scrollToBottom();
  // }, [messages]);

  // CV progress değiştiğinde önizlemeyi otomatik göster (her zaman aktif)
  useEffect(() => {
    setShowPreview(true); // Her zaman önizleme göster
  }, [cvProgress]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Erişim Reddedildi</h1>
          <p className="text-gray-600 mb-4">Bu sayfayı görüntülemek için giriş yapmalısınız.</p>
          <Link href="/" className="text-yellow-600 hover:text-yellow-700">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !cvData) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    try {
      // Düşünme simülasyonu
      await new Promise(resolve => setTimeout(resolve, isUsingAI ? 2000 : 1000));
      
      // Manuel veya AI ile cevabı işle
      const result = isUsingAI || currentInput.toLowerCase().includes('ai ile') 
        ? await processManualResponse(currentInput) // AI işlemi de manuel response içinde
        : await processManualResponse(currentInput);
      
      if (result) {
        // CV data'yı güncelle
        setCvData(result.updatedCvData);
        
        // Progress'i güncelle
        const newProgress = calculateProgress(result.updatedCvData);
        setCvProgress(newProgress);
        
        // Mevcut alanı güncelle
        if (result.nextField) {
          setCurrentField(result.nextField);
        }
        
        // AI modunu sıfırla (gerekirse)
        if (result.nextField !== currentField) {
          setIsUsingAI(false);
        }
        
        // Özel komutları işle
        if (currentInput.toLowerCase().includes('localstorage temizle')) {
          localStorage.removeItem(STORAGE_KEY);
          result.aiResponse += '\n\n🗑️ LocalStorage temizlendi.';
        }
        
        // Eğer tüm önemli bilgiler tamamlandıysa completed'a geç
        if (newProgress >= 80 && result.nextField === 'hobbies') {
          setCurrentField('completed');
          result.aiResponse += ' CV\'niz artık tamamlandı!';
        }

        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: result.aiResponse,
          timestamp: new Date(),
          suggestedQuestions: result.suggestions
        };

        setMessages(prev => [...prev, aiMessage]);
      }

    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin. 🤖',
        timestamp: new Date(),
        suggestedQuestions: ['Tekrar dene']
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      
      // Scroll'u tamamen kaldır - kullanıcı istediğinde manuel scroll yapacak
      // setTimeout(() => {
      //   scrollToBottom();
      // }, 300);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputMessage(question);
    // Otomatik gönder - scroll işlemi handleSendMessage içinde yapılacak
    setTimeout(() => {
      if (question.trim()) {
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        handleKeyDown(event as any);
      }
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSaveCV = async () => {
    if (!user || !cvData) return;
    
    setIsGeneratingCV(true);
    try {
      // CV data'yı API formatına dönüştür
      const cvPayload = {
        userId: user.id || 'test-user-123',
        templateName: selectedTemplate,
        personalInfo: cvData.personalInfo || {
          fullName: 'CV Sahibi',
          emails: ['email@example.com'],
          phones: ['+90 XXX XXX XXXX']
        },
        experience: cvData.experience || [],
        education: cvData.education || [],
        skills: cvData.skills || {
          technical: [],
          personal: [],
          languages: []
        },
        certificates: cvData.certificates || []
      };

      const response = await api.post('/cv', cvPayload);
      
      if (response.data) {
        // Show success message
        const successMessage: ChatMessage = {
          id: (Date.now() + 2).toString(),
          type: 'ai',
          content: '✅ Harika! CV\'niz başarıyla kaydedildi ve önizleme sayfasına yönlendiriliyorsunuz...',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, successMessage]);
        
        // Redirect to preview page after a short delay
        setTimeout(() => {
          router.push(`/cv-preview?id=${response.data.id}`);
        }, 2000);
      }
    } catch (error) {
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        type: 'ai',
        content: '❌ CV kaydedilirken bir hata oluştu. Lütfen tekrar deneyin veya manuel CV oluşturma sayfasını kullanın.',
        timestamp: new Date(),
        suggestedQuestions: ['Tekrar kaydet', 'Manuel sayfaya git']
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGeneratingCV(false);
    }
  };

  const handlePreviewCV = () => {
    // Navigate to manual CV creation with pre-filled data
    const queryParams = new URLSearchParams({
      template: selectedTemplate,
      aiData: JSON.stringify(cvData)
    });
    router.push(`/create-cv/manual?${queryParams.toString()}`);
  };

  const handlePDFDownload = async () => {
    if (!user || !cvData) {
      toast.error('PDF indirmek için giriş yapmalısınız');
      return;
    }
    
    setIsPDFGenerating(true);
    try {
      // Tam boyutlu CV HTML'ini oluştur (önizleme skalası olmadan)
      const cvElement = document.querySelector('[data-cv-content]');
      if (!cvElement) {
        throw new Error('CV önizlemesi bulunamadı');
      }
      
      // Tam boyutlu HTML için geçici bir element oluştur
      const fullSizeElement = cvElement.cloneNode(true) as HTMLElement;
      
      // Önizleme için uygulanan scale'i kaldır
      fullSizeElement.style.transform = 'none';
      fullSizeElement.style.width = '210mm'; // A4 genişliği
      fullSizeElement.style.maxWidth = '210mm';
      fullSizeElement.style.marginBottom = '0';
      
      // PDF API'ye tam boyutlu HTML'i gönder
      const response = await fetch('/api/pdf/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: selectedTemplate,
          cvData: convertToNewFormat(cvData),
          previewHtml: fullSizeElement.outerHTML,
          fullSize: true // PDF'in tam boyutta olması için flag
        }),
      });

      if (!response.ok) {
        throw new Error('PDF oluşturulamadı');
      }

      // PDF'i indir
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'cv.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('CV başarıyla indirildi!');
    } catch (error) {

      toast.error('PDF indirirken bir hata oluştu');
    } finally {
      setIsPDFGenerating(false);
    }
  };

  const handlePDFPreview = async () => {
    if (!user || !cvData) {
      toast.error('PDF önizlemek için giriş yapmalısınız');
      return;
    }
    
    try {
      // Tam boyutlu CV HTML'ini oluştur (önizleme skalası olmadan)
      const cvElement = document.querySelector('[data-cv-content]');
      if (!cvElement) {
        throw new Error('CV önizlemesi bulunamadı');
      }
      
      // Tam boyutlu HTML için geçici bir element oluştur
      const fullSizeElement = cvElement.cloneNode(true) as HTMLElement;
      
      // Önizleme için uygulanan scale'i kaldır
      fullSizeElement.style.transform = 'none';
      fullSizeElement.style.width = '210mm'; // A4 genişliği
      fullSizeElement.style.maxWidth = '210mm';
      fullSizeElement.style.marginBottom = '0';
      
      // PDF API'ye tam boyutlu HTML'i gönder ve yeni sekmede aç
      const response = await fetch('/api/pdf/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: selectedTemplate,
          cvData: convertToNewFormat(cvData),
          previewHtml: fullSizeElement.outerHTML,
          fullSize: true // PDF'in tam boyutta olması için flag
        }),
      });

      if (!response.ok) {
        throw new Error('PDF oluşturulamadı');
      }

      // PDF'i yeni sekmede aç
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      
      // URL'i temizle (biraz sonra)
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
      
    } catch (error) {

      toast.error('PDF önizleme açılırken bir hata oluştu');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Breadcrumb */}
          <div className="mb-4">
            <Breadcrumb items={breadcrumbItems} />
          </div>
          
          <div className="flex items-center justify-between">
            <Link 
              href={`/create-cv?method=ai`}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Geri Dön
            </Link>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                CV Tamamlanma: %{cvProgress}
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-amber-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${cvProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Sidebar - Üstte tam genişlik */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Manuel Asistan Bilgisi */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center mr-3">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  Hibrit Asistan {isUsingAI && '🤖'}
                </h3>
                <p className="text-xs text-gray-600 flex items-center">
                  <span className="w-2 h-2 rounded-full mr-1 bg-green-500"></span>
                  {isUsingAI ? 'AI Modu Aktif' : 'Manuel Mod Aktif'}
                </p>
              </div>
            </div>

            {/* CV İlerleme Çubuğu */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-3 border border-yellow-200">
                <div className="flex items-center justify-between text-xs text-yellow-800 mb-2">
                  <span className="font-medium">CV İlerleme Durumu</span>
                  <span className="font-bold">%{cvProgress}</span>
                </div>
                  <div className="grid grid-cols-8 gap-2 text-xs text-yellow-800">
                  <div className="flex flex-col items-center">
                    <span>{cvData?.personalInfo?.fullName ? '✅' : '⏳'}</span>
                    <span className="mt-1 text-center">Kişisel</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span>{cvData?.aboutMe ? '✅' : '⏳'}</span>
                    <span className="mt-1 text-center">Hakkımda</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span>{cvData?.education && cvData.education.length > 0 ? '✅' : '⏳'}</span>
                    <span className="mt-1 text-center">Eğitim</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span>{cvData?.experience && cvData.experience.length > 0 ? '✅' : '⏳'}</span>
                    <span className="mt-1 text-center">Deneyim</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span>{cvData?.skills && (cvData.skills.technical?.length || cvData.skills.personal?.length) ? '✅' : '⏳'}</span>
                    <span className="mt-1 text-center">Yetenek</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span>{cvData?.skills?.languages && cvData.skills.languages.length > 0 ? '✅' : '⏳'}</span>
                    <span className="mt-1 text-center">Dil</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span>{cvData?.extras?.hobbies && cvData.extras.hobbies.length > 0 ? '✅' : '⏳'}</span>
                    <span className="mt-1 text-center">Hobi</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span>{cvProgress >= 80 || currentField === 'completed' ? '✅' : '⏳'}</span>
                    <span className="mt-1 text-center">Kontrol</span>
                  </div>
                </div>                {/* Current Step Indicator */}
                <div className="mt-2 pt-2 border-t border-yellow-200 text-center">
                  <span className="text-xs text-yellow-700">
                    Şu anda: <span className="font-medium capitalize">
                      {currentField === 'completed' ? 'CV Tamamlandı!' : `${currentField} bilgisi alınıyor`}
                    </span>
                  </span>
                  {currentField === 'completed' && (
                    <div className="flex items-center justify-center mt-1">
                      <CheckCircle className="w-3 h-3 mr-1 text-green-700" />
                      <span className="text-xs text-green-700 font-medium">CV oluşturma tamamlandı!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Hızlı İşlemler */}
            <div className="flex items-center space-x-2">
              <Link
                href="/create-cv?method=ai"
                className="flex items-center px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <FileText className="w-3 h-3 mr-1" />
                Şablon
              </Link>
              <button 
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center px-3 py-2 text-xs rounded-lg transition-colors bg-blue-50 text-blue-700 hover:bg-blue-100"
              >
                <Eye className="w-3 h-3 mr-1" />
                {showPreview ? 'Gizle' : 'Önizle'}
              </button>
              <button 
                onClick={handleSaveCV}
                disabled={cvProgress < 50 || isGeneratingCV}
                className={`flex items-center px-3 py-2 text-xs rounded-lg transition-colors ${
                  cvProgress >= 50 && !isGeneratingCV
                    ? 'bg-green-50 text-green-700 hover:bg-green-100' 
                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isGeneratingCV ? (
                  <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                ) : (
                  <Save className="w-3 h-3 mr-1" />
                )}
                Kaydet
              </button>
              <button 
                onClick={handlePDFDownload}
                disabled={isPDFGenerating}
                className="flex items-center px-3 py-2 text-xs rounded-lg transition-colors bg-blue-50 text-blue-700 hover:bg-blue-100"
              >
                {isPDFGenerating ? (
                  <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                ) : (
                  <Download className="w-3 h-3 mr-1" />
                )}
                PDF
              </button>
              <button 
                onClick={handlePDFPreview}
                className="flex items-center px-3 py-2 text-xs rounded-lg transition-colors bg-purple-50 text-purple-700 hover:bg-purple-100"
              >
                <Settings className="w-3 h-3 mr-1" />
                Önizle
              </button>
              <button 
                onClick={handlePreviewCV}
                disabled={cvProgress < 20}
                className={`flex items-center px-3 py-2 text-xs rounded-lg transition-colors ${
                  cvProgress >= 20 
                    ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100' 
                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
              >
                <FileText className="w-3 h-3 mr-1" />
                Manuel
              </button>
              <button 
                onClick={() => {
                  localStorage.removeItem(STORAGE_KEY);
                  window.location.reload();
                }}
                className="flex items-center px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="LocalStorage'ı temizle ve yeniden başla"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Sıfırla
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ana İçerik - Chat ve Önizleme Yan Yana */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className={`grid gap-6 ${showPreview ? 'grid-cols-5' : 'grid-cols-1'}`}>
          {/* Chat Area - Chat alanı */}
          <div className={showPreview ? 'col-span-3' : 'col-span-1'}>
            <div className="bg-white rounded-lg shadow-md flex flex-col h-[calc(100vh-280px)]">
              {/* Chat Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center mr-4">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Hibrit CV Asistanı</h1>
                    <p className="text-gray-600">
                      Manuel sorular + AI desteği ile CV oluştur 
                      {isUsingAI && <span className="text-blue-600 font-semibold"> • AI Aktif 🤖</span>}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md xl:max-w-lg flex ${
                      message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                    } items-start space-x-3`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.type === 'user' 
                          ? 'bg-blue-500 ml-3' 
                          : 'bg-gradient-to-r from-blue-400 to-blue-500 mr-3'
                      }`}>
                        {message.type === 'user' ? (
                          <UserIcon className="w-4 h-4 text-white" />
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className={`rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <div className="text-sm whitespace-pre-line leading-relaxed">
                          {message.content}
                        </div>
                        <p className={`text-xs mt-1 opacity-70`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="max-w-xs lg:max-w-md xl:max-w-lg flex flex-row items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center mr-3">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Questions */}
              {messages.length > 0 && messages[messages.length - 1].type === 'ai' && messages[messages.length - 1].suggestedQuestions && (
                <div className="px-6 py-3 border-t border-gray-100">
                  <p className="text-sm text-gray-600 mb-3">Önerilen cevaplar:</p>
                  
                  {/* Renk seçimi için özel UI */}
                  {currentField === 'color_selection' ? (
                    <div className="grid grid-cols-4 gap-3">
                      {colorOptions.map((color, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestedQuestion(color.name)}
                          className="flex items-center space-x-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all border border-gray-200 hover:border-gray-300"
                        >
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: color.primary }}
                          ></div>
                          <span className="text-sm text-gray-700">{color.name}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    /* Normal suggested questions */
                    <div className="flex flex-wrap gap-2">
                      {messages[messages.length - 1].suggestedQuestions?.map((question: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestedQuestion(question)}
                          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Input Area */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <textarea
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Mesajını buraya yaz..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center mt-2 text-xs text-gray-500">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Enter ile gönder, Shift+Enter ile yeni satır
                  {isUsingAI && <span className="ml-2 text-blue-600">• AI aktif 🤖</span>}
                </div>
              </div>
            </div>
          </div>

          {/* CV Preview Area */}
          {showPreview && (
            <div className="col-span-2">
              <div className="bg-white rounded-lg shadow-md h-[calc(100vh-280px)] flex flex-col">
                {/* Preview Header */}
                <div className="p-3 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 text-blue-600 mr-2" />
                    <h3 className="text-base font-semibold text-gray-900">CV Önizleme</h3>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={handlePDFPreview}
                      className="px-2 py-1 text-xs rounded transition-colors bg-purple-600 text-white hover:bg-purple-700"
                    >
                      Önizle
                    </button>
                    <button
                      onClick={handlePDFDownload}
                      disabled={isPDFGenerating}
                      className="px-2 py-1 text-xs rounded transition-colors bg-green-600 text-white hover:bg-green-700"
                    >
                      {isPDFGenerating ? '...' : 'İndir'}
                    </button>
                  </div>
                </div>
                
                {/* Profil Fotoğrafı Kontrolü */}
                <div className="px-3 py-2 border-b border-gray-200 bg-gray-50">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(cvData as any)?.showProfilePhoto || false}
                      onChange={(e) => {
                        if (cvData) {
                          setCvData(prev => prev ? ({
                            ...prev,
                            showProfilePhoto: e.target.checked
                          } as any) : null);
                        }
                      }}
                      className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-xs font-medium text-gray-700">
                      📷 Profil fotoğrafı
                    </span>
                    {cvData?.personalInfo?.profilePhoto && (
                      <img 
                        src={cvData.personalInfo.profilePhoto} 
                        alt="Profil" 
                        className="w-4 h-4 rounded-full object-cover border border-gray-300"
                      />
                    )}
                  </label>
                </div>
                
                {/* Preview Content */}
                <div className="flex-1 overflow-y-auto bg-gray-100 p-1">
                  <div 
                    ref={cvRef}
                    data-cv-content
                    className="mx-auto bg-white shadow-lg"
                    style={{ 
                      width: '100%', 
                      maxWidth: '100%',
                      transform: 'scale(0.85)',
                      transformOrigin: 'top center',
                      marginBottom: '-15%' // Scale nedeniyle oluşan boşluğu kapatmak için
                    }}
                  >
                    {(() => {
                      if (!cvData) return <div className="p-8 text-center text-gray-500">CV verisi yükleniyor...</div>;
                      
                      const convertedData = convertToNewFormat(cvData);
                      return (
                        <CVTemplate 
                          data={convertedData}
                          template={selectedTemplate}
                          isPreview={true}
                          enableEditing={true}
                          onFieldUpdate={handleInlineFieldUpdate}
                          color={selectedColor}
                        />
                      );
                    })()}
                  </div>
                </div>
                
                {/* Preview Footer */}
                <div className="p-2 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Template: {selectedTemplate}</span>
                    <span>%{cvProgress}</span>
                  </div>
                  
                  {/* Quick Edit Buttons - Daha belirgin hale getirildi */}
                  <div className="mt-2 border-t border-gray-200 pt-2">
                    <p className="text-xs text-gray-500 mb-2">Düzenlemek için tıklayın:</p>
                    <div className="flex flex-wrap gap-1">
                      {cvData && cvData.aboutMe && (
                        <button
                          onClick={() => handleEditRequest('aboutMe', cvData.aboutMe || '', 'Hakkımda kısmını düzenle')}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors border border-blue-300"
                        >
                          📝 Hakkımda
                        </button>
                      )}
                      {cvData && cvData.education && cvData.education.length > 0 && (
                        <button
                          onClick={() => handleEditRequest('education', JSON.stringify(cvData.education), 'Eğitim bilgilerimi düzenle')}
                          className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors border border-green-300"
                        >
                          🎓 Eğitim ({cvData.education.length})
                        </button>
                      )}
                      {cvData && cvData.experience && cvData.experience.length > 0 && (
                        <button
                          onClick={() => handleEditRequest('experience', JSON.stringify(cvData.experience), 'İş deneyimlerimi düzenle')}
                          className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-md hover:bg-purple-200 transition-colors border border-purple-300"
                        >
                          🏢 Deneyim ({cvData.experience.length})
                        </button>
                      )}
                      {cvData && cvData.skills && (
                        <button
                          onClick={() => handleEditRequest('skills', JSON.stringify(cvData.skills), 'Yeteneklerimi düzenle')}
                          className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-md hover:bg-orange-200 transition-colors border border-orange-300"
                        >
                          ⚡ Yetenek ({(cvData.skills.technical?.length || 0) + (cvData.skills.personal?.length || 0)})
                        </button>
                      )}
                      {cvData && cvData.skills?.languages && cvData.skills.languages.length > 0 && (
                        <button
                          onClick={() => handleEditRequest('languages', JSON.stringify(cvData.skills.languages), 'Dil bilgilerimi düzenle')}
                          className="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-md hover:bg-indigo-200 transition-colors border border-indigo-300"
                        >
                          🌍 Dil ({cvData.skills.languages.length})
                        </button>
                      )}
                      {cvData && cvData.extras?.hobbies && cvData.extras.hobbies.length > 0 && (
                        <button  
                          onClick={() => handleEditRequest('hobbies', cvData.extras?.hobbies?.join(', ') || '', 'Hobilerim düzenle')}
                          className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition-colors border border-yellow-300"
                        >
                          🎯 Hobi ({cvData.extras.hobbies.length})
                        </button>
                      )}
                      {cvData && cvData.extras?.hobbies && cvData.extras.hobbies.length > 0 && (
                        <button  
                          onClick={() => handleEditRequest('hobbies', cvData.extras?.hobbies?.join(', ') || '', 'Hobilerim düzenle')}
                          className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition-colors border border-yellow-300"
                        >
                          🎯 Hobi ({cvData.extras.hobbies.length})
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AIChatCVPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Yükleniyor...</span>
        </div>
      </div>
    }>
      <AIChatCVContent />
    </Suspense>
  );
}
