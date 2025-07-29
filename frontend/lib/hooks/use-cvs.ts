import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

interface CV {
  id: string;
  title: string;
  templateName: string;
  templateId?: string; // Orijinal template ID'si (premium, modern, classic)
  template?: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'completed';
  previewUrl?: string;
  downloadUrl?: string;
  personalInfo?: {
    fullName?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
  experience?: any[];
  education?: any[];
  skills?: {
    technical?: string[];
    personal?: string[];
    languages?: string[];
  };
  certificates?: any[];
  socialMedia?: any[];
}

export function useCVs() {
  const { user } = useAuth();
  const [cvs, setCvs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCVs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user?.id) {
        throw new Error('Kullanıcı giriş yapmamış');
      }
      
      // Use the new backend endpoint for getting user's CV list
      const response = await api.get(`/cv/user/${user.id}/list`);
      setCvs(response.data || []);
    } catch (err: any) {
      setError(err.message || 'CV\'ler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const deleteCV = async (id: string) => {
    try {
      // Use the new CV ID endpoint for deletion
      const response = await api.delete(`/cv/${id}`);
      
      // Silme başarılı oldu, liste'den çıkar
      setCvs(prev => prev.filter(cv => cv.id !== id));
      setError(null); // Başarılı olduğunda error'u temizle
      return true;
    } catch (err: any) {
      setError(err.message || 'CV silinirken hata oluştu');
      return false;
    }
  };

  const duplicateCV = async (id: string) => {
    try {
      const response = await api.post(`/cv/${id}/duplicate`);
      await fetchCVs(); // Refresh the list
      return response.data;
    } catch (err: any) {
      // Backend doesn't support duplication yet
      setError('CV kopyalama özelliği henüz desteklenmiyor');
      return null;
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchCVs();
    }
  }, [user?.id]);

  return {
    cvs,
    loading,
    error,
    refetch: fetchCVs,
    deleteCV,
    duplicateCV
  };
}
