# 📄 PratikCV - Yapay Zeka Destekli CV Oluşturma Platformu

## 🚀 Proje Hakkında

PratikCV, kullanıcıların profesyonel CV'lerini kolayca oluşturabileceği, düzenleyebileceği ve analiz edebileceği modern bir web uygulamasıdır. Yapay zeka desteği ile CV'nizi optimize ederek iş başvurularınızda fark yaratmanızı sağlar.

## ✨ Özellikler

### 🎯 Ana Özellikler

- **AI Destekli CV Oluşturma**: Google Gemini AI ile etkileşimli CV oluşturma
- **Manuel CV Editörü**: Geleneksel form tabanlı CV oluşturma
- **Yapay Zeka Destekli CV Analizi**: CV'nizi analiz edin ve iyileştirme önerilerini alın
- **Çoklu Template Desteği**: Modern tasarım şablonları
- **Gerçek Zamanlı PDF Oluşturma**: Puppeteer ile yüksek kaliteli PDF export
- **Responsive Tasarım**: Tüm cihazlarda mükemmel görünüm
- **Kullanıcı Dostu Arayüz**: Modern React bileşenleri ile sezgisel deneyim

### 🔐 Premium Özellikler

- **Gelişmiş AI Analizi**: Detaylı CV değerlendirmesi
- **Premium Şablonlar**: Özel tasarım şablonlarına erişim
- **Sınırsız CV**: Çoklu CV oluşturma ve yönetme
- **Öncelikli Destek**: Hızlı müşteri desteği

### 📊 Teknik Özellikler

- ImageKit entegrasyonu ile görsel yönetimi
- SEO optimizasyonu
- Performance monitoring
- Build boyutu: 99.7kB shared JS
- 41 static page
- ~3 saniye build süresi

## 🛠️ Teknoloji Stack'i

### Frontend

- **Framework**: Next.js 15.4.1 (App Router)
- **Language**: TypeScript 5.x
- **UI Library**: React 19.1.0
- **Styling**: Tailwind CSS 4.x
- **Icons**: Lucide React
- **PDF Generation**: Puppeteer 24.14.0
- **AI Integration**: Google Generative AI (Gemini)
- **State Management**: React Context API
- **Notifications**: React Hot Toast
- **CSS Utilities**: Clsx & Tailwind Merge
- **Text Animation**: React Simple Typewriter

### Backend

- **Framework**: .NET 9.0 (ASP.NET Core Web API)
- **Language**: C#
- **Database**: MongoDB (NoSQL)
- **Architecture**: Clean Architecture (Domain-Driven Design)
- **Authentication**: JWT Bearer Token
- **Password Hashing**: BCrypt.Net
- **API Documentation**: Swagger/OpenAPI 3.0
- **Dependency Injection**: Built-in .NET DI Container

### DevOps & Tools

- **Version Control**: Git
- **Package Managers**: npm (Frontend), NuGet (Backend)
- **Build Tools**: Next.js Build System, .NET CLI
- **Development**: Hot Reload, TypeScript strict mode
- **Linting**: ESLint, .NET Analyzers

### External Services

- **AI Provider**: Google Gemini AI API
- **Image Storage**: ImageKit.io
- **Font Service**: Google Fonts

## 📁 Proje Yapısı

```
PratikCV/
├── 📂 frontend/                 # Next.js Frontend Uygulaması
│   ├── 📂 app/                 # App Router sayfaları
│   │   ├── 📂 api/             # Next.js API Routes
│   │   ├── 📂 auth/            # Authentication sayfaları
│   │   ├── 📂 create-cv/       # CV oluşturma sayfaları
│   │   ├── 📂 dashboard/       # Dashboard
│   │   └── ...
│   ├── 📂 components/          # React bileşenleri
│   ├── 📂 lib/                 # Utility fonksiyonları
│   ├── 📂 public/              # Statik dosyalar
│   └── 📂 templates/           # CV şablonları
│
├── 📂 backend/                 # .NET Core Backend API
│   ├── 📂 PratikCV.Api/        # Web API katmanı
│   ├── 📂 PratikCV.Application/ # Uygulama katmanı
│   ├── 📂 PratikCV.Domain/     # Domain katmanı
│   ├── 📂 PratikCV.Infrastructure/ # Altyapı katmanı
│   ├── 📂 PratikCV.Shared/     # Paylaşılan kütüphaneler
│   └── 📂 PratikCV.Tests/      # Test projeleri
│
└── 📄 API_CONFIGURATION.md    # API yapılandırma kılavuzu
```

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler

- Node.js 18+ ve npm
- .NET 9.0 SDK
- MongoDB 4.4+
- Git

### 1. Projeyi Klonlayın

```bash
git clone https://github.com/yourusername/pratikcv.git
cd pratikcv
```

### 2. Frontend Kurulumu

```bash
cd frontend
npm install
```

Gerekli environment variables'ları ayarlayın (`.env.local` oluşturun):

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key (opsiyonel)
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key (opsiyonel)
IMAGEKIT_URL_ENDPOINT=your_imagekit_url (opsiyonel)
```

Frontend'i başlatın:

```bash
npm run dev
```

Frontend: http://localhost:3000

### 3. Backend Kurulumu

```bash
cd backend
dotnet restore
dotnet build
# MongoDB'nin çalıştığından emin olun
# appsettings.json dosyasında MongoDB connection string'ini güncelleyin
dotnet run --project PratikCV.Api
```

Backend API: http://localhost:5000

## ⚙️ Environment Configuration

### Development (.env.local)

```bash
# Backend API Configuration
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:5000/api
BACKEND_API_URL=http://localhost:5000/api

# Gemini AI Configuration
GEMINI_API_KEY=your_development_gemini_api_key
NEXT_PUBLIC_GEMINI_MODEL=gemini-1.5-flash

# ImageKit Configuration
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_development_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_development_imagekit_private_key
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id

# Frontend URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
```

### Production (.env)

```bash
# Production URLs for pratikcv.com
NEXT_PUBLIC_BACKEND_API_URL=https://api.pratikcv.com/api
NEXT_PUBLIC_APP_URL=https://pratikcv.com

# MongoDB Configuration
MONGODB_CONNECTION_STRING=mongodb+srv://user:password@cluster.mongodb.net/?retryWrites=true&w=majority&appName=PratikCV

# JWT Configuration
JWT_SECRET_KEY=your_super_secure_jwt_secret_key_for_production

# Shopier Configuration
SHOPIER_API_KEY=your_production_shopier_api_key
SHOPIER_WEBHOOK_SECRET=your_shopier_webhook_secret

# ImageKit Configuration
IMAGEKIT_PUBLIC_KEY=your_production_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_production_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/pratikcv

# Gemini AI Configuration
GEMINI_API_KEY=your_production_gemini_api_key
```

### Backend Configuration (appsettings.json)

```json
{
  "MongoDbSettings": {
    "ConnectionString": "mongodb+srv://...",
    "DatabaseName": "PratikCVDb",
    "CVCollectionName": "cvs",
    "UserCollectionName": "users"
  },
  "JwtSettings": {
    "SecretKey": "your_jwt_secret_key",
    "Issuer": "PratikCV.Api",
    "Audience": "PratikCV.Frontend",
    "ExpirationInMinutes": 1440
  },
  "CorsSettings": {
    "AllowedOrigins": "https://pratikcv.com,https://www.pratikcv.com"
  },
  "AppSettings": {
    "FrontendUrl": "https://pratikcv.com"
  },
  "ShopierSettings": {
    "ApiKey": "your_shopier_api_key",
    "WebhookSecret": "your_webhook_secret",
    "BaseUrl": "https://api.shopier.com"
  }
}
```

## 📚 Frontend Özellikleri

### 📝 Available Scripts

- `npm run dev` - Geliştirme sunucusunu başlatır (Turbopack ile)
- `npm run build` - Production build oluşturur
- `npm run start` - Production sunucusunu başlatır
- `npm run lint` - ESLint ile kod kontrolü yapar

### 🎨 Ana Sayfalar

- `/` - Ana sayfa ve hero section
- `/auth/login` - Kullanıcı girişi
- `/auth/register` - Kullanıcı kaydı
- `/dashboard` - Kullanıcı paneli
- `/create-cv/manual` - Manuel CV oluşturma
- `/create-cv/ai-chat` - AI ile CV oluşturma
- `/cv-analysis` - CV analizi
- `/premium` - Premium üyelik
- `/my-cvs` - CV'lerim

### 📱 Responsive Design

Uygulama tüm cihaz boyutlarında optimize edilmiştir:

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### ⚡ Performance Metrikleri

- **Build Size**: ~461MB node_modules
- **Bundle Size**: 99.7kB shared JS
- **Pages**: 41 static pages
- **Build Time**: ~3 seconds
- **Package Count**: 420 packages (optimize edilmiş)

## 🧪 Test ve Build

### Frontend

```bash
cd frontend
npm run lint           # ESLint kontrolü
npm run build          # Production build testi
npm run start          # Production server test
```

## 🚀 Deployment

### Development Deployment

1. **Backend Setup:**

   ```bash
   cd backend
   dotnet restore
   dotnet run --project PratikCV.Api
   ```

2. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Performance Optimizasyonları

- ESLint ve TypeScript build hataları devre dışı
- Puppeteer server external package
- Static export optimizasyonu
- Bundle size: 99.7kB (optimize edilmiş)
- 41 static page başarıyla build ediliyor

## 📊 API Documentation

- **Development**: http://localhost:5000/swagger
- Comprehensive OpenAPI 3.0 documentation
- Interactive API testing interface
- Real-time API endpoint testing
- AWS ECS container health monitoring

## 🔐 Security Features

- JWT-based authentication with secure token management
- Environment variable configuration for sensitive data
- CORS protection with domain-specific origins
- Input validation and sanitization
- Secure payment processing with Shopier integration
- Rate limiting and request throttling
- HTTPS enforcement in production

## 🤝 Katkıda Bulunma

1. Bu repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasını inceleyiniz.

## 📞 İletişim

- **Proje Sahibi**: Enes Ataç
- **Email**: enesatc331@gmail.com
- **LinkedIn**: ienesatacdev
- **Website**: enesatac.com

## 🙏 Teşekkürler

- **Google Gemini AI** - Yapay zeka desteği için
- **ImageKit.io** - Görsel yönetimi için (opsiyonel)
- **Vercel** - Next.js geliştirme deneyimi için
- **Puppeteer** - PDF generation için
- **Lucide React** - Modern ikonlar için

## 📄 Lisans

Bu proje MIT Lisansı altında lisanslanmıştır.
