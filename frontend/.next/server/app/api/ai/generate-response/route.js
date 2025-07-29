(()=>{var a={};a.id=3238,a.ids=[3238],a.modules={261:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/app-paths")},3295:a=>{"use strict";a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},15691:(a,b,c)=>{"use strict";c.r(b),c.d(b,{handler:()=>C,patchFetch:()=>B,routeModule:()=>x,serverHooks:()=>A,workAsyncStorage:()=>y,workUnitAsyncStorage:()=>z});var d={};c.r(d),c.d(d,{POST:()=>w});var e=c(96559),f=c(48088),g=c(37719),h=c(26191),i=c(81289),j=c(261),k=c(92603),l=c(39893),m=c(14823),n=c(47220),o=c(66946),p=c(47912),q=c(99786),r=c(46143),s=c(86439),t=c(43365),u=c(32190);let v=new(c(37449)).ij(process.env.GEMINI_API_KEY||"");async function w(a){try{let{userInput:b,conversationHistory:c,cvData:d,detectedField:e,currentStep:f,responseType:g}=await a.json(),h=v.getGenerativeModel({model:"gemini-pro"}),i="";switch(g){case"profession_detected":i=`Sen bir CV uzmanı AI asistanısın. Kullanıcı "${e.profession}" alanında \xe7alışmak istediğini belirtti.

Şu bilgileri kullan:
- Meslek: ${e.profession}
- G\xfcven skoru: ${e.confidence}
- Kullanıcı girdisi: "${b}"

Bu duruma uygun, kişiselleştirilmiş ve samimi bir yanıt ver. Yanıt:
- Mesleği onaylayıcı ve destekleyici olsun
- Deneyim sorma y\xf6n\xfcnde y\xf6nlendirsin
- Empatik ve profesyonel olsun
- 1-2 c\xfcmle uzunluğunda olsun
- Emoji kullan ama abartma

Yanıtı doğrudan ver, ek a\xe7ıklama yapma.`;break;case"experience_added":i=`Sen bir CV uzmanı AI asistanısın. Kullanıcı iş deneyimi bilgilerini paylaştı.

Kullanıcı bilgileri:
- Meslek: ${d.personalInfo?.title||"Profesyonel"}
- Deneyim girdisi: "${b}"
- Mevcut CV durumu: ${JSON.stringify(d.experience||[])}

Bu duruma uygun yanıt ver:
- Deneyimin eklediğini onaylayıcı
- Eğitim bilgileri i\xe7in y\xf6nlendirici
- Pozitif ve motive edici
- 1-2 c\xfcmle uzunluğunda
- Uygun emoji kullan

Yanıtı doğrudan ver.`;break;case"education_added":i=`Sen bir CV uzmanı AI asistanısın. Kullanıcı eğitim bilgilerini paylaştı.

Kullanıcı bilgileri:
- Meslek: ${d.personalInfo?.title||"Profesyonel"}
- Eğitim girdisi: "${b}"
- Mevcut CV durumu: ${JSON.stringify(d.education||[])}

Bu duruma uygun yanıt ver:
- Eğitimin eklediğini onaylayıcı
- Yetenekler i\xe7in y\xf6nlendirici
- Destekleyici ve profesyonel
- 1-2 c\xfcmle uzunluğunda
- Uygun emoji kullan

Yanıtı doğrudan ver.`;break;case"skills_added":i=`Sen bir CV uzmanı AI asistanısın. Kullanıcı yetenek bilgilerini paylaştı.

Kullanıcı bilgileri:
- Meslek: ${d.personalInfo?.title||"Profesyonel"}
- Yetenek girdisi: "${b}"
- CV tamamlanma oranı: ${f}%

Bu duruma uygun yanıt ver:
- Yeteneklerin eklediğini onaylayıcı
- CV'nin g\xfc\xe7l\xfc olduğunu vurgulayıcı
- İlerleme durumunu kutlayıcı
- 1-2 c\xfcmle uzunluğunda
- Başarı odaklı emoji kullan

Yanıtı doğrudan ver.`;break;case"completion":i=`Sen bir CV uzmanı AI asistanısın. Kullanıcının CV'si b\xfcy\xfck \xf6l\xe7\xfcde tamamlandı.

CV durumu:
- Meslek: ${d.personalInfo?.title||"Profesyonel"}
- Son kullanıcı girdisi: "${b}"
- Tamamlanma oranı: ${f}%

Bu duruma uygun yanıt ver:
- CV'nin harika g\xf6r\xfcnd\xfcğ\xfcn\xfc belirt
- Kaydetmeye hazır olduğunu s\xf6yle
- Başarılı bir iş s\xfcrecinde takdir et
- Destekleyici ve kutlayıcı ol
- 2-3 c\xfcmle uzunluğunda
- Başarı emojileri kullan

Yanıtı doğrudan ver.`;break;default:i=`Sen bir CV uzmanı AI asistanısın. Kullanıcıyla doğal bir CV oluşturma sohbeti yapıyorsun.

Kullanıcı bilgileri:
- Son mesaj: "${b}"
- Sohbet ge\xe7mişi: ${JSON.stringify(c.slice(-3))}
- Mevcut CV durumu: ${JSON.stringify(d)}
- Mevcut adım: ${f}

Bu duruma uygun, doğal ve yardımcı bir yanıt ver:
- Kullanıcının girdisini anlayışla karşıla
- CV geliştirme s\xfcrecine odaklı kal
- Sohbet havasını koru
- Yapıcı ve destekleyici ol
- 1-2 c\xfcmle uzunluğunda
- Uygun emoji kullan

Yanıtı doğrudan ver, ek a\xe7ıklama yapma.`}let j=await h.generateContent(i),k=(await j.response).text();return u.NextResponse.json({response:k.trim(),success:!0})}catch(a){return u.NextResponse.json({response:"Anlıyorum! CV'nizi geliştirmeye devam edelim! ⭐",success:!1,error:"AI yanıt \xfcretimi başarısız, fallback kullanıldı"})}}let x=new e.AppRouteRouteModule({definition:{kind:f.RouteKind.APP_ROUTE,page:"/api/ai/generate-response/route",pathname:"/api/ai/generate-response",filename:"route",bundlePath:"app/api/ai/generate-response/route"},distDir:".next",projectDir:"",resolvedPagePath:"C:\\Users\\Ata\xe7\\Desktop\\PratikCV\\frontend\\app\\api\\ai\\generate-response\\route.ts",nextConfigOutput:"standalone",userland:d}),{workAsyncStorage:y,workUnitAsyncStorage:z,serverHooks:A}=x;function B(){return(0,g.patchFetch)({workAsyncStorage:y,workUnitAsyncStorage:z})}async function C(a,b,c){var d;let e="/api/ai/generate-response/route";"/index"===e&&(e="/");let g=await x.prepare(a,b,{srcPage:e,multiZoneDraftMode:"false"});if(!g)return b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve()),null;let{buildId:u,params:v,nextConfig:w,isDraftMode:y,prerenderManifest:z,routerServerContext:A,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,resolvedPathname:D}=g,E=(0,j.normalizeAppPath)(e),F=!!(z.dynamicRoutes[E]||z.routes[D]);if(F&&!y){let a=!!z.routes[D],b=z.dynamicRoutes[E];if(b&&!1===b.fallback&&!a)throw new s.NoFallbackError}let G=null;!F||x.isDev||y||(G="/index"===(G=D)?"/":G);let H=!0===x.isDev||!F,I=F&&!H,J=a.method||"GET",K=(0,i.getTracer)(),L=K.getActiveScopeSpan(),M={params:v,prerenderManifest:z,renderOpts:{experimental:{dynamicIO:!!w.experimental.dynamicIO,authInterrupts:!!w.experimental.authInterrupts},supportsDynamicResponse:H,incrementalCache:(0,h.getRequestMeta)(a,"incrementalCache"),cacheLifeProfiles:null==(d=w.experimental)?void 0:d.cacheLife,isRevalidate:I,waitUntil:c.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:void 0,onInstrumentationRequestError:(b,c,d)=>x.onRequestError(a,b,d,A)},sharedContext:{buildId:u}},N=new k.NodeNextRequest(a),O=new k.NodeNextResponse(b),P=l.NextRequestAdapter.fromNodeNextRequest(N,(0,l.signalFromNodeResponse)(b));try{let d=async c=>x.handle(P,M).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let d=K.getRootSpanAttributes();if(!d)return;if(d.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=d.get("next.route");if(e){let a=`${J} ${e}`;c.setAttributes({"next.route":e,"http.route":e,"next.span_name":a}),c.updateName(a)}else c.updateName(`${J} ${a.url}`)}),g=async g=>{var i,j;let k=async({previousCacheEntry:f})=>{try{if(!(0,h.getRequestMeta)(a,"minimalMode")&&B&&C&&!f)return b.statusCode=404,b.setHeader("x-nextjs-cache","REVALIDATED"),b.end("This page could not be found"),null;let e=await d(g);a.fetchMetrics=M.renderOpts.fetchMetrics;let i=M.renderOpts.pendingWaitUntil;i&&c.waitUntil&&(c.waitUntil(i),i=void 0);let j=M.renderOpts.collectedTags;if(!F)return await (0,o.I)(N,O,e,M.renderOpts.pendingWaitUntil),null;{let a=await e.blob(),b=(0,p.toNodeOutgoingHttpHeaders)(e.headers);j&&(b[r.NEXT_CACHE_TAGS_HEADER]=j),!b["content-type"]&&a.type&&(b["content-type"]=a.type);let c=void 0!==M.renderOpts.collectedRevalidate&&!(M.renderOpts.collectedRevalidate>=r.INFINITE_CACHE)&&M.renderOpts.collectedRevalidate,d=void 0===M.renderOpts.collectedExpire||M.renderOpts.collectedExpire>=r.INFINITE_CACHE?void 0:M.renderOpts.collectedExpire;return{value:{kind:t.CachedRouteKind.APP_ROUTE,status:e.status,body:Buffer.from(await a.arrayBuffer()),headers:b},cacheControl:{revalidate:c,expire:d}}}}catch(b){throw(null==f?void 0:f.isStale)&&await x.onRequestError(a,b,{routerKind:"App Router",routePath:e,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})},A),b}},l=await x.handleResponse({req:a,nextConfig:w,cacheKey:G,routeKind:f.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:z,isRoutePPREnabled:!1,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,responseGenerator:k,waitUntil:c.waitUntil});if(!F)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==t.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(j=l.value)?void 0:j.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,h.getRequestMeta)(a,"minimalMode")||b.setHeader("x-nextjs-cache",B?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),y&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return(0,h.getRequestMeta)(a,"minimalMode")&&F||m.delete(r.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||b.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,q.getCacheControlHeader)(l.cacheControl)),await (0,o.I)(N,O,new Response(l.value.body,{headers:m,status:l.value.status||200})),null};L?await g(L):await K.withPropagatedContext(a.headers,()=>K.trace(m.BaseServerSpan.handleRequest,{spanName:`${J} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":J,"http.target":a.url}},g))}catch(b){if(L||await x.onRequestError(a,b,{routerKind:"App Router",routePath:E,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})}),F)throw b;return await (0,o.I)(N,O,new Response(null,{status:500})),null}}},29294:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},44870:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},63033:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},78335:()=>{},86439:a=>{"use strict";a.exports=require("next/dist/shared/lib/no-fallback-error.external")},96487:()=>{}};var b=require("../../../../webpack-runtime.js");b.C(a);var c=b.X(0,[4985,6055,7449],()=>b(b.s=15691));module.exports=c})();