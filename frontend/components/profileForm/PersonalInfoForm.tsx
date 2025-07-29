import { Plus } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import ProfilePhotoUpload from "@/components/ui/ProfilePhotoUpload";

interface PersonalInfo {
  firstName: string;
  lastName: string;
  phones: string[];
  emails: string[];
  address: string;
  profilePhoto: string;
  birthDate: string;
}

interface PersonalInfoFormProps {
  formData: PersonalInfo;
  updateFormData: (data: PersonalInfo) => void;
  addArrayItem: (field: string, defaultValue: any) => void;
  removeArrayItem: (field: string, index: number) => void;
  updateArrayItem: (field: string, index: number, value: any) => void;
}

export default function PersonalInfoForm({
  formData,
  updateFormData,
  addArrayItem,
  removeArrayItem,
  updateArrayItem,
}: PersonalInfoFormProps) {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Profil Fotoğrafı */}
      <ProfilePhotoUpload
        currentPhotoUrl={formData.profilePhoto}
        onPhotoChange={(url) => updateFormData({ ...formData, profilePhoto: url })}
        userId={user?.id || ''}
        authPhotoUrl={user?.avatar} // Auth'dan gelen fotoğraf
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ad</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => updateFormData({ ...formData, firstName: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="Adınız"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Soyad</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => updateFormData({ ...formData, lastName: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="Soyadınız"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Doğum Tarihi</label>
        <input
          type="date"
          value={formData.birthDate}
          onChange={(e) => updateFormData({ ...formData, birthDate: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
        />
      </div>

      {/* Telefon Numaraları */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Telefon Numaraları</label>
        <div className="space-y-2">
          {formData.phones.map((phone, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="tel"
                value={phone}
                onChange={(e) => updateArrayItem('phones', index, e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Telefon numarası"
              />
              {formData.phones.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('phones', index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Sil
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('phones', '')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Telefon Ekle
          </button>
        </div>
      </div>

      {/* Email Adresleri */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email Adresleri</label>
        <div className="space-y-2">
          {formData.emails.map((email, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => updateArrayItem('emails', index, e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Email adresi"
              />
              {formData.emails.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('emails', index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Sil
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('emails', '')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Email Ekle
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Adres</label>
        <textarea
          value={formData.address}
          onChange={(e) => updateFormData({ ...formData, address: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          rows={3}
          placeholder="Tam adresiniz"
        />
      </div>
    </div>
  );
}
