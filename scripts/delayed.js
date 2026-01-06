/* eslint-disable */
import { loadScript, sampleRUM } from './lib-franklin.js';
import { setCookie, isOTEnabled } from './scripts.js';
import { getAuthorization, getCommerceBase } from './commerce.js';
import { getMetadata } from './lib-franklin.js';
import { addItemToCart } from '../blocks/cartlanding/myCartService.js';
import { removePreLoader, showNotification } from './common-utils.js';
import { getAuthenticationToken } from './token-utils.js';
import { userLogin } from './auth-utils.js';
import { loadMiniCart } from './cart-checkout-utils.js';
/**
 * Sets up event delegation for "Add to Cart" button clicks within the container.
 * Efficiently handles clicks even for dynamically added buttons.
 *
 * @param {HTMLElement} wrapper - The container element that may contain one or more buy buttons.
 */

export function decorateBuyButton(wrapper) {
  wrapper.addEventListener('click', async (e) => {

    const targetElement = e.target.closest('.add-to-cart-btn');
    if (!targetElement || !wrapper.contains(targetElement)) return;

    try {
      const btnProps = targetElement?.attributes;
      let itemQuantity = '';

      // Look for a nearby input[type="number"]
      const quantityInput = targetElement.parentNode?.querySelector('input[type="number"]');
      if (quantityInput || btnProps?.minorderquantity) {
        itemQuantity = quantityInput?.value || btnProps?.minorderquantity?.value;
      }
      if (itemQuantity <= 0 || itemQuantity > 100) {
        quantityInput.style.border = '2px solid red';
        // eslint-disable-next-line no-alert
        showNotification(`Please enter a valid order quantity which should be greater then 0 and less then 100`, 'error');
      }
      else {
        quantityInput.style.border = '';
        const itemObject = {
          sku: {
            value: btnProps?.sku?.value,
            quantity: itemQuantity,
          }
        };

        if (itemQuantity) {
          await addItemToCart(itemObject);
        }
      }

    } catch (error) {
      removePreLoader();
      showNotification('Error Processing Request.', 'error');
    }
  });
}


/*
  *
     include function to add utm params in the url(s)
  *
  */
function initUtmParamsUtm() {
  var hyperLink;
  const regex = "/content/danaher/ls";
  if (document.getElementsByTagName("a")) {
    hyperLink = document.getElementsByTagName("a");
    for (let i = 0; i < hyperLink.length; ++i) {
      if (
        hyperLink[i].getAttribute("href") != null &&
        !hyperLink[i].getAttribute("href").includes("lifesciences.danaher.com")
      ) {
        if (
          hyperLink[i].getAttribute("href").startsWith("http") ||
          hyperLink[i].getAttribute("href").startsWith("https") ||
          hyperLink[i].getAttribute("href").startsWith("ftp://")
        ) {
          if (
            hyperLink[i]
              .getAttribute("href")
              .includes("utm_source=dhls_website") ||
            hyperLink[i].getAttribute("href") == "#" ||
            hyperLink[i].getAttribute("href").startsWith("mailto:") ||
            hyperLink[i].getAttribute("href").includes("/content/danaher/ls")
          ) {
            //Nothing to add/update
          } else if (hyperLink[i].getAttribute("href").includes("?")) {
            hyperLink[i].setAttribute(
              "href",
              hyperLink[i].getAttribute("href") + "&utm_source=dhls_website"
            );
          } else {
            hyperLink[i].setAttribute(
              "href",
              hyperLink[i].getAttribute("href") + "?utm_source=dhls_website"
            );
          }
        } else if (
          hyperLink[i].getAttribute("href").startsWith("/content/danaher/ls")
        ) {
          hyperLink[i].setAttribute(
            "href",
            hyperLink[i].getAttribute("href").replace(regex, "")
          );
        }
      }
    }
  } else {
    hyperLink = null;
  }
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initUtmParamsUtm);
} else {
  initUtmParamsUtm();
}
/*
 *
 :::::::::::
    include / exclude eds page for Prod and Stage
 ::::::::::::::
 *
 */
export const includeProdEdsPaths = ['news', 'news.html', 'blog.html', 'blog', 'videos', 'videos.html', 'library', 'library.html', 'expert-eds', 'expert-eds.html', 'new-lab', 'new-lab.html', 'appliaction', 'appliaction.html', 'we-see-a-way', 'we-see-a-way.html', 'solutions/analytical', 'solutions/analytical.html', 'solutions/digital/products', 'solutions/digital/products.html', 'about-us', 'about-us.html', 'resources', 'resources.html', 'products/brands', 'products/2d-3d-cell-culture-systems', 'products/antibodies', 'products/capillary-electrophoresis-systems', 'products/cell-lines-lysates', 'products/extraction-kits', 'products/liquid-handlers', 'products/assay-kits', 'products/biochemicals', 'products/cell-counters-analyzers', 'products/cellular-imaging-systems', 'products/high-performance-liquid-chromatography-systems', 'products/high-throughput-cellular-screening-systems', 'products/mass-spectrometers', 'products/microarray-scanners', 'products/microbioreactors', 'products/microplate-readers', 'products/microscopes', 'products/particle-counters-and-analyzers', 'products/patch-clamp-systems', 'products/proteins-peptides', 'products/sample-preparation-detection', 'products/software-platforms', 'products/centrifuges', 'products/clone-screening-systems', 'products/flow-cytometers', 'products/chromatography-columns', '/products.html'];

export const includeStageEdsPaths = ['news', 'news.html', 'blog.html', 'blog', 'videos', 'videos.html', 'library', 'library.html', 'new-lab/excedr', 'new-lab/excedr.html', 'we-see-a-way', 'we-see-a-way.html', 'landing/home-eds', 'landing/home-eds.html', 'about-us', 'about-us.html', 'products/brands', 'products.html', 'products/2d-3d-cell-culture-systems', 'products/antibodies', 'e-buy', 'products/capillary-electrophoresis-systems', 'products/cell-lines-lysates', 'products/extraction-kits', 'products/liquid-handlers', 'products/assay-kits', 'products/biochemicals', 'products/cell-counters-analyzers', 'products/cellular-imaging-systems', 'products/high-performance-liquid-chromatography-systems', 'products/high-throughput-cellular-screening-systems', 'products/mass-spectrometers', 'products/microarray-scanners', 'products/microbioreactors', 'products/microplate-readers', 'products/microscopes', 'products/particle-counters-and-analyzers', 'products/patch-clamp-systems', 'products/proteins-peptides', 'products/sample-preparation-detection', 'products/software-platforms', 'products/centrifuges', 'products/clone-screening-systems', 'products/flow-cytometers', 'products/chromatography-columns', window.EbuyConfig?.cartPageUrl, window.EbuyConfig?.dashboardPage?.url, window.EbuyConfig?.cartPageUrl, window.EbuyConfig?.addressPageUrl, window.EbuyConfig?.myAddressPageUrl, window.EbuyConfig?.orderStatusPageUrl, window.EbuyConfig?.orderStatusPageUrl, window.EbuyConfig?.orderDetailsPageUrl, window.EbuyConfig?.paymentMethodsPageUrl, window.EbuyConfig?.myProfilePageUrl, window.EbuyConfig?.requestedQuoteDetailsPageUrl, window.EbuyConfig?.requestedQuotesPageUrl];


if (getMetadata('template') === 'pdp') {
  includeProdEdsPaths.push('/products/family', '/products/sku', '/products/bundle');
  includeStageEdsPaths.push('/products/family', '/products/sku', '/products/bundle');
}
// Core Web Vitals RUM collection
sampleRUM('cwv');

let refresh = false;
const baseURL = getCommerceBase();

// add more delayed functionality here
// google tag manager -start
function loadGTM() {
  const scriptTag = document.createElement('script');
  scriptTag.innerHTML = `
      let gtmId = window.DanaherConfig !== undefined ? window.DanaherConfig.gtmID : 'GTM-KCBGM2N';
      // googleTagManager
      (function (w, d, s, l, i) {
          w[l] = w[l] || [];
          w[l].push({
              'gtm.start':
                  new Date().getTime(), event: 'gtm.js'
          });
          var f = d.getElementsByTagName(s)[0],
              j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
          j.async = true;
          j.src =
              'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
          f.parentNode.insertBefore(j, f);
      })(window, document, 'script', 'dataLayer', gtmId);
      `;
  document.head.prepend(scriptTag);
}
// google tag manager -end

// New relic Script -start
function loadrelicScript() {
  const scriptTag = document.createElement('script');
  scriptTag.type = 'text/javascript';
  scriptTag.src =
    window.location.host === 'lifesciences.danaher.com'
      ? '/scripts/new-relic.js'
      : '/scripts/new-relic-stage.js';

  scriptTag.onload = function () {
    if (window.newrelic && typeof window.newrelic.addPageAction === 'function') {
      window.newrelic.addPageAction('pageView', {
        url: window.location.href,
        title: document.title,
        source: 'aem-eds',
      });
    } else {
      console.warn('New Relic not available or addPageAction not defined.');
    }
  };

  document.head.prepend(scriptTag);
}
// New relic Script - end

// Adobe Target - start

window.targetGlobalSettings = {
  bodyHidingEnabled: false,
};

function loadAT() {
  function targetPageParams() {
    return {
      at_property: '6aeb619e-92d9-f4cf-f209-6d88ff58af6a',
    };
  }
  loadScript('/scripts/at-lsig.js');
}
// Adobe Target - end

// Coveo Events - start

function sendCoveoEventPage() {
  const usp = new URLSearchParams(window.location.search);
  const pdfurl = usp.get('pdfurl');
  const pdftitle = usp.get('title');

  let cval = '';
  if (pdfurl != null && pdfurl.length > 0) {
    cval = window.location.origin + pdfurl;
  } else {
    cval = window.location.origin + window.location.pathname;
  }

  let title = '';
  if (pdftitle != null && pdftitle.length > 0) {
    title = pdftitle;
  } else {
    title = document.title;
  }

  coveoua(
    'init',
    accessToken,
    `https://${organizationId}.analytics.org.coveo.com`
  );

  coveoua('send', 'view', {
    contentIdKey: 'permanentid',
    contentIdValue: cval,
    language: 'en',
    username: 'anonymous',
    title: title,
    location: document.location.href,
    originLevel1: 'DanaherMainSearch',
  });
}

function sendCoveoEventProduct() {
  coveoua('set', 'currencyCode', 'USD');
  coveoua(
    'init',
    accessToken,
    `https://${organizationId}.analytics.org.coveo.com`
  );

  const cats = document.querySelector('.hero-default-content .categories');
  let pcats = '';
  if (cats != null) {
    pcats = cats.textContent.replaceAll('|', '/').replaceAll(',', '|');
  }

  coveoua('ec:addProduct', {
    id: document.querySelector('.hero-default-content .sku')?.textContent,
    name: document.querySelector('.hero-default-content .title')?.textContent,
    category: pcats,
    price: 0,
    brand: document.querySelector('.hero-default-content .brand')?.textContent,
  });

  coveoua('ec:setAction', 'detail');
  coveoua('send', 'event', {
    searchHub: 'DanaherMainSearch',
  });
}

// Coveo Events - end

// Get authorization token for anonymous user
// async function getAuthToken() {
//   if (!refresh) {
//     refresh = true;
//     const siteID = window.DanaherConfig?.siteID;
//     const formData = 'grant_type=anonymous&scope=openid+profile&client_id=';
//     const authRequest = await fetch(
//       `/content/danaher/services/auth/token?id=${siteID}`,
//       {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//         body: formData,
//       }
//     );
//     if (authRequest.ok) {
//       const hostName = window.location.hostname;
//       const env = hostName.includes('local')
//         ? 'local'
//         : hostName.includes('dev')
//         ? 'dev'
//         : hostName.includes('stage')
//         ? 'stage'
//         : 'prod';
//       const data = await authRequest.json();
//       sessionStorage.setItem(`${siteID}_${env}_apiToken`, JSON.stringify(data));
//       sessionStorage.setItem(
//         `${siteID}_${env}_refresh-token`,
//         data.refresh_token
//       );
//     }
//   }
// }
export async function getAuthToken() {
  const tokenData = await getAuthenticationToken();
  const hostName = window.location.hostname;
  const siteID = window.DanaherConfig?.siteID;
  const env = hostName.includes('local') ? 'local' : hostName.includes('dev') ? 'dev' : hostName.includes('stage') ? 'stage' : 'prod';
  if (tokenData?.access_token && tokenData?.user_type === 'customer'){
    const token = tokenData.access_token;
    sessionStorage.setItem(`${siteID}_${env}_apiToken`, JSON.stringify({access_token: token, expiry_time: tokenData.expiry_time}));
    return;
  }
  if (!refresh) {
    refresh = true;
    const formData = 'grant_type=anonymous&scope=openid+profile&client_id=';
    const authRequest = await fetch(`/content/danaher/services/auth/token?id=${siteID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    });
    if (authRequest.ok) {
      const data = await authRequest.json();
      sessionStorage.setItem(`${siteID}_${env}_apiToken`, JSON.stringify(data));
      sessionStorage.setItem(`${siteID}_${env}_refresh-token`, data.refresh_token);
    }
  }
}
// Get authorization token for anonymous user - end

// Loading fathom script - start
const attrs = JSON.parse('{"data-site": "KGTBOGMR"}');
loadScript('https://cdn.usefathom.com/script.js', attrs);
// Loading fathom script - end

// coveo analytics - start
(function (c, o, v, e, O, u, a) {
  a = 'coveoua';
  c[a] =
    c[a] ||
    function () {
      (c[a].q = c[a].q || []).push(arguments);
    };
  c[a].t = Date.now();

  u = o.createElement(v);
  u.async = 1;
  u.src = e;
  O = o.getElementsByTagName(v)[0];
  O.parentNode.insertBefore(u, O);
})(
  window,
  document,
  'script',
  'https://static.cloud.coveo.com/coveo.analytics.js/2/coveoua.js'
);

const accessToken =
  window.DanaherConfig !== undefined
    ? window.DanaherConfig.searchKey
    : 'xx2a2e7271-78c3-4e3b-bac3-2fcbab75323b';
const organizationId =
  window.DanaherConfig !== undefined
    ? window.DanaherConfig.searchOrg
    : 'danahernonproduction1892f3fhz';
// coveo analytics - end

const authHeader = getAuthorization();
if (
  !authHeader ||
  !(authHeader.has('authentication-token') || authHeader.has('Authorization'))
) {
  getAuthToken();
}

if (!window.location.hostname.includes('localhost')) {
  loadGTM();
  loadrelicScript();
  //loadAT();

  if (isOTEnabled()) {
    if (
      getMetadata('template') === 'ProductDetail' &&
      document.querySelector('h1')
    ) {
      sendCoveoEventProduct();
    } else if (getMetadata('template') !== 'ProductDetail') {
      sendCoveoEventPage();
    }
  }
}
/* eslint-enable */

if (window.DanaherConfig.host === 'stage.lifesciences.danaher.com') {
  loadMiniCart();
  // // Attempt to retrieve the authentication token asynchronously
  const authenticationToken = await getAuthenticationToken();

  // Check if the token retrieval resulted in an error
  if (!authenticationToken?.access_token) {
    // If there's an error, wait briefly and then attempt to log in as a guest user
    setTimeout(async () => {
      await userLogin('guest', '', 'true'); // Login with guest credentials
    });
  }
}
