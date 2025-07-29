'use client';

import { useState } from 'react';
import { Upload, X, Camera } from 'lucide-react';
import { imageKitService } from '../../lib/imagekit';
import { useAuth } from '@/lib/auth-context';
import toast from 'react-hot-toast';

interface ProfilePhotoUploadProps {
  currentPhotoUrl: string;
  onPhotoChange: (url: string) => void;
  userId: string;
  updateAuthProfile?: boolean;
  authPhotoUrl?: string;
}

export default function ProfilePhotoUpload({ 
  currentPhotoUrl, 
  onPhotoChange, 
  userId,
  updateAuthProfile = false,
  authPhotoUrl
}: ProfilePhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { updateUserAvatar } = useAuth();

  // Öncelik: 1. Yüklenmiş fotoğraf, 2. Clerk fotoğrafı, 3. Varsayılan
  const displayPhotoUrl = currentPhotoUrl || authPhotoUrl || '/placeholder-avatar.png';

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Dosya tipini kontrol et
    if (!file.type.startsWith('image/')) {
      toast.error('❌ Lütfen sadece resim dosyası seçin.');
      return;
    }

    // Dosya boyutunu kontrol et (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('❌ Dosya boyutu 5MB\'dan küçük olmalıdır.');
      return;
    }

    setUploading(true);

    try {
      // ImageKit'e yükle
      const uploadResult = await imageKitService.uploadProfilePhoto(file, userId);
      const uploadedUrl = uploadResult.url;
      
      // Form state'ini güncelle
      onPhotoChange(uploadedUrl);

      // Auth context'i güncelle - navbar'a fotoğraf gelsin diye
      updateUserAvatar(uploadedUrl);

      toast.success('📸 Profil fotoğrafı başarıyla yüklendi ve navbar güncellendi!');

    } catch (error) {
      toast.error('❌ Dosya yüklenirken bir hata oluştu.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const removePhoto = () => {
    onPhotoChange('');
    
    // Auth context'ten de fotoğrafı kaldır - navbar'dan da gitsin
    updateUserAvatar('');
    
    toast.success('🗑️ Profil fotoğrafı kaldırıldı!');
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Profil Fotoğrafı
      </label>

      <div className="flex items-center space-x-6">
        {/* Mevcut Fotoğraf */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
            {displayPhotoUrl && displayPhotoUrl !== '/placeholder-avatar.png' ? (
              <img
                src={displayPhotoUrl}
                alt="Profil fotoğrafı"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Camera className="w-8 h-8" />
              </div>
            )}
          </div>
          
          {currentPhotoUrl && (
            <button
              onClick={removePhoto}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              title="Fotoğrafı kaldır"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Upload Alanı */}
        <div className="flex-1">
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            } ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => {
              if (!uploading) {
                document.getElementById('photo-upload')?.click();
              }
            }}
          >
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />

            <Upload className={`mx-auto h-12 w-12 ${uploading ? 'text-gray-300' : 'text-gray-400'}`} />
            
            <div className="mt-4">
              <p className={`text-sm ${uploading ? 'text-gray-400' : 'text-gray-600'}`}>
                {uploading ? 'Yükleniyor...' : 'Fotoğraf yüklemek için tıklayın veya sürükleyin'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, GIF - Maksimum 5MB
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bilgi Notu */}
      {authPhotoUrl && !currentPhotoUrl && (
        <p className="text-xs text-gray-500">
          * Şu anda auth hesabınızdaki fotoğraf gösteriliyor
        </p>
      )}
    </div>
  );
}
