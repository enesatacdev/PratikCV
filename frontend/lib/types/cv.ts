export interface PersonalInfo {
  fullName: string;
  birthday: string;
  phones: string[];
  emails: string[];
  address: string;
  nationality: string;
  drivingLicenses: string[];
  profilePhoto: string;
  summary: string;
}

export interface CVData {
  id?: string;
  userId: string;
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: Skills;
  socialMedia: SocialMedia[];
  certificates: Certificate[];
  references: Reference[];
  extras: Extras;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}

export interface Education {
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  gpa: string;
  description: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  isCurrentJob: boolean;
}

export interface Skills {
  technical: string[];
  soft: string[];
  languages: Language[];
}

export interface Language {
  name: string;
  level: string;
}

export interface SocialMedia {
  platform: string;
  url: string;
  username: string;
}

export interface Certificate {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  credentialId: string;
  url: string;
}

export interface Reference {
  name: string;
  position: string;
  company: string;
  phone: string;
  email: string;
  relationship: string;
}

export interface Extras {
  hobbies: string[];
  militaryService: string;
  maritalStatus: string;
  additionalInfo: string;
}
