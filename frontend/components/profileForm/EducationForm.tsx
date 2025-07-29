import { Plus } from "lucide-react";

interface Education {
  school: string;
  department: string;
  startDate: string;
  endDate: string;
  degree: string;
  gpa: string;
}

interface EducationFormProps {
  formData: Education[];
  addArrayItem: (defaultValue: Education) => void;
  removeArrayItem: (index: number) => void;
  updateArrayItem: (index: number, value: Education) => void;
}

export default function EducationForm({
  formData,
  addArrayItem,
  removeArrayItem,
  updateArrayItem,
}: EducationFormProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-600">Eğitim bilgilerinizi ekleyin</p>
        <button
          type="button"
          onClick={() => addArrayItem({
            school: '',
            department: '',
            startDate: '',
            endDate: '',
            degree: '',
            gpa: ''
          })}
          className="text-yellow-600 hover:text-amber-700 text-sm font-medium flex items-center gap-1"
        >
          <Plus className="w-4 h-4" /> Eğitim Ekle
        </button>
      </div>

      {formData.length === 0 && (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
          Henüz eğitim bilgisi eklenmemiş. Yukarıdaki butona tıklayarak ekleyebilirsiniz.
        </div>
      )}

      {formData.map((edu, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-6 space-y-4">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-gray-800">Eğitim {index + 1}</h4>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Okul Adı</label>
              <input
                type="text"
                value={edu.school}
                onChange={(e) => updateArrayItem(index, { ...edu, school: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Okul adı"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bölüm / Program</label>
              <input
                type="text"
                value={edu.department}
                onChange={(e) => updateArrayItem(index, { ...edu, department: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Bölüm adı"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Başlangıç Tarihi</label>
              <input
                type="date"
                value={edu.startDate}
                onChange={(e) => updateArrayItem(index, { ...edu, startDate: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bitiş Tarihi</label>
              <input
                type="date"
                value={edu.endDate}
                onChange={(e) => updateArrayItem(index, { ...edu, endDate: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Diploma / Derece</label>
              <select
                value={edu.degree}
                onChange={(e) => updateArrayItem(index, { ...edu, degree: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="">Seçiniz</option>
                <option value="Lise">Lise</option>
                <option value="Ön Lisans">Ön Lisans</option>
                <option value="Lisans">Lisans</option>
                <option value="Yüksek Lisans">Yüksek Lisans</option>
                <option value="Doktora">Doktora</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Not Ortalaması (Opsiyonel)</label>
              <input
                type="text"
                value={edu.gpa}
                onChange={(e) => updateArrayItem(index, { ...edu, gpa: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Örn: 3.2 / 4.0"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
