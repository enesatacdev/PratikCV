// ImageKit service for PratikCV
// Gerçek ImageKit API implementasyonu

// ImageKit konfigürasyonu
const IMAGEKIT_CONFIG = {
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
};

// ImageKit authentication endpoint
const getAuthParams = async () => {
  try {
    const response = await fetch('/api/imagekit-auth');
    if (!response.ok) {
      throw new Error('ImageKit auth failed');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// ImageKit service
export const imageKitService = {
  // Fotoğraf yükleme (gerçek ImageKit API kullanarak)
  uploadPhoto: async (file: File, fileName?: string): Promise<string> => {
    try {
      // Dosya boyutu kontrolü (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Dosya boyutu 5MB\'dan büyük olamaz');
      }

      // Dosya tipi kontrolü
      if (!file.type.startsWith('image/')) {
        throw new Error('Lütfen sadece resim dosyası seçin');
      }

      // ImageKit auth parametrelerini al
      const authParams = await getAuthParams();
      
      // FormData oluştur
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', fileName || `photo_${Date.now()}_${file.name}`);
      formData.append('folder', '/profile-photos');
      formData.append('publicKey', IMAGEKIT_CONFIG.publicKey);
      formData.append('signature', authParams.signature);
      formData.append('expire', authParams.expire);
      formData.append('token', authParams.token);

      // ImageKit'e upload et
      const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const result = await response.json();
      return result.url;
    } catch (error) {
      throw error;
    }
  },

  // CV dosyası yükleme (PDF, JPG, PNG destekli) - Gerçek ImageKit API
  uploadCV: async (file: File, fileName?: string): Promise<string> => {
    try {
      // Dosya boyutu kontrolü (max 10MB CV için)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('CV dosyası boyutu 10MB\'dan büyük olamaz');
      }

      // Dosya tipi kontrolü
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Lütfen PDF, JPG veya PNG formatında dosya yükleyin');
      }

      // ImageKit auth parametrelerini al
      const authParams = await getAuthParams();
      
      // FormData oluştur
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', fileName || `cv_${Date.now()}_${file.name}`);
      formData.append('folder', '/cv-uploads');
      formData.append('publicKey', IMAGEKIT_CONFIG.publicKey);
      formData.append('signature', authParams.signature);
      formData.append('expire', authParams.expire);
      formData.append('token', authParams.token);

      // ImageKit'e upload et
      const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'CV upload failed');
      }

      const result = await response.json();
      
      return result.url;
    } catch (error) {
      throw error;
    }
  },

  // Fotoğraf silme
  deletePhoto: async (fileId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/delete-photo/${fileId}`, {
        method: 'DELETE'
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  },

  // URL oluşturma ve optimize etme
  generateUrl: (filePath: string, transformations?: { width?: number; height?: number; quality?: number }): string => {
    try {
      // Eğer zaten tam URL ise direkt döndür
      if (filePath.startsWith('data:') || filePath.startsWith('http')) {
        return filePath;
      }
      
      // Environment'dan ImageKit URL'ini al
      const baseUrl = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
      if (!baseUrl) {
        return filePath;
      }

      // Transformasyon parametrelerini ekle
      let url = `${baseUrl}/${filePath}`;
      if (transformations && Object.keys(transformations).length > 0) {
        const params = new URLSearchParams();
        if (transformations.width) params.append('tr', `w-${transformations.width}`);
        if (transformations.height) params.append('tr', `h-${transformations.height}`);
        if (transformations.quality) params.append('tr', `q-${Math.round(transformations.quality * 100)}`);
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
      }
      
      return url;
    } catch (error) {
      return filePath;
    }
  },

  // Fotoğraf optimize etme (client-side için canvas kullanarak)
  optimizePhoto: async (file: File, maxWidth = 800, maxHeight = 800, quality = 0.9): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Orijinal boyutlar
        const { width, height } = img;
        
        // Yeni boyutları hesapla (aspect ratio'yu koru)
        let newWidth = width;
        let newHeight = height;

        if (width > height) {
          if (width > maxWidth) {
            newWidth = maxWidth;
            newHeight = (height * maxWidth) / width;
          }
        } else {
          if (height > maxHeight) {
            newHeight = maxHeight;
            newWidth = (width * maxHeight) / height;
          }
        }

        // Canvas'ı ayarla
        canvas.width = newWidth;
        canvas.height = newHeight;

        // Resmi çiz
        ctx?.drawImage(img, 0, 0, newWidth, newHeight);

        // Base64 olarak döndür
        const optimizedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(optimizedDataUrl);
      };

      img.onerror = () => reject(new Error('Resim yüklenemedi'));
      
      // File'ı Image'e yükle
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Dosya okuma hatası'));
      reader.readAsDataURL(file);
    });
  },

  // Profil fotoğrafı için özel optimize fonksiyonu
  optimizeProfilePhoto: async (file: File): Promise<string> => {
    try {
      // Profil fotoğrafları için 600x600 px, %90 kalite - CV'de daha net görünsün
      return await imageKitService.optimizePhoto(file, 600, 600, 0.9);
    } catch (error) {
      // Hata durumunda normal upload dene
      return await imageKitService.uploadPhoto(file);
    }
  },

  // CV fotoğrafı için özel optimize fonksiyonu (daha büyük boyut)
  optimizeCVPhoto: async (file: File): Promise<string> => {
    try {
      // CV'de kullanım için 800x800 px, %95 kalite - yazdırma kalitesi
      return await imageKitService.optimizePhoto(file, 800, 800, 0.95);
    } catch (error) {
      // Hata durumunda profil fotoğrafı optimizasyonunu dene
      return await imageKitService.optimizeProfilePhoto(file);
    }
  },

  // Profil fotoğrafı yükleme wrapper fonksiyonu (ProfilePhotoUpload component için)
  uploadProfilePhoto: async (file: File, userId?: string): Promise<{ url: string; fileId: string }> => {
    try {
      // CV için optimize edilmiş fotoğraf kullan
      const optimizedUrl = await imageKitService.optimizeCVPhoto(file);
      
      // File ID oluştur
      const fileId = `profile_${userId || 'user'}_${Date.now()}`;
      
      return {
        url: optimizedUrl,
        fileId: fileId
      };
    } catch (error) {
      throw new Error('Profil fotoğrafı yüklenirken bir hata oluştu');
    }
  }
};

export default imageKitService;
