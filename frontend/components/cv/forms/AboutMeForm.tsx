'use client';

import React from 'react';
import { User, FileText, Info } from 'lucide-react';

interface AboutMeFormProps {
  aboutMe: string;
  onChange: (aboutMe: string) => void;
}

const AboutMeForm: React.FC<AboutMeFormProps> = ({ aboutMe, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
          <FileText className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Hakkımızda</h2>
        <p className="text-gray-600">
          Kendinizden bahsedin. Bu alan CV'nizde ayrı bir bölüm olarak görünecektir.
        </p>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
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
          <label htmlFor="aboutMe" className="block text-sm font-medium text-gray-700 mb-2">
            Hakkımızda Metni
          </label>
          <textarea
            id="aboutMe"
            value={aboutMe}
            onChange={(e) => onChange(e.target.value)}
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Kendinizi tanıtın... Örnek: 'Yaratıcı düşünce yapısı ve analitik problem çözme yetenekleri ile yazılım geliştirme alanında...'"
          />
          <div className="mt-2 flex justify-between text-sm text-gray-500">
            <span>Bu alan opsiyoneldir ve boş bırakılabilir</span>
            <span>{aboutMe.length} karakter</span>
          </div>
        </div>
      </div>

      {/* Preview */}
      {aboutMe.trim() && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Önizleme</h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <User className="w-4 h-4 text-gray-600" />
              <h4 className="font-medium text-gray-900">Hakkımızda</h4>
            </div>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {aboutMe}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutMeForm;
