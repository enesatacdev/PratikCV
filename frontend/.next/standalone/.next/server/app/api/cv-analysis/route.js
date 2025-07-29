(()=>{var a={};a.id=1312,a.ids=[1312],a.modules={261:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/app-paths")},3295:a=>{"use strict";a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},29294:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},44870:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},63033:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},67731:(a,b,c)=>{"use strict";c.r(b),c.d(b,{handler:()=>D,patchFetch:()=>C,routeModule:()=>y,serverHooks:()=>B,workAsyncStorage:()=>z,workUnitAsyncStorage:()=>A});var d={};c.r(d),c.d(d,{GET:()=>v,POST:()=>w});var e=c(96559),f=c(48088),g=c(37719),h=c(26191),i=c(81289),j=c(261),k=c(92603),l=c(39893),m=c(14823),n=c(47220),o=c(66946),p=c(47912),q=c(99786),r=c(46143),s=c(86439),t=c(43365),u=c(32190);async function v(){return u.NextResponse.json({message:"CV Analysis API is working",method:"GET",timestamp:new Date().toISOString()})}async function w(a){let b={},c="",d="",e="cv-data";try{let f=await a.json();b=f.cvData||{},c=f.pdfUrl||"",d=f.cvId||"",e=f.analysisType||"cv-data";let g=process.env.GEMINI_API_KEY;if(!g)throw Error("Gemini API key not configured");let h={};if("pdf-upload"===e&&c)try{let a;if(c.startsWith("data:")){let b=c.indexOf("base64,");if(-1===b)throw Error("Ge\xe7ersiz data URL formatı");a=c.substring(b+7)}else{let b=await fetch(c,{method:"GET",headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",Accept:"application/pdf,*/*"}});if(!b.ok)throw Error(`PDF dosyası ImageKit'ten alınamadı: ${b.status} - ${b.statusText}`);let d=await b.arrayBuffer();if(0===d.byteLength)throw Error("PDF dosyası boş");a=Buffer.from(d).toString("base64")}h={contents:[{parts:[{text:`Sen bir ATS (Applicant Tracking System) uzmanısın. Verilen PDF CV'yi TAMAMEN okuyup analiz et.

G\xd6REV: PDF'den t\xfcm kişisel bilgileri ve CV i\xe7eriğini \xe7ıkarıp ATS uyumluluğuna g\xf6re analiz et.

\xd6NCELİKLE PDF'DEN \xc7ıKAR:
1. KİŞİSEL BİLGİLER:
   - Ad Soyad (tam isim)
   - E-posta adresi
   - Telefon numarası
   - Adres bilgileri
   - Doğum tarihi (varsa)
   - LinkedIn profili (varsa)
   - Web sitesi (varsa)

2. İŞ DENEYİMLERİ:
   - Şirket adları
   - Pozisyon isimleri
   - \xc7alışma tarihleri (başlangı\xe7-bitiş)
   - İş tanımları ve sorumlulukları
   - Başarılar ve projeler

3. EĞİTİM BİLGİLERİ:
   - Okul/\xdcniversite adları
   - B\xf6l\xfcm/Alan
   - Mezuniyet tarihleri
   - Not ortalaması (varsa)
   - Sertifikalar

4. YETENEKLER:
   - Teknik beceriler
   - Kişisel \xf6zellikler
   - Dil bilgileri
   - Programlama dilleri
   - Yazılım bilgileri

5. DİĞER:
   - Projeler
   - Sertifikalar
   - Hobi ve ilgi alanları
   - Referanslar

SONRA ATS ANALİZİ YAP:

1. ATS TEMEL GEREKSİNİMLER (Kritik - %50):
   ✓ İletişim bilgileri ATS'nin okuyabileceği konumda mı?
   ✓ Standart b\xf6l\xfcm başlıkları ("Work Experience", "Education", "Skills") var mı?
   ✓ Kronolojik sıralama doğru mu? (En yeni \xfcstte)
   ✓ Tarihler standardize mi? (MM/YYYY formatı)

2. ATS ANAHTAR KELİME TARAMA (%30):
   ✓ Pozisyon i\xe7in gerekli teknik terimler mevcut mu?
   ✓ Action verbs (managed, developed, created) kullanılmış mı?
   ✓ Sekt\xf6r standart kavramları var mı?
   ✓ Beceriler ayrı b\xf6l\xfcmde listelenmiş mi?

3. ATS FORMAT UYUMLULUĞU (%20):
   ✓ Metin se\xe7ilebilir mi? (Taranmış g\xf6r\xfcnt\xfc değil)
   ✓ Tablolar, grafikler ATS okumayı engelliyor mu?
   ✓ Font ATS uyumlu mu? (Arial, Calibri gibi standart fontlar)
   ✓ Karmaşık kolon d\xfczeni var mı? (ATS karıştırır)

ATS PUANLAMA \xd6L\xc7EĞİ:
🤖 90-100: ATS M\xdcKEMMEL - T\xfcm sistemlerden ge\xe7er
🤖 70-89: ATS İYİ - \xc7oğu sistemde kabul
🤖 50-69: ATS ORTA - Bazı sistemlerde sorun
🤖 30-49: ATS ZAYIF - \xc7oğu sistemde elenir
🤖 0-29: ATS UYUMSUZ - Sistemler okuyamaz

SONUCU ŞU FORMATTA VER:

{
  "overall_score": ATS_UYUMLULUK_PUANI,
  "summary": "ATS sistemleri bu CV'yi nasıl değerlendiriecek",
  "extracted_data": {
    "personal_info": {
      "full_name": "\xc7ıkarılan ad soyad",
      "email": "\xc7ıkarılan e-posta",
      "phone": "\xc7ıkarılan telefon",
      "address": "\xc7ıkarılan adres",
      "birth_date": "\xc7ıkarılan doğum tarihi",
      "linkedin": "LinkedIn profili",
      "website": "Web sitesi"
    },
    "work_experience": [
      {
        "company": "Şirket adı",
        "position": "Pozisyon",
        "start_date": "Başlangı\xe7 tarihi",
        "end_date": "Bitiş tarihi", 
        "description": "İş tanımı ve sorumlulukları"
      }
    ],
    "education": [
      {
        "school": "Okul/\xdcniversite adı",
        "degree": "Derece/B\xf6l\xfcm",
        "field": "Alan",
        "start_date": "Başlangı\xe7",
        "end_date": "Bitiş",
        "gpa": "Not ortalaması"
      }
    ],
    "skills": {
      "technical": ["Teknik beceriler listesi"],
      "personal": ["Kişisel \xf6zellikler listesi"],
      "languages": ["Dil bilgileri"]
    },
    "certifications": ["Sertifikalar listesi"],
    "projects": ["Projeler listesi"]
  },
  "sections": {
    "personal_info": {"score": 0-100, "feedback": "Kişisel bilgiler değerlendirmesi"},
    "experience": {"score": 0-100, "feedback": "İş deneyimi değerlendirmesi"},
    "education": {"score": 0-100, "feedback": "Eğitim bilgileri değerlendirmesi"},
    "skills": {"score": 0-100, "feedback": "Yetenekler değerlendirmesi"},
    "ats_compatibility": {"score": 0-100, "feedback": "ATS uyumluluk değerlendirmesi"}
  },
  "strengths": ["ATS sistemlerin kolayca işleyebileceği \xf6zellikler"],
  "weaknesses": ["ATS sistemlerin zorlanacağı veya başarısız olacağı kısımlar"],
  "suggestions": ["ATS ge\xe7iş oranını artırmak i\xe7in kritik değişiklikler"],
  "ats_analysis": {
    "parsing_success_rate": "ATS CV ayrıştırma başarı oranı: %XX",
    "keyword_density": "Anahtar kelime yoğunluğu ATS i\xe7in yeterli mi?",
    "section_detection": "ATS b\xf6l\xfcm tanıma başarısı",
    "contact_extraction": "ATS iletişim bilgisi \xe7ıkarma kabiliyeti",
    "experience_chronology": "ATS deneyim sıralama başarısı",
    "skills_identification": "ATS beceri listesi tanıma",
    "overall_ats_score": ATS_TOPLAM_PUAN,
    "system_compatibility": {
      "workday": "Workday ATS uyumluluğu",
      "greenhouse": "Greenhouse ATS uyumluluğu", 
      "lever": "Lever ATS uyumluluğu",
      "successfactors": "SAP SuccessFactors uyumluluğu"
    },
    "pass_probability": "İlk ATS eleme ge\xe7iş olasılığı: %XX",
    "recommendations": [
      "1. En kritik ATS uyumluluk \xf6nerisi",
      "2. İkincil ATS optimizasyon \xf6nerisi",
      "3. \xdc\xe7\xfcnc\xfc \xf6ncelik ATS iyileştirmesi",
      "4. D\xf6rd\xfcnc\xfc ATS geliştirme \xf6nerisi",
      "5. Beşinci ATS uyumluluk tavsiyesi"
    ]
  },
  "industry_ats_match": "Hangi sekt\xf6r ATS sistemleri i\xe7in optimize",
  "competitive_advantage": "ATS ortamında rekabet avantajı",
  "critical_issues": ["ATS sistemlerin kesinlikle başarısız olacağı alanlar"],
  "ats_optimization_priority": [
    "1. En kritik ATS uyumluluk sorunu",
    "2. İkincil ATS problemi", 
    "3. \xdc\xe7\xfcnc\xfc \xf6ncelik ATS sorunu"
  ],
  "ats_compatibility": "GENEL ATS DEĞERLENDİRME: [M\xdcKEMMEL/İYİ/KABUL EDİLEBİLİR/ZAYIF/UYUMSUZ]"
}

🚨 \xd6NEMLİ: CV'yi tamamen ATS sisteminin g\xf6z\xfcnden değerlendir! 
İnsan okuyucusu değil, algoritma ve makine \xf6ğrenmesi modelleri bu CV'yi nasıl işler?`},{inline_data:{mime_type:"application/pdf",data:a}}]}],generationConfig:{temperature:.3,maxOutputTokens:4096}}}catch(a){throw Error(`PDF işleme hatası: ${a instanceof Error?a.message:"Bilinmeyen hata"}`)}else if("existing-cv"===e&&d){let a=await fetch(`http://localhost:5000/api/cv/${d}`,{headers:{"Content-Type":"application/json"}});if(!a.ok){let b=await a.text();throw Error(`CV verisi alınamadı: ${a.status} - ${b}`)}let b=await a.json();h={contents:[{parts:[{text:x(b)}]}],generationConfig:{temperature:.3,maxOutputTokens:4096}}}else h={contents:[{parts:[{text:x(b)}]}],generationConfig:{temperature:.3,maxOutputTokens:4096}};let i=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${g}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(h)});if(!i.ok){let a=await i.text();throw Error(`Gemini API error: ${i.status} - ${a}`)}let j=await i.json();if(!j.candidates||!Array.isArray(j.candidates)||0===j.candidates.length)throw Error("Invalid Gemini response structure: no candidates");let k=j.candidates[0];if(!k.content||!k.content.parts||!Array.isArray(k.content.parts)||0===k.content.parts.length)throw Error("Invalid Gemini response structure: no content parts");let l=k.content.parts[0]?.text;if(!l)throw Error("No response from Gemini AI");try{let a=l.trim();a.startsWith("```json")&&(a=a.replace(/```json\s*/g,"").replace(/```\s*$/g,"")),a.startsWith("```")&&(a=a.replace(/```\s*/g,"").replace(/```\s*$/g,""));let b=(a=a.replace(/^[^{]*/,"").replace(/[^}]*$/,"")).match(/\{[\s\S]*\}/);b&&(a=b[0]),a=a.replace(/##\s*[^{]*?(?=\{|$)/g,"").replace(/:\s*"([^"]*)\n([^"]*)"([,\s]*)/g,': "$1 $2"$3').replace(/,(\s*[}\]])/g,"$1").replace(/\n\s*/g," ").replace(/\s+/g," ").replace(/#/g,"");let c=0,d=!1,e=!1,f=a.length;for(let b=0;b<a.length;b++){let g=a[b];if(e){e=!1;continue}if("\\"===g){e=!0;continue}if('"'===g&&!e){d=!d;continue}if(!d){if("{"===g)c++;else if("}"===g&&(c--,0===c)){f=b+1;break}}}if(c>0)for(let b=0;b<c;b++)a+="}";else 0===c&&f<a.length&&(a=a.substring(0,f));let g=JSON.parse(a);return u.NextResponse.json({success:!0,analysis:g,timestamp:new Date().toISOString()})}catch(a){return u.NextResponse.json({success:!0,analysis:{overall_score:75,summary:l?.substring(0,500)+(l?.length>500?"...":""),extracted_data:{personal_info:{full_name:"Bilgi PDF'den \xe7ıkarılamadı",email:"",phone:"",address:"",birth_date:"",linkedin:"",website:""},work_experience:[],education:[],skills:{technical:[],personal:[],languages:[]},certifications:[],projects:[]},sections:{personal_info:{score:80,feedback:"Kişisel bilgiler değerlendirildi"},experience:{score:75,feedback:"İş deneyimi incelendi"},education:{score:80,feedback:"Eğitim bilgileri uygun"},skills:{score:70,feedback:"Yetenekler listelendi"},ats_compatibility:{score:72,feedback:"ATS uyumluluğu değerlendirildi"}},ats_analysis:{overall_ats_score:72,overall_score:72,keyword_density:"Orta",section_recognition:"İyi",section_detection:"Başarılı",contact_extraction:"Uygun",formatting:"Standart",format_parsing:"Uyumlu",pass_probability:"%75",parsing_success_rate:"CV başarıyla işlendi",recommendations:["\uD83C\uDFAF İş ilanındaki anahtar kelimeleri CV'nizde kullanın (React, Node.js, Python gibi)","\uD83D\uDCCB Standart b\xf6l\xfcm başlıkları kullanın: İş Deneyimi, Eğitim, Yetenekler, İletişim","\uD83D\uDCC4 CV'yi PDF formatında kaydedin - Word belgeleri ATS'de problem yaratır","\uD83D\uDEAB Karmaşık tablolar, grafikler ve \xe7ok s\xfctunlu d\xfczenlerden ka\xe7ının","⚡ İş a\xe7ıklamalarında g\xfc\xe7l\xfc eylem fiilleri kullanın (achieved, managed, developed)","\uD83D\uDCBB Sekt\xf6r\xfcn\xfcze \xf6zel teknik terimleri dahil edin (.NET, JavaScript, SQL)","\uD83D\uDD24 Standart fontlar kullanın: Arial, Calibri, Times New Roman (10-12pt)","\uD83D\uDCCF CV'yi 1-2 sayfa ile sınırlayın - uzun CV'ler ATS'de kaybolur","✉️ İletişim bilgilerini header'da net şekilde belirtin","\uD83D\uDCDD Her iş deneyimi i\xe7in 2-4 maddelik a\xe7ıklama yazın"]},ats_compatibility:"CV, \xe7oğu ATS sistemi tarafından başarıyla işlenebilir",strengths:["Genel yapı uygun","Temel bilgiler mevcut"],weaknesses:["Detaylı analiz tamamlanamadı"],suggestions:["Tekrar analiz i\xe7in dosyayı yeniden y\xfckleyin"]},timestamp:new Date().toISOString(),note:"Fallback analiz kullanıldı"})}}catch(a){return u.NextResponse.json({success:!1,error:"CV analizi sırasında bir hata oluştu. L\xfctfen tekrar deneyin.",details:a instanceof Error?a.message:"Bilinmeyen hata",analysisType:e,timestamp:new Date().toISOString()},{status:500})}}function x(a){let b=a?.personalInfo||{},c=b.fullName&&b.fullName.trim().length>0,d=b.phones&&b.phones.length>0,e=b.emails&&b.emails.length>0,f=b.address&&b.address.trim().length>0;b.birthday&&b.birthday.trim().length;let g=a?.experience||[],h=g.some(a=>a.description&&a.description.trim().length>10&&a.startDate&&a.startDate.trim().length>0),i=(a?.education||[]).some(a=>a.startDate&&a.startDate.trim().length>0&&a.endDate&&a.endDate.trim().length>0&&a.department&&a.department.trim().length>0),j=a?.skills||{},k=j.technical&&j.technical.length>0,l=j.personal&&j.personal.length>0,m=j.languages&&j.languages.length>0,n=100,o=[];c||(n-=15,o.push("Ad Soyad")),d||(n-=15,o.push("Telefon Numarası")),e||(n-=15,o.push("E-posta Adresi")),h||(n-=20,o.push("Detaylı İş Deneyimi")),i||(n-=10,o.push("Detaylı Eğitim Bilgisi")),k||(n-=10,o.push("Teknik Beceriler")),f||(n-=5,o.push("Adres Bilgisi")),l||(n-=5,o.push("Kişisel Beceriler")),m||(n-=5,o.push("Dil Becerileri"));let p=Math.max(10,n);return`CV uzmanı olarak aşağıdaki CV'yi TAMAMEN ATS (Applicant Tracking System) UYUMLULUĞUNA g\xf6re analiz et.

ATS UYUMLULUK ANALİZİ:
Kişisel Bilgiler (ATS Kritik):
- Ad Soyad: ${c?"✓ ATS UYUMLU":"✗ ATS CRİTİK EKSİK"}
- Telefon: ${d?"✓ ATS UYUMLU":"✗ ATS CRİTİK EKSİK"}
- Email: ${e?"✓ ATS UYUMLU":"✗ ATS CRİTİK EKSİK"}  
- Adres: ${f?"✓ ATS UYUMLU":"✗ ATS EKSİK"}

İş Deneyimi (ATS En \xd6nemli):
- Detaylı A\xe7ıklama: ${h?"✓ ATS UYUMLU":"✗ ATS CRİTİK EKSİK"}
- Tarihler: ${g.length>0?"✓ ATS UYUMLU":"✗ ATS EKSİK"}

Eğitim (ATS \xd6nemli):
- Detaylı Bilgi: ${i?"✓ ATS UYUMLU":"✗ ATS EKSİK"}

Beceriler (ATS Anahtar Kelime):
- Teknik: ${k?"✓ ATS ANAHTAR KELİME":"✗ ATS CRİTİK EKSİK"}
- Kişisel: ${l?"✓ ATS UYUMLU":"✗ ATS EKSİK"}
- Dil: ${m?"✓ ATS UYUMLU":"✗ ATS EKSİK"}

ATS UYUMLULUK SKORU: ${p}/100
EKSİK ELEMENTLER: ${o.length} adet

CV Verisi:
${JSON.stringify(a,null,2)}

ATS UYUMLULUK ODAKLI PUANLAMA:

{
  "overall_score": ${p},
  "summary": "CV'nin ATS uyumluluğu: ${p}/100 puan. ${o.length} kritik eksiklik tespit edildi.",
  "strengths": ["Sadece ATS uyumlu b\xf6l\xfcmler i\xe7in pozitif yorumlar"],
  "weaknesses": ["ATS sistemleri tarafından okunmayacak eksiklikler", "İş başvurularında CV'nin sistem tarafından reddedilme riski"],
  "suggestions": ["ATS uyumluluğu i\xe7in kritik eksikliklerin giderilmesi", "Standart b\xf6l\xfcm başlıklarının kullanılması", "Anahtar kelime optimizasyonu"],
  "sections": {
    "personal_info": {"score": ${c&&d&&e?85:Math.max(15,85-(3-[c,d,e].filter(Boolean).length)*25)}, "feedback": "ATS kişisel bilgi okuma analizi"},
    "experience": {"score": ${h?80:20}, "feedback": "ATS iş deneyimi arama algoritması analizi"},
    "education": {"score": ${i?75:35}, "feedback": "ATS eğitim filtreleme analizi"},
    "skills": {"score": ${k?70:25}, "feedback": "ATS anahtar kelime eşleştirme analizi"},
    "ats_compatibility": {"score": ${p}, "feedback": "Genel ATS sistem uyumluluğu"}
  },
  "ats_analysis": {
    "keyword_usage": "ATS anahtar kelime tarama başarı oranı",
    "standard_sections": "ATS standart b\xf6l\xfcm tanıma kabiliyeti",
    "contact_info": "ATS iletişim bilgisi \xe7ıkarma başarısı",
    "formatting": "ATS format okuma uyumluluğu",
    "parsing_success": "ATS CV ayrıştırma başarı oranı",
    "overall_score": ${p},
    "recommendations": ["ATS ge\xe7iş oranını artırmak i\xe7in \xf6neriler"]
  },
  "industry_match": "ATS filtreleme sistemlerinde hangi sekt\xf6rler i\xe7in ge\xe7erli",
  "competitiveness": "ATS sistemlerinde rekabet g\xfcc\xfc - ${p<70?"D\xdcŞ\xdcK RİSK":"KABUL EDİLEBİLİR"}",
  "missing_elements": ${JSON.stringify(o)},
  "ats_compatibility": "ATS sistemlerinde ${p<70?"REDDEDİLME RİSKİ Y\xdcKSEK":"KABUL ŞANSİ VAR"}"
}

\xd6NEMLİ: TAMAMEN ATS UYUMLULUĞUNA G\xd6RE PUANLA. ATS sistemleri bu CV'yi ${p}% başarıyla okuyabilir.`}let y=new e.AppRouteRouteModule({definition:{kind:f.RouteKind.APP_ROUTE,page:"/api/cv-analysis/route",pathname:"/api/cv-analysis",filename:"route",bundlePath:"app/api/cv-analysis/route"},distDir:".next",projectDir:"",resolvedPagePath:"C:\\Users\\Ata\xe7\\Desktop\\PratikCV\\frontend\\app\\api\\cv-analysis\\route.ts",nextConfigOutput:"standalone",userland:d}),{workAsyncStorage:z,workUnitAsyncStorage:A,serverHooks:B}=y;function C(){return(0,g.patchFetch)({workAsyncStorage:z,workUnitAsyncStorage:A})}async function D(a,b,c){var d;let e="/api/cv-analysis/route";"/index"===e&&(e="/");let g=await y.prepare(a,b,{srcPage:e,multiZoneDraftMode:"false"});if(!g)return b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve()),null;let{buildId:u,params:v,nextConfig:w,isDraftMode:x,prerenderManifest:z,routerServerContext:A,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,resolvedPathname:D}=g,E=(0,j.normalizeAppPath)(e),F=!!(z.dynamicRoutes[E]||z.routes[D]);if(F&&!x){let a=!!z.routes[D],b=z.dynamicRoutes[E];if(b&&!1===b.fallback&&!a)throw new s.NoFallbackError}let G=null;!F||y.isDev||x||(G="/index"===(G=D)?"/":G);let H=!0===y.isDev||!F,I=F&&!H,J=a.method||"GET",K=(0,i.getTracer)(),L=K.getActiveScopeSpan(),M={params:v,prerenderManifest:z,renderOpts:{experimental:{dynamicIO:!!w.experimental.dynamicIO,authInterrupts:!!w.experimental.authInterrupts},supportsDynamicResponse:H,incrementalCache:(0,h.getRequestMeta)(a,"incrementalCache"),cacheLifeProfiles:null==(d=w.experimental)?void 0:d.cacheLife,isRevalidate:I,waitUntil:c.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:void 0,onInstrumentationRequestError:(b,c,d)=>y.onRequestError(a,b,d,A)},sharedContext:{buildId:u}},N=new k.NodeNextRequest(a),O=new k.NodeNextResponse(b),P=l.NextRequestAdapter.fromNodeNextRequest(N,(0,l.signalFromNodeResponse)(b));try{let d=async c=>y.handle(P,M).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let d=K.getRootSpanAttributes();if(!d)return;if(d.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=d.get("next.route");if(e){let a=`${J} ${e}`;c.setAttributes({"next.route":e,"http.route":e,"next.span_name":a}),c.updateName(a)}else c.updateName(`${J} ${a.url}`)}),g=async g=>{var i,j;let k=async({previousCacheEntry:f})=>{try{if(!(0,h.getRequestMeta)(a,"minimalMode")&&B&&C&&!f)return b.statusCode=404,b.setHeader("x-nextjs-cache","REVALIDATED"),b.end("This page could not be found"),null;let e=await d(g);a.fetchMetrics=M.renderOpts.fetchMetrics;let i=M.renderOpts.pendingWaitUntil;i&&c.waitUntil&&(c.waitUntil(i),i=void 0);let j=M.renderOpts.collectedTags;if(!F)return await (0,o.I)(N,O,e,M.renderOpts.pendingWaitUntil),null;{let a=await e.blob(),b=(0,p.toNodeOutgoingHttpHeaders)(e.headers);j&&(b[r.NEXT_CACHE_TAGS_HEADER]=j),!b["content-type"]&&a.type&&(b["content-type"]=a.type);let c=void 0!==M.renderOpts.collectedRevalidate&&!(M.renderOpts.collectedRevalidate>=r.INFINITE_CACHE)&&M.renderOpts.collectedRevalidate,d=void 0===M.renderOpts.collectedExpire||M.renderOpts.collectedExpire>=r.INFINITE_CACHE?void 0:M.renderOpts.collectedExpire;return{value:{kind:t.CachedRouteKind.APP_ROUTE,status:e.status,body:Buffer.from(await a.arrayBuffer()),headers:b},cacheControl:{revalidate:c,expire:d}}}}catch(b){throw(null==f?void 0:f.isStale)&&await y.onRequestError(a,b,{routerKind:"App Router",routePath:e,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})},A),b}},l=await y.handleResponse({req:a,nextConfig:w,cacheKey:G,routeKind:f.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:z,isRoutePPREnabled:!1,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,responseGenerator:k,waitUntil:c.waitUntil});if(!F)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==t.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(j=l.value)?void 0:j.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,h.getRequestMeta)(a,"minimalMode")||b.setHeader("x-nextjs-cache",B?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),x&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return(0,h.getRequestMeta)(a,"minimalMode")&&F||m.delete(r.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||b.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,q.getCacheControlHeader)(l.cacheControl)),await (0,o.I)(N,O,new Response(l.value.body,{headers:m,status:l.value.status||200})),null};L?await g(L):await K.withPropagatedContext(a.headers,()=>K.trace(m.BaseServerSpan.handleRequest,{spanName:`${J} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":J,"http.target":a.url}},g))}catch(b){if(L||await y.onRequestError(a,b,{routerKind:"App Router",routePath:E,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})}),F)throw b;return await (0,o.I)(N,O,new Response(null,{status:500})),null}}},78335:()=>{},86439:a=>{"use strict";a.exports=require("next/dist/shared/lib/no-fallback-error.external")},96487:()=>{}};var b=require("../../../webpack-runtime.js");b.C(a);var c=b.X(0,[4985,6055],()=>b(b.s=67731));module.exports=c})();