import { Plus } from "lucide-react";

interface Certificate {
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

interface CertificatesFormProps {
  formData: Certificate[];
  addArrayItem: (field: string, defaultValue: any) => void;
  removeArrayItem: (field: string, index: number) => void;
  updateArrayItem: (field: string, index: number, value: any) => void;
}

export default function CertificatesForm({
  formData,
  addArrayItem,
  removeArrayItem,
  updateArrayItem,
}: CertificatesFormProps) {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">Sertifikalar</label>
          <button
            type="button"
            onClick={() => addArrayItem('certificates', { name: '', issuer: '', date: '', url: '' })}
            className="text-yellow-600 hover:text-amber-700 text-sm font-medium flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Sertifika Ekle
          </button>
        </div>
        <div className="space-y-4">
          {formData.map((cert, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sertifika Adı
                  </label>
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => updateArrayItem('certificates', index, { ...cert, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Örn: AWS Certified Solutions Architect"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Veren Kurum
                  </label>
                  <input
                    type="text"
                    value={cert.issuer}
                    onChange={(e) => updateArrayItem('certificates', index, { ...cert, issuer: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Örn: Amazon Web Services"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tarih
                  </label>
                  <input
                    type="month"
                    value={cert.date}
                    onChange={(e) => updateArrayItem('certificates', index, { ...cert, date: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sertifika URL (Opsiyonel)
                  </label>
                  <input
                    type="url"
                    value={cert.url}
                    onChange={(e) => updateArrayItem('certificates', index, { ...cert, url: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="https://example.com/certificate"
                  />
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => removeArrayItem('certificates', index)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Sertifikayı Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
