import Script from 'next/script';

interface StructuredDataProps {
  type: 'website' | 'faq' | 'organization' | 'breadcrumbList' | 'product';
  data: any;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const getStructuredData = () => {
    const baseData = {
      '@context': 'https://schema.org',
    };

    switch (type) {
      case 'website':
        return {
          ...baseData,
          '@type': 'WebSite',
          name: 'PratikCV',
          alternateName: 'Pratik CV Oluşturucu',
          url: 'https://pratikcv.com',
          description: 'Ücretsiz CV oluşturucu ve İş başvuru aracı',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://pratikcv.com/search?q={search_term_string}',
            'query-input': 'required name=search_term_string',
          },
          ...data,
        };

      case 'organization':
        return {
          ...baseData,
          '@type': 'Organization',
          name: 'PratikCV',
          url: 'https://pratikcv.com',
          logo: 'https://pratikcv.com/logo.png',
          description: 'AI destekli CV oluşturucu platform',
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+90-XXX-XXX-XXXX',
            contactType: 'customer service',
            availableLanguage: ['Turkish', 'English'],
          },
          sameAs: [
            'https://twitter.com/pratikcv',
            'https://linkedin.com/company/pratikcv',
          ],
          ...data,
        };

      case 'faq':
        return {
          ...baseData,
          '@type': 'FAQPage',
          mainEntity: data.questions?.map((q: any) => ({
            '@type': 'Question',
            name: q.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: q.answer,
            },
          })) || [],
        };

      case 'breadcrumbList':
        return {
          ...baseData,
          '@type': 'BreadcrumbList',
          itemListElement: data.items?.map((item: any, index: number) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@id': item.url,
              name: item.name,
            },
          })) || [],
        };

      case 'product':
        return {
          ...baseData,
          '@type': 'Product',
          name: 'PratikCV Premium',
          description: 'Gelişmiş CV oluşturma özellikleri ve premium şablonlar',
          brand: {
            '@type': 'Brand',
            name: 'PratikCV',
          },
          offers: {
            '@type': 'Offer',
            price: data.price || '0',
            priceCurrency: 'TRY',
            availability: 'https://schema.org/InStock',
          },
          ...data,
        };

      default:
        return { ...baseData, ...data };
    }
  };

  return (
    <Script
      id={`structured-data-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getStructuredData()),
      }}
    />
  );
}
