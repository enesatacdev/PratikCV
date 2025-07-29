'use client';

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useAuth } from "@/lib/auth-context";
import { useSearchParams } from 'next/navigation';
import { apiService, CVData } from "@/lib/api";
import { geminiService } from "@/lib/gemini-service";
import CVTemplate from "@/components/cv/CVTemplate";
import { TemplateId, TEMPLATE_DEFINITIONS } from '@/lib/types/templates';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  User, 
  GraduationCap, 
  Briefcase, 
  Award, 
  Settings,
  FileText,
  Download,
  Eye,
  Share2,
  Globe,
  Users,
  Sparkles
} from "lucide-react";
import Link from "next/link";

import Breadcrumb from "@/components/ui/breadcrumb";

const steps = [
  { id: 1, name: "Kişisel Bilgiler", icon: User, component: "PersonalInfo" },
  { id: 2, name: "Hakkımda", icon: FileText, component: "AboutMe" },
  { id: 3, name: "Eğitim", icon: GraduationCap, component: "Education" },
  { id: 4, name: "İş Deneyimi", icon: Briefcase, component: "Experience" },
  { id: 5, name: "Yetenekler", icon: Award, component: "Skills" },
  { id: 6, name: "Dil Becerileri", icon: Globe, component: "Languages" },
  { id: 7, name: "Sertifikalar", icon: Award, component: "Certificates" },
  { id: 8, name: "Referanslar", icon: Users, component: "References" },
  { id: 9, name: "Sosyal Medya", icon: Settings, component: "SocialMedia" },
  { id: 10, name: "Ekstra Bilgiler", icon: Settings, component: "AdditionalInfo" },
  { id: 11, name: "Önizleme", icon: Eye, component: "Preview" },
];

function ManualCVContent() {
  const { user, isLoading, deductPremiumCredit } = useAuth();
  const searchParams = useSearchParams();
  const editCVId = searchParams.get('edit');
  const urlTemplate = searchParams.get('template') as TemplateId;
  const aiDataParam = searchParams.get('aiData');
  const cvRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isPDFGenerating, setIsPDFGenerating] = useState(false);
  const [isEditingExisting, setIsEditingExisting] = useState(!!editCVId);
  const [isLoadingCV, setIsLoadingCV] = useState(!!editCVId);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('modern');
  const [currentCVId, setCurrentCVId] = useState<string | null>(editCVId);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [originalTemplate, setOriginalTemplate] = useState<TemplateId | null>(null); // Orijinal template'i sakla
  const [hobbyInput, setHobbyInput] = useState<string>(''); // Hobi girişi için state

  // Inline editing için field update handler
  const handleFieldUpdate = (field: string, value: any) => {
    const fieldParts = field.split('.');
    
    setCvData(prev => {
      const updated = { ...prev };
      
      if (fieldParts.length === 1) {
        // Direct field (e.g., 'title', 'aboutMe')
        (updated as any)[fieldParts[0]] = value;
      } else if (fieldParts.length === 2) {
        // Nested field (e.g., 'personalInfo.firstName')
        const [section, fieldName] = fieldParts;
        if (!updated[section as keyof CVData]) {
          (updated as any)[section] = {};
        }
        ((updated as any)[section] as any)[fieldName] = value;
      } else if (fieldParts.length === 3) {
        // Array field (e.g., 'experience.0.title')
        const [section, index, fieldName] = fieldParts;
        const sectionData = (updated as any)[section] || [];
        if (sectionData[parseInt(index)]) {
          sectionData[parseInt(index)][fieldName] = value;
        }
      }
      
      return updated;
    });

    // Auto save after edit
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }
    
    const timeout = setTimeout(() => {
      saveCVData();
    }, 1000);
    
    setAutoSaveTimeout(timeout);
  };

  // AI ile alan zenginleştirme fonksiyonu
  const handleAIEnhance = async (fieldPath: string, currentValue: string) => {
    if (!currentValue || currentValue.trim() === '') {
      toast.error('Zenginleştirmek için alan boş olamaz');
      return;
    }

    try {
      toast.loading('AI ile zenginleştiriliyor...', { duration: 1000 });

      let instruction = '';
      if (fieldPath === 'aboutMe') {
        instruction = 'Bu hakkımda metnini profesyonel, etkileyici ve özgeçmiş için uygun hale getir. Kişinin güçlü yönlerini ve kariyerine olan bağlılığını vurgulayang, akıcı bir şekilde yaz.';
      } else if (fieldPath.includes('experience') && fieldPath.includes('description')) {
        instruction = 'Bu iş deneyimi açıklamasını profesyonel bir CV için uygun hale getir. Başarıları, sorumlulukları ve becerileri vurgula. Özgeçmiş formatına uygun, etkileyici bir dille yaz.';
      } else if (fieldPath.includes('education') && fieldPath.includes('description')) {
        instruction = 'Bu eğitim açıklamasını profesyonel bir CV için uygun hale getir. Önemli projeleri, başarıları ve kazanılan becerileri vurgula. Özgeçmiş formatına uygun şekilde yaz.';
      }

      const improvedText = await geminiService.improveField(fieldPath, currentValue, instruction);
      
      // Alan güncellenmesini trigger et - manuel form'da direkt updateCvData kullan
      if (fieldPath === 'aboutMe') {
        updateCvData('aboutMe', improvedText);
      } else if (fieldPath.includes('experience')) {
        // experience.0.description formatında
        const match = fieldPath.match(/experience\.(\d+)\.description/);
        if (match) {
          const index = parseInt(match[1]);
          const updatedExperience = [...(cvData.experience || [])];
          if (updatedExperience[index]) {
            updatedExperience[index] = { ...updatedExperience[index], description: improvedText };
            updateCvData('experience', updatedExperience);
          }
        }
      } else if (fieldPath.includes('education')) {
        // education.0.description formatında
        const match = fieldPath.match(/education\.(\d+)\.description/);
        if (match) {
          const index = parseInt(match[1]);
          const updatedEducation = [...(cvData.education || [])];
          if (updatedEducation[index]) {
            (updatedEducation[index] as any).description = improvedText;
            updateCvData('education', updatedEducation);
          }
        }
      }
      
      // Auto save
      saveCVData();
      
      toast.success('AI ile zenginleştirildi!');
    } catch (error) {

      toast.error('AI zenginleştirme başarısız oldu');
    }
  };

  const [cvData, setCvData] = useState<Partial<CVData>>({
    title: '',
    aboutMe: '', // Hakkımızda/Ek bilgiler alanı
    personalInfo: undefined,
    education: [],
    experience: [],
    skills: undefined,
    certificates: [],
    socialMedia: [],
    references: [], // Referansları ekle
    extras: {
      hobbies: [],
      references: [],
      additional: '',
      projects: [],
      volunteerWork: [],
      awards: []
    }
  });

  // Load AI data if provided
  useEffect(() => {
    if (aiDataParam && !isEditingExisting) {
      try {
        const parsedAIData = JSON.parse(decodeURIComponent(aiDataParam));
        setCvData(prev => ({
          ...prev,
          ...parsedAIData,
          // Merge any existing data with AI data
          personalInfo: {
            ...prev.personalInfo,
            ...parsedAIData.personalInfo
          },
          experience: parsedAIData.experience || prev.experience,
          education: parsedAIData.education || prev.education,
          skills: parsedAIData.skills || prev.skills,
          certificates: parsedAIData.certificates || prev.certificates
        }));
        
        // If AI data has personal info, skip to experience step
        if (parsedAIData.personalInfo?.fullName) {
          setCurrentStep(parsedAIData.experience?.length > 0 ? 4 : 3); // Skip to experience or education
        }
        
        toast.success('AI verileriniz yüklendi!');
      } catch (error) {
        toast.error('AI verileri yüklenemedi');
      }
    }
  }, [aiDataParam, isEditingExisting]);

  // Premium template access control - kredi sistemi
  useEffect(() => {
    // Eğer edit modundaysak ve orijinal template zaten premium ise kredi kontrolü yapma
    const isEditingPremiumCV = isEditingExisting && (originalTemplate === 'premium' || originalTemplate === 'executive');
    
    if ((selectedTemplate === 'premium' || selectedTemplate === 'executive') && !isEditingPremiumCV && (!user?.premiumCredits || user.premiumCredits < 1)) {
      // Redirect to premium page for credit purchase
      window.location.href = '/premium';
      return;
    }
  }, [selectedTemplate, user?.premiumCredits, isEditingExisting, originalTemplate]);

  const convertToNewFormat = (data: Partial<CVData>) => {
    // Veri boşsa veya eksikse template için güvenli varsayılan değerler kullan
    const safePersonalInfo = data.personalInfo || {} as any;
    const safeSkills = data.skills || { technical: [], personal: [], languages: [] };
    const safeExtras = data.extras || { hobbies: [], references: [], additional: '', projects: [], volunteerWork: [], awards: [] };
    
    return {
      showProfilePhoto: data.showProfilePhoto ?? false, // Kullanıcının tercihini al, yoksa false
      profilePhoto: safePersonalInfo.profilePhoto || user?.avatar || '', // En üst seviyede profilePhoto
      // Personal info alanları - template'ların beklediği format
      firstName: safePersonalInfo.fullName?.split(' ')[0] || safePersonalInfo.firstName || '',
      lastName: safePersonalInfo.fullName?.split(' ').slice(1).join(' ') || safePersonalInfo.lastName || '',
      fullName: safePersonalInfo.fullName || `${safePersonalInfo.firstName || ''} ${safePersonalInfo.lastName || ''}`.trim(),
      email: safePersonalInfo.emails?.[0] || safePersonalInfo.email || '',
      phone: safePersonalInfo.phones?.[0] || safePersonalInfo.phone || '',
      address: safePersonalInfo.address || '',
      title: safePersonalInfo.title || '',
      summary: '', // Summary alanını boş bırak, sadece aboutMe kullanılacak
      personalInfo: {
        firstName: safePersonalInfo.fullName?.split(' ')[0] || safePersonalInfo.firstName || '',
        lastName: safePersonalInfo.fullName?.split(' ').slice(1).join(' ') || safePersonalInfo.lastName || '',
        fullName: safePersonalInfo.fullName || `${safePersonalInfo.firstName || ''} ${safePersonalInfo.lastName || ''}`.trim(),
        email: safePersonalInfo.emails?.[0] || safePersonalInfo.email || '',
        phone: safePersonalInfo.phones?.[0] || safePersonalInfo.phone || '',
        address: safePersonalInfo.address || '',
        title: safePersonalInfo.title || '',
        summary: '', // Summary alanını boş bırak, sadece aboutMe kullanılacak
        profilePhoto: safePersonalInfo.profilePhoto || user?.avatar || '',
      },
      aboutMe: data.aboutMe || '', // Hakkımda alanını ekle
      experiences: (data.experience || []).map((exp: any, index: number) => ({
        id: exp.id || index.toString(),
        jobTitle: exp.position || '',
        company: exp.company || '',
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        isCurrentJob: !exp.endDate || exp.endDate === '',
        description: exp.description || '',
      })),
      educations: (data.education || []).map((edu: any, index: number) => {
        return {
          id: edu.id || index.toString(),
          degree: edu.degree || '',
          school: edu.school || '',
          department: edu.department || '',
          startDate: edu.startDate || '',
          endDate: edu.endDate || '',
          isCurrentEducation: !edu.endDate || edu.endDate === '',
          gpa: edu.gpa || '',
        };
      }),
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
          level: 3, // Default level
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
      socialMedia: data.socialMedia || [],
      references: data.references || [],
      // Ek alanları direkt olarak da ekle (TemplateManager uyumluluğu için)
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
  
  // Mevcut CV verilerini yükle
  useEffect(() => {
    const loadExistingCV = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoadingCV(true);
        
        // Eğer edit parametresi varsa, o CV'yi yükle
        if (editCVId) {
          const existingCV = await apiService.getCVById(editCVId);
          if (existingCV) {
            setIsEditingExisting(true);
            setCurrentCVId(existingCV.id);
            
            // Backend'den gelen template bilgisini kullan, yoksa URL'den al
            const templateToUse = existingCV.templateName || urlTemplate || 'modern';
            setSelectedTemplate(templateToUse as TemplateId);
            setOriginalTemplate(templateToUse as TemplateId); // Orijinal template'i sakla
            
            setCvData({
              title: existingCV.title || '',
              aboutMe: existingCV.aboutMe || '', // Hakkımda alanını ekle
              showProfilePhoto: existingCV.showProfilePhoto || false,
              personalInfo: existingCV.personalInfo,
              education: existingCV.education || [],
              experience: existingCV.experience || [],
              skills: existingCV.skills || { technical: [], personal: [], languages: [] },
              certificates: existingCV.certificates || [],
              socialMedia: existingCV.socialMedia || [],
              references: existingCV.references || [], // Referansları ekle
              extras: existingCV.extras || { 
                hobbies: [], 
                references: [], 
                additional: '',
                projects: [],
                volunteerWork: [],
                awards: []
              }
            });
          }
        } else {
          // Eğer edit parametresi yoksa, yeni CV oluştur
          // URL'den template al, yoksa default modern kullan
          const templateToUse = urlTemplate || 'modern';
          setSelectedTemplate(templateToUse as TemplateId);

          // Kullanıcı bilgilerini backend'den çek
          try {
            const profile = await apiService.getUserProfile();
            setCvData({
              title: '',
              aboutMe: '',
              showProfilePhoto: false,
              personalInfo: {
                fullName: profile.fullName || profile.name || '',
                phones: profile.phones && profile.phones.length > 0 ? profile.phones : [''],
                emails: profile.emails && profile.emails.length > 0 ? profile.emails : (profile.email ? [profile.email] : ['']),
                address: profile.address || '',
                profilePhoto: profile.profilePhoto || '',
              } as any,
              education: [],
              experience: [],
              skills: { technical: [], personal: [], languages: [] },
              certificates: [],
              socialMedia: [],
              references: [],
              extras: { 
                hobbies: [], 
                references: [], 
                additional: '',
                projects: [],
                volunteerWork: [],
                awards: []
              }
            });
          } catch (err) {
            // Backend'den profil çekilemezse fallback olarak user'dan doldur
            setCvData({
              title: '',
              aboutMe: '',
              showProfilePhoto: false,
              personalInfo: {
                fullName: user?.name || '',
                phones: [''],
                emails: user?.email ? [user.email] : [''],
                address: '',
                profilePhoto: '',
              } as any,
              education: [],
              experience: [],
              skills: { technical: [], personal: [], languages: [] },
              certificates: [],
              socialMedia: [],
              references: [],
              extras: { 
                hobbies: [], 
                references: [], 
                additional: '',
                projects: [],
                volunteerWork: [],
                awards: []
              }
            });
          }
        }
      } catch (error) {
        // Error loading CV
      } finally {
        setIsLoadingCV(false);
      }
    };

    loadExistingCV();
  }, [user?.id, editCVId, urlTemplate]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
    };
  }, [autoSaveTimeout]);

  if (isLoading || isLoadingCV) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {isLoading ? 'Kullanıcı bilgileri yükleniyor...' : 'CV verileri yükleniyor...'}
          </p>
        </div>
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

  const currentStepData = steps.find(step => step.id === currentStep);
  const progress = (currentStep / steps.length) * 100;

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'CV Oluştur', href: '/dashboard' },
    { label: isEditingExisting ? 'CV Düzenle' : 'Manuel CV', current: true }
  ];

  const handleNext = async () => {
    if (currentStep < 11) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 11) {
      // Son adımda - CV'yi tamamla
      await handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateCvData = (section: string, data: any) => {
    setCvData(prev => ({
      ...prev,
      [section]: data
    }));
    
    // Debounced auto-save - 2 saniye sonra kaydet
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }
    
    const timeout = setTimeout(() => {
      saveCVData().catch(() => {});
    }, 2000);
    
    setAutoSaveTimeout(timeout);
  };

  // Hobi ekleme fonksiyonu
  const addHobby = () => {
    if (hobbyInput.trim()) {
      const currentHobbies = Array.isArray(cvData.extras?.hobbies) ? cvData.extras.hobbies : [];
      updateCvData('extras', {
        ...cvData.extras,
        hobbies: [...currentHobbies, hobbyInput.trim()]
      });
      setHobbyInput('');
      saveCVData();
    }
  };

  // Hobi kaldırma fonksiyonu
  const removeHobby = (index: number) => {
    const currentHobbies = Array.isArray(cvData.extras?.hobbies) ? cvData.extras.hobbies : [];
    const newHobbies = currentHobbies.filter((_, i) => i !== index);
    updateCvData('extras', {
      ...cvData.extras,
      hobbies: newHobbies
    });
    saveCVData();
  };

  // CV verilerini kaydet
  const saveCVData = async () => {
    if (!user?.id) return;
    
    try {
      const cvDataToSave = {
        userId: user.id,
        title: cvData.title || `${cvData.personalInfo?.fullName || 'Adsız'} CV - ${new Date().toLocaleDateString('tr-TR')}`,
        templateName: selectedTemplate,
        status: 'draft',
        showProfilePhoto: cvData.showProfilePhoto || false, // Profil fotoğrafı gösterme ayarı
        personalInfo: {
          fullName: cvData.personalInfo?.fullName || '',
          phones: cvData.personalInfo?.phones || [],
          emails: cvData.personalInfo?.emails || [],
          address: cvData.personalInfo?.address || '',
          profilePhoto: cvData.personalInfo?.profilePhoto || user?.avatar || '', // Auth context'ten avatar'ı al
        } as any,
        aboutMe: cvData.aboutMe || '', // Hakkımızda alanını ekle
        education: cvData.education || [],
        experience: cvData.experience || [],
        skills: cvData.skills || {
          technical: [],
          personal: [],
          languages: []
        },
        certificates: cvData.certificates || [],
        references: cvData.references || [], // Referansları backend'e gönder
        socialMedia: cvData.socialMedia || [],
        extras: {
          hobbies: Array.isArray(cvData.extras?.hobbies) ? cvData.extras.hobbies : [],
          references: Array.isArray(cvData.extras?.references) ? cvData.extras.references : [],
          additional: cvData.extras?.additional || '',
          projects: cvData.extras?.projects || [],
          volunteerWork: cvData.extras?.volunteerWork || [],
          awards: cvData.extras?.awards || []
        }
      };
      
      if (currentCVId) {
        // Var olan CV'yi güncelle
        await apiService.updateCVById(currentCVId, cvDataToSave);
      } else {
        // Yeni CV oluştur ve ID'sini kaydet
        const newCV = await apiService.createCV(user.id, cvDataToSave);
        setCurrentCVId(newCV.id);
        setIsEditingExisting(true);
      }
    } catch (error) {
      throw error; // Hatayı yukarı fırlat
    }
  };

  const handleComplete = async () => {
    if (!user?.id) return;
    
    try {
      setIsCompleting(true);
      
      // Premium template kullanılıyorsa kredi kontrolü ve düşürme
      if (selectedTemplate === 'premium' || selectedTemplate === 'executive') {
        // Eğer edit modundaysak ve orijinal template zaten premium ise kredi düşürme
        const isEditingPremiumCV = isEditingExisting && (originalTemplate === 'premium' || originalTemplate === 'executive');
        
        if (!isEditingPremiumCV) {
          // Yeni premium CV oluşturuluyorsa kredi kontrolü yap
          if (!user.premiumCredits || user.premiumCredits < 1) {
            toast.error('Premium CV oluşturmak için yeterli krediniz yok!');
            setTimeout(() => {
              window.location.href = '/premium';
            }, 1500);
            return;
          }
          
          // Kredi düşür
          const creditResult = await deductPremiumCredit();
          if (!creditResult.success) {
            // Hata mesajı göster ama devam et - localStorage fallback kullanılmış olabilir
          }
        }
      }
      
      // CV'yi final durumda veritabanına kaydet
      const finalCvData = {
        userId: user.id,
        title: cvData.title || `${cvData.personalInfo?.fullName || 'Adsız'} CV - ${new Date().toLocaleDateString('tr-TR')}`,
        templateName: selectedTemplate, // Template ID'yi kaydet
        status: 'completed', // Final durumda tamamlanmış olarak işaretle
        personalInfo: {
          fullName: cvData.personalInfo?.fullName || '',
          phones: cvData.personalInfo?.phones || [],
          emails: cvData.personalInfo?.emails || [],
          address: cvData.personalInfo?.address || '',
          profilePhoto: cvData.personalInfo?.profilePhoto || user?.avatar || '', // Auth context'ten avatar'ı al
        } as any,
        aboutMe: cvData.aboutMe || '', // Hakkımızda alanını ekle
        education: cvData.education || [],
        experience: cvData.experience || [],
        skills: cvData.skills || {
          technical: [],
          personal: [],
          languages: []
        },
        certificates: cvData.certificates || [],
        references: Array.isArray(cvData.extras?.references) ? cvData.extras.references : [],
        socialMedia: cvData.socialMedia || [],
        extras: {
          hobbies: Array.isArray(cvData.extras?.hobbies) ? cvData.extras.hobbies : 
                   typeof cvData.extras?.hobbies === 'string' ? [cvData.extras.hobbies] : [],
          references: Array.isArray(cvData.extras?.references) ? cvData.extras.references : [],
          additional: cvData.extras?.additional || '',
          projects: cvData.extras?.projects || [],
          volunteerWork: cvData.extras?.volunteerWork || [],
          awards: cvData.extras?.awards || []
        }
      };
      
      // Önce CV'yi kaydet (eğer kaydedilmemişse)
      if (!currentCVId) {
        await saveCVData();
      }
      
      // Sonra status'u completed olarak güncelle
      if (currentCVId) {
        const completedCvData = {
          userId: user.id,
          title: cvData.title || `${cvData.personalInfo?.fullName || 'Adsız'} CV - ${new Date().toLocaleDateString('tr-TR')}`,
          templateName: selectedTemplate,
          status: 'completed', // Status'u completed yap
          personalInfo: {
            fullName: cvData.personalInfo?.fullName || '',
            phones: cvData.personalInfo?.phones || [],
            emails: cvData.personalInfo?.emails || [],
            address: cvData.personalInfo?.address || '',
            profilePhoto: cvData.personalInfo?.profilePhoto || '',
          } as any,
          aboutMe: cvData.aboutMe || '',
          education: cvData.education || [],
          experience: cvData.experience || [],
          skills: cvData.skills || {
            technical: [],
            personal: [],
            languages: []
          },
          certificates: cvData.certificates || [],
          references: cvData.references || [],
          socialMedia: cvData.socialMedia || [],
          extras: {
            hobbies: Array.isArray(cvData.extras?.hobbies) ? cvData.extras.hobbies : 
                     typeof cvData.extras?.hobbies === 'string' ? [cvData.extras.hobbies] : [],
            references: Array.isArray(cvData.extras?.references) ? cvData.extras.references : [],
            additional: cvData.extras?.additional || '',
            projects: cvData.extras?.projects || [],
            volunteerWork: cvData.extras?.volunteerWork || [],
            awards: cvData.extras?.awards || []
          }
        };
        
        await apiService.updateCVById(currentCVId, completedCvData);
      }
      
      // Başarı mesajı göster ve CV'lerim sayfasına yönlendir
      toast.success('CV başarıyla oluşturuldu! 🎉');
      
      // Kısa bir delay sonra yönlendir
      setTimeout(() => {
        window.location.href = '/my-cvs';
      }, 1500);
    } catch (error) {
      toast.error('CV kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsCompleting(false);
    }
  };

  const handlePDFDownload = async () => {
    if (!user?.id) return;
    
    // Premium template kullanılıyorsa kredi kontrolü (edit modunda değilse veya orijinal template premium değilse)
    const isEditingPremiumCV = isEditingExisting && originalTemplate === 'premium';
    if (selectedTemplate === 'premium' && !isEditingPremiumCV && (!user.premiumCredits || user.premiumCredits < 1)) {
      window.location.href = '/premium';
      return;
    }
    
    try {
      setIsPDFGenerating(true);
      
      // Premium template kullanılıyorsa kredi harca
      if (selectedTemplate === 'premium') {
        const token = localStorage.getItem('auth_token');
        if (token) {
          await fetch('/api/use-credit', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ creditAmount: 1 })
          });
        }
      }
      
      // Önce CV'yi kaydet
      await saveCVData();
      
      // CV verilerini yeni formata çevir
      const formattedCvData = convertToNewFormat(cvData);
      
      // Önizleme HTML'ini al
      const cvElement = document.querySelector('[data-cv-content]');
      if (!cvElement) {
        throw new Error('CV önizlemesi bulunamadı');
      }
      
      const previewHtml = cvElement.outerHTML;
      
      // PDF API'ye HTML'i direkt gönder
      const response = await fetch('/api/pdf/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: selectedTemplate,
          cvData: formattedCvData,
          previewHtml: previewHtml
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

  const handleFullScreenPreview = async () => {
    try {
      setIsPDFGenerating(true);
      
      // CV verilerini yeni formata çevir
      const formattedCvData = convertToNewFormat(cvData);
      
      // Önizleme HTML'ini al
      const cvElement = document.querySelector('[data-cv-content]');
      if (!cvElement) {
        throw new Error('CV önizlemesi bulunamadı');
      }
      
      const previewHtml = cvElement.outerHTML;
      
      // PDF API'ye HTML'i direkt gönder ve yeni sekmede aç
      const response = await fetch('/api/pdf/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: selectedTemplate,
          cvData: formattedCvData,
          previewHtml: previewHtml
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
    } finally {
      setIsPDFGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard"
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard'a Dön
              </Link>
              
              {isEditingExisting && (
                <div className="flex items-center text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
                  <Settings className="w-3 h-3 mr-1" />
                  CV Düzenleniyor
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Adım {currentStep} / {steps.length}
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">CV Bölümleri</h3>
              <nav className="space-y-2">
                {steps.map((step) => {
                  const IconComponent = step.icon;
                  const isCompleted = step.id < currentStep;
                  const isCurrent = step.id === currentStep;
                  
                  return (
                    <button
                      key={step.id}
                      onClick={() => setCurrentStep(step.id)}
                      className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                        isCurrent 
                          ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                          : isCompleted
                          ? 'bg-green-50 text-green-700 hover:bg-green-100'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        isCurrent 
                          ? 'bg-blue-100' 
                          : isCompleted
                          ? 'bg-green-100'
                          : 'bg-gray-100'
                      }`}>
                        {isCompleted ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <IconComponent className={`w-4 h-4 ${
                            isCurrent ? 'text-blue-600' : 'text-gray-400'
                          }`} />
                        )}
                      </div>
                      <span className="font-medium">{step.name}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Quick Actions */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Hızlı İşlemler</h4>
                <div className="space-y-2">
                  <Link
                    href="/create-cv?method=manual"
                    className="w-full flex items-center p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Şablon Değiştir
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              {/* Step Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    {currentStepData && <currentStepData.icon className="w-6 h-6 text-blue-600" />}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {currentStepData?.name}
                    </h1>
                    <p className="text-gray-600">
                      {currentStep === 1 && "Kişisel bilgilerini ve iletişim detaylarını gir"}
                      {currentStep === 2 && "Kendinizden bahsedin ve kişisel özelliklerinizi vurgulayın"}
                      {currentStep === 3 && "Eğitim geçmişini ve aldığın sertifikaları ekle"}
                      {currentStep === 4 && "İş deneyimlerini ve başarılarını detaylandır"}
                      {currentStep === 5 && "Teknik ve kişisel yeteneklerini belirt"}
                      {currentStep === 6 && "Dil becerilerini ve seviyelerini ekle"}
                      {currentStep === 7 && "Sertifikalarını ve başarılarını ekle"}
                      {currentStep === 8 && "Referans kişilerini ve iletişim bilgilerini ekle"}
                      {currentStep === 9 && "Sosyal medya hesaplarını ve iletişim bilgilerini ekle"}
                      {currentStep === 10 && "Ek bilgiler ve hobilerini ekle"}
                      {currentStep === 11 && "CV'ini önizle ve indir"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Step Content */}
              <div className="p-6">
                {currentStep === 1 && (
                  <div className="space-y-6">
                    {/* CV Title Section */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">📝 CV İsmi</h3>
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                          CV'nize bir isim verin (opsiyonel)
                        </label>
                        <input
                          type="text"
                          placeholder="Örn: Frontend Developer CV, Yazılım Geliştirici CV..."
                          value={cvData.title || ''}
                          onChange={(e) => {
                            updateCvData('title', e.target.value);
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-sm text-gray-600">
                          İsim belirtmezseniz otomatik olarak "İsimsiz CV 1, İsimsiz CV 2..." şeklinde numaralandırılır.
                        </p>
                      </div>
                    </div>

                    {/* Template Information Section */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">🎨 Kullanılan Şablon</h3>
                      <div className="flex items-center space-x-3">
                        <div className="flex-1">
                          <p className="font-medium text-green-900">
                            {TEMPLATE_DEFINITIONS[selectedTemplate]?.name || selectedTemplate}
                          </p>
                          <p className="text-sm text-green-700">
                            {TEMPLATE_DEFINITIONS[selectedTemplate]?.description || 
                             (selectedTemplate === 'premium' ? 
                              'Premium şablon - Profesyonel tasarım özelliklerine sahip' :
                              selectedTemplate === 'modern' ?
                              'Modern şablon - Temiz ve güncel tasarım' :
                              'Klasik şablon - Geleneksel ve sade tasarım')
                            }
                          </p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          selectedTemplate === 'premium' ? 'bg-yellow-100 text-yellow-800' :
                          selectedTemplate === 'executive' ? 'bg-black text-yellow-400 border border-yellow-400' :
                          selectedTemplate === 'modern' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedTemplate === 'premium' ? '👑 Premium' : 
                           selectedTemplate === 'executive' ? '💼 Executive' :
                           selectedTemplate === 'modern' ? '✨ Modern' : 
                           '📄 Klasik'}
                        </div>
                      </div>
                      {isEditingExisting && (
                        <p className="text-xs text-green-600 mt-2">
                          ✅ Bu CV daha önce {TEMPLATE_DEFINITIONS[selectedTemplate]?.name || selectedTemplate} şablonu ile kaydedilmiş
                        </p>
                      )}
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900">Kişisel Bilgiler</h3>
                    
                    {/* Profil Fotoğrafı Seçeneği */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-3">📷 Profil Fotoğrafı</h4>
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={cvData.showProfilePhoto || false}
                            onChange={(e) => {
                              updateCvData('showProfilePhoto', e.target.checked);
                            }}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <span className="text-sm font-medium text-blue-900">
                            CV'de profil fotoğrafımı göster
                          </span>
                        </label>
                        {(cvData.personalInfo?.profilePhoto || user?.avatar) && (
                          <div className="flex items-center space-x-2">
                            <img 
                              src={cvData.personalInfo?.profilePhoto || user?.avatar} 
                              alt="Profil" 
                              className="w-8 h-8 rounded-full object-cover border-2 border-blue-300"
                            />
                            <span className="text-xs text-blue-700">Mevcut fotoğraf</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-blue-700 mt-2">
                        Profil fotoğrafınızı profil sayfasından güncelleyebilirsiniz.
                      </p>
                    </div>

                    {cvData.personalInfo ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h4 className="font-medium text-green-900 mb-3">✅ Profil Bilgilerin Mevcut</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-800">
                          <div>
                            <span className="font-medium">Ad Soyad:</span> {cvData.personalInfo.fullName || 'Belirtilmemiş'}
                          </div>
                          <div>
                            <span className="font-medium">E-posta:</span> {cvData.personalInfo.emails?.[0] || 'Belirtilmemiş'}
                          </div>
                          <div>
                            <span className="font-medium">Telefon:</span> {cvData.personalInfo.phones?.[0] || 'Belirtilmemiş'}
                          </div>
                          <div>
                            <span className="font-medium">Doğum Tarihi:</span> {(cvData.personalInfo as any)?.birthday || 'Belirtilmemiş'}
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <p className="text-green-800">
                            Bu bilgiler profil sayfasından otomatik olarak çekildi.
                          </p>
                          <Link
                            href="/profile"
                            className="text-green-700 hover:text-green-800 font-medium text-sm underline"
                          >
                            Düzenle
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="font-medium text-yellow-900 mb-2">⚠️ Profil Bilgileri Eksik</h4>
                        <p className="text-yellow-800 mb-4">
                          CV oluşturmak için önce profil bilgilerini tamamlamalısın.
                        </p>
                        <Link
                          href="/profile"
                          className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
                        >
                          Profil Bilgilerini Tamamla
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="space-y-6">
                      {/* Header */}
                      <div className="text-center">
                        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Hakkımda</h2>
                        <p className="text-gray-600">
                          Kendinizden bahsedin. Bu alan CV'nizde ayrı bir bölüm olarak görünecektir.
                        </p>
                      </div>

                      {/* Info Box */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div className="text-sm text-blue-800">
                            <p className="font-medium mb-1">İpucu:</p>
                            <ul className="space-y-1 list-disc list-inside">
                              <li>Kişisel özelliklerinizi ve değerlerinizi vurgulayın</li>
                              <li>Profesyonel hedeflerinizi belirtin</li>
                              <li>Bu alan boş bırakılırsa CV'de görünmeyecektir</li>
                              <li>150-300 kelime arası optimal uzunluktur</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* About Me Text Area */}
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label htmlFor="aboutMe" className="block text-sm font-medium text-gray-700">
                              Hakkımda Metni
                            </label>
                            {cvData.aboutMe && cvData.aboutMe.trim() && (
                              <button
                                onClick={() => handleAIEnhance('aboutMe', cvData.aboutMe || '')}
                                className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-600 text-white text-xs rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all duration-200 shadow-sm"
                                title="AI ile zenginleştir"
                              >
                                <Sparkles className="w-3 h-3" />
                                AI ile Zenginleştir
                              </button>
                            )}
                          </div>
                          <textarea
                            id="aboutMe"
                            value={cvData.aboutMe || ''}
                            onChange={(e) => {
                              updateCvData('aboutMe', e.target.value);
                            }}
                            rows={8}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 resize-none"
                            placeholder="Kendinizi tanıtın... Örnek: 'Yaratıcı düşünce yapısı ve analitik problem çözme yetenekleri ile yazılım geliştirme alanında...'"
                          />
                          <div className="mt-2 flex justify-between text-sm text-gray-500">
                            <span>Bu alan opsiyoneldir ve boş bırakılabilir</span>
                            <span>{(cvData.aboutMe || '').length} karakter</span>
                          </div>
                        </div>
                      </div>

                      {/* Preview */}
                      {cvData.aboutMe?.trim() && (
                        <div className="mt-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">Önizleme</h3>
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <User className="w-4 h-4 text-gray-600" />
                              <h4 className="font-medium text-gray-900">Hakkımda</h4>
                            </div>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                              {cvData.aboutMe}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Eğitim Bilgileri</h3>
                      <button
                        onClick={() => {
                          const newEducation = {
                            school: '',
                            department: '',
                            startDate: '',
                            endDate: '',
                            degree: '',
                            gpa: '',
                            description: ''
                          };
                          updateCvData('education', [...(cvData.education || []), newEducation]);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        + Eğitim Ekle
                      </button>
                    </div>
                    
                    {cvData.education && cvData.education.length > 0 ? (
                      <div className="space-y-4">
                        {cvData.education.map((education, index) => (
                          <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <input
                                type="text"
                                placeholder="Okul/Üniversite Adı"
                                value={education.school}
                                onChange={(e) => {
                                  const updatedEducation = [...(cvData.education || [])];
                                  updatedEducation[index] = { ...updatedEducation[index], school: e.target.value };
                                  updateCvData('education', updatedEducation);
                                  saveCVData();
                                }}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <input
                                type="text"
                                placeholder="Bölüm/Department"
                                value={education.department}
                                onChange={(e) => {
                                  const updatedEducation = [...(cvData.education || [])];
                                  updatedEducation[index] = { ...updatedEducation[index], department: e.target.value };
                                  updateCvData('education', updatedEducation);
                                  saveCVData();
                                }}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <input
                                type="text"
                                placeholder="Derece (Lisans, Yüksek Lisans...)"
                                value={education.degree}
                                onChange={(e) => {
                                  const updatedEducation = [...(cvData.education || [])];
                                  updatedEducation[index] = { ...updatedEducation[index], degree: e.target.value };
                                  updateCvData('education', updatedEducation);
                                  saveCVData();
                                }}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <input
                                type="date"
                                placeholder="Başlangıç Tarihi"
                                value={education.startDate}
                                onChange={(e) => {
                                  const updatedEducation = [...(cvData.education || [])];
                                  updatedEducation[index] = { ...updatedEducation[index], startDate: e.target.value };
                                  updateCvData('education', updatedEducation);
                                  saveCVData();
                                }}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <input
                                type="date"
                                placeholder="Mezuniyet Tarihi"
                                value={education.endDate}
                                onChange={(e) => {
                                  const updatedEducation = [...(cvData.education || [])];
                                  updatedEducation[index] = { ...updatedEducation[index], endDate: e.target.value };
                                  updateCvData('education', updatedEducation);
                                  saveCVData();
                                }}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div className="mb-4">
                              <input
                                type="text"
                                placeholder="GPA/Not Ortalaması (Opsiyonel)"
                                value={education.gpa}
                                onChange={(e) => {
                                  const updatedEducation = [...(cvData.education || [])];
                                  updatedEducation[index] = { ...updatedEducation[index], gpa: e.target.value };
                                  updateCvData('education', updatedEducation);
                                  saveCVData();
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div className="mb-4">
                              <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                  Eğitim açıklaması (Opsiyonel)
                                </label>
                                {(education as any).description && (education as any).description.trim() && (
                                  <button
                                    onClick={() => handleAIEnhance(`education.${index}.description`, (education as any).description || '')}
                                    className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-500 to-blue-600 text-white text-xs rounded-md hover:from-purple-600 hover:to-blue-700 transition-all duration-200 shadow-sm"
                                    title="Eğitim açıklamasını AI ile zenginleştir"
                                  >
                                    <Sparkles className="w-3 h-3" />
                                    AI ile Zenginleştir
                                  </button>
                                )}
                              </div>
                              <textarea
                                placeholder="Eğitim açıklaması (Opsiyonel - projeler, başarılar, vb.)"
                                value={(education as any).description || ''}
                                onChange={(e) => {
                                  const updatedEducation = [...(cvData.education || [])];
                                  (updatedEducation[index] as any).description = e.target.value;
                                  updateCvData('education', updatedEducation);
                                  saveCVData();
                                }}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                              />
                            </div>
                            <div className="flex justify-end">
                              <button
                                onClick={() => {
                                  const updatedEducation = cvData.education?.filter((_, i) => i !== index) || [];
                                  updateCvData('education', updatedEducation);
                                  saveCVData();
                                }}
                                className="text-red-600 hover:text-red-700 text-sm"
                              >
                                Sil
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                        <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Henüz eğitim bilgisi eklenmedi</p>
                        <p className="text-gray-400 text-sm">Yukarıdaki "Eğitim Ekle" butonuna tıklayın</p>
                      </div>
                    )}
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">İş Deneyimi</h3>
                    
                    <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-lg font-medium text-gray-900 flex items-center">
                          <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                          İş Deneyimleri
                        </h4>
                        <button
                          onClick={() => {
                            const newExperience = {
                              company: '',
                              position: '',
                              startDate: '',
                              endDate: '',
                              isCurrent: false,
                              description: ''
                            };
                            updateCvData('experience', [...(cvData.experience || []), newExperience]);
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                        >
                          + İş Deneyimi Ekle
                        </button>
                      </div>
                      
                      {cvData.experience && cvData.experience.length > 0 ? (
                        <div className="space-y-6">
                          {cvData.experience.map((exp, index) => (
                            <div key={index} className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-500">
                              <div className="flex justify-between items-start mb-4">
                                <h5 className="font-medium text-gray-900">İş Deneyimi {index + 1}</h5>
                                <button
                                  onClick={() => {
                                    const updatedExperience = cvData.experience?.filter((_, i) => i !== index) || [];
                                    updateCvData('experience', updatedExperience);
                                    saveCVData();
                                  }}
                                  className="text-red-600 hover:text-red-700 px-2 py-1 rounded"
                                >
                                  ✕
                                </button>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Şirket Adı *
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="Örn: ABC Teknoloji"
                                    value={exp.company || ''}
                                    onChange={(e) => {
                                      const updatedExperience = [...(cvData.experience || [])];
                                      updatedExperience[index] = { ...updatedExperience[index], company: e.target.value };
                                      updateCvData('experience', updatedExperience);
                                      saveCVData();
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Pozisyon *
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="Örn: Frontend Developer"
                                    value={exp.position || ''}
                                    onChange={(e) => {
                                      const updatedExperience = [...(cvData.experience || [])];
                                      updatedExperience[index] = { ...updatedExperience[index], position: e.target.value };
                                      updateCvData('experience', updatedExperience);
                                      saveCVData();
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Başlangıç Tarihi *
                                  </label>
                                  <input
                                    type="month"
                                    value={exp.startDate || ''}
                                    onChange={(e) => {
                                      const updatedExperience = [...(cvData.experience || [])];
                                      updatedExperience[index] = { ...updatedExperience[index], startDate: e.target.value };
                                      updateCvData('experience', updatedExperience);
                                      saveCVData();
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Bitiş Tarihi
                                  </label>
                                  <div className="space-y-2">
                                    <input
                                      type="month"
                                      value={exp.endDate || ''}
                                      disabled={exp.isCurrent}
                                      onChange={(e) => {
                                        const updatedExperience = [...(cvData.experience || [])];
                                        updatedExperience[index] = { ...updatedExperience[index], endDate: e.target.value };
                                        updateCvData('experience', updatedExperience);
                                        saveCVData();
                                      }}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                                    />
                                    <label className="flex items-center">
                                      <input
                                        type="checkbox"
                                        checked={exp.isCurrent || false}
                                        onChange={(e) => {
                                          const updatedExperience = [...(cvData.experience || [])];
                                          updatedExperience[index] = { 
                                            ...updatedExperience[index], 
                                            isCurrent: e.target.checked,
                                            endDate: e.target.checked ? '' : updatedExperience[index].endDate
                                          };
                                          updateCvData('experience', updatedExperience);
                                          saveCVData();
                                        }}
                                        className="mr-2"
                                      />
                                      <span className="text-sm text-gray-600">Hala çalışıyorum</span>
                                    </label>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <label className="block text-sm font-medium text-gray-700">
                                    İş Açıklaması
                                  </label>
                                  {exp.description && exp.description.trim() && (
                                    <button
                                      onClick={() => handleAIEnhance(`experience.${index}.description`, exp.description || '')}
                                      className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-500 to-blue-600 text-white text-xs rounded-md hover:from-purple-600 hover:to-blue-700 transition-all duration-200 shadow-sm"
                                      title="İş açıklamasını AI ile zenginleştir"
                                    >
                                      <Sparkles className="w-3 h-3" />
                                      AI ile Zenginleştir
                                    </button>
                                  )}
                                </div>
                                <textarea
                                  placeholder="İş tanımın, sorumlulukların ve başarıların..."
                                  value={exp.description || ''}
                                  onChange={(e) => {
                                    const updatedExperience = [...(cvData.experience || [])];
                                    updatedExperience[index] = { ...updatedExperience[index], description: e.target.value };
                                    updateCvData('experience', updatedExperience);
                                    saveCVData();
                                  }}
                                  rows={4}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p>Henüz iş deneyimi eklenmedi</p>
                          <p className="text-sm">İş geçmişini ve deneyimlerini ekle</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">Yetenekler & Beceriler</h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Teknik Yetenekler */}
                      <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-medium text-gray-900 flex items-center">
                            <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                            Teknik Yetenekler
                          </h4>
                          <button
                            onClick={() => {
                              const newSkill = '';
                              updateCvData('skills', {
                                ...cvData.skills,
                                technical: [...(cvData.skills?.technical || []), newSkill]
                              });
                            }}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                          >
                            + Ekle
                          </button>
                        </div>
                        
                        {cvData.skills?.technical && cvData.skills.technical.length > 0 ? (
                          <div className="space-y-3">
                            {cvData.skills.technical.map((skill, index) => (
                              <div key={index} className="flex gap-3 items-center">
                                <input
                                  type="text"
                                  placeholder="Teknik yetenek (JavaScript, React, Python...)"
                                  value={skill}
                                  onChange={(e) => {
                                    const updatedSkills = [...(cvData.skills?.technical || [])];
                                    updatedSkills[index] = e.target.value;
                                    updateCvData('skills', {
                                      ...cvData.skills,
                                      technical: updatedSkills
                                    });
                                    saveCVData();
                                  }}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <button
                                  onClick={() => {
                                    const updatedSkills = cvData.skills?.technical?.filter((_, i) => i !== index) || [];
                                    updateCvData('skills', {
                                      ...cvData.skills,
                                      technical: updatedSkills
                                    });
                                    saveCVData();
                                  }}
                                  className="text-red-600 hover:text-red-700 text-sm px-2"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <p className="text-sm">Henüz teknik yetenek eklenmedi</p>
                            <p className="text-xs mt-1">JavaScript, Python, React gibi teknolojileri ekleyin</p>
                          </div>
                        )}
                      </div>

                      {/* Kişisel Yetenekler */}
                      <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-medium text-gray-900 flex items-center">
                            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                            Kişisel Yetenekler
                          </h4>
                          <button
                            onClick={() => {
                              const newSkill = '';
                              updateCvData('skills', {
                                ...cvData.skills,
                                personal: [...(cvData.skills?.personal || []), newSkill]
                              });
                            }}
                            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                          >
                            + Ekle
                          </button>
                        </div>
                        
                        {cvData.skills?.personal && cvData.skills.personal.length > 0 ? (
                          <div className="space-y-3">
                            {cvData.skills.personal.map((skill, index) => (
                              <div key={index} className="flex gap-3 items-center">
                                <input
                                  type="text"
                                  placeholder="Kişisel yetenek (Liderlik, İletişim, Problem Çözme...)"
                                  value={skill}
                                  onChange={(e) => {
                                    const updatedSkills = [...(cvData.skills?.personal || [])];
                                    updatedSkills[index] = e.target.value;
                                    updateCvData('skills', {
                                      ...cvData.skills,
                                      personal: updatedSkills
                                    });
                                    saveCVData();
                                  }}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                                <button
                                  onClick={() => {
                                    const updatedSkills = cvData.skills?.personal?.filter((_, i) => i !== index) || [];
                                    updateCvData('skills', {
                                      ...cvData.skills,
                                      personal: updatedSkills
                                    });
                                    saveCVData();
                                  }}
                                  className="text-red-600 hover:text-red-700 text-sm px-2"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <p className="text-sm">Henüz kişisel yetenek eklenmedi</p>
                            <p className="text-xs mt-1">Liderlik, Takım Çalışması, Problem Çözme gibi yetenekler</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 6 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">Dil Becerileri</h3>
                    
                    <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-lg font-medium text-gray-900 flex items-center">
                          <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                          Konuştuğun Diller
                        </h4>
                        <button
                          onClick={() => {
                            const newLanguage = { language: '', level: '3' };
                            updateCvData('skills', {
                              ...cvData.skills,
                              languages: [...(cvData.skills?.languages || []), newLanguage]
                            });
                          }}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors"
                        >
                          + Dil Ekle
                        </button>
                      </div>
                      
                      {cvData.skills?.languages && cvData.skills.languages.length > 0 ? (
                        <div className="space-y-4">
                          {cvData.skills.languages.map((lang, index) => {
                            // Ensure we have a proper language object
                            const languageObj = typeof lang === 'object' ? lang : { language: lang || '', level: '3' };
                            
                            return (
                              <div key={index} className="flex gap-4 items-center bg-gray-50 p-4 rounded-lg">
                                <div className="flex-1">
                                  <input
                                    type="text"
                                    placeholder="Dil adı (İngilizce, Almanca, Fransızca...)"
                                    value={languageObj.language}
                                    onChange={(e) => {
                                      const updatedLanguages = [...(cvData.skills?.languages || [])];
                                      updatedLanguages[index] = { 
                                        language: e.target.value, 
                                        level: languageObj.level || '3' 
                                      };
                                      updateCvData('skills', {
                                        ...cvData.skills,
                                        languages: updatedLanguages
                                      });
                                      saveCVData();
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  />
                                </div>
                                
                                <div className="flex-1">
                                  <select
                                    value={languageObj.level || '3'}
                                    onChange={(e) => {
                                      const updatedLanguages = [...(cvData.skills?.languages || [])];
                                      updatedLanguages[index] = { 
                                        language: languageObj.language, 
                                        level: e.target.value 
                                      };
                                      updateCvData('skills', {
                                        ...cvData.skills,
                                        languages: updatedLanguages
                                      });
                                      saveCVData();
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  >
                                    <option value="1">Başlangıç (A1-A2)</option>
                                    <option value="2">Temel (B1)</option>
                                    <option value="3">Orta (B2)</option>
                                    <option value="4">İleri (C1)</option>
                                    <option value="5">Ana Dil / Uzman (C2)</option>
                                  </select>
                                </div>
                                
                                <div className="flex gap-1">
                                  {[1, 2, 3, 4, 5].map((dot) => (
                                    <span
                                      key={dot}
                                      className={`w-3 h-3 rounded-full border-2 border-purple-500 ${
                                        dot <= parseInt(languageObj.level || '3')
                                          ? 'bg-purple-500'
                                          : 'bg-transparent'
                                      }`}
                                    />
                                  ))}
                                </div>
                                
                                <button
                                  onClick={() => {
                                    const updatedLanguages = cvData.skills?.languages?.filter((_, i) => i !== index) || [];
                                    updateCvData('skills', {
                                      ...cvData.skills,
                                      languages: updatedLanguages
                                    });
                                    saveCVData();
                                  }}
                                  className="text-red-600 hover:text-red-700 px-2 py-1 rounded"
                                >
                                  ✕
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-gray-500">
                          <Globe className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                          <p className="text-lg font-medium mb-2">Henüz dil eklenmedi</p>
                          <p className="text-sm">İngilizce, Almanca, Fransızca gibi konuştuğun dilleri ve seviyelerini ekle</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 7 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Sertifikalar</h3>
                      <button
                        onClick={() => {
                          const newCertificate = {
                            name: '',
                            issuer: '',
                            date: '',
                            credentialId: ''
                          };
                          updateCvData('certificates', [...(cvData.certificates || []), newCertificate]);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        + Sertifika Ekle
                      </button>
                    </div>
                    
                    {cvData.certificates && cvData.certificates.length > 0 ? (
                      <div className="space-y-4">
                        {cvData.certificates.map((certificate, index) => (
                          <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <input
                                type="text"
                                placeholder="Sertifika Adı"
                                value={certificate.name}
                                onChange={(e) => {
                                  const updatedCertificates = [...(cvData.certificates || [])];
                                  updatedCertificates[index] = { ...updatedCertificates[index], name: e.target.value };
                                  updateCvData('certificates', updatedCertificates);
                                  saveCVData();
                                }}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <input
                                type="text"
                                placeholder="Veren Kuruluş"
                                value={certificate.issuer}
                                onChange={(e) => {
                                  const updatedCertificates = [...(cvData.certificates || [])];
                                  updatedCertificates[index] = { ...updatedCertificates[index], issuer: e.target.value };
                                  updateCvData('certificates', updatedCertificates);
                                  saveCVData();
                                }}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <input
                                type="date"
                                placeholder="Alınma Tarihi"
                                value={certificate.date}
                                onChange={(e) => {
                                  const updatedCertificates = [...(cvData.certificates || [])];
                                  updatedCertificates[index] = { ...updatedCertificates[index], date: e.target.value };
                                  updateCvData('certificates', updatedCertificates);
                                  saveCVData();
                                }}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <input
                                type="text"
                                placeholder="Sertifika ID (Opsiyonel)"
                                value={certificate.credentialId}
                                onChange={(e) => {
                                  const updatedCertificates = [...(cvData.certificates || [])];
                                  updatedCertificates[index] = { ...updatedCertificates[index], credentialId: e.target.value };
                                  updateCvData('certificates', updatedCertificates);
                                  saveCVData();
                                }}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div className="flex justify-end">
                              <button
                                onClick={() => {
                                  const updatedCertificates = cvData.certificates?.filter((_, i) => i !== index) || [];
                                  updateCvData('certificates', updatedCertificates);
                                  saveCVData();
                                }}
                                className="text-red-600 hover:text-red-700 text-sm"
                              >
                                Sil
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>Henüz sertifika eklenmedi</p>
                        <p className="text-sm">İlk sertifikanı eklemek için yukarıdaki butona tıkla</p>
                      </div>
                    )}
                  </div>
                )}

                {currentStep === 8 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">Referanslar</h3>
                    
                    <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-lg font-medium text-gray-900 flex items-center">
                          <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                          Referans Kişiler
                        </h4>
                        <button
                          onClick={() => {
                            const newReference = {
                              name: '',
                              position: '',
                              company: '',
                              phone: '',
                              email: ''
                            };
                            updateCvData('references', [...(cvData.references || []), newReference]);
                          }}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors"
                        >
                          + Referans Ekle
                        </button>
                      </div>
                      
                      {cvData.references && cvData.references.length > 0 ? (
                        <div className="space-y-4">
                          {cvData.references.map((reference, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ad Soyad *
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="Mehmet Ali Yılmaz"
                                    value={reference.name || ''}
                                    onChange={(e) => {
                                      const updatedReferences = [...(cvData.references || [])];
                                      updatedReferences[index] = { ...updatedReferences[index], name: e.target.value };
                                      updateCvData('references', updatedReferences);
                                      saveCVData();
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ünvan/Pozisyon
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="Proje Müdürü"
                                    value={reference.position || ''}
                                    onChange={(e) => {
                                      const updatedReferences = [...(cvData.references || [])];
                                      updatedReferences[index] = { ...updatedReferences[index], position: e.target.value };
                                      updateCvData('references', updatedReferences);
                                      saveCVData();
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  />
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Şirket
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="ABC Teknoloji"
                                    value={reference.company || ''}
                                    onChange={(e) => {
                                      const updatedReferences = [...(cvData.references || [])];
                                      updatedReferences[index] = { ...updatedReferences[index], company: e.target.value };
                                      updateCvData('references', updatedReferences);
                                      saveCVData();
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Telefon
                                  </label>
                                  <input
                                    type="tel"
                                    placeholder="+90 555 123 45 67"
                                    value={reference.phone || ''}
                                    onChange={(e) => {
                                      const updatedReferences = [...(cvData.references || [])];
                                      updatedReferences[index] = { ...updatedReferences[index], phone: e.target.value };
                                      updateCvData('references', updatedReferences);
                                      saveCVData();
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    E-posta
                                  </label>
                                  <input
                                    type="email"
                                    placeholder="mehmet@abc.com"
                                    value={reference.email || ''}
                                    onChange={(e) => {
                                      const updatedReferences = [...(cvData.references || [])];
                                      updatedReferences[index] = { ...updatedReferences[index], email: e.target.value };
                                      updateCvData('references', updatedReferences);
                                      saveCVData();
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  />
                                </div>
                              </div>
                              
                              <div className="flex justify-end">
                                <button
                                  onClick={() => {
                                    const updatedReferences = cvData.references?.filter((_, i) => i !== index) || [];
                                    updateCvData('references', updatedReferences);
                                    saveCVData();
                                  }}
                                  className="text-red-600 hover:text-red-700 text-sm px-3 py-1 hover:bg-red-50 rounded transition-colors"
                                >
                                  ✕ Kaldır
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p>Henüz referans eklenmedi</p>
                          <p className="text-sm">İş başvurularında referans olarak verebileceğin kişileri ekle</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 9 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">Sosyal Medya</h3>
                    
                    <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-lg font-medium text-gray-900 flex items-center">
                          <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                          Sosyal Medya Hesapları
                        </h4>
                        <button
                          onClick={() => {
                            const newSocialMedia = {
                              platform: '',
                              url: ''
                            };
                            updateCvData('socialMedia', [...(cvData.socialMedia || []), newSocialMedia]);
                          }}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                        >
                          + Hesap Ekle
                        </button>
                      </div>
                      
                      {cvData.socialMedia && cvData.socialMedia.length > 0 ? (
                        <div className="space-y-4">
                          {cvData.socialMedia.map((social, index) => (
                            <div key={index} className="flex gap-4 items-center bg-gray-50 p-4 rounded-lg">
                              <div className="flex-1">
                                <select
                                  value={social.platform || ''}
                                  onChange={(e) => {
                                    const updatedSocialMedia = [...(cvData.socialMedia || [])];
                                    updatedSocialMedia[index] = { ...updatedSocialMedia[index], platform: e.target.value };
                                    updateCvData('socialMedia', updatedSocialMedia);
                                    saveCVData();
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                  <option value="">Platform Seç</option>
                                  <option value="LinkedIn">LinkedIn</option>
                                  <option value="GitHub">GitHub</option>
                                  <option value="Twitter">Twitter</option>
                                  <option value="Instagram">Instagram</option>
                                  <option value="Website">Kişisel Website</option>
                                  <option value="Behance">Behance</option>
                                  <option value="Dribbble">Dribbble</option>
                                  <option value="YouTube">YouTube</option>
                                </select>
                              </div>
                              
                              <div className="flex-2">
                                <input
                                  type="url"
                                  placeholder="https://linkedin.com/in/username"
                                  value={social.url || ''}
                                  onChange={(e) => {
                                    const updatedSocialMedia = [...(cvData.socialMedia || [])];
                                    updatedSocialMedia[index] = { ...updatedSocialMedia[index], url: e.target.value };
                                    updateCvData('socialMedia', updatedSocialMedia);
                                    saveCVData();
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                              </div>
                              
                              <button
                                onClick={() => {
                                  const updatedSocialMedia = cvData.socialMedia?.filter((_, i) => i !== index) || [];
                                  updateCvData('socialMedia', updatedSocialMedia);
                                  saveCVData();
                                }}
                                className="text-red-600 hover:text-red-700 px-2 py-1 rounded"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-gray-500">
                          <Share2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                          <p className="text-lg font-medium mb-2">Henüz sosyal medya hesabı eklenmedi</p>
                          <p className="text-sm">LinkedIn, GitHub, kişisel website gibi hesaplarını ekle</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 10 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">Ekstra Bilgiler</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hobiler & İlgi Alanları
                        </label>
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Örn: Kitap okumak"
                              value={hobbyInput}
                              onChange={(e) => setHobbyInput(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter' && hobbyInput.trim()) {
                                  const currentHobbies = Array.isArray(cvData.extras?.hobbies) ? cvData.extras.hobbies : [];
                                  updateCvData('extras', {
                                    ...cvData.extras,
                                    hobbies: [...currentHobbies, hobbyInput.trim()]
                                  });
                                  setHobbyInput('');
                                  saveCVData();
                                }
                              }}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (hobbyInput.trim()) {
                                  const currentHobbies = Array.isArray(cvData.extras?.hobbies) ? cvData.extras.hobbies : [];
                                  updateCvData('extras', {
                                    ...cvData.extras,
                                    hobbies: [...currentHobbies, hobbyInput.trim()]
                                  });
                                  setHobbyInput('');
                                  saveCVData();
                                }
                              }}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Ekle
                            </button>
                          </div>
                          
                          {cvData.extras?.hobbies && Array.isArray(cvData.extras.hobbies) && cvData.extras.hobbies.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {cvData.extras.hobbies.map((hobby, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                >
                                  {hobby}
                                  <button
                                    onClick={() => {
                                      const updatedHobbies = cvData.extras?.hobbies?.filter((_, i) => i !== index) || [];
                                      updateCvData('extras', {
                                        ...cvData.extras,
                                        hobbies: updatedHobbies
                                      });
                                      saveCVData();
                                    }}
                                    className="text-blue-600 hover:text-blue-800"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ek Bilgiler
                        </label>
                        <textarea
                          placeholder="Diğer önemli bilgiler..."
                          value={cvData.extras?.additional || ''}
                          onChange={(e) => {
                            updateCvData('extras', {
                              ...cvData.extras,
                              additional: e.target.value
                            });
                            saveCVData();
                          }}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 11 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">CV Önizleme ve İndirme</h3>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => saveCVData()}
                          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Kaydet
                        </button>
                        <button 
                          onClick={handlePDFDownload}
                          disabled={isPDFGenerating}
                          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isPDFGenerating ? (
                            <>
                              <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              İndiriliyor...
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4 mr-2" />
                              PDF İndir
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    
                    {/* CV Özet Bilgileri */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-4">CV Özeti</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Ad Soyad:</span>
                          <span className="ml-2 text-gray-600">
                            {cvData.personalInfo?.fullName || 'Belirtilmemiş'}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">E-posta:</span>
                          <span className="ml-2 text-gray-600">
                            {cvData.personalInfo?.emails?.[0] || 'Belirtilmemiş'}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Telefon:</span>
                          <span className="ml-2 text-gray-600">
                            {cvData.personalInfo?.phones?.[0] || 'Belirtilmemiş'}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Şehir:</span>
                          <span className="ml-2 text-gray-600">
                            {cvData.personalInfo?.address?.split(',')[0] || 'Belirtilmemiş'}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Eğitim:</span>
                          <span className="ml-2 text-gray-600">
                            {cvData.education?.[0]?.degree || 'Belirtilmemiş'}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Deneyim:</span>
                          <span className="ml-2 text-gray-600">
                            {cvData.experience?.length || 0} pozisyon
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Yetenekler:</span>
                          <span className="ml-2 text-gray-600">
                            {(cvData.skills?.technical?.length || 0) + (cvData.skills?.personal?.length || 0)} beceri
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Diller:</span>
                          <span className="ml-2 text-gray-600">
                            {cvData.skills?.languages?.length || 0} dil
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Sertifikalar:</span>
                          <span className="ml-2 text-gray-600">
                            {cvData.certificates?.length || 0} sertifika
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Referanslar:</span>
                          <span className="ml-2 text-gray-600">
                            {cvData.references?.length || 0} referans
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Sosyal Medya:</span>
                          <span className="ml-2 text-gray-600">
                            {cvData.socialMedia?.length || 0} hesap
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Tamamlanma Durumu */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Tamamlanma Durumu</h4>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          {cvData.personalInfo?.fullName ? (
                            <Check className="w-5 h-5 text-green-500 mr-3" />
                          ) : (
                            <div className="w-5 h-5 border-2 border-gray-300 rounded mr-3" />
                          )}
                          <span className={cvData.personalInfo?.fullName ? 'text-gray-900' : 'text-gray-500'}>
                            Kişisel Bilgiler
                          </span>
                        </div>
                        <div className="flex items-center">
                          {cvData.education && cvData.education.length > 0 ? (
                            <Check className="w-5 h-5 text-green-500 mr-3" />
                          ) : (
                            <div className="w-5 h-5 border-2 border-gray-300 rounded mr-3" />
                          )}
                          <span className={cvData.education && cvData.education.length > 0 ? 'text-gray-900' : 'text-gray-500'}>
                            Eğitim Bilgileri
                          </span>
                        </div>
                        <div className="flex items-center">
                          {cvData.experience && cvData.experience.length > 0 ? (
                            <Check className="w-5 h-5 text-green-500 mr-3" />
                          ) : (
                            <div className="w-5 h-5 border-2 border-gray-300 rounded mr-3" />
                          )}
                          <span className={cvData.experience && cvData.experience.length > 0 ? 'text-gray-900' : 'text-gray-500'}>
                            İş Deneyimi
                          </span>
                        </div>
                        <div className="flex items-center">
                          {cvData.skills && (cvData.skills.technical?.length > 0 || cvData.skills.personal?.length > 0) ? (
                            <Check className="w-5 h-5 text-green-500 mr-3" />
                          ) : (
                            <div className="w-5 h-5 border-2 border-gray-300 rounded mr-3" />
                          )}
                          <span className={cvData.skills && (cvData.skills.technical?.length > 0 || cvData.skills.personal?.length > 0) ? 'text-gray-900' : 'text-gray-500'}>
                            Yetenekler
                          </span>
                        </div>
                        <div className="flex items-center">
                          {cvData.skills?.languages && cvData.skills.languages.length > 0 ? (
                            <Check className="w-5 h-5 text-green-500 mr-3" />
                          ) : (
                            <div className="w-5 h-5 border-2 border-gray-300 rounded mr-3" />
                          )}
                          <span className={cvData.skills?.languages && cvData.skills.languages.length > 0 ? 'text-gray-900' : 'text-gray-500'}>
                            Dil Becerileri
                          </span>
                        </div>
                        <div className="flex items-center">
                          {cvData.certificates && cvData.certificates.length > 0 ? (
                            <Check className="w-5 h-5 text-green-500 mr-3" />
                          ) : (
                            <div className="w-5 h-5 border-2 border-gray-300 rounded mr-3" />
                          )}
                          <span className={cvData.certificates && cvData.certificates.length > 0 ? 'text-gray-900' : 'text-gray-500'}>
                            Sertifikalar
                          </span>
                        </div>
                        <div className="flex items-center">
                          {cvData.references && cvData.references.length > 0 ? (
                            <Check className="w-5 h-5 text-green-500 mr-3" />
                          ) : (
                            <div className="w-5 h-5 border-2 border-gray-300 rounded mr-3" />
                          )}
                          <span className={cvData.references && cvData.references.length > 0 ? 'text-gray-900' : 'text-gray-500'}>
                            Referanslar
                          </span>
                        </div>
                        <div className="flex items-center">
                          {cvData.socialMedia && cvData.socialMedia.length > 0 ? (
                            <Check className="w-5 h-5 text-green-500 mr-3" />
                          ) : (
                            <div className="w-5 h-5 border-2 border-gray-300 rounded mr-3" />
                          )}
                          <span className={cvData.socialMedia && cvData.socialMedia.length > 0 ? 'text-gray-900' : 'text-gray-500'}>
                            Sosyal Medya
                          </span>
                        </div>
                        <div className="flex items-center">
                          {cvData.extras && (cvData.extras.hobbies || cvData.extras.additional) ? (
                            <Check className="w-5 h-5 text-green-500 mr-3" />
                          ) : (
                            <div className="w-5 h-5 border-2 border-gray-300 rounded mr-3" />
                          )}
                          <span className={cvData.extras && (cvData.extras.hobbies || cvData.extras.additional) ? 'text-gray-900' : 'text-gray-500'}>
                            Ek Bilgiler
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* İpuçları */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">💡 İpuçları</h4>
                      <ul className="text-blue-800 text-sm space-y-1">
                        <li>• CV'nizi kaydetmeyi unutmayın</li>
                        <li>• Eksik bölümleri önceki adımlardan tamamlayabilirsiniz</li>
                        <li>• PDF indirmek için CV'nizi önce kaydedin</li>
                        <li>• Yetenekler bölümünde her yeteneği ayrı ayrı ekleyin</li>
                        <li>• "Tamamla" butonuna basarak CV'nizi veritabanına kaydedin</li>
                        <li>• Kaydedilen CV'ler daha sonra düzenlenebilir</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="p-6 border-t border-gray-200 flex justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    currentStep === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Önceki
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentStep === steps.length ? isCompleting : false}
                  className={`flex items-center px-6 py-2 rounded-lg transition-colors ${
                    currentStep === steps.length
                      ? isCompleting 
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {currentStep === steps.length ? (
                    isCompleting ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Kaydediliyor...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        {isEditingExisting ? 'Güncelle' : 'Tamamla'}
                      </>
                    )
                  ) : (
                    <>
                      Sonraki
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* PDF Preview Panel - Sağ taraf - CANLI ÖNİZLEME */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md sticky top-24">
              <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Eye className="w-5 h-5 mr-2 text-blue-600" />
                    Canlı PDF Önizleme
                  </h3>
                  <div className="flex space-x-2">
                    <button 
                      onClick={handleFullScreenPreview}
                      disabled={isPDFGenerating}
                      className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPDFGenerating ? 'Hazırlanıyor...' : 'Tam Ekran'}
                    </button>
                    <button 
                      onClick={handlePDFDownload}
                      disabled={isPDFGenerating}
                      className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPDFGenerating ? 'İndiriliyor...' : 'PDF İndir'}
                    </button>
                  </div>
                </div>
                
                {/* Profil Fotoğrafı Kontrolü */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cvData.showProfilePhoto || false}
                      onChange={(e) => {
                        updateCvData('showProfilePhoto', e.target.checked);
                        saveCVData();
                      }}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-xs font-medium text-gray-700">
                      📷 Profil fotoğrafını göster
                    </span>
                    {cvData.personalInfo?.profilePhoto && (
                      <img 
                        src={cvData.personalInfo.profilePhoto} 
                        alt="Profil" 
                        className="w-5 h-5 rounded-full object-cover border border-gray-300"
                      />
                    )}
                  </label>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto bg-gray-100 p-2">
                {/* Yeni CV Template - Tam ekrana sığdırılmış */}
                <div 
                  ref={cvRef}
                  className="mx-auto bg-white shadow-lg"
                  style={{ 
                    width: '100%', 
                    maxWidth: '100%',
                    transform: 'scale(0.75)',
                    transformOrigin: 'top center',
                    marginBottom: '-25%' // Scale nedeniyle oluşan boşluğu kapatmak için
                  }}
                >
                  <CVTemplate 
                    data={convertToNewFormat(cvData)}
                    template={selectedTemplate}
                    isPreview={true}
                    enableEditing={true}
                    onFieldUpdate={handleFieldUpdate}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ManualCVPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Yükleniyor...</span>
        </div>
      </div>
    }>
      <ManualCVContent />
    </Suspense>
  );
}
