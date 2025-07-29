// Server-side only PDF generator using Puppeteer
// For client-side usage, import from './pdf-client' instead

import puppeteer from 'puppeteer';
import type { PDFOptions, Browser, Page } from 'puppeteer';

export interface PDFGenerationOptions {
  templateId: string;
  format?: 'A4' | 'Letter';
  margin?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  printBackground?: boolean;
  displayHeaderFooter?: boolean;
  scale?: number;
}

export class PDFGenerator {
  private static browser: Browser | null = null;

  // CV verisini optimize et
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
      experiences: (cvData.experiences || cvData.experience || []).slice(0, 10),
      educations: (cvData.educations || cvData.education || []).slice(0, 5),
      skills: (cvData.skills || []).slice(0, 20),
      certificates: (cvData.certificates || []).slice(0, 10),
      aboutMe: (cvData.aboutMe || '').substring(0, 1000),
      showProfilePhoto: cvData.showProfilePhoto || false,
      // Diğer alanları da ekle ama sınırla
      references: (cvData.references || []).slice(0, 3),
      hobbies: (cvData.hobbies || []).slice(0, 10),
      projects: (cvData.projects || []).slice(0, 5)
    };
  }

  static async initialize(): Promise<void> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor'
        ]
      });
    }
  }

  // HTML içeriği oluştur
  private static async generateCVHTML(cvData: any, templateId: string): Promise<string> {
    // CV data'yı formatla
    const formattedData = {
      showProfilePhoto: cvData.showProfilePhoto || false,
      personalInfo: {
        firstName: cvData.personalInfo?.firstName || cvData.personalInfo?.fullName?.split(' ')[0] || '',
        lastName: cvData.personalInfo?.lastName || cvData.personalInfo?.fullName?.split(' ').slice(1).join(' ') || '',
        fullName: cvData.personalInfo?.fullName || `${cvData.personalInfo?.firstName || ''} ${cvData.personalInfo?.lastName || ''}`.trim(),
        email: cvData.personalInfo?.email || '',
        phone: cvData.personalInfo?.phone || '',
        address: cvData.personalInfo?.address || '',
        title: cvData.personalInfo?.title || '',
        summary: cvData.aboutMe || '',
        profilePhoto: cvData.personalInfo?.profilePhoto || ''
      },
      aboutMe: cvData.aboutMe || '',
      experiences: (cvData.experiences || []).map((exp: any, index: number) => ({
        id: `exp-${index}`,
        jobTitle: exp.jobTitle || exp.position || '',
        company: exp.company || '',
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        isCurrentJob: exp.endDate === '' || exp.endDate === 'Devam ediyor',
        description: exp.description || ''
      })),
      educations: (cvData.educations || []).map((edu: any, index: number) => ({
        id: `edu-${index}`,
        degree: edu.degree || '',
        school: edu.school || '',
        department: edu.department || '',
        startDate: edu.startDate || '',
        endDate: edu.endDate || '',
        isCurrentEducation: edu.endDate === '' || edu.endDate === 'Devam ediyor',
        gpa: edu.gpa || ''
      })),
      skills: (cvData.skills || []).map((skill: any, index: number) => ({
        id: `skill-${index}`,
        name: skill.name || skill,
        level: skill.level || 3,
        category: skill.category || 'Teknik'
      })),
      certificates: (cvData.certificates || []).map((cert: any, index: number) => ({
        id: `cert-${index}`,
        name: cert.name || '',
        issuer: cert.issuer || '',
        issueDate: cert.date || cert.issueDate || '',
        expiryDate: cert.expiryDate || '',
        credentialId: cert.credentialId || ''
      })),
      socialMedia: cvData.socialMedia || [],
      references: cvData.references || [],
      extras: {
        hobbies: cvData.hobbies || [],
        additional: cvData.additional || ''
      }
    };

    // Template'e göre HTML oluştur (CVTemplate benzeri)
    const generateTemplateHTML = (template: string, data: any) => {
      // Modern template (varsayılan)
      if (template === 'modern' || !template) {
        return `
          <div class="max-w-4xl mx-auto bg-white" data-cv-content>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Sol Kolon -->
              <div class="space-y-6">
                <!-- Kişisel Bilgiler -->
                <div class="text-center lg:text-left">
                  ${data.showProfilePhoto && data.personalInfo?.profilePhoto ? `
                    <div class="mb-6 flex justify-center lg:justify-start">
                      <img src="${data.personalInfo.profilePhoto}" alt="Profile" class="w-32 h-32 rounded-full object-cover border-4 border-blue-100">
                    </div>
                  ` : ''}
                  <h1 class="text-3xl font-bold text-gray-900 mb-2">${data.personalInfo?.fullName || ''}</h1>
                  <p class="text-xl text-blue-600 mb-4 font-medium">${data.personalInfo?.title || ''}</p>
                  <div class="space-y-2 text-gray-600">
                    ${data.personalInfo?.email ? `<p class="flex items-center justify-center lg:justify-start"><span class="mr-2">📧</span>${data.personalInfo.email}</p>` : ''}
                    ${data.personalInfo?.phone ? `<p class="flex items-center justify-center lg:justify-start"><span class="mr-2">📞</span>${data.personalInfo.phone}</p>` : ''}
                    ${data.personalInfo?.address ? `<p class="flex items-center justify-center lg:justify-start"><span class="mr-2">📍</span>${data.personalInfo.address}</p>` : ''}
                  </div>
                </div>

                <!-- Hakkımda -->
                ${data.aboutMe ? `
                <div>
                  <h2 class="text-xl font-bold text-gray-900 mb-3 border-b-2 border-blue-500 pb-1">Hakkımda</h2>
                  <p class="text-gray-700 leading-relaxed">${data.aboutMe}</p>
                </div>
                ` : ''}

                <!-- Yetenekler -->
                ${data.skills?.length ? `
                <div>
                  <h2 class="text-xl font-bold text-gray-900 mb-3 border-b-2 border-blue-500 pb-1">Yetenekler</h2>
                  <div class="flex flex-wrap gap-2">
                    ${data.skills.map((skill: any) => `
                      <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        ${skill.name || skill}
                      </span>
                    `).join('')}
                  </div>
                </div>
                ` : ''}
              </div>

              <!-- Sağ Kolon -->
              <div class="space-y-6">
                <!-- Deneyim -->
                ${data.experiences?.length ? `
                <div>
                  <h2 class="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-500 pb-1">İş Deneyimi</h2>
                  <div class="space-y-4">
                    ${data.experiences.map((exp: any) => `
                      <div class="border-l-4 border-blue-200 pl-4">
                        <h3 class="font-bold text-gray-900">${exp.jobTitle || ''}</h3>
                        <p class="text-blue-600 font-medium">${exp.company || ''}</p>
                        <p class="text-gray-500 text-sm">${exp.startDate || ''} - ${exp.endDate || 'Devam ediyor'}</p>
                        ${exp.description ? `<p class="text-gray-700 mt-2">${exp.description}</p>` : ''}
                      </div>
                    `).join('')}
                  </div>
                </div>
                ` : ''}

                <!-- Eğitim -->
                ${data.educations?.length ? `
                <div>
                  <h2 class="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-500 pb-1">Eğitim</h2>
                  <div class="space-y-4">
                    ${data.educations.map((edu: any) => `
                      <div class="border-l-4 border-green-200 pl-4">
                        <h3 class="font-bold text-gray-900">${edu.degree || ''}</h3>
                        <p class="text-green-600 font-medium">${edu.school || ''}</p>
                        ${edu.department ? `<p class="text-gray-600">${edu.department}</p>` : ''}
                        <p class="text-gray-500 text-sm">${edu.startDate || ''} - ${edu.endDate || ''}</p>
                      </div>
                    `).join('')}
                  </div>
                </div>
                ` : ''}

                <!-- Sertifikalar -->
                ${data.certificates?.length ? `
                <div>
                  <h2 class="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-500 pb-1">Sertifikalar</h2>
                  <div class="space-y-3">
                    ${data.certificates.map((cert: any) => `
                      <div class="bg-gray-50 p-3 rounded">
                        <h3 class="font-medium text-gray-900">${cert.name || ''}</h3>
                        <p class="text-gray-600 text-sm">${cert.issuer || ''} ${cert.issueDate ? `- ${cert.issueDate}` : ''}</p>
                      </div>
                    `).join('')}
                  </div>
                </div>
                ` : ''}
              </div>
            </div>
          </div>
        `;
      }
      
      // Diğer template'ler için de benzer yapı eklenebilir
      return generateTemplateHTML('modern', data);
    };

    const cvHTML = generateTemplateHTML(templateId, formattedData);

    // Tam HTML sayfası oluştur
    return `
      <!DOCTYPE html>
      <html lang="tr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>CV - ${formattedData.personalInfo?.fullName || 'CV'}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { 
              margin: 0; 
              padding: 20px; 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: white;
            }
            
            @media print {
              @page { 
                margin: 0; 
                size: A4; 
              }
              body { 
                margin: 0; 
                padding: 20px; 
              }
              * { 
                print-color-adjust: exact; 
                -webkit-print-color-adjust: exact; 
              }
            }
            
            /* Ensure grid layouts work in PDF */
            .grid {
              display: grid !important;
            }
            
            /* Hide any potential navigation elements */
            nav, .navbar, .header, .footer, .navigation, .menu {
              display: none !important;
            }
          </style>
        </head>
        <body>
          ${cvHTML}
        </body>
      </html>
    `;
  }

  static async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  static async generatePDF(
    cvData: any,
    options: PDFGenerationOptions = { templateId: 'modern' }
  ): Promise<Buffer> {
    await this.initialize();
    
    if (!this.browser) {
      throw new Error('Browser initialization failed');
    }

    let page: Page | null = null;
    
    try {
      // Create new page
      page = await this.browser.newPage();
      
      // Set viewport for consistent rendering
      await page.setViewport({
        width: 794,  // A4 width in pixels at 96 DPI
        height: 1123, // A4 height in pixels at 96 DPI
        deviceScaleFactor: 1
      });

      // Optimize CV data to reduce size
      const optimizedCvData = this.optimizeCVData(cvData);
      
      // HTML template oluştur - URL encoding yerine
      const htmlContent = await this.generateCVHTML(optimizedCvData, options.templateId);
      
      // HTML içeriğini doğrudan yükle
      await page.setContent(htmlContent, {
        waitUntil: ['networkidle0', 'domcontentloaded'],
        timeout: 30000
      });

      // Sayfanın tamamen render olmasını bekle
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Wait for the CV to render completely
      await page.waitForSelector('[data-cv-content]', { timeout: 10000 }).catch(() => {
        // CV content not found, proceed anyway
      });

      // Inject additional CSS to hide navigation elements and ensure layout consistency
      await page.addStyleTag({
        content: `
          nav, header, footer, .navbar, .header, .footer,
          .navigation, .menu, .sidebar, .topbar {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            overflow: hidden !important;
          }
          
          body { 
            margin: 0 !important; 
            padding: 0 !important; 
          }
          
          /* Ensure consistent layout between preview and PDF */
          .grid {
            display: grid !important;
          }
          
          .grid-cols-1 {
            grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
          }
          
          @media (min-width: 1024px) {
            .lg\\:grid-cols-2 {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }
          }
          
          .gap-8 {
            gap: 2rem !important;
          }
          
          .space-y-4 > * + * {
            margin-top: 1rem !important;
          }
          
          .space-y-6 > * + * {
            margin-top: 1.5rem !important;
          }
          
          .flex-wrap {
            flex-wrap: wrap !important;
          }
          
          .gap-2 {
            gap: 0.5rem !important;
          }
          
          .gap-4 {
            gap: 1rem !important;
          }
          
          @media print {
            nav, header, footer, .navbar, .header, .footer,
            .navigation, .menu, .sidebar, .topbar {
              display: none !important;
            }
            
            /* Force layout consistency in print */
            .grid {
              display: grid !important;
            }
            
            .lg\\:grid-cols-2 {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }
          }
        `
      });

      // Add CSS to hide any potential browser UI
      await page.addStyleTag({
        content: `
          @media print {
            @page { margin: 0; size: A4; }
            body { margin: 0; padding: 0; }
            html { margin: 0; padding: 0; }
          }
        `
      });

      // Configure PDF options
      const pdfOptions: PDFOptions = {
        format: options.format || 'A4',
        printBackground: options.printBackground ?? true,
        margin: options.margin || {
          top: '0mm',
          right: '0mm',
          bottom: '0mm',
          left: '0mm'
        },
        displayHeaderFooter: false, // Kesinlikle kapalı
        headerTemplate: '',
        footerTemplate: '',
        scale: options.scale || 1,
        preferCSSPageSize: true,
        omitBackground: false
      };

      // Generate PDF
      const pdfBuffer = await page.pdf(pdfOptions);
      
      return Buffer.from(pdfBuffer);
      
    } catch (error) {
      throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      if (page) {
        await page.close();
      }
    }
  }
}
