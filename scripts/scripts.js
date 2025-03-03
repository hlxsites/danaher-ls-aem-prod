import{sampleRUM,loadHeader,loadFooter,decorateButtons,decorateIcons,decorateSections,decorateBlocks,decorateTemplateAndTheme,waitForLCP,loadBlocks,loadCSS,toClassName,getMetadata,createOptimizedPicture,loadBlock,decorateBlock}from"./lib-franklin.js";import{div,img}from"./dom-builder.js";if(window.location.hostname.includes("lifesciences.danaher.com")){if(!window.location.pathname.endsWith(".html")&&window.location.pathname!=="/"){window.location.pathname+=".html"}}const LCP_BLOCKS=["breadcrumb","product-hero","carousel","columns"];const TEMPLATE_LIST={blog:{templateName:"blog",dependencies:["./schema.js","../blocks/columns/columns.js","../blocks/social-media/social-media.js","../blocks/article-info/article-info.js"]},productdetail:{templateName:"productDetail",dependencies:["./commerce.js","./product-payload-builder.js","./schema.js"]},processstep:"processstep",topic:"topic",library:"library",info:"library"};TEMPLATE_LIST.news=TEMPLATE_LIST.blog;export function getEdgeDeliveryPath(path){return path.replace(/^\/content\/danaher\/ls/,"").replace(/\.html$/,"")}export function moveAttributes(from,to,attributes){if(!attributes){attributes=[...from.attributes].map((({nodeName:nodeName})=>nodeName))}attributes.forEach((attr=>{const value=from.getAttribute(attr);if(value){to.setAttribute(attr,value);from.removeAttribute(attr)}}))}export function moveInstrumentation(from,to){moveAttributes(from,to,[...from.attributes].map((({nodeName:nodeName})=>nodeName)).filter((attr=>attr.startsWith("data-aue-")||attr.startsWith("data-richtext-"))))}export function imageHelper(imageUrl,imageAlt,eager=false){if(imageUrl.indexOf(".scene7.com")>-1){return img({src:`${imageUrl}`,alt:imageAlt,loading:eager?"eager":"lazy",class:"mb-2 h-48 w-full object-cover"})}const cardImage=createOptimizedPicture(imageUrl,imageAlt,eager,[{width:"500"}]);cardImage.querySelector("img").className="mb-2 h-48 w-full object-cover";return cardImage}export function createOptimizedS7Picture(src,alt="",eager=false){if(src.startsWith("/is/image")||src.indexOf(".scene7.com")>-1){const picture=document.createElement("picture");picture.appendChild(img({src:`${src}?$danaher-mobile$`,fetchpriority:"high",alt:alt,loading:eager?"eager":"lazy"}));return picture}return img({src:src,alt:alt,loading:eager?"eager":"lazy"})}export function formatDateUTCSeconds(date,options={}){const dateObj=new Date(0);dateObj.setUTCSeconds(date);return dateObj.toLocaleDateString("en-US",{month:"short",day:"2-digit",year:"numeric",...options})}export function generateUUID(){return Math.floor(1e3+Math.random()*9e3)}let originalOffset=0;export function scrollJumpMenuFixed(pageJumpMenuContainer){if(!originalOffset){const rectPageTabs=pageJumpMenuContainer.getBoundingClientRect();originalOffset=rectPageTabs.top}if(window.scrollY>originalOffset){pageJumpMenuContainer.classList.add(..."w-full fixed mt-[-1px] bg-white shadow-lg inset-x-0 top-[83px] py-2 z-10 [&_.page-jump-menu-wrapper]:md:max-w-7xl [&_ul>li>a]:flex-row [&_ul>li>a]:items-center [&_ul>li>a]:h-full [&_li>a>span.icon-chevron-down]:hidden".split(" "));document.querySelector(".page-jump-menu-container.fixed ul")?.classList.add("shadow-none","rounded-none");document.querySelectorAll(".page-jump-menu-container.fixed ul li")?.forEach((el=>{el?.firstElementChild?.classList.add("rounded-full");el?.firstElementChild?.querySelector("span.icon svg use")?.classList.add("stroke-danaherpurple-500")}));document.querySelector('.page-jump-menu-container.fixed li[aria-selected="true"] a span.icon svg')?.classList.add("stroke-white");pageJumpMenuContainer.classList.remove(..."[&_.page-jump-menu-wrapper]:md:max-w-max [&_ul]:divide-x [&_ul>li>a]:h-40 [&_ul>li>a]:flex-col [&_ul>li>a]:justify-center".split(" "))}else{pageJumpMenuContainer.classList.remove(..."w-full fixed mt-[-1px] bg-white shadow-lg inset-x-0 top-[83px] py-2 z-10 [&_.page-jump-menu-wrapper]:md:max-w-7xl [&_ul>li>a]:flex-row [&_ul>li>a]:items-center [&_ul>li>a]:h-full [&_li>a>span.icon-chevron-down]:hidden".split(" "));document.querySelectorAll(".page-jump-menu-container ul li")?.forEach((el=>{el?.firstElementChild?.classList.remove("rounded-full");el?.firstElementChild?.querySelector("span.icon svg use")?.classList.remove("stroke-danaherpurple-500")}));pageJumpMenuContainer.classList.add(..."[&_.page-jump-menu-wrapper]:md:max-w-max [&_ul]:divide-x [&_ul>li>a]:h-40 [&_ul>li>a]:flex-col [&_ul>li>a]:justify-center".split(" "))}}let pageTabsOriginalOffset=0;export function scrollPageTabFixed(pageTabsContainer){if(!pageTabsOriginalOffset){const rectPageTabs=pageTabsContainer.getBoundingClientRect();pageTabsOriginalOffset=rectPageTabs.top}if(window.scrollY>pageTabsOriginalOffset){pageTabsContainer.classList.add(..."w-full fixed mt-[-1px] bg-white shadow-lg inset-x-0 top-[83px] py-2 z-10 [&_.page-tabs-wrapper]:md:max-w-7xl [&_ul>li>a]:flex-row [&_ul>li>a]:items-center [&_ul>li>a]:h-full [&_li>a>span.icon-chevron-down]:hidden".split(" "));pageTabsContainer.classList.remove(..."[&_.page-tabs-wrapper]:md:max-w-max [&_ul]:divide-x [&_ul>li>a]:h-40 [&_ul>li>a]:flex-col [&_ul>li>a]:justify-center".split(" "))}else{pageTabsContainer.classList.remove(..."w-full fixed mt-[-1px] bg-white shadow-lg inset-x-0 top-[83px] py-2 z-10 [&_.page-tabs-wrapper]:md:max-w-7xl [&_ul>li>a]:flex-row [&_ul>li>a]:items-center [&_ul>li>a]:h-full [&_li>a>span.icon-chevron-down]:hidden".split(" "));pageTabsContainer.classList.add(..."[&_.page-tabs-wrapper]:md:max-w-max [&_ul]:divide-x [&_ul>li>a]:h-40 [&_ul>li>a]:flex-col [&_ul>li>a]:justify-center".split(" "))}}export function makePublicUrl(url){const isProd=window.location.hostname.includes("lifesciences.danaher.com");try{const newURL=new URL(url,window.location.origin);if(isProd){if(newURL.pathname.endsWith(".html")){return newURL.pathname}newURL.pathname+=".html";return newURL.pathname}if(newURL.pathname.endsWith(".html")){newURL.pathname=newURL.pathname.slice(0,-5);return newURL.pathname}return newURL.pathname}catch(error){console.error("Invalid URL:",error);return url}}export function setJsonLd(data,name){const existingScript=document.head.querySelector(`script[data-name="${name}"]`);if(existingScript){existingScript.innerHTML=JSON.stringify(data);return}const script=document.createElement("script");script.type="application/ld+json";script.innerHTML=JSON.stringify(data);script.dataset.name=name;document.head.appendChild(script)}function setFavicon(){const faviconLink=document.querySelector("link[rel*='icon']")||document.createElement("link");faviconLink.type="image/x-icon";faviconLink.rel="shortcut icon";faviconLink.href=`https://${window.location.hostname}/favicon.ico`;document.getElementsByTagName("head")[0].appendChild(faviconLink)}export async function getFragmentFromFile(url){const response=await fetch(url);if(!response.ok){console.error("error loading fragment details",response);return null}const text=await response.text();if(!text){console.error("fragment details empty",url);return null}return text}export function getCookie(cname){let value=decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*"+encodeURIComponent(cname).replace(/[\\-\\.\\+\\*]/g,"\\$&")+"\\s*\\=\\s*([^;]*).*$)|^.*$"),"$1"))||null;if(value&&(value.substring(0,1)==="{"&&value.substring(value.length-1,value.length)==="}"||value.substring(0,1)==="["&&value.substring(value.length-1,value.length)==="]")){try{value=JSON.parse(value)}catch(e){return value}}return value}export function isOTEnabled(){const otCookie=getCookie("OptanonConsent");if(typeof otCookie==="string"){return otCookie.includes("C0002:1")}return true}export function setCookie(cname,cvalue,expTime=30*1e3*60*60*24,path="/"){const today=new Date;today.setTime(today.getTime()+expTime);const expires="expires=".concat(today.toGMTString());const cookieString=cname.concat("=").concat(cvalue).concat(";").concat(expires).concat(";path=").concat(path);document.cookie=cookieString}async function buildVideo(main){const videoLinks=main.querySelectorAll('a[href*="youtube.com"],a[href*="vimeo.com"],a[href*="vidyard.com"]');if(videoLinks.length>0){const{default:decorateEmbed}=await import("../blocks/embed/embed.js");videoLinks.forEach((link=>{if(link.closest(".embed, .hero")==null){decorateEmbed(link.parentNode)}}))}}async function loadFonts(){await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);try{if(!window.location.hostname.includes("localhost"))sessionStorage.setItem("fonts-loaded","true")}catch(e){}}function loadBreadCrumb(){const header=document.querySelector("header");const breadcrumb=document.createElement("breadcrumb");if(window.location.pathname!=="/")header.after(breadcrumb)}function loadMobileMenu(){const breadcrumb=document.querySelector("breadcrumb");const mobileMunu=document.createElement("mobilemenu");const url=new URL(window.location.href);if(url.pathname.match(/\/us\/en\/products\/(family\/|sku\/|bundles\/)/)||url.pathname.match(/\/us\/en\/solutions\//)){breadcrumb.after(mobileMunu)}}function buildAutoBlocks(main){try{buildVideo(main)}catch(error){console.error("Auto Blocking failed",error)}}export function decorateModals(main){const ctaModalButton=main.querySelector(".show-modal-btn");const content=()=>ctaModalButton.getAttribute("data-dialog-message")?ctaModalButton.getAttribute("dialog-message"):"";ctaModalButton?.addEventListener("click",(async e=>{e.preventDefault();const{default:getModal}=await import("./modal.js");const customModal=await getModal("custom-modal",content,(modal=>{modal.querySelector('p[name="close"]')?.addEventListener("click",(()=>modal.close()))}));customModal.showModal()}))}function decorateTwoColumnSection(main){main.querySelectorAll(".section.container-two-col").forEach((section=>{const defaultContentWrappers=section.querySelectorAll(":scope > .default-content-wrapper");defaultContentWrappers.forEach((contentWrapper=>{[...contentWrapper.children].forEach((child=>{section.appendChild(child)}));let nextElement=contentWrapper.nextSibling;const allBlocks=[];while(nextElement){if(nextElement.className.includes("-wrapper"))allBlocks.push(nextElement);nextElement=nextElement.nextSibling}section.append(...allBlocks);section.removeChild(contentWrapper)}));const newSection=div();let currentDiv=null;[...section.children].forEach((child=>{if(child.tagName==="H1"){newSection.appendChild(div({class:"col-left lg:w-1/3 xl:w-1/4 pt-4"}));currentDiv=div({class:"col-right w-full mt-0 md:mt-4 lg:mt-0 lg:w-2/3 xl:w-3/4 pt-6 pb-0 md:pb-10"})}const childClone=child.cloneNode(true);if(childClone.tagName==="H2"&&childClone.querySelector(":scope > strong")){if(currentDiv?.classList.contains("col-right")){newSection.appendChild(currentDiv)}childClone.className="text-3xl leading-6 pt-6 pb-4 my-0";newSection.appendChild(div({class:"col-left lg:w-1/3 xl:w-1/3 pr-11"},childClone));currentDiv=div({class:"col-right w-full mt-4 lg:mt-0 lg:w-2/3 xl:w-2/3 pt-6 pb-10"})}else if(currentDiv?.classList.contains("col-right")){currentDiv.appendChild(childClone)}}));if(currentDiv){newSection.appendChild(currentDiv)}newSection.classList.add("w-full","flex","flex-wrap","break-normal");section.innerHTML=newSection.outerHTML;section.classList.add("mx-auto","w-full","flex","flex-wrap","mb-5")}))}function updateExternalLinks(main){const REFERERS=[window.location.origin];main.querySelectorAll("a[href]").forEach((a=>{try{const{origin:origin,pathname:pathname,hash:hash}=new URL(a.href,window.location.href);const targetHash=hash&&hash.startsWith("#_");const isPDF=pathname.split(".").pop()==="pdf";if(origin&&origin!==window.location.origin&&!targetHash||isPDF){a.setAttribute("target","_blank");if(!REFERERS.includes(origin))a.setAttribute("rel","noopener")}else if(targetHash){a.setAttribute("target",hash.replace("#",""));a.href=a.href.replace(hash,"")}}catch(e){console.warn(`Invalid link in ${main}: ${a.href}`)}}))}function lazyLoadHiddenPageNavTabs(sections,nameOfFirstSection){const activeHash=window.location.hash;const active=activeHash?activeHash.substring(1,activeHash.length).toLowerCase():nameOfFirstSection;sections.forEach((section=>{const hasBreadCrumb=section.className.includes("breadcrumb-container");if(!hasBreadCrumb&&section.getAttribute("aria-labelledby")!==active){section.querySelectorAll(".block").forEach((block=>{block.setAttribute("data-block-status","loaded");block.setAttribute("data-block-lazy-load",true);block.parentElement.style.display="none"}));const loadLazyBlocks=lazySection=>{lazySection.querySelectorAll(".block[data-block-lazy-load]").forEach((async block=>{block.removeAttribute("data-block-lazy-load");block.setAttribute("data-block-status","initialized");await loadBlock(block);block.parentElement.style.display=""}));section.setAttribute("data-section-status","loaded")};const observer=new IntersectionObserver((entries=>{if(entries.some((e=>e.isIntersecting))){observer.disconnect();loadLazyBlocks(section)}}));observer.observe(section);setTimeout((()=>{observer.disconnect();loadLazyBlocks(section)}),5e3)}}))}function decoratePageNav(main){const pageTabsBlock=main.querySelector(".page-tabs");if(!pageTabsBlock)return;const pageTabSection=pageTabsBlock.closest("div.section");let sections=[...main.querySelectorAll("div.section")];sections=sections.slice(sections.indexOf(pageTabSection)+1);const namedSections=sections.filter((section=>section.hasAttribute("data-tabname")));let index=0;sections.forEach((section=>{if(index<namedSections.length){section.classList.add("page-tab");const tabName=namedSections[index].getAttribute("data-tabname");const tabId=tabName?.toLowerCase().replace(/\s+/g,"-");section.setAttribute("aria-labelledby",tabId);if(section.hasAttribute("data-tabname")){index+=1}}}));lazyLoadHiddenPageNavTabs(sections,namedSections[0].getAttribute("aria-labelledby"))}export function decorateMain(main){decorateButtons(main);decorateIcons(main);buildAutoBlocks(main);decorateSections(main);decorateBlocks(main);loadHeader(document.querySelector("header"));loadBreadCrumb();loadMobileMenu();decoratePageNav(main);decorateTwoColumnSection(main);updateExternalLinks(main)}async function decorateTemplates(main){try{const template=toClassName(getMetadata("template"));const templates=Object.keys(TEMPLATE_LIST);if(templates.includes(template)){const templateObj=TEMPLATE_LIST[template];const templateName=typeof templateObj==="string"?templateObj:templateObj.templateName;const templateDeps=typeof templateObj==="string"?[]:templateObj.dependencies||[];const decorator=await Promise.all([import(`../templates/${templateName}/${templateName}.js`),...templateDeps.map((dep=>import(dep)))]).then((([mod])=>mod.default));if(decorator){await decorator(main)}document.body.classList.add(templateName)}}catch(error){console.error("Auto Blocking failed",error)}}function decorateEmbeddedBlocks(container){container.querySelectorAll("div.section > div").forEach(decorateBlock)}export async function processEmbedFragment(element){const block=div({class:"embed-fragment"});[...element.classList].forEach((className=>{block.classList.add(className)}));const link=element.textContent;if(link){const fragment=await getFragmentFromFile(`${link}.plain.html`);if(fragment){block.innerHTML=fragment;const sections=block.querySelectorAll(".embed-fragment > div");[...sections].forEach((section=>{section.classList.add("section")}));decorateEmbeddedBlocks(block);decorateSections(block);loadBlocks(block)}else{const elementInner=element.innerHTML;block.append(div({class:"section"}));block.querySelector(".section").innerHTML=elementInner}}decorateButtons(block);decorateIcons(block);return block}function loadEvergageScript(){const script=document.createElement("script");if(window.location.host==="lifesciences.danaher.com"){script.src="https://cdn.evgnet.com/beacon/v55685555553mx3rf3h3n3n3i091550196/danaher_ls_prod/scripts/evergage.min.js"}else{script.src="https://cdn.evgnet.com/beacon/v55685555553mx3rf3h3n3n3i091550196/danaher_ls_staging/scripts/evergage.min.js"}script.onload=function onEvergageLoad(){};script.onerror=function onEvergageError(){};document.head.appendChild(script)}loadEvergageScript();async function loadEager(doc){document.documentElement.lang="en";decorateTemplateAndTheme();await window.hlx.plugins.run("loadEager");const main=doc.querySelector("main");if(main){await decorateTemplates(main);decorateMain(main);await new Promise((resolve=>{window.requestAnimationFrame((async()=>{document.body.classList.add("appear");await waitForLCP(LCP_BLOCKS);resolve()}))}))}try{if(window.innerWidth>=900||sessionStorage.getItem("fonts-loaded")){loadFonts()}}catch(e){}}function getParameterByName(parameter,url=window.location.href){const modifiedParameter=parameter.replace(/[[\]]/g,"$&");const paramRegex=new RegExp(`[?&]${modifiedParameter}(=([^&#]*)|&|#|$)`);const results=paramRegex.exec(url);if(!results)return null;if(!results[2])return"";return decodeURIComponent(results[2].replace(/\+/g," "))}function loadUTMprams(){const utmParameters=["utm_campaign","utm_source","utm_medium","utm_content","utm_term","utm_previouspage"];utmParameters.forEach((param=>{const value=getParameterByName(param);if(value!==null){window.localStorage.setItem(`danaher_${param}`,value)}}))}async function loadLazy(doc){const main=doc.querySelector("main");await loadBlocks(main);const{hash:hash}=window.location;const element=hash?doc.getElementById(hash.substring(1)):false;if(hash&&element)element.scrollIntoView();loadFooter(doc.querySelector("footer"));loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);loadFonts();window.hlx.plugins.run("loadLazy");sampleRUM("lazy");sampleRUM.observe(main.querySelectorAll("div[data-block-name]"));sampleRUM.observe(main.querySelectorAll("picture > img"));loadUTMprams()}function loadDelayed(){window.setTimeout((()=>{window.hlx.plugins.load("delayed");window.hlx.plugins.run("loadDelayed");return import("./delayed.js")}),4e3);import("./sidekick.js").then((({initSidekick:initSidekick})=>initSidekick()))}async function loadPage(){setFavicon();await window.hlx.plugins.load("eager");await loadEager(document);await window.hlx.plugins.load("lazy");await loadLazy(document);loadDelayed()}function getDLPage(){const page={title:document.querySelector("title").textContent.replace(/[\n\t]/gm,""),language:"en",locale:"US",level:"top",type:"webpage",keywords:"",creationDate:getMetadata("creationdate"),updateDate:getMetadata("updatedate")};const path=window.location.pathname;if(path==="/"||path==="/us/en"||path==="/us/en.html"){page.level="top";page.type="home"}else if(path.includes("/us/en/news")){page.level="top";page.type="news"}else if(path.includes("/us/en/blog")){page.level="middle";page.type="blog"}else if(path.includes("/us/en/solutions")){page.level="middle";page.type="solutions"}else if(path.includes("/us/en/applications")){page.level="middle";page.type="applications"}else if(path.includes("/us/en/products")){if(path.includes("/us/en/products/family")){page.level="bottom";page.type="family"}else if(path.includes("/us/en/products/bundles")){page.level="bottom";page.type="bundles"}else if(path.includes("/us/en/products/sku")){page.level="bottom";page.type="sku"}else if(path.includes("/topics")){page.level="other";page.type="topics"}else{page.level="bottom";page.type="products"}}else if(path.includes("/us/en/library")){page.level="other";page.type="library"}else if(path.includes("/us/en/about-us")){page.level="top";page.type="about-us"}else if(path.includes("/us/en/expert")){page.level="top";page.type="expert"}else if(path.includes("/us/en/new-lab/join-today")){page.level="other";page.type="join-today"}else if(path.includes("/us/en/search")||path.includes("/us/en/danahersearch")){page.level="top";page.type="search"}else if(path.includes("/us/en/signin")){page.level="top";page.type="signin"}else if(path.includes("/us/en/legal")){page.level="top";page.type="legal"}return page}const urlParams=new URLSearchParams(window.location.search);const useProd=urlParams.get("useProd");if(window.location.host==="lifesciences.danaher.com"||useProd==="true"){window.DanaherConfig={siteID:"ls-us-en",gtmID:"GTM-THXPLCS",munchkinID:"306-EHG-641",marketoDomain:"//306-EHG-641.mktoweb.com",quoteCartPath:"/us/en/quote-cart.html",cartPath:"/us/en/cart.html",addressesPath:"/us/en/addresses.html",shippingPath:"/us/en/shipping.html",paymentPath:"/us/en/payment.html",receiptPath:"/us/en/receipt.html",quoteSubmitPath:"/us/en/submit-quote.html",intershopDomain:"https://shop.lifesciences.danaher.com",intershopPath:"/INTERSHOP/rest/WFS/DANAHERLS-LSIG-Site/-",searchOrg:"danaherproductionrfl96bkr",searchKey:"xxf2f10385-5a54-4a18-bb48-fd8025d6b5d2",workflowProductKey:"xx3d1b8da5-d1e9-4989-bbed-264a248a9e22",workflowResourceKey:"xxf6a8b387-10f2-4660-af5d-6d304d0a789d",productKey:"xxfb161aa6-0fa0-419f-af37-9c6d7784bf76",familyProductKey:"xx1ecd2a4f-8391-4c70-b3c0-2d589bda56b7",familyResourceKey:"xx9dd85afc-64b6-4295-bc5d-eb8285f96d52",categoryProductKey:"xx2a299d60-2cf1-48ab-b9d5-94daeb25f1d6",categoryDetailKey:"xx61910369-c1ab-4df9-8d8a-3092b1323fcc",productRecommendationsKey:"xx107716c0-1ccd-4a61-8717-6ca36b6cdb0e",megaMenuPath:"/content/dam/danaher/system/navigation/megamenu_items_us.json",coveoProductPageTitle:"Product Page",pdfEmbedKey:"4a472c386025439d8a4ce2493557f6e7",host:"lifesciences.danaher.com",scene7host:"https://danaherls.scene7.com"}}else{window.DanaherConfig={siteID:"ls-us-en",gtmID:"GTM-KCBGM2N",munchkinID:"439-KNJ-322",marketoDomain:"//439-KNJ-322.mktoweb.com",quoteCartPath:"/us/en/quote-cart.html",cartPath:"/us/en/cart.html",addressesPath:"/us/en/addresses.html",shippingPath:"/us/en/shipping.html",paymentPath:"/us/en/payment.html",receiptPath:"/us/en/receipt.html",quoteSubmitPath:"/us/en/submit-quote.html",intershopDomain:"https://stage.shop.lifesciences.danaher.com",intershopPath:"/INTERSHOP/rest/WFS/DANAHERLS-LSIG-Site/-",searchOrg:"danahernonproduction1892f3fhz",searchKey:"xx2a2e7271-78c3-4e3b-bac3-2fcbab75323b",workflowProductKey:"xx26ffc727-cc72-4bbd-98e3-34052f296382",workflowResourceKey:"xx14676f1d-cf4a-4a38-94f0-eda56e9920f1",productKey:"xx32da148e-dfd0-4725-a443-c05a7793afea",familyProductKey:"xx4e3989d6-93aa-4140-a227-19da35fcd1cc",familyResourceKey:"xx8274a91e-b29c-4267-8b3a-5022a2698605",categoryProductKey:"xxdf9d160d-f6e5-4c8c-969b-8570d7b81418",categoryDetailKey:"xxf2ea9bfd-bccb-4195-90fd-7757504fdc33",productRecommendationsKey:"xxea4d2c40-26e7-4e98-9377-d8ebe3f435ea",megaMenuPath:"/content/dam/danaher/system/navigation/megamenu_items_us.json",coveoProductPageTitle:"Product Page",pdfEmbedKey:"4a472c386025439d8a4ce2493557f6e7",host:"stage.lifesciences.danaher.com",scene7host:"https://s7d9.scene7.com"}}window.dataLayer=[];window.dataLayer.push({user:{customerID:"",accountType:"guest",marketCode:"",company:"",role:"",city:"",state:"",country:"",postalCode:"",lastVisit:""}});window.dataLayer.push({page:getDLPage()});document.addEventListener("DOMContentLoaded",(()=>{const oldUrl="https://shop.leica-microsystems.com/content/danaher/ls/us/en";const newUrl="https://lifesciences.danaher.com/us/en";const links=document.querySelectorAll("a");links.forEach((link=>{if(link.href.includes(oldUrl)){link.href=link.href.replace(oldUrl,newUrl)}}))}));loadPage();