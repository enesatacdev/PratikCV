import { Plus } from "lucide-react";

interface Skills {
  technical: string[];
  personal: string[];
  languages: Array<{ language: string; level: string }>;
}

interface SkillsFormProps {
  formData: Skills;
  addArrayItem: (field: string, defaultValue: any) => void;
  removeArrayItem: (field: string, index: number) => void;
  updateArrayItem: (field: string, index: number, value: any) => void;
}

export default function SkillsForm({
  formData,
  addArrayItem,
  removeArrayItem,
  updateArrayItem,
}: SkillsFormProps) {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">Teknik Yetenekler</label>
          <button
            type="button"
            onClick={() => addArrayItem('technical', '')}
            className="text-yellow-600 hover:text-amber-700 text-sm font-medium flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Yetenek Ekle
          </button>
        </div>
        <div className="space-y-2">
          {formData.technical.map((skill, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={skill}
                onChange={(e) => updateArrayItem('technical', index, e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Örn: Python, React, Photoshop..."
              />
              {formData.technical.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('technical', index)}
                  className="text-red-500 hover:text-red-700 px-2"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">Kişisel Yetenekler</label>
          <button
            type="button"
            onClick={() => addArrayItem('personal', '')}
            className="text-yellow-600 hover:text-amber-700 text-sm font-medium flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Yetenek Ekle
          </button>
        </div>
        <div className="space-y-2">
          {formData.personal.map((skill, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={skill}
                onChange={(e) => updateArrayItem('personal', index, e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Örn: Takım çalışması, Liderlik, İletişim..."
              />
              {formData.personal.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('personal', index)}
                  className="text-red-500 hover:text-red-700 px-2"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">Diller</label>
          <button
            type="button"
            onClick={() => addArrayItem('languages', { language: '', level: '' })}
            className="text-yellow-600 hover:text-amber-700 text-sm font-medium flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Dil Ekle
          </button>
        </div>
        <div className="space-y-3">
          {formData.languages.map((lang, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={lang.language}
                onChange={(e) => updateArrayItem('languages', index, { ...lang, language: e.target.value })}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Dil adı (Örn: İngilizce)"
              />
              <select
                value={lang.level}
                onChange={(e) => updateArrayItem('languages', index, { ...lang, level: e.target.value })}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="">Seviye</option>
                <option value="A1">A1 - Başlangıç</option>
                <option value="A2">A2 - Temel</option>
                <option value="B1">B1 - Orta</option>
                <option value="B2">B2 - Orta Üstü</option>
                <option value="C1">C1 - İleri</option>
                <option value="C2">C2 - Uzman</option>
                <option value="Ana Dil">Ana Dil</option>
              </select>
              <button
                type="button"
                onClick={() => removeArrayItem('languages', index)}
                className="text-red-500 hover:text-red-700 px-2"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
