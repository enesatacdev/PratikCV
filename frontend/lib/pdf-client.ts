// Client-side PDF utilities that use API endpoints instead of direct Puppeteer
export class PDFClient {
  private static baseUrl = '/api';

  // CV verisini optimize et ve gereksiz alanları temizle
  private static optimizeCVData(cvData: any) {
    return {
      personalInfo: {
        fullName: cvData.personalInfo?.fullName || cvData.fullName || '',
        email: cvData.personalInfo?.email || cvData.email || '',
        phone: cvData.personalInfo?.phone || cvData.phone || '',
        address: cvData.personalInfo?.address || cvData.address || '',
        title: cvData.personalInfo?.title || cvData.title || '',
        profilePhoto: cvData.personalInfo?.profilePhoto || cvData.profilePhoto || ''
      },
      experiences: (cvData.experiences || cvData.experience || []).slice(0, 10).map((exp: any) => ({
        jobTitle: exp.jobTitle || exp.position || '',
        company: exp.company || '',
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        description: (exp.description || '').substring(0, 500) // Maksimum 500 karakter
      })),
      educations: (cvData.educations || cvData.education || []).slice(0, 5).map((edu: any) => ({
        degree: edu.degree || '',
        school: edu.school || '',
        department: edu.department || '',
        startDate: edu.startDate || '',
        endDate: edu.endDate || ''
      })),
      skills: (cvData.skills || []).slice(0, 20).map((skill: any) => ({
        name: skill.name || skill,
        level: skill.level || 3,
        category: skill.category || 'Teknik'
      })),
      certificates: (cvData.certificates || []).slice(0, 10).map((cert: any) => ({
        name: cert.name || '',
        issuer: cert.issuer || '',
        date: cert.issueDate || cert.date || ''
      })),
      aboutMe: (cvData.aboutMe || '').substring(0, 1000), // Maksimum 1000 karakter
      showProfilePhoto: cvData.showProfilePhoto || false
    };
  }

  static async downloadPDF(cvData: any, templateId: string = 'modern'): Promise<void> {
    try {
      const optimizedData = this.optimizeCVData(cvData);
      
      const response = await fetch(`${this.baseUrl}/pdf/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cvData: optimizedData,
          templateId,
          options: {
            format: 'A4',
            printBackground: true
          }
        })
      });
      
      if (!response.ok) {
        // Hata durumunda JSON parse et
        try {
          const errorData = await response.json();
          throw new Error(errorData.error || `Server error: ${response.status}`);
        } catch (e) {
          throw new Error(`Server error: ${response.status}`);
        }
      }

      // Content-type kontrolü
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        // JSON response durumunda hata
        try {
          const errorData = await response.json();
          throw new Error(errorData.error || 'PDF generation failed');
        } catch (e) {
          throw new Error('PDF generation failed - invalid JSON response');
        }
      }

      // Blob olarak al
      const blob = await response.blob();
      
      if (blob.size === 0) {
        throw new Error('Empty PDF file received');
      }

      // PDF magic number kontrolü
      const arrayBuffer = await blob.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const header = String.fromCharCode(...bytes.slice(0, 4));
      
      if (!header.startsWith('%PDF')) {
        throw new Error('Invalid PDF format received');
      }

      // PDF blob'unu yeniden oluştur
      const pdfBlob = new Blob([arrayBuffer], { type: 'application/pdf' });

      // İndirme linkini oluştur
      const url = URL.createObjectURL(pdfBlob);
      const fileName = `CV_${new Date().getTime()}.pdf`;
      
      // İndirme işlemini başlat
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup
      URL.revokeObjectURL(url);
      
      
    } catch (error) {
      throw error;
    }
  }

  static async previewPDF(cvData: any, templateId: string = 'modern'): Promise<void> {
    try {
      const optimizedData = this.optimizeCVData(cvData);
      
      const response = await fetch(`${this.baseUrl}/pdf/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cvData: optimizedData,
          templateId,
          options: {
            format: 'A4',
            printBackground: true
          }
        })
      });

      if (!response.ok) {
        // Hata durumunda content-type'a göre handle et
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          try {
            const errorData = await response.json();
            throw new Error(errorData.error || 'PDF generation failed');
          } catch (e) {
            throw new Error(`Server error: ${response.status}`);
          }
        } else {
          throw new Error(`Server error: ${response.status}`);
        }
      }

      // Content-type kontrolü
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = await response.json();
          throw new Error(errorData.error || 'PDF generation failed');
        } catch (e) {
          throw new Error('PDF generation failed - invalid response');
        }
      }

      // Get PDF blob and open in new tab
      const pdfBlob = await response.blob();
      const url = URL.createObjectURL(pdfBlob);
      window.open(url, '_blank');
      
      // Clean up after some time
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 5000);
      
    } catch (error) {
      throw error;
    }
  }

  static async getThumbnailImage(cvData: any, templateId: string = 'modern'): Promise<string> {
    try {
      // Basit thumbnail oluştur - gerçek API endpoint olmadığı için mock
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Canvas context not available');
      }
      
      // Arka plan
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Border
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
      
      // Header area
      ctx.fillStyle = '#f9fafb';
      ctx.fillRect(10, 10, canvas.width - 20, 80);
      
      // Title
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      const name = cvData.personalInfo?.firstName 
        ? `${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName || ''}`
        : cvData.personalInfo?.fullName || 'CV Önizlemesi';
      ctx.fillText(name, canvas.width / 2, 35);
      
      // Template name
      ctx.fillStyle = '#6b7280';
      ctx.font = '12px Arial';
      ctx.fillText(`${templateId} Şablonu`, canvas.width / 2, 55);
      
      // Content lines (mock)
      ctx.fillStyle = '#e5e7eb';
      const lineHeight = 15;
      const startY = 110;
      for (let i = 0; i < 15; i++) {
        const y = startY + (i * lineHeight);
        const width = Math.random() * 200 + 50;
        ctx.fillRect(20, y, width, 8);
      }
      
      // Sections
      ctx.fillStyle = '#3b82f6';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('Kişisel Bilgiler', 20, 130);
      ctx.fillText('Deneyim', 20, 190);
      ctx.fillText('Eğitim', 20, 250);
      ctx.fillText('Yetenekler', 20, 310);
      
      return canvas.toDataURL('image/png');
      
    } catch (error) {
      // Fallback: basit metin tabanlı placeholder
      return `data:image/svg+xml;base64,${btoa(`
        <svg width="300" height="400" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="400" fill="#f3f4f6" stroke="#e5e7eb" stroke-width="2"/>
          <text x="150" y="50" text-anchor="middle" font-family="Arial" font-size="16" font-weight="bold" fill="#1f2937">
            ${cvData.personalInfo?.fullName || 'CV Önizlemesi'}
          </text>
          <text x="150" y="70" text-anchor="middle" font-family="Arial" font-size="12" fill="#6b7280">
            ${templateId} Şablonu
          </text>
          <rect x="20" y="90" width="260" height="280" fill="none" stroke="#e5e7eb" stroke-width="1"/>
          <text x="30" y="110" font-family="Arial" font-size="14" font-weight="bold" fill="#3b82f6">Kişisel Bilgiler</text>
          <text x="30" y="150" font-family="Arial" font-size="14" font-weight="bold" fill="#3b82f6">Deneyim</text>
          <text x="30" y="190" font-family="Arial" font-size="14" font-weight="bold" fill="#3b82f6">Eğitim</text>
          <text x="30" y="230" font-family="Arial" font-size="14" font-weight="bold" fill="#3b82f6">Yetenekler</text>
        </svg>
      `)}`;
    }
  }

  static async getAvailableTemplates(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/templates`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }

      const data = await response.json();
      return data.success ? data.data : [];
      
    } catch (error) {
      return [];
    }
  }
}

// Legacy exports for backward compatibility
export const downloadPDF = PDFClient.downloadPDF.bind(PDFClient);
export const previewPDF = PDFClient.previewPDF.bind(PDFClient);
export const generatePDF = async (cvData: any, templateId: string = 'modern'): Promise<Buffer> => {
  // This can't return Buffer in browser, redirect to download instead
  await PDFClient.downloadPDF(cvData, templateId);
  return Buffer.from([]); // Dummy return for compatibility
};
