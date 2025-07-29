import { NextRequest, NextResponse } from 'next/server';
import { PDFGenerator } from '@/lib/pdf-generator';

export async function POST(request: NextRequest) {
  try {
    const { cvData, templateId } = await request.json();

    if (!cvData) {
      return NextResponse.json(
        { error: 'CV data is required' },
        { status: 400 }
      );
    }

    // Generate PDF and return as base64 thumbnail
    const pdfBuffer = await PDFGenerator.generatePDF(cvData, { templateId: templateId || 'modern' });
    
    // Return PDF as base64 for thumbnail purposes
    const base64Pdf = pdfBuffer.toString('base64');
    
    return NextResponse.json({
      success: true,
      thumbnail: `data:application/pdf;base64,${base64Pdf}`
    });
  } catch (error) {

    return NextResponse.json(
      { error: 'Failed to generate thumbnail' },
      { status: 500 }
    );
  }
}
