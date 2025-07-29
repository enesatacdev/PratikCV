(()=>{var a={};a.id=4528,a.ids=[4528],a.modules={261:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/app-paths")},3295:a=>{"use strict";a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},29294:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},44870:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},53492:(a,b,c)=>{"use strict";c.r(b),c.d(b,{handler:()=>B,patchFetch:()=>A,routeModule:()=>w,serverHooks:()=>z,workAsyncStorage:()=>x,workUnitAsyncStorage:()=>y});var d={};c.r(d),c.d(d,{POST:()=>v});var e=c(96559),f=c(48088),g=c(37719),h=c(26191),i=c(81289),j=c(261),k=c(92603),l=c(39893),m=c(14823),n=c(47220),o=c(66946),p=c(47912),q=c(99786),r=c(46143),s=c(86439),t=c(43365),u=c(32190);async function v(a){try{let{input:b,language:c="tr",retry:d=!1,fallback:e=!1,emergency:f=!1}=await a.json();if(!b)return u.NextResponse.json({error:"Input gerekli"},{status:400});let g=process.env.GEMINI_API_KEY;if(!g)return u.NextResponse.json({error:"AI servisi yapılandırılmamış"},{status:500});let h="";h=f?`
Bu metinden kişinin mesleğini tahmin et: "${b}"

Sadece şu JSON formatında yanıt ver:
{
  "profession": "Tahmin edilen meslek",
  "confidence": 0.5,
  "category": "Genel kategori",
  "skills": {
    "technical": ["Temel yetenek 1", "Temel yetenek 2"],
    "soft": ["Kişisel \xf6zellik 1", "Kişisel \xf6zellik 2"],
    "languages": ["T\xfcrk\xe7e", "İngilizce"]
  },
  "companies": ["Genel şirket t\xfcr\xfc 1", "Genel şirket t\xfcr\xfc 2"]
}
`:e?`
Detaylı analiz i\xe7in: "${b}"

Bu metinden mesleği belirle ve bu JSON formatında d\xf6nd\xfcr:
{
  "profession": "Tespit edilen meslek adı",
  "confidence": 0.7,
  "category": "Ana kategori",
  "skills": {
    "technical": ["İlgili teknik yetenek 1", "Teknik yetenek 2", "Teknik yetenek 3"],
    "soft": ["Soft skill 1", "Soft skill 2", "Soft skill 3"],
    "languages": ["Gerekli dil 1", "Dil 2"]
  },
  "companies": ["Şirket t\xfcr\xfc 1", "Şirket t\xfcr\xfc 2", "Şirket t\xfcr\xfc 3"]
}
`:d?`
İkinci deneme - Bu kişi hangi alanda \xe7alışıyor: "${b}"

T\xfcrkiye'deki t\xfcm meslek alanlarını g\xf6z \xf6n\xfcnde bulundur. Modern ve geleneksel t\xfcm meslekleri tanıyabilmelisin.
Sadece JSON d\xf6nd\xfcr:

{
  "profession": "Tespit edilen meslek (T\xfcrk\xe7e)",
  "confidence": 0.8,
  "category": "Sekt\xf6r kategorisi",
  "skills": {
    "technical": ["Bu meslek i\xe7in gereken teknik yetenek 1", "Teknik yetenek 2", "Teknik yetenek 3"],
    "soft": ["Bu meslek i\xe7in \xf6nemli kişisel \xf6zellik 1", "\xd6zellik 2", "\xd6zellik 3"],
    "languages": ["Bu meslek i\xe7in gerekli dil 1", "Dil 2"]
  },
  "companies": ["Bu meslekteki kişinin \xe7alışabileceği şirket t\xfcr\xfc 1", "T\xfcr 2", "T\xfcr 3"]
}
`:`
Kullanıcı şu metni yazdı: "${b}"

Bu metinden kullanıcının mesleğini/kariyer alanını tespit et. 
T\xfcrkiye'deki t\xfcm meslek gruplarını ve sekt\xf6rleri g\xf6z \xf6n\xfcnde bulundur.
Geleneksel mesleklerden modern dijital kariyerlere kadar her t\xfcrl\xfc mesleği tanıyabilmelisin.

\xd6RNEKLER:
- "Kod yazıyorum" → Yazılım Geliştirici
- "Hasta bakımı yapıyorum" → Hemşire/Sağlık Uzmanı  
- "Sa\xe7 kesiyorum" → Berber/Kuaf\xf6r
- "Yemek pişiriyorum" → Aş\xe7ı/Şef
- "\xc7izim yapıyorum" → Tasarımcı/İll\xfcstrat\xf6r
- "Ara\xe7 tamiri" → Otomotiv Teknisyeni
- "Temizlik yapıyorum" → Temizlik Uzmanı

Aşağıdaki JSON formatında SADECE JSON d\xf6nd\xfcr, başka hi\xe7bir metin ekleme:

{
  "profession": "Tespit edilen tam meslek adı (T\xfcrk\xe7e)",
  "confidence": 0.8,
  "category": "Ana sekt\xf6r kategorisi",
  "skills": {
    "technical": ["Bu meslek i\xe7in kritik teknik yetenek 1", "Teknik yetenek 2", "Teknik yetenek 3"],
    "soft": ["Bu meslek i\xe7in \xf6nemli kişisel \xf6zellik 1", "\xd6zellik 2", "\xd6zellik 3"],
    "languages": ["Bu meslek i\xe7in gerekli/faydalı dil 1", "Dil 2"]
  },
  "companies": ["Bu meslekteki kişinin \xe7alışabileceği şirket/kurum t\xfcr\xfc 1", "T\xfcr 2", "T\xfcr 3"]
}

Eğer meslek tespit edemezsen:
{
  "profession": null,
  "confidence": 0,
  "category": null,
  "skills": null,
  "companies": null
}
`;let i=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${g}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:h}]}],generationConfig:{temperature:.3,topK:40,topP:.95,maxOutputTokens:1024}})});if(!i.ok)return u.NextResponse.json({error:"AI servisi hatası"},{status:500});let j=await i.json();if(!j.candidates||!j.candidates[0]||!j.candidates[0].content)return u.NextResponse.json({error:"AI servisi beklenmeyen yanıt"},{status:500});let k=j.candidates[0].content.parts[0].text;try{let a=k.replace(/```json\n?/g,"").replace(/```\n?/g,"").trim(),b=JSON.parse(a);if(b.profession&&null!==b.profession)return u.NextResponse.json({profession:b.profession,confidence:b.confidence||.8,category:b.category||"Genel",skills:b.skills||{technical:["Microsoft Office","Excel"],soft:["İletişim","Takım \xc7alışması"],languages:["İngilizce"]},companies:b.companies||["Şirket","Kurum","Organizasyon"]});return u.NextResponse.json({profession:null,confidence:0,category:null,skills:null,companies:null})}catch(a){return u.NextResponse.json({error:"AI yanıtı işlenemiyor"},{status:500})}}catch(a){return u.NextResponse.json({error:"Sunucu hatası"},{status:500})}}let w=new e.AppRouteRouteModule({definition:{kind:f.RouteKind.APP_ROUTE,page:"/api/ai/analyze-profession/route",pathname:"/api/ai/analyze-profession",filename:"route",bundlePath:"app/api/ai/analyze-profession/route"},distDir:".next",projectDir:"",resolvedPagePath:"C:\\Users\\Ata\xe7\\Desktop\\PratikCV\\frontend\\app\\api\\ai\\analyze-profession\\route.ts",nextConfigOutput:"standalone",userland:d}),{workAsyncStorage:x,workUnitAsyncStorage:y,serverHooks:z}=w;function A(){return(0,g.patchFetch)({workAsyncStorage:x,workUnitAsyncStorage:y})}async function B(a,b,c){var d;let e="/api/ai/analyze-profession/route";"/index"===e&&(e="/");let g=await w.prepare(a,b,{srcPage:e,multiZoneDraftMode:"false"});if(!g)return b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve()),null;let{buildId:u,params:v,nextConfig:x,isDraftMode:y,prerenderManifest:z,routerServerContext:A,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,resolvedPathname:D}=g,E=(0,j.normalizeAppPath)(e),F=!!(z.dynamicRoutes[E]||z.routes[D]);if(F&&!y){let a=!!z.routes[D],b=z.dynamicRoutes[E];if(b&&!1===b.fallback&&!a)throw new s.NoFallbackError}let G=null;!F||w.isDev||y||(G="/index"===(G=D)?"/":G);let H=!0===w.isDev||!F,I=F&&!H,J=a.method||"GET",K=(0,i.getTracer)(),L=K.getActiveScopeSpan(),M={params:v,prerenderManifest:z,renderOpts:{experimental:{dynamicIO:!!x.experimental.dynamicIO,authInterrupts:!!x.experimental.authInterrupts},supportsDynamicResponse:H,incrementalCache:(0,h.getRequestMeta)(a,"incrementalCache"),cacheLifeProfiles:null==(d=x.experimental)?void 0:d.cacheLife,isRevalidate:I,waitUntil:c.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:void 0,onInstrumentationRequestError:(b,c,d)=>w.onRequestError(a,b,d,A)},sharedContext:{buildId:u}},N=new k.NodeNextRequest(a),O=new k.NodeNextResponse(b),P=l.NextRequestAdapter.fromNodeNextRequest(N,(0,l.signalFromNodeResponse)(b));try{let d=async c=>w.handle(P,M).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let d=K.getRootSpanAttributes();if(!d)return;if(d.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=d.get("next.route");if(e){let a=`${J} ${e}`;c.setAttributes({"next.route":e,"http.route":e,"next.span_name":a}),c.updateName(a)}else c.updateName(`${J} ${a.url}`)}),g=async g=>{var i,j;let k=async({previousCacheEntry:f})=>{try{if(!(0,h.getRequestMeta)(a,"minimalMode")&&B&&C&&!f)return b.statusCode=404,b.setHeader("x-nextjs-cache","REVALIDATED"),b.end("This page could not be found"),null;let e=await d(g);a.fetchMetrics=M.renderOpts.fetchMetrics;let i=M.renderOpts.pendingWaitUntil;i&&c.waitUntil&&(c.waitUntil(i),i=void 0);let j=M.renderOpts.collectedTags;if(!F)return await (0,o.I)(N,O,e,M.renderOpts.pendingWaitUntil),null;{let a=await e.blob(),b=(0,p.toNodeOutgoingHttpHeaders)(e.headers);j&&(b[r.NEXT_CACHE_TAGS_HEADER]=j),!b["content-type"]&&a.type&&(b["content-type"]=a.type);let c=void 0!==M.renderOpts.collectedRevalidate&&!(M.renderOpts.collectedRevalidate>=r.INFINITE_CACHE)&&M.renderOpts.collectedRevalidate,d=void 0===M.renderOpts.collectedExpire||M.renderOpts.collectedExpire>=r.INFINITE_CACHE?void 0:M.renderOpts.collectedExpire;return{value:{kind:t.CachedRouteKind.APP_ROUTE,status:e.status,body:Buffer.from(await a.arrayBuffer()),headers:b},cacheControl:{revalidate:c,expire:d}}}}catch(b){throw(null==f?void 0:f.isStale)&&await w.onRequestError(a,b,{routerKind:"App Router",routePath:e,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})},A),b}},l=await w.handleResponse({req:a,nextConfig:x,cacheKey:G,routeKind:f.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:z,isRoutePPREnabled:!1,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,responseGenerator:k,waitUntil:c.waitUntil});if(!F)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==t.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(j=l.value)?void 0:j.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,h.getRequestMeta)(a,"minimalMode")||b.setHeader("x-nextjs-cache",B?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),y&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return(0,h.getRequestMeta)(a,"minimalMode")&&F||m.delete(r.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||b.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,q.getCacheControlHeader)(l.cacheControl)),await (0,o.I)(N,O,new Response(l.value.body,{headers:m,status:l.value.status||200})),null};L?await g(L):await K.withPropagatedContext(a.headers,()=>K.trace(m.BaseServerSpan.handleRequest,{spanName:`${J} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":J,"http.target":a.url}},g))}catch(b){if(L||await w.onRequestError(a,b,{routerKind:"App Router",routePath:E,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})}),F)throw b;return await (0,o.I)(N,O,new Response(null,{status:500})),null}}},63033:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},78335:()=>{},86439:a=>{"use strict";a.exports=require("next/dist/shared/lib/no-fallback-error.external")},96487:()=>{}};var b=require("../../../../webpack-runtime.js");b.C(a);var c=b.X(0,[4985,6055],()=>b(b.s=53492));module.exports=c})();