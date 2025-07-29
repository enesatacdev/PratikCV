import React from 'react';
import { Mail, Phone, MapPin, Calendar, ExternalLink, Edit3 } from 'lucide-react';
import EditableField from './EditableField';

interface CVData {
  showProfilePhoto?: boolean; // Profile photo visibility setting
  personalInfo: {
    firstName: string;
    lastName: string;
    fullName?: string; // Backward compatibility
    email: string;
    phone: string;
    address: string;
    title: string;
    summary: string;
    profilePhoto?: string;
  };
  aboutMe?: string; // Hakkımda alanı
  experiences: Array<{
    id: string;
    jobTitle: string;
    company: string;
    startDate: string;
    endDate: string;
    isCurrentJob: boolean;
    description: string;
  }>;
  educations: Array<{
    id: string;
    degree: string;
    school: string;
    department?: string;
    startDate: string;
    endDate: string;
    isCurrentEducation: boolean;
    gpa?: string;
  }>;
  skills: Array<{
    id: string;
    name: string;
    level: number;
    category: string;
  }>;
  certificates: Array<{
    id: string;
    name: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string;
    credentialId?: string;
  }>;
  socialMedia?: Array<{
    platform: string;
    url: string;
  }>;
  references?: Array<{
    name: string;
    position: string;
    company: string;
    phone: string;
    email: string;
    relationship?: string;
  }>;
  extras?: {
    hobbies?: string[];
    additional?: string;
  };
}

interface CVTemplateProps {
  data: CVData;
  template?: 'modern' | 'classic' | 'minimal' | 'premium' | 'executive';
  isPreview?: boolean;
  onFieldUpdate?: (fieldPath: string, newValue: string) => void;
  enableEditing?: boolean;
}

const CVTemplate: React.FC<CVTemplateProps> = ({ 
  data, 
  template = 'modern',
  isPreview = false,
  onFieldUpdate,
  enableEditing = false
}) => {
  const { personalInfo, aboutMe, experiences, educations, skills, certificates, socialMedia, references, extras } = data;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('tr-TR', { 
        year: 'numeric', 
        month: 'long' 
      });
    } catch {
      return dateString;
    }
  };

  const getTemplateStyles = () => {
    const baseStyles = "max-w-4xl mx-auto bg-white shadow-lg print:shadow-none";
    
    switch (template) {
      case 'modern':
        return `${baseStyles} border-l-4 border-blue-500`;
      case 'classic':
        return `${baseStyles} border border-gray-300`;
      case 'minimal':
        return `${baseStyles}`;
      case 'premium':
        return `${baseStyles} border-2 border-blue-400 relative overflow-hidden`;
      case 'executive':
        return `${baseStyles} bg-gradient-to-br from-gray-900 to-black text-white relative overflow-hidden`;
      default:
        return baseStyles;
    }
  };

  const getHeaderStyles = () => {
    switch (template) {
      case 'modern':
        return "bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8";
      case 'classic':
        return "bg-gray-50 border-b border-gray-300 p-8";
      case 'minimal':
        return "border-b border-gray-200 p-8";
      case 'premium':
        return "bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white p-8 relative";
      case 'executive':
        return "bg-gradient-to-r from-black to-gray-900 text-white p-8 relative border-b-2 border-yellow-400";
      default:
        return "bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8";
    }
  };

  const getSectionStyles = () => {
    return "mb-8 last:mb-0";
  };

  const getSectionTitleStyles = () => {
    switch (template) {
      case 'modern':
        return "text-2xl font-bold text-blue-800 mb-4 border-b-2 border-blue-200 pb-2";
      case 'classic':
        return "text-2xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2";
      case 'minimal':
        return "text-xl font-semibold text-gray-700 mb-4 border-b border-gray-200 pb-1";
      case 'executive':
        return "text-2xl font-bold text-yellow-400 mb-4 border-b-2 border-yellow-400 pb-2";
      default:
        return "text-2xl font-bold text-blue-800 mb-4 border-b-2 border-blue-200 pb-2";
    }
  };

  return (
    <div className={`${getTemplateStyles()} ${isPreview ? 'min-h-screen' : ''}`} data-cv-content="true">
      {/* Premium Badge */}
      {template === 'premium' && (
        <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
          PREMIUM
        </div>
      )}
      
      {/* Executive Badge */}
      {template === 'executive' && (
        <div className="absolute top-4 right-4 z-10 bg-black border-2 border-yellow-400 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
          EXECUTIVE
        </div>
      )}
      
      {/* Header Section */}
      <div className={getHeaderStyles()}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-baseline gap-4 mb-4">
              <h1 className={`text-4xl font-bold ${template !== 'modern' && template !== 'premium' ? 'text-gray-900' : ''}`}>
                {personalInfo.firstName} {personalInfo.lastName}
              </h1>
              {personalInfo.title && (
                enableEditing ? (
                  <EditableField
                    value={personalInfo.title}
                    onSave={(newValue) => onFieldUpdate?.('personalInfo.title', newValue)}
                    className={`text-xl ${template === 'modern' || template === 'premium' ? 'text-blue-100' : 'text-gray-600'}`}
                    placeholder="Unvan/Pozisyon"
                    fieldName="title"
                  />
                ) : (
                  <h2 className={`text-xl ${template === 'modern' || template === 'premium' ? 'text-blue-100' : 'text-gray-600'}`}>
                    {personalInfo.title}
                  </h2>
                )
              )}
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{personalInfo.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{personalInfo.phone}</span>
              </div>
              {personalInfo.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{personalInfo.address}</span>
                </div>
              )}
              
              {/* Social Media Links in Header */}
              {socialMedia && socialMedia.length > 0 && socialMedia.map((social, index) => (
                <div key={index} className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  <a 
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline truncate"
                  >
                    {social.platform}
                  </a>
                </div>
              ))}
            </div>
          </div>
          
          {data.showProfilePhoto && personalInfo.profilePhoto && (
            <div className="ml-8">
              <img
                src={personalInfo.profilePhoto}
                alt="Profil Fotoğrafı"
                className={`w-32 h-32 rounded-full object-cover shadow-lg ${
                  template === 'executive' 
                    ? 'border-4 border-yellow-400' 
                    : 'border-4 border-white'
                }`}
              />
            </div>
          )}
        </div>
      </div>

      <div className="p-8">
        {/* Summary Section */}
        {personalInfo.summary && (
          <div className={getSectionStyles()}>
            <h3 className={getSectionTitleStyles()}>Özet</h3>
            {enableEditing ? (
              <EditableField
                value={personalInfo.summary}
                onSave={(newValue) => onFieldUpdate?.('personalInfo.summary', newValue)}
                className="text-gray-700 leading-relaxed"
                placeholder="Profesyonel özetinizi yazın..."
                fieldName="summary"
                multiline
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">
                {personalInfo.summary}
              </p>
            )}
          </div>
        )}

        {/* About Me Section */}
        {aboutMe && aboutMe.trim() && (
          <div className={getSectionStyles()}>
            <h3 className={getSectionTitleStyles()}>Hakkımda</h3>
            {enableEditing ? (
              <EditableField
                value={aboutMe}
                onSave={(newValue) => onFieldUpdate?.('aboutMe', newValue)}
                className="text-gray-700 leading-relaxed"
                placeholder="Kendiniz hakkında bilgi verin..."
                fieldName="aboutMe"
                multiline
              />
            ) : (
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {aboutMe}
              </p>
            )}
          </div>
        )}

        {/* Experience and Education Section - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Experience Section */}
          {experiences && experiences.length > 0 && (
            <div>
              <h3 className={getSectionTitleStyles()}>İş Deneyimi</h3>
              <div className="space-y-6">
                {experiences.map((exp) => (
                  <div key={exp.id} className="border-l-2 border-gray-200 pl-4">
                    <div className="mb-2">
                      {enableEditing ? (
                        <EditableField
                          value={exp.jobTitle}
                          onSave={(newValue) => onFieldUpdate?.(`experiences.${exp.id}.jobTitle`, newValue)}
                          className="text-lg font-semibold text-gray-900"
                          placeholder="İş pozisyonu"
                          fieldName={`jobTitle-${exp.id}`}
                        />
                      ) : (
                        <h4 className="text-lg font-semibold text-gray-900">
                          {exp.jobTitle}
                        </h4>
                      )}
                      
                      {enableEditing ? (
                        <EditableField
                          value={exp.company}
                          onSave={(newValue) => onFieldUpdate?.(`experiences.${exp.id}.company`, newValue)}
                          className="text-blue-600 font-medium"
                          placeholder="Şirket adı"
                          fieldName={`company-${exp.id}`}
                        />
                      ) : (
                        <p className="text-blue-600 font-medium">
                          {exp.company}
                        </p>
                      )}
                      
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(exp.startDate)} - {exp.isCurrentJob ? 'Devam Ediyor' : formatDate(exp.endDate)}
                      </div>
                    </div>
                    {exp.description && (
                      enableEditing ? (
                        <EditableField
                          value={exp.description}
                          onSave={(newValue) => onFieldUpdate?.(`experiences.${exp.id}.description`, newValue)}
                          className="text-gray-700 text-sm leading-relaxed"
                          placeholder="İş tanımı ve başarılarınızı yazın..."
                          fieldName={`description-${exp.id}`}
                          multiline
                        />
                      ) : (
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {exp.description}
                        </p>
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education Section */}
          {educations && educations.length > 0 && (
            <div>
              <h3 className={getSectionTitleStyles()}>Eğitim</h3>
              <div className="space-y-4">
                {educations.map((edu) => (
                  <div key={edu.id} className="border-l-2 border-gray-200 pl-4">
                    <div className="mb-1">
                      {enableEditing ? (
                        <EditableField
                          value={edu.school}
                          onSave={(newValue) => onFieldUpdate?.(`educations.${edu.id}.school`, newValue)}
                          className="text-blue-600 font-medium"
                          placeholder="Okul adı"
                          fieldName={`school-${edu.id}`}
                        />
                      ) : (
                        <p className="text-blue-600 font-medium">
                          {edu.school}
                        </p>
                      )}
                      
                      {edu.department && (
                        enableEditing ? (
                          <EditableField
                            value={edu.department}
                            onSave={(newValue) => onFieldUpdate?.(`educations.${edu.id}.department`, newValue)}
                            className="text-gray-700 font-medium"
                            placeholder="Bölüm"
                            fieldName={`department-${edu.id}`}
                          />
                        ) : (
                          <p className="text-gray-700 font-medium">
                            {edu.department}
                          </p>
                        )
                      )}
                      
                      {enableEditing ? (
                        <EditableField
                          value={edu.degree}
                          onSave={(newValue) => onFieldUpdate?.(`educations.${edu.id}.degree`, newValue)}
                          className="text-lg font-semibold text-gray-900"
                          placeholder="Derece/Diploma"
                          fieldName={`degree-${edu.id}`}
                        />
                      ) : (
                        <h4 className="text-lg font-semibold text-gray-900">
                          {edu.degree}
                        </h4>
                      )}
                      
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(edu.startDate)} - {edu.isCurrentEducation ? 'Devam Ediyor' : formatDate(edu.endDate)}
                      </div>
                    </div>
                    {edu.gpa && (
                      <p className="text-sm text-gray-600">
                        GPA: {edu.gpa}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Skills and Languages Section - Side by Side */}
        {skills && skills.length > 0 && (
          <div className={getSectionStyles()}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Technical and Personal Skills Combined - Left Half */}
              <div>
                <h3 className={getSectionTitleStyles()}>Yetenekler</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {skills.filter(skill => skill.category !== 'Dil').map((skill) => (
                      <span
                        key={skill.id}
                        className="px-3 py-2 bg-blue-500 text-white text-sm rounded-md font-medium border-2 border-blue-500 relative group"
                      >
                        {enableEditing ? (
                          <EditableField
                            value={skill.name}
                            onSave={(newValue) => onFieldUpdate?.(`skills.${skill.id}.name`, newValue)}
                            className="bg-transparent text-white placeholder-blue-200"
                            placeholder="Yetenek adı"
                            fieldName={`skillName-${skill.id}`}
                          />
                        ) : (
                          skill.name
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Languages - Right Half */}
              <div>
                {(() => {
                  const languageSkills = skills.filter(skill => skill.category === 'Dil');
                  return languageSkills.length > 0 ? (
                    <>
                      <h3 className={getSectionTitleStyles()}>Diller</h3>
                      <div className="space-y-3">
                        {languageSkills.map((skill) => (
                          <div key={skill.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border">
                            <span className="font-medium text-gray-900">
                              {enableEditing ? (
                                <EditableField
                                  value={skill.name}
                                  onSave={(newValue) => onFieldUpdate?.(`skills.${skill.id}.name`, newValue)}
                                  className="bg-white border border-gray-200 rounded px-2 py-1"
                                  placeholder="Dil adı"
                                  fieldName={`languageName-${skill.id}`}
                                />
                              ) : (
                                skill.name
                              )}
                            </span>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((level) => (
                                <div
                                  key={level}
                                  className={`w-3 h-3 rounded-full border-2 border-blue-500 ${
                                    level <= skill.level ? 'bg-blue-500' : 'bg-transparent'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : null;
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Certificates and References Section - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Certificates Section */}
          {certificates && certificates.length > 0 && (
            <div className={getSectionStyles()}>
              <h3 className={getSectionTitleStyles()}>Sertifikalar</h3>
              <div className="space-y-4">
                {certificates.map((cert) => (
                  <div key={cert.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-r-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {enableEditing ? (
                          <div className="mb-1">
                            <EditableField
                              value={cert.name}
                              onSave={(newValue) => onFieldUpdate?.(`certificates.${cert.id}.name`, newValue)}
                              className="text-lg font-bold text-gray-900 bg-transparent border-none p-0 w-full"
                              placeholder="Sertifika adı"
                              fieldName={`certName-${cert.id}`}
                            />
                          </div>
                        ) : (
                          <h4 className="text-lg font-bold text-gray-900 mb-1">
                            {cert.name}
                          </h4>
                        )}
                        
                        {enableEditing ? (
                          <div className="mb-3">
                            <EditableField
                              value={cert.issuer}
                              onSave={(newValue) => onFieldUpdate?.(`certificates.${cert.id}.issuer`, newValue)}
                              className="text-blue-700 font-semibold text-sm bg-transparent border-none p-0 w-full"
                              placeholder="Veren kurum"
                              fieldName={`certIssuer-${cert.id}`}
                            />
                          </div>
                        ) : (
                          <p className="text-blue-700 font-semibold text-sm mb-3">
                            {cert.issuer}
                          </p>
                        )}
                        
                        <div className="flex items-center text-xs text-gray-600 bg-white px-3 py-1 rounded-full w-fit">
                          <Calendar className="w-3 h-3 mr-2" />
                          {formatDate(cert.issueDate)}
                          {cert.expiryDate && ` - ${formatDate(cert.expiryDate)}`}
                        </div>
                      </div>
                      
                      {cert.credentialId && (
                        <div className="ml-4 bg-blue-100 px-3 py-2 rounded-lg flex-shrink-0">
                          <p className="text-xs text-blue-800 font-mono">
                            {enableEditing ? (
                              <span className="block">
                                ID: <EditableField
                                  value={cert.credentialId}
                                  onSave={(newValue) => onFieldUpdate?.(`certificates.${cert.id}.credentialId`, newValue)}
                                  className="bg-transparent border-none p-0 font-mono text-blue-800 inline-block min-w-0"
                                  placeholder="ID"
                                  fieldName={`certId-${cert.id}`}
                                />
                              </span>
                            ) : (
                              `ID: ${cert.credentialId}`
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* References Section */}
          {references && references.length > 0 && (
            <div className={getSectionStyles()}>
              <h3 className={getSectionTitleStyles()}>Referanslar</h3>
              <div className="space-y-4">
                {references.map((reference, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-blue-300">
                    <div className="w-full">
                      <div className="flex items-baseline gap-3 mb-2">
                        {enableEditing ? (
                          <EditableField
                            value={reference.name}
                            onSave={(newValue) => onFieldUpdate?.(`references.${index}.name`, newValue)}
                            className="text-lg font-bold text-gray-900 bg-transparent border-none p-0"
                            placeholder="Referans adı"
                            fieldName={`refName-${index}`}
                          />
                        ) : (
                          <h4 className="text-lg font-bold text-gray-900">
                            {reference.name}
                          </h4>
                        )}
                        
                        {reference.position && (
                          <>
                            <span className="text-gray-400">•</span>
                            {enableEditing ? (
                              <EditableField
                                value={reference.position}
                                onSave={(newValue) => onFieldUpdate?.(`references.${index}.position`, newValue)}
                                className="text-blue-600 font-semibold text-sm bg-transparent border-none p-0"
                                placeholder="Pozisyon"
                                fieldName={`refPosition-${index}`}
                              />
                            ) : (
                              <span className="text-blue-600 font-semibold text-sm">
                                {reference.position}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                      
                      {reference.company && (
                        <div className="mb-3">
                          {enableEditing ? (
                            <span className="text-gray-700 font-medium">
                              <EditableField
                                value={reference.company}
                                onSave={(newValue) => onFieldUpdate?.(`references.${index}.company`, newValue)}
                                className="bg-transparent border-none p-0 text-gray-700 font-medium"
                                placeholder="Şirket"
                                fieldName={`refCompany-${index}`}
                              />
                            </span>
                          ) : (
                            <span className="text-gray-700 font-medium">
                              {reference.company}
                            </span>
                          )}
                        </div>
                      )}
                      
                      <div className="space-y-1">
                        {reference.phone && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="w-4 h-4 mr-2 text-green-500" />
                            <span className="font-mono">{reference.phone}</span>
                          </div>
                        )}
                        {reference.email && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Mail className="w-4 h-4 mr-2 text-blue-500" />
                            <span className="truncate">{reference.email}</span>
                          </div>
                        )}
                      </div>
                      
                      {reference.relationship && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <span className="text-xs text-gray-400 uppercase tracking-wide">İlişki</span>
                          <div className="mt-1">
                            {enableEditing ? (
                              <EditableField
                                value={reference.relationship}
                                onSave={(newValue) => onFieldUpdate?.(`references.${index}.relationship`, newValue)}
                                className="text-sm text-gray-700 font-medium bg-transparent border-none p-0"
                                placeholder="İlişki türü"
                                fieldName={`refRelationship-${index}`}
                              />
                            ) : (
                              <span className="text-sm text-gray-700 font-medium">
                                {reference.relationship}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Extras Section */}
        {extras && ((extras.hobbies && Array.isArray(extras.hobbies) && extras.hobbies.length > 0) || (extras.additional && extras.additional.trim())) && (
          <div className={getSectionStyles()}>
            <h3 className={getSectionTitleStyles()}>Ek Bilgiler</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Hobbies - Left Half */}
              {extras.hobbies && Array.isArray(extras.hobbies) && extras.hobbies.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Hobiler & İlgi Alanları</h4>
                  <div className="flex flex-wrap gap-2">
                    {extras.hobbies.map((hobby, index) => (
                      <span 
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {hobby}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Additional Info - Right Half */}
              {extras.additional && extras.additional.trim() && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Diğer Bilgiler</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                      {extras.additional}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CVTemplate;
