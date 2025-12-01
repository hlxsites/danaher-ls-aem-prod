import { loadScript, toClassName } from '../../scripts/lib-franklin.js';
import { div } from '../../scripts/dom-builder.js';
// eslint-disable-next-line import/no-cycle
import { setJsonLd } from '../../scripts/scripts.js';

// YT

async function getYouTubeMeta(videoUrl) {
  const videoId = new URL(videoUrl).searchParams.get('v');
  const formattedUrl = `https://www.youtube.com/watch?v=${videoId}`;

  const res = await fetch(
    `https://noembed.com/embed?dataType=json&url=${formattedUrl}`,
  );
  const data = await res.json();

  return {
    embedUrl: videoUrl,
    name: data.title,
    description: data.description,
    thumbnailUrl: data.thumbnail_url,
    duration: data.duration,
    uploadDate: data.upload_date,

    '@context': 'https://schema.org/',
    '@type': 'VideoObject',
    hasPart: [],
  };
}

// Vimeo
async function getVimeoMeta(videoUrl) {
  const oembedUrl = `https://vimeo.com/api/oembed.json?url=${videoUrl}`;
  const data = await fetch(oembedUrl).then((r) => r.json());

  return {
    embedUrl: videoUrl,
    name: data.title,
    description: data.description,
    thumbnailUrl: data.thumbnail_url,
    duration: data.duration,
    uploadDate: data.upload_date,
    '@context': 'https://schema.org/',
    '@type': 'VideoObject',
    hasPart: [],
  };
}

// Vidyard
async function getVidyardMeta(videoUrl) {
  const oembedUrl = `https://api.vidyard.com/dashboard/v1/oembed?url=${videoUrl}`;
  const data = await fetch(oembedUrl).then((r) => r.json());

  return {
    name: data.name || data.title,
    description: data.description,
    thumbnailUrl: data.thumbnail_url,
    duration: data.duration,
    uploadDate: data.upload_date,
  };
}

// load the Schema
async function getVideoMetadata(url) {
  if (/youtube\.com|youtu\.be/.test(url)) {
    setJsonLd(await getYouTubeMeta(url), 'Video');
  }
  if (/vimeo\.com/.test(url)) {
    setJsonLd(await getVimeoMeta(url), 'Video');
  }
  if (/vidyard\.com/.test(url)) {
    await getVidyardMeta(url);
  }
}

const getDefaultEmbed = (url) => `<div style="flex justify-center left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
      <iframe src="${url.href}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen=""
        scrolling="no" allow="encrypted-media" title="Content from ${url.hostname}" loading="lazy">
      </iframe>
    </div>`;

const embedPdfViewer = (block, url) => {
  loadScript('https://acrobatservices.adobe.com/view-sdk/viewer.js');

  const pdfEmbedKey = window.DanaherConfig !== undefined ? window.DanaherConfig.pdfEmbedKey : '';

  const VIEWER_CONFIG = [
    { 'sized-container': { embedMode: 'SIZED_CONTAINER' } },
    { showfullscreen: { showFullScreen: true } },
    { showdownload: { showDownloadPDF: true } },
    { showannotationtools: { showAnnotationTools: true } },
    { showprint: { showPrintPDF: true } },
  ];

  const config = [...block.classList].filter((item) => item !== 'embed' && item !== 'block').map((item) => {
    const configItem = VIEWER_CONFIG.find((cfg) => cfg[item]);
    return Object.entries(configItem)[0][1];
  });

  const embedHTML = div({ id: 'adobe-dc-view', style: 'width: 100%; height: 500px' });
  const fileName = url.pathname.split('/').pop();
  document.addEventListener('adobe_dc_view_sdk.ready', () => {
    // eslint-disable-next-line no-undef
    const adobeDCView = new AdobeDC.View({
      clientId: pdfEmbedKey,
      divId: 'adobe-dc-view',
    });
    adobeDCView.previewFile(
      {
        content: { location: { url: url.pathname } },
        metaData: { fileName },
      },
      Object.assign({}, ...config),
    );
  });
  return embedHTML.outerHTML;
};

const embedYoutube = (block, url, autoplay) => {
  const usp = new URLSearchParams(url.search);
  const suffix = autoplay ? '&muted=1&autoplay=1' : '';
  let vid = usp.get('v') ? encodeURIComponent(usp.get('v')) : '';
  const embed = url.pathname;
  if (url.origin.includes('youtu.be')) {
    [, vid] = url.pathname.split('/');
  }
  const embedHTML = `<div style="flex justify-center left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
        <iframe src="https://www.youtube.com${vid ? `/embed/${vid}?rel=0&v=${vid}${suffix}` : embed}"
        style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;"
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope; picture-in-picture" allowfullscreen="" scrolling="no" title="Content from Youtube" loading="lazy"></iframe>
      </div>`;
  return embedHTML;
};

const embedVimeo = (block, url, autoplay) => {
  const video = url.pathname.split('/').pop();
  const suffix = autoplay ? '?muted=1&autoplay=1' : '';
  const embedHTML = `<div style="flex justify-center left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
      <iframe src="https://player.vimeo.com/video/${video}${suffix}"
      style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;"
      frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen
      title="Content from Vimeo" loading="lazy"></iframe>
    </div>`;
  return embedHTML;
};

// To play vidyard videos
const embedVidyard = (block, url, autoplay) => {
  const video = url.pathname.split('/').pop();
  const suffix = autoplay ? '?muted=1&autoplay=1' : '';
  const embedHTML = `<div style="flex justify-center left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
      <iframe src="https://play.vidyard.com/${video}${suffix}"
      style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;"
      frameborder="0" allowtransparency="true" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen
      title="video" loading="lazy"></iframe>
    </div>`;
  return embedHTML;
};

const loadEmbed = async (block, link, autoplay) => {
  if (block.classList.contains('embed-is-loaded')) {
    return;
  }

  const EMBEDS_CONFIG = [
    {
      match: ['youtube', 'youtu.be'],
      embed: embedYoutube,
    },
    {
      match: ['vimeo'],
      embed: embedVimeo,
    },
    {
      match: ['vidyard'],
      embed: embedVidyard,
    },
    {
      match: ['/content/dam/danaher/', '.pdf'],
      embed: embedPdfViewer,
    },
  ];

  const config = EMBEDS_CONFIG.find((e) => e.match.some((match) => link.includes(match)));
  const url = new URL(link);
  if (config) {
    await getVideoMetadata(link);
    block.innerHTML = config.embed(block, url, autoplay);
    block.classList = `block embed embed-${toClassName(config.match[0])} my-8 mx-auto text-center`;
    block.parentNode.classList.add('w-full');
  } else {
    block.innerHTML = getDefaultEmbed(url);
    block.classList = 'block embed my-8 mx-auto text-center';
  }
  block.classList.add('embed-is-loaded');
};

export default function decorate(block) {
  const link = block.querySelector('a').href;
  block.textContent = '';

  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      setTimeout(() => {
        loadEmbed(block, link);
      }, 2000);
    }
  });
  observer.observe(block);
}
