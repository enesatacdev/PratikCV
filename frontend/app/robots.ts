import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/profile',
          '/my-cvs',
          '/cv-preview/',
          '/api/',
          '/admin/',
          '/_next/',
          '/auth/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/dashboard',
          '/profile', 
          '/my-cvs',
          '/cv-preview/',
          '/api/',
          '/admin/',
        ],
      },
    ],
    sitemap: 'https://pratikcv.com/sitemap.xml',
    host: 'https://pratikcv.com',
  }
}
