import { Plus } from "lucide-react";

interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements: string;
}

interface ExperienceFormProps {
  formData: Experience[];
  addArrayItem: (defaultValue: Experience) => void;
  removeArrayItem: (index: number) => void;
  updateArrayItem: (index: number, value: Experience) => void;
}

export default function ExperienceForm({
  formData,
  addArrayItem,
  removeArrayItem,
  updateArrayItem,
}: ExperienceFormProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-600">İş deneyimlerinizi ekleyin</p>
        <button
          type="button"
          onClick={() => addArrayItem({
            company: '',
            position: '',
            startDate: '',
            endDate: '',
            description: '',
            achievements: ''
          })}
          className="text-yellow-600 hover:text-amber-700 text-sm font-medium flex items-center gap-1"
        >
          <Plus className="w-4 h-4" /> Deneyim Ekle
        </button>
      </div>

      {formData.length === 0 && (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
          Henüz iş deneyimi eklenmemiş. Yukarıdaki butona tıklayarak ekleyebilirsiniz.
        </div>
      )}

      {formData.map((exp, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-6 space-y-4">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-gray-800">Deneyim {index + 1}</h4>
            <button
              type="button"
              onClick={() => removeArrayItem(index)}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Firma Adı</label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => updateArrayItem(index, { ...exp, company: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Şirket adı"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pozisyon / Ünvan</label>
              <input
                type="text"
                value={exp.position}
                onChange={(e) => updateArrayItem(index, { ...exp, position: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="İş unvanınız"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Başlangıç Tarihi</label>
              <input
                type="date"
                value={exp.startDate}
                onChange={(e) => updateArrayItem(index, { ...exp, startDate: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bitiş Tarihi</label>
              <input
                type="date"
                value={exp.endDate}
                onChange={(e) => updateArrayItem(index, { ...exp, endDate: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Halen çalışıyorsanız boş bırakın"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">İş Tanımı / Sorumluluklar</label>
            <textarea
              value={exp.description}
              onChange={(e) => updateArrayItem(index, { ...exp, description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              rows={3}
              placeholder="Bu pozisyondaki görev ve sorumluluklarınızı açıklayın..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Başarılar / Projeler (Opsiyonel)</label>
            <textarea
              value={exp.achievements}
              onChange={(e) => updateArrayItem(index, { ...exp, achievements: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              rows={2}
              placeholder="Önemli başarılarınız, projelere katkılarınız..."
            />
          </div>
        </div>
      ))}
    </div>
  );
}
