import { Plus } from "lucide-react";

interface SocialMedia {
  platform: string;
  url: string;
}

interface SocialMediaFormProps {
  formData: SocialMedia[];
  addArrayItem: (field: string, defaultValue: any) => void;
  removeArrayItem: (field: string, index: number) => void;
  updateArrayItem: (field: string, index: number, value: any) => void;
}

export default function SocialMediaForm({
  formData,
  addArrayItem,
  removeArrayItem,
  updateArrayItem,
}: SocialMediaFormProps) {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">Sosyal Medya Hesapları</label>
          <button
            type="button"
            onClick={() => addArrayItem('socialMedia', { platform: '', url: '' })}
            className="text-yellow-600 hover:text-amber-700 text-sm font-medium flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Hesap Ekle
          </button>
        </div>
        <div className="space-y-3">
          {formData.map((social, index) => (
            <div key={index} className="flex gap-2">
              <select
                value={social.platform}
                onChange={(e) => updateArrayItem('socialMedia', index, { ...social, platform: e.target.value })}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="">Platform Seç</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="GitHub">GitHub</option>
                <option value="Twitter">Twitter</option>
                <option value="Instagram">Instagram</option>
                <option value="Facebook">Facebook</option>
                <option value="YouTube">YouTube</option>
                <option value="Behance">Behance</option>
                <option value="Dribbble">Dribbble</option>
                <option value="Medium">Medium</option>
                <option value="Personal Website">Kişisel Website</option>
                <option value="Portfolio">Portfolio</option>
                <option value="Other">Diğer</option>
              </select>
              <input
                type="url"
                value={social.url}
                onChange={(e) => updateArrayItem('socialMedia', index, { ...social, url: e.target.value })}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="https://example.com/profile"
              />
              <button
                type="button"
                onClick={() => removeArrayItem('socialMedia', index)}
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
