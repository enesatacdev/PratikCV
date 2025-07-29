import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    
    if (!privateKey) {
      return NextResponse.json(
        { error: 'ImageKit private key not configured' },
        { status: 500 }
      );
    }

    // Generate authentication parameters
    const token = crypto.randomUUID();
    const expire = Math.floor(Date.now() / 1000) + 2400; // 40 minutes from now
    
    // Create signature
    const signature = crypto
      .createHmac('sha1', privateKey)
      .update(token + expire)
      .digest('hex');

    return NextResponse.json({
      token,
      expire,
      signature,
    });
  } catch (error) {

    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
