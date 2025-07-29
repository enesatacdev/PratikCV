interface Extras {
  hobbies: string[];
  projects: Array<{
    name: string;
    description: string;
    url?: string;
    technologies?: string;
  }>;
  volunteerWork: Array<{
    organization: string;
    position: string;
    startDate: string;
    endDate?: string;
    description: string;
  }>;
  awards: Array<{
    title: string;
    organization: string;
    date: string;
    description?: string;
  }>;
}

interface ExtrasFormProps {
  formData: Extras;
  addArrayItem: (field: string, defaultValue: any) => void;
  removeArrayItem: (field: string, index: number) => void;
  updateArrayItem: (field: string, index: number, value: any) => void;
}

export default function ExtrasForm({
  formData,
  addArrayItem,
  removeArrayItem,
  updateArrayItem,
}: ExtrasFormProps) {
  return (
    <div className="space-y-8">
      {/* Hobbies Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">Hobiler & İlgi Alanları</label>
          <button
            type="button"
            onClick={() => addArrayItem('hobbies', '')}
            className="text-yellow-600 hover:text-amber-700 text-sm font-medium flex items-center gap-1"
          >
            + Hobi Ekle
          </button>
        </div>
        <div className="space-y-2">
          {formData.hobbies.map((hobby, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={hobby}
                onChange={(e) => updateArrayItem('hobbies', index, e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Örn: Fotoğrafçılık, Yüzme, Kitap okuma..."
              />
              {formData.hobbies.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('hobbies', index)}
                  className="text-red-500 hover:text-red-700 px-2"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Projects Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">Kişisel Projeler</label>
          <button
            type="button"
            onClick={() => addArrayItem('projects', { name: '', description: '', url: '', technologies: '' })}
            className="text-yellow-600 hover:text-amber-700 text-sm font-medium flex items-center gap-1"
          >
            + Proje Ekle
          </button>
        </div>
        <div className="space-y-4">
          {formData.projects.map((project, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proje Adı
                  </label>
                  <input
                    type="text"
                    value={project.name}
                    onChange={(e) => updateArrayItem('projects', index, { ...project, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Örn: E-ticaret Platformu"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proje URL (Opsiyonel)
                  </label>
                  <input
                    type="url"
                    value={project.url}
                    onChange={(e) => updateArrayItem('projects', index, { ...project, url: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="https://github.com/username/project"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kullanılan Teknolojiler
                  </label>
                  <input
                    type="text"
                    value={project.technologies}
                    onChange={(e) => updateArrayItem('projects', index, { ...project, technologies: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="React, Node.js, MongoDB, Docker..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama
                  </label>
                  <textarea
                    value={project.description}
                    onChange={(e) => updateArrayItem('projects', index, { ...project, description: e.target.value })}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Projenin amacı, kullanılan teknolojiler ve elde edilen sonuçlar..."
                  />
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => removeArrayItem('projects', index)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Projeyi Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Volunteer Work Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">Gönüllü Çalışmalar</label>
          <button
            type="button"
            onClick={() => addArrayItem('volunteerWork', { organization: '', position: '', startDate: '', endDate: '', description: '' })}
            className="text-yellow-600 hover:text-amber-700 text-sm font-medium flex items-center gap-1"
          >
            + Gönüllü Çalışma Ekle
          </button>
        </div>
        <div className="space-y-4">
          {formData.volunteerWork.map((work, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organizasyon
                  </label>
                  <input
                    type="text"
                    value={work.organization}
                    onChange={(e) => updateArrayItem('volunteerWork', index, { ...work, organization: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Örn: Kızılay, TEMA Vakfı..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pozisyon
                  </label>
                  <input
                    type="text"
                    value={work.position}
                    onChange={(e) => updateArrayItem('volunteerWork', index, { ...work, position: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Örn: Gönüllü Koordinatörü"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Başlangıç Tarihi
                  </label>
                  <input
                    type="month"
                    value={work.startDate}
                    onChange={(e) => updateArrayItem('volunteerWork', index, { ...work, startDate: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bitiş Tarihi (Opsiyonel)
                  </label>
                  <input
                    type="month"
                    value={work.endDate}
                    onChange={(e) => updateArrayItem('volunteerWork', index, { ...work, endDate: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama
                  </label>
                  <textarea
                    value={work.description}
                    onChange={(e) => updateArrayItem('volunteerWork', index, { ...work, description: e.target.value })}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Gönüllü çalışma kapsamında yaptığınız faaliyetler..."
                  />
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => removeArrayItem('volunteerWork', index)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Gönüllü Çalışmayı Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Awards Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">Ödüller & Başarılar</label>
          <button
            type="button"
            onClick={() => addArrayItem('awards', { title: '', organization: '', date: '', description: '' })}
            className="text-yellow-600 hover:text-amber-700 text-sm font-medium flex items-center gap-1"
          >
            + Ödül Ekle
          </button>
        </div>
        <div className="space-y-4">
          {formData.awards.map((award, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ödül/Başarı Adı
                  </label>
                  <input
                    type="text"
                    value={award.title}
                    onChange={(e) => updateArrayItem('awards', index, { ...award, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Örn: Yılın En İyi Çalışanı"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Veren Kurum
                  </label>
                  <input
                    type="text"
                    value={award.organization}
                    onChange={(e) => updateArrayItem('awards', index, { ...award, organization: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Örn: ABC Şirketi, IEEE..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tarih
                  </label>
                  <input
                    type="month"
                    value={award.date}
                    onChange={(e) => updateArrayItem('awards', index, { ...award, date: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama (Opsiyonel)
                  </label>
                  <textarea
                    value={award.description}
                    onChange={(e) => updateArrayItem('awards', index, { ...award, description: e.target.value })}
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Ödülün nedeni ve başarının detayları..."
                  />
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => removeArrayItem('awards', index)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Ödülü Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
