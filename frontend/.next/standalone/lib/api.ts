// ...removed duplicate apiService block...
// API Base URL
// Backend API (.NET Core API) - Auth ve CV işlemleri için
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

// CV Data Types (Backend ile uyumlu)
export interface CVData {
  title?: string; // CV title
  templateName?: string; // Template name
  status?: string; // CV status
  showProfilePhoto?: boolean; // Show profile photo in CV
  aboutMe?: string; // Hakkımızda/Ek bilgiler alanı
  personalInfo: {
    fullName: string;
    phones: string[];
    emails: string[];
    address: string;
    profilePhoto: string;
  };
  education: Array<{
    school: string;
    department: string;
    startDate: string;
    endDate: string;
    degree: string;
    gpa: string;
  }>;
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    isCurrent?: boolean;
    description: string;
    achievements: string;
  }>;
  skills: {
    technical: string[];
    personal: string[];
    languages: Array<{ language: string; level: string }>; // Updated to match SkillsForm interface
  };
  socialMedia: Array<{
    platform: string;
    url: string;
  }>;
  certificates: Array<{
    name: string;
    issuer: string;
    date: string;
    credentialId?: string;
    url?: string;
  }>;
  references: Array<{
    name: string;
    position: string;
    company: string;
    phone: string;
    email: string;
    relationship: string;
  }>;
  extras: {
    hobbies: string[];
    references?: Array<{
      name: string;
      position: string;
      company: string;
      phone: string;
      email: string;
      relationship: string;
    }>;
    additional?: string;
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
  };
}

// API Functions
export const apiService = {
  // CV işlemleri
  async getCVByUserId(userId: string) {
    const response = await fetch(`${API_BASE_URL}/cv/user/${userId}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null; // CV bulunamadı
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async getCVById(cvId: string) {
    const response = await fetch(`${API_BASE_URL}/cv/${cvId}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null; // CV bulunamadı
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async createCV(userId: string, cvData: CVData) {
    const payload = {
      userId,
      ...cvData
    };

    const response = await fetch(`${API_BASE_URL}/cv`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async updateCV(userId: string, cvData: CVData) {
    const response = await fetch(`${API_BASE_URL}/cv/user/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cvData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async updateCVById(cvId: string, cvData: CVData) {
    const response = await fetch(`${API_BASE_URL}/cv/${cvId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cvData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async deleteCV(userId: string) {
    const response = await fetch(`${API_BASE_URL}/cv/user/${userId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.ok;
  },

  // Health check
  async checkHealth() {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  },

  // Premium upgrade
  async upgradeToPremium(token: string) {
    const response = await fetch(`${API_BASE_URL}/auth/upgrade-premium`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Add premium credits
  async addPremiumCredits(token: string, credits: number) {
    const response = await fetch(`${API_BASE_URL}/auth/add-premium-credits`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ credits })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
  ,
  async getUserProfile() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (!token) throw new Error('No auth token');
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch user profile');
    return res.json();
  }
};

// Axios-like API instance for easier usage
export const api = {
  get: async (endpoint: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // TODO: Add real auth token when authentication is implemented
        // For now, we'll use a mock user ID in the endpoint
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    
    return { data: await response.json() };
  },

  post: async (endpoint: string, data?: any) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    
    return { data: await response.json() };
  },

  put: async (endpoint: string, data?: any) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    
    return { data: await response.json() };
  },

  delete: async (endpoint: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    
    // Handle 204 No Content response
    if (response.status === 204) {
      return { data: null };
    }
    
    return { data: await response.json() };
  },

  // Premium credits
  addPremiumCredits: async (token: string, credits: number) => {
    const response = await fetch(`${API_BASE_URL}/auth/add-premium-credits`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ credits })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  deductPremiumCredit: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/deduct-premium-credit`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Shopier ödeme onayı
  confirmPayment: async (token: string, paymentData: {
    userId: string;
    planId: string;
    credits: number;
    transactionId: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/payment/confirm-shopier`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(paymentData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // User Profile işlemleri
  updateUserProfile: async (token: string, profileData: {
    firstName: string;
    lastName: string;
    email: string;
    profilePhoto?: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
};
