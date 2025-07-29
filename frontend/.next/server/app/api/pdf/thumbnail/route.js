(()=>{var a={};a.id=4581,a.ids=[4581],a.modules={261:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/app-paths")},3295:a=>{"use strict";a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},29294:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},44870:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},63033:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},63222:(a,b,c)=>{"use strict";c.a(a,async(a,d)=>{try{c.r(b),c.d(b,{POST:()=>h});var e=c(32190),f=c(85420),g=a([f]);async function h(a){try{let{cvData:b,templateId:c}=await a.json();if(!b)return e.NextResponse.json({error:"CV data is required"},{status:400});let d=(await f.C.generatePDF(b,{templateId:c||"modern"})).toString("base64");return e.NextResponse.json({success:!0,thumbnail:`data:application/pdf;base64,${d}`})}catch(a){return e.NextResponse.json({error:"Failed to generate thumbnail"},{status:500})}}f=(g.then?(await g)():g)[0],d()}catch(a){d(a)}})},78335:()=>{},83636:a=>{"use strict";a.exports=import("puppeteer")},85420:(a,b,c)=>{"use strict";c.a(a,async(a,d)=>{try{c.d(b,{C:()=>g});var e=c(83636),f=a([e]);e=(f.then?(await f)():f)[0];class g{static{this.browser=null}static optimizeCVData(a){return{personalInfo:{fullName:a.personalInfo?.fullName||a.fullName||"",email:a.personalInfo?.email||a.email||"",phone:a.personalInfo?.phone||a.phone||"",address:a.personalInfo?.address||a.address||"",title:a.personalInfo?.title||a.title||"",profilePhoto:a.personalInfo?.profilePhoto||a.profilePhoto||""},experiences:(a.experiences||a.experience||[]).slice(0,10),educations:(a.educations||a.education||[]).slice(0,5),skills:(a.skills||[]).slice(0,20),certificates:(a.certificates||[]).slice(0,10),aboutMe:(a.aboutMe||"").substring(0,1e3),showProfilePhoto:a.showProfilePhoto||!1,references:(a.references||[]).slice(0,3),hobbies:(a.hobbies||[]).slice(0,10),projects:(a.projects||[]).slice(0,5)}}static async initialize(){this.browser||(this.browser=await e.default.launch({headless:!0,args:["--no-sandbox","--disable-setuid-sandbox","--disable-web-security","--disable-features=VizDisplayCompositor"]}))}static async generateCVHTML(a,b){let c={showProfilePhoto:a.showProfilePhoto||!1,personalInfo:{firstName:a.personalInfo?.firstName||a.personalInfo?.fullName?.split(" ")[0]||"",lastName:a.personalInfo?.lastName||a.personalInfo?.fullName?.split(" ").slice(1).join(" ")||"",fullName:a.personalInfo?.fullName||`${a.personalInfo?.firstName||""} ${a.personalInfo?.lastName||""}`.trim(),email:a.personalInfo?.email||"",phone:a.personalInfo?.phone||"",address:a.personalInfo?.address||"",title:a.personalInfo?.title||"",summary:a.aboutMe||"",profilePhoto:a.personalInfo?.profilePhoto||""},aboutMe:a.aboutMe||"",experiences:(a.experiences||[]).map((a,b)=>({id:`exp-${b}`,jobTitle:a.jobTitle||a.position||"",company:a.company||"",startDate:a.startDate||"",endDate:a.endDate||"",isCurrentJob:""===a.endDate||"Devam ediyor"===a.endDate,description:a.description||""})),educations:(a.educations||[]).map((a,b)=>({id:`edu-${b}`,degree:a.degree||"",school:a.school||"",department:a.department||"",startDate:a.startDate||"",endDate:a.endDate||"",isCurrentEducation:""===a.endDate||"Devam ediyor"===a.endDate,gpa:a.gpa||""})),skills:(a.skills||[]).map((a,b)=>({id:`skill-${b}`,name:a.name||a,level:a.level||3,category:a.category||"Teknik"})),certificates:(a.certificates||[]).map((a,b)=>({id:`cert-${b}`,name:a.name||"",issuer:a.issuer||"",issueDate:a.date||a.issueDate||"",expiryDate:a.expiryDate||"",credentialId:a.credentialId||""})),socialMedia:a.socialMedia||[],references:a.references||[],extras:{hobbies:a.hobbies||[],additional:a.additional||""}},d=(a,b)=>"modern"!==a&&a?d("modern",b):`
          <div class="max-w-4xl mx-auto bg-white" data-cv-content>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Sol Kolon -->
              <div class="space-y-6">
                <!-- Kişisel Bilgiler -->
                <div class="text-center lg:text-left">
                  ${b.showProfilePhoto&&b.personalInfo?.profilePhoto?`
                    <div class="mb-6 flex justify-center lg:justify-start">
                      <img src="${b.personalInfo.profilePhoto}" alt="Profile" class="w-32 h-32 rounded-full object-cover border-4 border-blue-100">
                    </div>
                  `:""}
                  <h1 class="text-3xl font-bold text-gray-900 mb-2">${b.personalInfo?.fullName||""}</h1>
                  <p class="text-xl text-blue-600 mb-4 font-medium">${b.personalInfo?.title||""}</p>
                  <div class="space-y-2 text-gray-600">
                    ${b.personalInfo?.email?`<p class="flex items-center justify-center lg:justify-start"><span class="mr-2">📧</span>${b.personalInfo.email}</p>`:""}
                    ${b.personalInfo?.phone?`<p class="flex items-center justify-center lg:justify-start"><span class="mr-2">📞</span>${b.personalInfo.phone}</p>`:""}
                    ${b.personalInfo?.address?`<p class="flex items-center justify-center lg:justify-start"><span class="mr-2">📍</span>${b.personalInfo.address}</p>`:""}
                  </div>
                </div>

                <!-- Hakkımda -->
                ${b.aboutMe?`
                <div>
                  <h2 class="text-xl font-bold text-gray-900 mb-3 border-b-2 border-blue-500 pb-1">Hakkımda</h2>
                  <p class="text-gray-700 leading-relaxed">${b.aboutMe}</p>
                </div>
                `:""}

                <!-- Yetenekler -->
                ${b.skills?.length?`
                <div>
                  <h2 class="text-xl font-bold text-gray-900 mb-3 border-b-2 border-blue-500 pb-1">Yetenekler</h2>
                  <div class="flex flex-wrap gap-2">
                    ${b.skills.map(a=>`
                      <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        ${a.name||a}
                      </span>
                    `).join("")}
                  </div>
                </div>
                `:""}
              </div>

              <!-- Sağ Kolon -->
              <div class="space-y-6">
                <!-- Deneyim -->
                ${b.experiences?.length?`
                <div>
                  <h2 class="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-500 pb-1">İş Deneyimi</h2>
                  <div class="space-y-4">
                    ${b.experiences.map(a=>`
                      <div class="border-l-4 border-blue-200 pl-4">
                        <h3 class="font-bold text-gray-900">${a.jobTitle||""}</h3>
                        <p class="text-blue-600 font-medium">${a.company||""}</p>
                        <p class="text-gray-500 text-sm">${a.startDate||""} - ${a.endDate||"Devam ediyor"}</p>
                        ${a.description?`<p class="text-gray-700 mt-2">${a.description}</p>`:""}
                      </div>
                    `).join("")}
                  </div>
                </div>
                `:""}

                <!-- Eğitim -->
                ${b.educations?.length?`
                <div>
                  <h2 class="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-500 pb-1">Eğitim</h2>
                  <div class="space-y-4">
                    ${b.educations.map(a=>`
                      <div class="border-l-4 border-green-200 pl-4">
                        <h3 class="font-bold text-gray-900">${a.degree||""}</h3>
                        <p class="text-green-600 font-medium">${a.school||""}</p>
                        ${a.department?`<p class="text-gray-600">${a.department}</p>`:""}
                        <p class="text-gray-500 text-sm">${a.startDate||""} - ${a.endDate||""}</p>
                      </div>
                    `).join("")}
                  </div>
                </div>
                `:""}

                <!-- Sertifikalar -->
                ${b.certificates?.length?`
                <div>
                  <h2 class="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-500 pb-1">Sertifikalar</h2>
                  <div class="space-y-3">
                    ${b.certificates.map(a=>`
                      <div class="bg-gray-50 p-3 rounded">
                        <h3 class="font-medium text-gray-900">${a.name||""}</h3>
                        <p class="text-gray-600 text-sm">${a.issuer||""} ${a.issueDate?`- ${a.issueDate}`:""}</p>
                      </div>
                    `).join("")}
                  </div>
                </div>
                `:""}
              </div>
            </div>
          </div>
        `,e=d(b,c);return`
      <!DOCTYPE html>
      <html lang="tr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>CV - ${c.personalInfo?.fullName||"CV"}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { 
              margin: 0; 
              padding: 20px; 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: white;
            }
            
            @media print {
              @page { 
                margin: 0; 
                size: A4; 
              }
              body { 
                margin: 0; 
                padding: 20px; 
              }
              * { 
                print-color-adjust: exact; 
                -webkit-print-color-adjust: exact; 
              }
            }
            
            /* Ensure grid layouts work in PDF */
            .grid {
              display: grid !important;
            }
            
            /* Hide any potential navigation elements */
            nav, .navbar, .header, .footer, .navigation, .menu {
              display: none !important;
            }
          </style>
        </head>
        <body>
          ${e}
        </body>
      </html>
    `}static async cleanup(){this.browser&&(await this.browser.close(),this.browser=null)}static async generatePDF(a,b={templateId:"modern"}){if(await this.initialize(),!this.browser)throw Error("Browser initialization failed");let c=null;try{c=await this.browser.newPage(),await c.setViewport({width:794,height:1123,deviceScaleFactor:1});let d=this.optimizeCVData(a),e=await this.generateCVHTML(d,b.templateId);await c.setContent(e,{waitUntil:["networkidle0","domcontentloaded"],timeout:3e4}),await new Promise(a=>setTimeout(a,2e3)),await c.waitForSelector("[data-cv-content]",{timeout:1e4}).catch(()=>{}),await c.addStyleTag({content:`
          nav, header, footer, .navbar, .header, .footer,
          .navigation, .menu, .sidebar, .topbar {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            overflow: hidden !important;
          }
          
          body { 
            margin: 0 !important; 
            padding: 0 !important; 
          }
          
          /* Ensure consistent layout between preview and PDF */
          .grid {
            display: grid !important;
          }
          
          .grid-cols-1 {
            grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
          }
          
          @media (min-width: 1024px) {
            .lg\\:grid-cols-2 {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }
          }
          
          .gap-8 {
            gap: 2rem !important;
          }
          
          .space-y-4 > * + * {
            margin-top: 1rem !important;
          }
          
          .space-y-6 > * + * {
            margin-top: 1.5rem !important;
          }
          
          .flex-wrap {
            flex-wrap: wrap !important;
          }
          
          .gap-2 {
            gap: 0.5rem !important;
          }
          
          .gap-4 {
            gap: 1rem !important;
          }
          
          @media print {
            nav, header, footer, .navbar, .header, .footer,
            .navigation, .menu, .sidebar, .topbar {
              display: none !important;
            }
            
            /* Force layout consistency in print */
            .grid {
              display: grid !important;
            }
            
            .lg\\:grid-cols-2 {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }
          }
        `}),await c.addStyleTag({content:`
          @media print {
            @page { margin: 0; size: A4; }
            body { margin: 0; padding: 0; }
            html { margin: 0; padding: 0; }
          }
        `});let f={format:b.format||"A4",printBackground:b.printBackground??!0,margin:b.margin||{top:"0mm",right:"0mm",bottom:"0mm",left:"0mm"},displayHeaderFooter:!1,headerTemplate:"",footerTemplate:"",scale:b.scale||1,preferCSSPageSize:!0,omitBackground:!1},g=await c.pdf(f);return Buffer.from(g)}catch(a){throw Error(`Failed to generate PDF: ${a instanceof Error?a.message:"Unknown error"}`)}finally{c&&await c.close()}}}d()}catch(a){d(a)}})},86439:a=>{"use strict";a.exports=require("next/dist/shared/lib/no-fallback-error.external")},92695:(a,b,c)=>{"use strict";c.a(a,async(a,d)=>{try{c.r(b),c.d(b,{handler:()=>x,patchFetch:()=>w,routeModule:()=>y,serverHooks:()=>B,workAsyncStorage:()=>z,workUnitAsyncStorage:()=>A});var e=c(96559),f=c(48088),g=c(37719),h=c(26191),i=c(81289),j=c(261),k=c(92603),l=c(39893),m=c(14823),n=c(47220),o=c(66946),p=c(47912),q=c(99786),r=c(46143),s=c(86439),t=c(43365),u=c(63222),v=a([u]);u=(v.then?(await v)():v)[0];let y=new e.AppRouteRouteModule({definition:{kind:f.RouteKind.APP_ROUTE,page:"/api/pdf/thumbnail/route",pathname:"/api/pdf/thumbnail",filename:"route",bundlePath:"app/api/pdf/thumbnail/route"},distDir:".next",projectDir:"",resolvedPagePath:"C:\\Users\\Ata\xe7\\Desktop\\PratikCV\\frontend\\app\\api\\pdf\\thumbnail\\route.ts",nextConfigOutput:"standalone",userland:u}),{workAsyncStorage:z,workUnitAsyncStorage:A,serverHooks:B}=y;function w(){return(0,g.patchFetch)({workAsyncStorage:z,workUnitAsyncStorage:A})}async function x(a,b,c){var d;let e="/api/pdf/thumbnail/route";"/index"===e&&(e="/");let g=await y.prepare(a,b,{srcPage:e,multiZoneDraftMode:"false"});if(!g)return b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve()),null;let{buildId:u,params:v,nextConfig:w,isDraftMode:x,prerenderManifest:z,routerServerContext:A,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,resolvedPathname:D}=g,E=(0,j.normalizeAppPath)(e),F=!!(z.dynamicRoutes[E]||z.routes[D]);if(F&&!x){let a=!!z.routes[D],b=z.dynamicRoutes[E];if(b&&!1===b.fallback&&!a)throw new s.NoFallbackError}let G=null;!F||y.isDev||x||(G=D,G="/index"===G?"/":G);let H=!0===y.isDev||!F,I=F&&!H,J=a.method||"GET",K=(0,i.getTracer)(),L=K.getActiveScopeSpan(),M={params:v,prerenderManifest:z,renderOpts:{experimental:{dynamicIO:!!w.experimental.dynamicIO,authInterrupts:!!w.experimental.authInterrupts},supportsDynamicResponse:H,incrementalCache:(0,h.getRequestMeta)(a,"incrementalCache"),cacheLifeProfiles:null==(d=w.experimental)?void 0:d.cacheLife,isRevalidate:I,waitUntil:c.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:void 0,onInstrumentationRequestError:(b,c,d)=>y.onRequestError(a,b,d,A)},sharedContext:{buildId:u}},N=new k.NodeNextRequest(a),O=new k.NodeNextResponse(b),P=l.NextRequestAdapter.fromNodeNextRequest(N,(0,l.signalFromNodeResponse)(b));try{let d=async c=>y.handle(P,M).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let d=K.getRootSpanAttributes();if(!d)return;if(d.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=d.get("next.route");if(e){let a=`${J} ${e}`;c.setAttributes({"next.route":e,"http.route":e,"next.span_name":a}),c.updateName(a)}else c.updateName(`${J} ${a.url}`)}),g=async g=>{var i,j;let k=async({previousCacheEntry:f})=>{try{if(!(0,h.getRequestMeta)(a,"minimalMode")&&B&&C&&!f)return b.statusCode=404,b.setHeader("x-nextjs-cache","REVALIDATED"),b.end("This page could not be found"),null;let e=await d(g);a.fetchMetrics=M.renderOpts.fetchMetrics;let i=M.renderOpts.pendingWaitUntil;i&&c.waitUntil&&(c.waitUntil(i),i=void 0);let j=M.renderOpts.collectedTags;if(!F)return await (0,o.I)(N,O,e,M.renderOpts.pendingWaitUntil),null;{let a=await e.blob(),b=(0,p.toNodeOutgoingHttpHeaders)(e.headers);j&&(b[r.NEXT_CACHE_TAGS_HEADER]=j),!b["content-type"]&&a.type&&(b["content-type"]=a.type);let c=void 0!==M.renderOpts.collectedRevalidate&&!(M.renderOpts.collectedRevalidate>=r.INFINITE_CACHE)&&M.renderOpts.collectedRevalidate,d=void 0===M.renderOpts.collectedExpire||M.renderOpts.collectedExpire>=r.INFINITE_CACHE?void 0:M.renderOpts.collectedExpire;return{value:{kind:t.CachedRouteKind.APP_ROUTE,status:e.status,body:Buffer.from(await a.arrayBuffer()),headers:b},cacheControl:{revalidate:c,expire:d}}}}catch(b){throw(null==f?void 0:f.isStale)&&await y.onRequestError(a,b,{routerKind:"App Router",routePath:e,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})},A),b}},l=await y.handleResponse({req:a,nextConfig:w,cacheKey:G,routeKind:f.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:z,isRoutePPREnabled:!1,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,responseGenerator:k,waitUntil:c.waitUntil});if(!F)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==t.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(j=l.value)?void 0:j.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,h.getRequestMeta)(a,"minimalMode")||b.setHeader("x-nextjs-cache",B?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),x&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return(0,h.getRequestMeta)(a,"minimalMode")&&F||m.delete(r.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||b.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,q.getCacheControlHeader)(l.cacheControl)),await (0,o.I)(N,O,new Response(l.value.body,{headers:m,status:l.value.status||200})),null};L?await g(L):await K.withPropagatedContext(a.headers,()=>K.trace(m.BaseServerSpan.handleRequest,{spanName:`${J} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":J,"http.target":a.url}},g))}catch(b){if(L||await y.onRequestError(a,b,{routerKind:"App Router",routePath:E,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})}),F)throw b;return await (0,o.I)(N,O,new Response(null,{status:500})),null}}d()}catch(a){d(a)}})},96487:()=>{}};var b=require("../../../../webpack-runtime.js");b.C(a);var c=b.X(0,[4985,6055],()=>b(b.s=92695));module.exports=c})();