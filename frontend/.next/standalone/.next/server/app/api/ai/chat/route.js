(()=>{var a={};a.id=1337,a.ids=[1337],a.modules={261:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/app-paths")},3295:a=>{"use strict";a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},29294:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},44870:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},63033:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},64018:(a,b,c)=>{"use strict";c.r(b),c.d(b,{handler:()=>E,patchFetch:()=>D,routeModule:()=>z,serverHooks:()=>C,workAsyncStorage:()=>A,workUnitAsyncStorage:()=>B});var d={};c.r(d),c.d(d,{GET:()=>v,POST:()=>w});var e=c(96559),f=c(48088),g=c(37719),h=c(26191),i=c(81289),j=c(261),k=c(92603),l=c(39893),m=c(14823),n=c(47220),o=c(66946),p=c(47912),q=c(99786),r=c(46143),s=c(86439),t=c(43365),u=c(32190);async function v(){return u.NextResponse.json({message:"AI Chat API is working",method:"GET",timestamp:new Date().toISOString()})}async function w(a){let b,c="",d={},e=null,f=[];try{let g=await a.json();if(c=g.message,f=g.conversationHistory||[],d=g.cvData||{},e=g.user||null,!(b=process.env.GEMINI_API_KEY))throw Error("Gemini API key not configured");let h=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${b}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:function(a,b,c=null,d=[]){let e=c?`
Mevcut Kullanıcı Bilgileri (otomatik doldurulacak):
- Ad Soyad: ${c.fullName}
- Email: ${c.email}
- Telefon: ${c.phone||"Belirtilmemiş"}
`:"",f=d.some(a=>{let b=a.toLowerCase();return b.includes("pozisyon")||b.includes("iş")||b.includes("i\xe7in cv")||b.includes("başvuru")||b.includes("\xe7alış")||a.length>30}),g=b.personalInfo?.title&&b.personalInfo.title.trim().length>0,h="kisisel_bilgiler";(f||g)&&(h=b.personalInfo?.address&&b.personalInfo?.summary?b.experience&&0!==b.experience.length?b.education&&0!==b.education.length?b.skills&&(b.skills.technical?.length||b.skills.personal?.length)?b.certificates&&0!==b.certificates.length?"son_kontrol":"sertifikalar":"yetenekler":"egitim":"deneyim":"kisisel_detaylar");let i=d.length>0?`
\xd6nceki Konuşma:
${d.slice(-3).map((a,b)=>`- ${a}`).join("\n")}

BU \xd6NEMLİ: Yukarıdaki konuşma ge\xe7mişine g\xf6re, kullanıcı zaten tanıştı mı kontrol et.
Eğer kullanıcı pozisyonunu belirttiyse, ASLA tekrar giriş sorusu sorma!
`:"";return`Sen bir CV oluşturma asistanısın. T\xfcrk\xe7e konuşuyorsun ve kullanıcının CV'sini adım adım oluşturmasına yardım ediyorsun.

\xd6NEMLI: Cevabını SADECE JSON formatında ver. Hi\xe7bir a\xe7ıklama, markdown veya ek metin kullanma.
${e}
${i}

Şu anki Adım: ${h}

\xd6NEMLİ KURALLAR:
- Eğer conversation history'de pozisyon bilgisi varsa, ASLA giriş sorusu sorma
- Kullanıcı zaten kendini tanıttıysa, bir sonraki adıma ge\xe7
- Conversation history'yi dikkate alarak uygun soruları sor

G\xf6revin:
1. Eğer kisisel_bilgiler adımındaysa: Kullanıcının hangi pozisyon i\xe7in CV hazırladığını \xf6ğren
2. Eğer kisisel_detaylar adımındaysa: Adres, \xf6zet ve ek kişisel bilgileri al
3. Eğer deneyim adımındaysa: İş deneyimlerini detaylı olarak \xf6ğren
4. Eğer egitim adımındaysa: Eğitim bilgilerini topla
5. Eğer yetenekler adımındaysa: Teknik, kişisel ve dil becerilerini kategorize et
6. Eğer sertifikalar adımındaysa: Sertifika ve kursları \xf6ğren
7. Eğer son_kontrol adımındaysa: Profil fotoğrafı tercihi, referanslar, hobiler sor

\xd6ZEL KURALLAR:
- Eğer kullanıcı zaten pozisyonunu belirttiyse, adres ve \xf6zet iste
- Conversation history'de ge\xe7en bilgileri tekrar sorma
- Mevcut verileri ASLA silme, sadece ekle veya g\xfcncelle
- Her adımda sadece 1-2 soru sor
- son_kontrol adımında: "Profil fotoğrafı eklemek ister misin?", "Referansların var mı?" gibi sorular sor
- Kullanıcı "oluştur", "hazırla", "tamamla", "bitir" derse isComplete: true yap

Mevcut CV Verisi: ${JSON.stringify(b,null,2)}

Kullanıcının son mesajı: "${a}"

ZORUNLU JSON FORMAT:
{
  "message": "Kullanıcıya verilecek samimi ve adıma \xf6zel mesaj",
  "cvData": {
    "personalInfo": {
      "fullName": "${c?.fullName||b.personalInfo?.fullName||""}",
      "email": "${c?.email||b.personalInfo?.email||""}",
      "phone": "${c?.phone||b.personalInfo?.phone||""}",
      "address": "Mevcut veya yeni adres",
      "title": "Mevcut veya yeni pozisyon/unvan",
      "summary": "Mevcut veya yeni \xf6zet"
    },
    "experience": "Mevcut deneyimleri koru, yenilerini ekle",
    "education": "Mevcut eğitimleri koru, yenilerini ekle",
    "skills": {
      "technical": "Mevcut teknikleri koru, yenilerini ekle",
      "personal": "Mevcut kişiselleri koru, yenilerini ekle",
      "languages": "Mevcut dilleri koru, yenilerini ekle"
    },
    "certificates": "Sertifikaları ekle veya mevcut array",
    "references": "Referansları ekle veya mevcut array",
    "profilePhoto": "Profil fotoğrafı tercihi"
  },
  "nextQuestions": ["Adıma \xf6zel \xf6nerilen cevap 1", "\xd6nerilen cevap 2", "\xd6nerilen cevap 3"],
  "currentStep": "${h}",
  "isComplete": false
}`}(c,d,e,f)}]}],generationConfig:{temperature:.7,maxOutputTokens:1024}})});if(!h.ok){let a=await h.text();throw Error(`Gemini API error: ${h.status} - ${a}`)}let i=await h.json(),j=i.candidates[0]?.content?.parts[0]?.text;if(!j)throw Error("No response from Gemini AI");try{let a=j.trim();a.startsWith("```json")&&(a=a.replace(/```json\s*/g,"").replace(/```\s*$/g,"")),a.startsWith("```")&&(a=a.replace(/```\s*/g,"").replace(/```\s*$/g,""));let b=a.match(/\{[\s\S]*\}/);b&&(a=b[0]);let c=JSON.parse(a),f={message:c.message||"Anlayamadım, tekrar a\xe7ıklayabilir misin?",cvData:{userId:c.cvData?.userId||d.userId||"",title:c.cvData?.title||d.title||"",templateName:c.cvData?.templateName||d.templateName||"modern",status:c.cvData?.status||d.status||"draft",personalInfo:{fullName:c.cvData?.personalInfo?.fullName||e?.fullName||d.personalInfo?.fullName||"",birthday:c.cvData?.personalInfo?.birthday||d.personalInfo?.birthday||"",phones:(()=>{let a=d.personalInfo?.phones||[],b=c.cvData?.personalInfo?.phones||[],f=c.cvData?.personalInfo?.phone||e?.phone||d.personalInfo?.phone,g=[...a,...b];return f&&!g.includes(f)&&g.push(f),[...new Set(g)].filter(Boolean)})(),emails:(()=>{let a=d.personalInfo?.emails||[],b=c.cvData?.personalInfo?.emails||[],f=c.cvData?.personalInfo?.email||e?.email||d.personalInfo?.email,g=[...a,...b];return f&&!g.includes(f)&&g.push(f),[...new Set(g)].filter(Boolean)})(),email:c.cvData?.personalInfo?.email||e?.email||d.personalInfo?.email||"",phone:c.cvData?.personalInfo?.phone||e?.phone||d.personalInfo?.phone||"",address:c.cvData?.personalInfo?.address||d.personalInfo?.address||"",nationality:c.cvData?.personalInfo?.nationality||d.personalInfo?.nationality||"",drivingLicense:c.cvData?.personalInfo?.drivingLicense||d.personalInfo?.drivingLicense||"",profilePhoto:c.cvData?.personalInfo?.profilePhoto||d.personalInfo?.profilePhoto||"",summary:c.cvData?.personalInfo?.summary||d.personalInfo?.summary||"",title:c.cvData?.personalInfo?.title||d.personalInfo?.title||""},aboutMe:c.cvData?.aboutMe||d.aboutMe||"",experience:(()=>{let a=d.experience||[],b=c.cvData?.experience||[],e=[...a];return b.forEach(a=>{a&&a.position&&a.company&&!e.some(b=>b.position===a.position&&b.company===a.company)&&e.push(a)}),e})(),education:(()=>{let a=d.education||[],b=c.cvData?.education||[],e=[...a];return b.forEach(a=>{a&&a.degree&&a.school&&!e.some(b=>b.degree===a.degree&&b.school===a.school)&&e.push(a)}),e})(),skills:{technical:(()=>{let a=d.skills?.technical||[],b=c.cvData?.skills?.technical||[];return[...new Set([...a,...b])].filter(Boolean)})(),personal:(()=>{let a=d.skills?.personal||[],b=c.cvData?.skills?.personal||[];return[...new Set([...a,...b])].filter(Boolean)})(),languages:(()=>{let a=d.skills?.languages||[],b=c.cvData?.skills?.languages||[],e=[...a];return b.forEach(a=>{a&&("string"==typeof a||a.language&&a.level)&&("string"==typeof a?e.some(b=>"string"==typeof b&&b===a||"object"==typeof b&&b.language===a)||e.push({language:a,level:"Intermediate"}):e.some(b=>"object"==typeof b&&b.language===a.language||"string"==typeof b&&b===a.language)||e.push(a))}),e})()},socialMedia:(()=>{let a=d.socialMedia||[],b=c.cvData?.socialMedia||[],e=[...a];return b.forEach(a=>{a&&a.platform&&a.url&&!e.some(b=>b.platform===a.platform)&&e.push(a)}),e})(),certificates:(()=>{let a=d.certificates||[],b=c.cvData?.certificates||[],e=[...a];return b.forEach(a=>{a&&a.name&&!e.some(b=>b.name===a.name)&&e.push(a)}),e})(),references:(()=>{let a=d.references||[],b=c.cvData?.references||[],e=[...a];return b.forEach(a=>{a&&a.name&&!e.some(b=>b.name===a.name)&&e.push(a)}),e})(),hobbies:(()=>{let a=d.hobbies||[],b=c.cvData?.hobbies||[];return[...new Set([...a,...b])].filter(Boolean)})(),additionalInfo:c.cvData?.additionalInfo||d.additionalInfo||""},nextQuestions:c.nextQuestions||["Devam et","Daha detay ver","CV'yi oluştur"],currentStep:c.currentStep||"conversation",isComplete:c.isComplete||!1};return u.NextResponse.json(f)}catch(b){let a=j;return(a=a.replace(/\{[\s\S]*\}/g,"").trim())&&!(a.length<10)||(a="Anlayamadım, tekrar a\xe7ıklayabilir misin? Daha basit bir şekilde s\xf6yleyebilirsin."),u.NextResponse.json({message:a,cvData:d,nextQuestions:["Devam et","Daha detay ver","CV'yi oluştur"],currentStep:"conversation",isComplete:!1})}}catch(g){let a=c.toLowerCase();if(a.includes("oluştur")||a.includes("hazırla")||a.includes("tamamla"))return u.NextResponse.json({message:"CV'niz hazır! Mevcut bilgilerle CV'niz oluşturuldu. \uD83C\uDF89",cvData:{personalInfo:{fullName:e?.fullName||d.personalInfo?.fullName||"",email:e?.email||d.personalInfo?.email||"",phone:e?.phone||d.personalInfo?.phone||"",address:d.personalInfo?.address||"",title:d.personalInfo?.title||"",summary:d.personalInfo?.summary||""},experience:d.experience||[],education:d.education||[],skills:d.skills||{technical:[],personal:[],languages:[]}},nextQuestions:["CV'mi \xf6nizle","PDF olarak indir","D\xfczenlemeler yap"],currentStep:"tamamlandi",isComplete:!0});try{if(!b)return y(c,d,e,f);{let a=await x(c,d,e,f,b);return u.NextResponse.json(a)}}catch(a){return y(c,d,e,f)}}}async function x(a,b,c,d,e){let f=function(a,b,c,d){let e=c?`
Kullanıcı Bilgileri:
- Ad: ${c.fullName}
- Email: ${c.email}
- Telefon: ${c.phone||"Yok"}
`:"",f=d.length>0?`
Son Konuşmalar:
${d.slice(-2).map(a=>`- ${a}`).join("\n")}
`:"";return`Sen bir CV asistanısın. Ana sistem \xe7alışmıyor, bu y\xfczden basit fallback modundasın.

${e}
${f}

Mevcut CV Durumu: ${JSON.stringify(b,null,1)}

Kullanıcının son mesajı: "${a}"

G\xd6REV: Kullanıcının mevcut durumuna g\xf6re en uygun sonraki adımı belirle ve 3 akıllı soru \xf6ner.

CEVAP FORMATI (SADECE JSON):
{
  "message": "Kısa ve samimi bir CV asistan mesajı",
  "cvData": {
    "personalInfo": {
      "fullName": "${c?.fullName||b.personalInfo?.fullName||""}",
      "email": "${c?.email||b.personalInfo?.email||""}",
      "phone": "${c?.phone||b.personalInfo?.phone||""}",
      "address": "mevcut adres veya yeni",
      "title": "mevcut pozisyon veya yeni",
      "summary": "mevcut \xf6zet veya yeni"
    }
  },
  "nextQuestions": ["Akıllı soru 1", "Akıllı soru 2", "Akıllı soru 3"],
  "currentStep": "uygun_adim",
  "isComplete": false
}`}(a,b,c,d),g=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:f}]}],generationConfig:{temperature:.8,maxOutputTokens:512}})});if(!g.ok)throw Error(`AI Fallback failed: ${g.status}`);let h=await g.json(),i=h.candidates[0]?.content?.parts[0]?.text;if(!i)throw Error("No AI fallback response");try{let a=i.trim();a.startsWith("```json")&&(a=a.replace(/```json\s*/g,"").replace(/```\s*$/g,"")),a.startsWith("```")&&(a=a.replace(/```\s*/g,"").replace(/```\s*$/g,""));let c=a.match(/\{[\s\S]*\}/);c&&(a=c[0]);let d=JSON.parse(a);return{message:d.message||i,cvData:{...b,...d.cvData},nextQuestions:d.nextQuestions||["Devam et","Daha detay ver","CV'yi oluştur"],currentStep:d.currentStep||"conversation",isComplete:d.isComplete||!1}}catch(a){return{message:i,cvData:b,nextQuestions:["Devam et","Daha detay ver","CV'yi oluştur"],currentStep:"conversation",isComplete:!1}}}function y(a,b,c,d){let e=d.some(a=>{let b=a.toLowerCase();return b.includes("pozisyon")||b.includes("iş")||b.includes("i\xe7in cv")||b.includes("başvuru")||b.includes("\xe7alış")||a.length>30}),f=b.personalInfo?.title&&b.personalInfo.title.trim().length>0,g="",h=[],i="kisisel_bilgiler";return e||f?b.personalInfo?.address?b.experience&&0!==b.experience.length?b.education&&0!==b.education.length?(g="CV'n neredeyse hazır! Son kontroller yapalım.",h=["Tamamla","D\xfczenle","\xd6nizle"],i="son_kontrol"):(g="Eğitim ge\xe7mişini \xf6ğrenelim. Okul bilgilerini paylaşır mısın?",h=["\xdcniversite","Lise","Y\xfcksek lisans"],i="egitim"):(g="İş deneyimlerini konuşalım. \xc7alıştığın yerler var mı?",h=["\xc7alışıyorum","Deneyim var","Yeni mezunum"],i="deneyim"):(g=`Merhaba ${c?.fullName||"tekrardan"}! Adres bilgini alabilir miyim?`,h=["İstanbul, T\xfcrkiye","Ankara, T\xfcrkiye","İzmir, T\xfcrkiye"],i="kisisel_detaylar"):(g=c?.fullName?`Merhaba ${c.fullName}! Hangi pozisyon i\xe7in CV hazırlıyorsun?`:"Merhaba! Hangi pozisyon i\xe7in CV hazırlıyorsun?",h=["Developer","Designer","Marketing"]),u.NextResponse.json({message:g,cvData:{personalInfo:{fullName:c?.fullName||b.personalInfo?.fullName||"",email:c?.email||b.personalInfo?.email||"",phone:c?.phone||b.personalInfo?.phone||"",address:b.personalInfo?.address||"",title:b.personalInfo?.title||"",summary:b.personalInfo?.summary||""},experience:b.experience||[],education:b.education||[],skills:b.skills||{technical:[],personal:[],languages:[]}},nextQuestions:h,currentStep:i,isComplete:!1})}let z=new e.AppRouteRouteModule({definition:{kind:f.RouteKind.APP_ROUTE,page:"/api/ai/chat/route",pathname:"/api/ai/chat",filename:"route",bundlePath:"app/api/ai/chat/route"},distDir:".next",projectDir:"",resolvedPagePath:"C:\\Users\\Ata\xe7\\Desktop\\PratikCV\\frontend\\app\\api\\ai\\chat\\route.ts",nextConfigOutput:"standalone",userland:d}),{workAsyncStorage:A,workUnitAsyncStorage:B,serverHooks:C}=z;function D(){return(0,g.patchFetch)({workAsyncStorage:A,workUnitAsyncStorage:B})}async function E(a,b,c){var d;let e="/api/ai/chat/route";"/index"===e&&(e="/");let g=await z.prepare(a,b,{srcPage:e,multiZoneDraftMode:"false"});if(!g)return b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve()),null;let{buildId:u,params:v,nextConfig:w,isDraftMode:x,prerenderManifest:y,routerServerContext:A,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,resolvedPathname:D}=g,E=(0,j.normalizeAppPath)(e),F=!!(y.dynamicRoutes[E]||y.routes[D]);if(F&&!x){let a=!!y.routes[D],b=y.dynamicRoutes[E];if(b&&!1===b.fallback&&!a)throw new s.NoFallbackError}let G=null;!F||z.isDev||x||(G="/index"===(G=D)?"/":G);let H=!0===z.isDev||!F,I=F&&!H,J=a.method||"GET",K=(0,i.getTracer)(),L=K.getActiveScopeSpan(),M={params:v,prerenderManifest:y,renderOpts:{experimental:{dynamicIO:!!w.experimental.dynamicIO,authInterrupts:!!w.experimental.authInterrupts},supportsDynamicResponse:H,incrementalCache:(0,h.getRequestMeta)(a,"incrementalCache"),cacheLifeProfiles:null==(d=w.experimental)?void 0:d.cacheLife,isRevalidate:I,waitUntil:c.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:void 0,onInstrumentationRequestError:(b,c,d)=>z.onRequestError(a,b,d,A)},sharedContext:{buildId:u}},N=new k.NodeNextRequest(a),O=new k.NodeNextResponse(b),P=l.NextRequestAdapter.fromNodeNextRequest(N,(0,l.signalFromNodeResponse)(b));try{let d=async c=>z.handle(P,M).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let d=K.getRootSpanAttributes();if(!d)return;if(d.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=d.get("next.route");if(e){let a=`${J} ${e}`;c.setAttributes({"next.route":e,"http.route":e,"next.span_name":a}),c.updateName(a)}else c.updateName(`${J} ${a.url}`)}),g=async g=>{var i,j;let k=async({previousCacheEntry:f})=>{try{if(!(0,h.getRequestMeta)(a,"minimalMode")&&B&&C&&!f)return b.statusCode=404,b.setHeader("x-nextjs-cache","REVALIDATED"),b.end("This page could not be found"),null;let e=await d(g);a.fetchMetrics=M.renderOpts.fetchMetrics;let i=M.renderOpts.pendingWaitUntil;i&&c.waitUntil&&(c.waitUntil(i),i=void 0);let j=M.renderOpts.collectedTags;if(!F)return await (0,o.I)(N,O,e,M.renderOpts.pendingWaitUntil),null;{let a=await e.blob(),b=(0,p.toNodeOutgoingHttpHeaders)(e.headers);j&&(b[r.NEXT_CACHE_TAGS_HEADER]=j),!b["content-type"]&&a.type&&(b["content-type"]=a.type);let c=void 0!==M.renderOpts.collectedRevalidate&&!(M.renderOpts.collectedRevalidate>=r.INFINITE_CACHE)&&M.renderOpts.collectedRevalidate,d=void 0===M.renderOpts.collectedExpire||M.renderOpts.collectedExpire>=r.INFINITE_CACHE?void 0:M.renderOpts.collectedExpire;return{value:{kind:t.CachedRouteKind.APP_ROUTE,status:e.status,body:Buffer.from(await a.arrayBuffer()),headers:b},cacheControl:{revalidate:c,expire:d}}}}catch(b){throw(null==f?void 0:f.isStale)&&await z.onRequestError(a,b,{routerKind:"App Router",routePath:e,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})},A),b}},l=await z.handleResponse({req:a,nextConfig:w,cacheKey:G,routeKind:f.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:y,isRoutePPREnabled:!1,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,responseGenerator:k,waitUntil:c.waitUntil});if(!F)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==t.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(j=l.value)?void 0:j.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,h.getRequestMeta)(a,"minimalMode")||b.setHeader("x-nextjs-cache",B?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),x&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return(0,h.getRequestMeta)(a,"minimalMode")&&F||m.delete(r.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||b.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,q.getCacheControlHeader)(l.cacheControl)),await (0,o.I)(N,O,new Response(l.value.body,{headers:m,status:l.value.status||200})),null};L?await g(L):await K.withPropagatedContext(a.headers,()=>K.trace(m.BaseServerSpan.handleRequest,{spanName:`${J} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":J,"http.target":a.url}},g))}catch(b){if(L||await z.onRequestError(a,b,{routerKind:"App Router",routePath:E,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})}),F)throw b;return await (0,o.I)(N,O,new Response(null,{status:500})),null}}},78335:()=>{},86439:a=>{"use strict";a.exports=require("next/dist/shared/lib/no-fallback-error.external")},96487:()=>{}};var b=require("../../../../webpack-runtime.js");b.C(a);var c=b.X(0,[4985,6055],()=>b(b.s=64018));module.exports=c})();