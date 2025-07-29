import { NextRequest, NextResponse } from 'next/server';
import { PDFGenerator } from '@/lib/pdf-generator';

export async function POST(request: NextRequest) {
  try {
    const { templateId = 'modern', cvData } = await request.json();
    
    if (!cvData) {
      return NextResponse.json({
        success: false,
        error: 'CV data is required'
      }, { status: 400 });
    }
    
    // Generate PDF first, then convert to image
    const pdfBuffer = await PDFGenerator.generatePDF(cvData, { templateId });
    
    // Return PDF buffer as base64 for preview purposes
    const base64Pdf = pdfBuffer.toString('base64');
    
    return NextResponse.json({
      success: true,
      pdf: `data:application/pdf;base64,${base64Pdf}`
    });
    
  } catch (error) {

    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate preview'
    }, { status: 500 });
  }
}
