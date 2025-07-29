# PratikCV - AI Destekli CV Oluşturma Platformu

PratikCV, yapay zeka teknolojisi ile profesyonel CV'ler oluşturmanızı sağlayan modern bir web uygulamasıdır. Kullanıcılar hem manuel olarak hem de AI chatbot ile etkileşimli şekilde CV'lerini oluşturabilir, analiz edebilir ve PDF formatında indirebilirler.

## 🚀 Özellikler

### Temel Özellikler

- **AI Destekli CV Oluşturma**: Gemini AI ile etkileşimli CV oluşturma
- **Manuel CV Editörü**: Geleneksel form tabanlı CV oluşturma
- **CV Analizi**: AI ile CV'nizin güçlü ve zayıf yönlerini analiz etme
- **PDF Export**: Profesyonel PDF formatında CV indirme
- **Çoklu Template**: Farklı CV şablonları arasından seçim
- **Responsive Tasarım**: Mobil ve masaüstü uyumlu

### Premium Özellikler

- **Gelişmiş AI Analizi**: Detaylı CV değerlendirmesi
- **Premium Şablonlar**: Özel tasarım şablonlarına erişim
- **Sınırsız CV**: Çoklu CV oluşturma ve yönetme
- **Öncelikli Destek**: Hızlı müşteri desteği

## 🛠️ Teknoloji Stack

### Frontend

- **Next.js 15.4.1** - React framework
- **React 19.1.0** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Styling
- **Lucide React** - Icons

### AI & Services

- **Google Gemini AI** - AI chat ve analiz
- **Puppeteer** - PDF generation
- **ImageKit** - Image management

### Utilities

- **React Hot Toast** - Notifications
- **Clsx & Tailwind Merge** - CSS utilities
- **React Simple Typewriter** - Text animations

## 📦 Kurulum

### Gereksinimler

- Node.js 18.0 veya üzeri
- npm veya yarn package manager

### Kurulum Adımları

1. Repository'yi klonlayın:

```bash
git clone <repository-url>
cd PratikCV/frontend
```

2. Bağımlılıkları yükleyin:

```bash
npm install
```

3. Environment variables'ları ayarlayın:

```bash
cp .env.example .env.local
```

4. Gerekli API anahtarlarını `.env.local` dosyasına ekleyin:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url
```

5. Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

Uygulamanız [http://localhost:3000](http://localhost:3000) adresinde çalışacaktır.

## 📝 Available Scripts

- `npm run dev` - Geliştirme sunucusunu başlatır (Turbopack ile)
- `npm run build` - Production build oluşturur
- `npm run start` - Production sunucusunu başlatır
- `npm run lint` - ESLint ile kod kontrolü yapar

## 🏗️ Proje Yapısı

```
frontend/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── create-cv/         # CV creation pages
│   ├── dashboard/         # User dashboard
│   └── ...
├── components/            # Reusable components
│   ├── ui/               # UI components
│   ├── cv/               # CV specific components
│   └── ...
├── lib/                  # Utilities and services
│   ├── api.ts            # API client
│   ├── auth-context.tsx  # Authentication context
│   ├── gemini-ai.ts      # AI services
│   └── ...
├── public/               # Static assets
└── templates/            # CV templates
```

## 🎨 Ana Sayfalar

- `/` - Ana sayfa ve hero section
- `/auth/login` - Kullanıcı girişi
- `/auth/register` - Kullanıcı kaydı
- `/dashboard` - Kullanıcı paneli
- `/create-cv/manual` - Manuel CV oluşturma
- `/create-cv/ai-chat` - AI ile CV oluşturma
- `/cv-analysis` - CV analizi
- `/premium` - Premium üyelik
- `/my-cvs` - CV'lerim

## 🔧 Konfigürasyon

### Next.js Konfigürasyonu

- ESLint ve TypeScript hataları build sırasında ignore edilir
- Puppeteer server external package olarak ayarlanmıştır
- Static export ve optimizasyon ayarları yapılmıştır

### Tailwind CSS

- Custom variant'lar ve theme konfigürasyonu
- Responsive breakpoint'ler
- Custom color palette

## 📱 Responsive Design

Uygulama tüm cihaz boyutlarında optimize edilmiştir:

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## 🚀 Deployment

### Vercel Deployment

```bash
npm run build
```

### Docker Deployment

```dockerfile
# Dockerfile örneği mevcut değil, manuel deployment önerilir
```

## 🤝 Katkı Sağlama

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Branch'i push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🔗 Links

- **Production**: [PratikCV.com](https://pratikcv.com)
- **Documentation**: [Docs](https://docs.pratikcv.com)
- **Support**: [Destek](mailto:support@pratikcv.com)

## ⚡ Performance

- **Build Size**: ~461MB node_modules
- **Bundle Size**: 99.7kB shared JS
- **Pages**: 41 static pages
- **Build Time**: ~3 seconds

---

**PratikCV** ile profesyonel CV'nizi dakikalar içinde oluşturun! 🎯
