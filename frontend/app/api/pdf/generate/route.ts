import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(request: NextRequest) {
  try {
    const { templateId = 'modern', cvData, options = {}, previewHtml } = await request.json();
    
    if (!cvData && !previewHtml) {
      return NextResponse.json({
        success: false,
        error: 'CV data or preview HTML is required'
      }, { status: 400 });
    }



    // Puppeteer ile PDF oluştur
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });

    const page = await browser.newPage();
    
    // Set viewport for consistent rendering (büyük ekran simülasyonu)
    await page.setViewport({
      width: 1400,
      height: 1800,
      deviceScaleFactor: 1
    });

    // PDF oluştur
    let pdfBuffer;

    // Eğer previewHtml gönderilmişse onu kullan (screenshot yaklaşımı)
    if (previewHtml) {
      // Önce HTML'i sayfaya yükle
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="tr">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>CV</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <script>
              tailwind.config = {
                theme: {
                  extend: {
                    screens: {
                      'sm': '640px',
                      'md': '768px',
                      'lg': '1024px',
                      'xl': '1280px',
                    }
                  }
                }
              }
            </script>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
              body { 
                font-family: 'Inter', sans-serif;
                background: white;
                margin: 0;
                padding: 0;
              }
              /* Grid sistemini zorla aktif et */
              .grid { display: grid !important; }
              .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)) !important; }
              .lg\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
              .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
              /* Responsive sınıfları zorla aktif et */
              @media (min-width: 768px) {
                .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
              }
              @media (min-width: 1024px) {
                .lg\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
              }
              /* Premium ve Executive badge'leri gizle */
              .absolute.top-4.right-4 { display: none !important; }
              .bg-gradient-to-r.from-yellow-400.to-yellow-500 { display: none !important; }
            </style>
          </head>
          <body>
            <div style="width: 210mm; min-height: 297mm; margin: 0 auto; background: white; transform-origin: top center;">
              ${previewHtml}
            </div>
          </body>
        </html>
      `;
      
      await page.setContent(htmlContent, {
        waitUntil: ['networkidle0', 'domcontentloaded'],
        timeout: 30000
      });

      // Sayfanın tam yüklenmesini bekle
      await new Promise(resolve => setTimeout(resolve, 2000));

      // PDF oluştur (screenshot yaklaşımı ile)
      pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '0mm',
          right: '0mm',
          bottom: '0mm',
          left: '0mm'
        },
        displayHeaderFooter: false,
        scale: 1,
        preferCSSPageSize: true,
        omitBackground: false
      });
    } else {
      // Fallback - AI chat sayfasına git
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const previewUrl = `${baseUrl}/create-cv/ai-chat`;
      
      await page.goto(previewUrl, {
        waitUntil: ['networkidle0', 'domcontentloaded'],
        timeout: 30000
      });

      // CV data'yı sayfaya inject et
      await page.evaluate((data) => {
        localStorage.setItem('currentCvData', JSON.stringify(data));
        window.location.reload();
      }, cvData);

      await page.waitForNavigation({ 
        waitUntil: ['networkidle0', 'domcontentloaded'],
        timeout: 30000 
      });

      // CV container'ının yüklenmesini bekle
      await page.waitForSelector('[data-cv-content]', { 
        timeout: 10000 
      });

      // Tailwind CSS'in yüklenmesini bekle
      await new Promise(resolve => setTimeout(resolve, 3000));

      // PDF oluştur
      pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '0mm',
          right: '0mm',
          bottom: '0mm',
          left: '0mm'
        },
        displayHeaderFooter: false,
        scale: 1,
        preferCSSPageSize: true,
        omitBackground: false
      });
    }

    await browser.close();



    // Buffer boyutunu kontrol et
    if (pdfBuffer.length > 10 * 1024 * 1024) { // 10MB limit
      return NextResponse.json({
        success: false,
        error: 'Generated PDF too large'
      }, { status: 413 });
    }

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="cv.pdf"',
      },
    });
    
  } catch (error) {

    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate PDF'
    }, { status: 500 });
  }
}
