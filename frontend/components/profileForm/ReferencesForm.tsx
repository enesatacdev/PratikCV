import { Plus } from "lucide-react";

interface Reference {
  name: string;
  position: string;
  company: string;
  phone: string;
  email: string;
  relationship: string;
}

interface ReferencesFormProps {
  formData: Reference[];
  addArrayItem: (field: string, defaultValue: any) => void;
  removeArrayItem: (field: string, index: number) => void;
  updateArrayItem: (field: string, index: number, value: any) => void;
}

export default function ReferencesForm({
  formData,
  addArrayItem,
  removeArrayItem,
  updateArrayItem,
}: ReferencesFormProps) {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">Referanslar</label>
          <button
            type="button"
            onClick={() => addArrayItem('references', { 
              name: '', 
              position: '', 
              company: '', 
              phone: '', 
              email: '', 
              relationship: '' 
            })}
            className="text-yellow-600 hover:text-amber-700 text-sm font-medium flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Referans Ekle
          </button>
        </div>
        <div className="space-y-6">
          {formData.map((ref, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    value={ref.name}
                    onChange={(e) => updateArrayItem('references', index, { ...ref, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Örn: Ahmet Yılmaz"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pozisyon
                  </label>
                  <input
                    type="text"
                    value={ref.position}
                    onChange={(e) => updateArrayItem('references', index, { ...ref, position: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Örn: Proje Yöneticisi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Şirket
                  </label>
                  <input
                    type="text"
                    value={ref.company}
                    onChange={(e) => updateArrayItem('references', index, { ...ref, company: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Örn: ABC Teknoloji"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İlişki
                  </label>
                  <select
                    value={ref.relationship}
                    onChange={(e) => updateArrayItem('references', index, { ...ref, relationship: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="">İlişki Türü</option>
                    <option value="Önceki Yönetici">Önceki Yönetici</option>
                    <option value="Meslektaş">Meslektaş</option>
                    <option value="Müşteri">Müşteri</option>
                    <option value="Akademik Referans">Akademik Referans</option>
                    <option value="Proje Ortağı">Proje Ortağı</option>
                    <option value="Diğer">Diğer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={ref.phone}
                    onChange={(e) => updateArrayItem('references', index, { ...ref, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="+90 555 123 45 67"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta
                  </label>
                  <input
                    type="email"
                    value={ref.email}
                    onChange={(e) => updateArrayItem('references', index, { ...ref, email: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="ahmet@example.com"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => removeArrayItem('references', index)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Referansı Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
