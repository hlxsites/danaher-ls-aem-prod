/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-relative-packages */

// eslint-disable-next-line import/no-extraneous-dependencies
import { JSDOM } from 'jsdom';
import { pipe, toRuntime } from 'crosswalk-converter';
import transform from '../../../importer/import.js';
import converterCfg from '../../../../converter.yaml';
import mappingCfg from '../../../../paths.json';
import createPipeline from './utils.js';
// eslint-disable-next-line
//import pathConfig from './pathConfig.json' with { type: 'json' };

const mediaTypes = {
  'application/atom+xml': false,
  'application/base64': true,
  'application/excel': true,
  'application/font-woff': true,
  'application/gnutar': true,
  'application/java-archive': true,
  'application/javascript': false,
  'application/json': false, // we treat JSON as binary, since its encoding is not variable but defined by RFC4627
  'application/json-patch+json': false, // we treat JSON as binary, since its encoding is not variable but defined by RFC4627
  'application/lha': true,
  'application/lzx': true,
  'application/mspowerpoint': true,
  'application/msword': true,
  'application/octet-stream': true,
  'application/pdf': true,
  'application/postscript': true,
  'application/rss+xml': false,
  'application/soap+xml': false,
  'application/vnd.api+json': true, // we treat JSON as binary, since its encoding is not variable but defined by RFC4627
  'application/vnd.google-earth.kml+xml': false,
  'application/vnd.google-earth.kmz': true,
  'application/vnd.ms-fontobject': true,
  'application/vnd.oasis.opendocument.chart': true,
  'application/vnd.oasis.opendocument.database': true,
  'application/vnd.oasis.opendocument.formula': true,
  'application/vnd.oasis.opendocument.graphics': true,
  'application/vnd.oasis.opendocument.image': true,
  'application/vnd.oasis.opendocument.presentation': true,
  'application/vnd.oasis.opendocument.spreadsheet': true,
  'application/vnd.oasis.opendocument.text': true,
  'application/vnd.oasis.opendocument.text-master': true,
  'application/vnd.oasis.opendocument.text-web': true,
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': true,
  'application/vnd.openxmlformats-officedocument.presentationml.slide': true,
  'application/vnd.openxmlformats-officedocument.presentationml.slideshow': true,
  'application/vnd.openxmlformats-officedocument.presentationml.template': true,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': true,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.template': true,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': true,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.template': true,
  'application/x-7z-compressed': true,
  'application/x-ace-compressed': true,
  'application/x-apple-diskimage': true,
  'application/x-arc-compressed': true,
  'application/x-bzip': true,
  'application/x-bzip2': true,
  'application/x-chrome-extension': true,
  'application/x-compress': true,
  'application/x-compressed': true,
  'application/x-debian-package': true,
  'application/x-dvi': true,
  'application/x-font-truetype': true,
  'application/x-font-opentype': true,
  'application/x-gtar': true,
  'application/x-gzip': true,
  'application/x-latex': true,
  'application/x-rar-compressed': true,
  'application/x-redhat-package-manager': true,
  'application/x-shockwave-flash': true,
  'application/x-tar': true,
  'application/x-tex': true,
  'application/x-texinfo': true,
  'application/x-vrml': false,
  'application/x-www-form-urlencoded': false,
  'application/x-x509-ca-cert': true,
  'application/x-xpinstall': true,
  'application/xhtml+xml': false,
  'application/xml-dtd': false,
  'application/xml': false,
  'application/zip': true,
};

function appendExtensionInbound(path, extension) {
  // append the extension only if the path does not already end with it
  if (!path.endsWith(extension)) {
    path += extension;
  }
  return path;
}

function withoutQueryStringAndAnchor(path, fn) {
  const queryStart = path.indexOf('?');
  const anchorStart = path.indexOf('#');
  let start = -1;

  if (queryStart > 0 && anchorStart > 0) {
    start = Math.min(anchorStart, queryStart);
  } else if (queryStart > 0) {
    start = queryStart;
  } else {
    start = anchorStart;
  }

  if (start > 0) {
    const part = path.substring(start);
    path = path.substring(0, start);
    return fn(path) + part;
  }
  return fn(path);
}

function mapInbound(franklinPath, cfg) {
  if (!cfg.mappings || !franklinPath.startsWith('/')) {
    return franklinPath;
  }

  return withoutQueryStringAndAnchor(franklinPath, (originalPath) => {
    let path = originalPath;
    let extension = '';
    const extensionStart = path.lastIndexOf('.');
    if (extensionStart >= 0) {
      extension = path.substring(extensionStart);
      path = path.substring(0, path.length - extension.length);
    }

    // test the path without extension, and the original path
    const candidates = [path, originalPath];
    const reversedMappings = structuredClone(cfg.mappings).reverse();

    for (const mapping of reversedMappings) {
      const [aemBasePath, franklinBasePath] = mapping.split(':', 2);
      for (const candidate of candidates) {
        if (candidate.startsWith(franklinBasePath)) {
          // mapping from folder or single page?
          if (aemBasePath.endsWith('/')) {
            // folder, e.g. /content/site/us/en/:/us/en/
            // mapping to folder
            if (franklinBasePath.endsWith('/')) {
              return appendExtensionInbound(
                aemBasePath + candidate.substring(franklinBasePath.length),
                extension
              );
            }
            // else, ignore folder => single page as this is not reversible
          } else {
            // single page
            // mapping to a folder aka. /index, e.g. /content/site/us/en:/
            // mapping to a single page, aka. exact match, /content/site/us/en/page:/vanity
            // eslint-disable-next-line no-lonely-if
            if (
              (franklinBasePath.endsWith('/') &&
                candidate.endsWith('/index')) ||
              franklinBasePath === candidate
            ) {
              return appendExtensionInbound(aemBasePath, extension);
            }
          }
        }
      }
    }
    // restore extension
    return appendExtensionInbound(path, extension);
  });
}

export function isBinary(contentType) {
  if (contentType.startsWith('text/') || contentType.startsWith('message/'))
    return false;
  if (
    contentType.startsWith('audio/') ||
    contentType.startsWith('image/') ||
    contentType.startsWith('video/')
  )
    return true;
  return mediaTypes[contentType];
}
function skipConverter(path) {
  // TODO: remove the logic for test pages (with -jck1 in the path)
  if (!path) return false;
  if (path.includes('.json')) return true;
  
  //TODO-We need use this logic for EDS pages

  //   if(path.includes('us/en/products') && !path.includes('/topics-jck1/') ) {
  //   const pathsToConvert = pathConfig.convertPaths.some(convertPath =>
  //   path.includes(convertPath)
  // );
  //   if (!pathsToConvert) {
  //     return true;
  //   }
  //   else 
  //   {
  //     return false;
  //   }
  // }

  if((path.includes('us/en/products/family') || path.includes('us/en/products/sku')|| path.includes('us/en/products/bundle')) && !path.includes('/topics-jck1/')) {
      return false;
  }

  if((path.includes('us/en/products.html') || path.includes('us/en/products/brands') || path.includes('us/en/products/antibodies') || path.includes('us/en/products/assay-kits')) && !path.includes('/topics-jck1/') ) {    
      return true;
  }

  if (path.includes('/us/en/blog-eds/')) return true;
  if (path.includes('/us/en/news-eds/')) return true;
  if (path.includes('/us/en/products-eds')) return true;
  if (path.includes('/us/en/e-buy')) return true;
  // skip the converter for pages like **/products/*/topics/**
  const regex = /\/[^/]+\/[^/]+\/products\/[^/]+\/topics-jck1\/[^/]+/;
  return regex.test(path);
}

function domParser(html, url) {
  return new JSDOM(html, { url }).window.document;
}

function rewriteLink(link, attribute, origin, liveUrls) {
  const urlStr = link.getAttribute(attribute);
  if (urlStr) {
    if (urlStr.startsWith('#')) return;

    const url = urlStr.startsWith('/')
      ? new URL(urlStr, origin)
      : new URL(urlStr);
    if (url.pathname.indexOf('.') > 0 || url.pathname.endsWith('/')) return;

    if (
      url.hostname === origin.hostname ||
      liveUrls.some((liveUrl) => url.hostname === liveUrl.hostname)
    ) {
      link.setAttribute(attribute, `${urlStr}.html`);
      // replace also the text content if it equals the urlStr
      if (link.textContent === urlStr) {
        link.textContent = `${urlStr}.html`;
      }
    }
  }
}

function rewriteImage(image, origin) {
  const src = image.getAttribute('src');
  // for url starting with '/' we add the origin
  if (src && src.startsWith('/')) {
    image.setAttribute('src', new URL(src, origin));
  }
}

async function rewriteLinksAndImages(state) {
  // eslint-disable-next-line prefer-const
  let { blob, contentType, originUrl } = state;
  let { origin, liveUrls = [] } = converterCfg || {};
  if (!Array.isArray(liveUrls)) liveUrls = [liveUrls];
  if (!liveUrls.length) liveUrls.push(origin);
  origin = new URL(origin);
  liveUrls = liveUrls.filter((url) => !!url).map((url) => new URL(url));

  if (contentType === 'text/html') {
    const document = domParser(blob, originUrl);

    // rewrite links
    const links = document.querySelectorAll('[href]');
    links.forEach((link) => {
      rewriteLink(link, 'href', origin, liveUrls);
    });

    // rewrite canonical link
    const metaOgUrl = document.querySelector('meta[property="og:url"]');
    if (metaOgUrl) {
      rewriteLink(metaOgUrl, 'content', origin, liveUrls);
    }

    // rewrite images
    const images = document.querySelectorAll('img[src]');
    images.forEach((image) => {
      rewriteImage(image, origin);
    });

    blob = document.documentElement.outerHTML;

    // eslint-disable-next-line no-param-reassign
    state = {
      ...state,
      originUrl,
      blob,
      contentType,
      contentLength: blob.length,
    };
  }
  return state;
}

function mapPathToFranklinDeliveryServlet(host, path) {
  // host: https://ref--repo--owner.hlx.live
  // mapped path: /bin/franklin.delivery/owner/repo/ref/path
  const [ref, repo, owner] = host.split('://')[1].split('.')[0].split('--');
  return `/bin/franklin.delivery/${owner}/${repo}/${ref}${path}`;
}

function defaultAppendSuffix(mappedPath, suffix) {
  // if suffix is defined and the mapped path has no extension, add suffix
  if (suffix && !mappedPath.includes('.') && !mappedPath.endsWith('/')) {
    /* eslint-disable no-param-reassign */
    mappedPath += suffix;
  }
  return mappedPath;
}

async function fetchContentWithFranklinDeliveryServlet(state, params, opts) {
  // input URL: https://ref--repo--owner/path
  // output URL: https://author-pXYZ-eXYZ.adobeaemcloud.com/bin/franklin.delivery/owner/repo/ref/path
  const { path, queryString } = state;
  const { authorization, loginToken } = params;
  const { origin, suffix, internalHost } = converterCfg || {};
  const appendSuffix = opts.appendSuffix || defaultAppendSuffix;

  if (!origin) {
    throw new Error("'origin' not set in converter.yaml");
  }

  if (!internalHost) {
    throw new Error("'internalHost' not set in converter.yaml");
  }

  let mappedPath = mapPathToFranklinDeliveryServlet(internalHost, path);
  mappedPath = appendSuffix(mappedPath, suffix);
  const originUrl = new URL(mappedPath, origin);
  if (queryString) {
    originUrl.search = queryString;
  }

  const requestHeaders = { 'cache-control': 'no-cache' };
  if (authorization) {
    requestHeaders.authorization = authorization;
  } else if (loginToken) {
    requestHeaders.cookie = loginToken;
  }

  const resp = await fetch(originUrl, { headers: { ...requestHeaders } });

  if (!resp.ok) {
    return { ...state, error: { code: resp.status, message: resp.statusText } };
  }

  const [contentType] = (resp.headers.get('content-type') || 'text/html').split(
    ';'
  );
  const contentLength = resp.headers.get('content-length') || -1;
  // for binaries return the readable stream
  const blob = isBinary(contentType) ? resp.body : await resp.text();

  return {
    ...state,
    originUrl,
    blob,
    contentType,
    contentLength,
  };
}

export async function main(params) {
  // eslint-disable-next-line no-underscore-dangle
  const path = params.__ow_path;
  const { redirectPaths } = converterCfg;

  if (redirectPaths.includes(path)) {
    const aemPath = mapInbound(path, mappingCfg);
    const publisherUrl = `${converterCfg.host}${aemPath}`;
    return {
      headers: { location: publisherUrl },
      statusCode: 302,
    };
  }

  const silent = params.silent === 'true';
  const pipeline = skipConverter(path)
    ? pipe()
        .use(fetchContentWithFranklinDeliveryServlet)
        .use(rewriteLinksAndImages)
    : createPipeline();
  if (silent) {
    pipeline.logger = { log: () => {} };
  }
  return pipeline
    .wrap(toRuntime, {
      transform,
      converterCfg,
      mappingCfg,
      silent,
    })
    .apply(this, [params]);
}