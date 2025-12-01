import { div, h1, p } from '../../scripts/dom-builder.js';
import { applyResponsivePadding } from '../../scripts/common-utils.js';

function validateOverview(container) {
  const logs = {
    missingParent: [],
    mismatchedPairs: [],
    duplicateIds: [],
    orphanImages: [],
    orphanDescs: [],
    otherIssues: [],
  };

  const idMap = new Map();

  // Collect ALL elements with IDs and track duplicates
  container.querySelectorAll('[id]').forEach((el) => {
    const { id } = el;

    if (idMap.has(id)) {
      logs.duplicateIds.push(id);
    } else {
      idMap.set(id, el);
    }
  });

  // Extract all overviewdesc_X and overviewimage_X
  const descs = [...container.querySelectorAll('[id^="overviewdesc_"]')];
  const images = [...container.querySelectorAll('[id^="overviewimage_"]')];

  const descMap = new Map();
  const imageMap = new Map();

  descs.forEach((el) => {
    const num = Number(el.id.split('_')[1]);
    descMap.set(num, el);
  });

  images.forEach((el) => {
    const num = Number(el.id.split('_')[1]);
    imageMap.set(num, el);
  });

  // --- VALIDATION 1 ---
  // image_X must be inside desc_X
  imageMap.forEach((imageEl, num) => {
    const descEl = descMap.get(num);

    if (!descEl) {
      logs.orphanImages.push(`overviewimage_${num} has no matching overviewdesc_${num}`);
      return;
    }

    if (!descEl.contains(imageEl)) {
      logs.missingParent.push(
        `overviewimage_${num} is NOT inside overviewdesc_${num}`,
      );
    }
  });

  // --- VALIDATION 2 ---
  // desc_X should have matching image_X
  descMap.forEach((descEl, num) => {
    const imageEl = imageMap.get(num);

    if (!imageEl) {
      logs.orphanDescs.push(`overviewdesc_${num} has NO overviewimage_${num}`);
    }
  });

  // --- VALIDATION 3 ---
  // Number mismatch check: if image_3 appears under desc_2 etc
  images.forEach((imageEl) => {
    const imgNum = Number(imageEl.id.split('_')[1]);

    // Find nearest parent desc
    const parentDesc = imageEl.closest('[id^="overviewdesc_"]');
    if (parentDesc) {
      const parentNum = Number(parentDesc.id.split('_')[1]);
      if (imgNum !== parentNum) {
        logs.mismatchedPairs.push(
          `overviewimage_${imgNum} is inside overviewdesc_${parentNum} (numbers do not match)`,
        );
      }
    }
  });

  // --- VALIDATION 4 ---
  // Extra: check IDs that accidentally repeat on wrong elements
  container.querySelectorAll('[id^="overviewdesc_"]').forEach((el) => {
    const { id } = el;
    const matches = el.parentNode.querySelectorAll(`#${id}`);

    if (matches.length > 1) {
      logs.otherIssues.push(`ID ${id} appears multiple times within the same parent`);
    }
  });

  // eslint-disable-next-line no-console
  console.log('=== OVERVIEW VALIDATION REPORT ===');
  // eslint-disable-next-line no-console
  console.log('Duplicate IDs:', logs.duplicateIds);
  // eslint-disable-next-line no-console
  console.log('Missing Parent (image not under desc):', logs.missingParent);
  // eslint-disable-next-line no-console
  console.log('Mismatched desc/image numbers:', logs.mismatchedPairs);
  // eslint-disable-next-line no-console
  console.log('Orphan Images:', logs.orphanImages);
  // eslint-disable-next-line no-console
  console.log('Orphan Descs:', logs.orphanDescs);
  // eslint-disable-next-line no-console
  console.log('Other Issues:', logs.otherIssues);

  return logs;
}

export default async function decorate(block) {
  const response = JSON.parse(localStorage.getItem('eds-product-details') || '{}');
  block.replaceChildren();
  block.id = 'overview-tab';
  block.classList.add(...'!mt-0'.split(' '));

  const authoredOverview = document.querySelector('#authored-overview');
  const isPIM = authoredOverview?.children[0]?.textContent?.trim();

  // Adjust padding
  if (block.parentElement?.parentElement) {
    block.parentElement.parentElement.style.padding = '0px 0px 0px 20px';
  }

  let authoredContent = null;
  const elem = authoredOverview?.children[3];

  if (elem) {
    // Always use textContent for encoded HTML
    const encoded = elem.textContent;

    // Decode
    const textarea = document.createElement('textarea');
    textarea.innerHTML = encoded;
    const decoded = textarea.value;

    // Parse into DOM
    const container = document.createElement('div');
    container.innerHTML = decoded;

    // Replace authored block with decoded HTML
    elem.replaceWith(container);

    authoredContent = container;
  }

  // Combine richlongdescription and overview if they exist
  const richLongDesc = response?.raw?.richlongdescription || '';
  const overview = response?.raw?.overview || '';

  if (overview !== '') {
    const container = document.createElement('div');
    container.innerHTML = overview;
    validateOverview(container);
  }

  let combinedContent = '';
  if (richLongDesc || overview) {
    combinedContent = richLongDesc + overview;
  }

  // Final block content
  if (isPIM === 'only-authored' && authoredContent) {
    block.innerHTML = authoredContent.innerHTML;
  } else if (isPIM === 'pim-authored' && authoredContent) {
    block.innerHTML = combinedContent + authoredContent.innerHTML;
  } else {
    block.innerHTML = combinedContent;
  }
  block.querySelectorAll('ul').forEach((ul) => {
    ul.classList.add(...'list-disc ml-3'.split(' '));
    ul.querySelectorAll('li').forEach((li) => {
      li.classList.add(...'mb-2 leading-[22px]'.split(' '));
      const nestedUl = li.querySelector('ul');
      if (nestedUl) {
        nestedUl.classList.add(...'list-circle ml-6 mt-2'.split(' '));
      }
    });
  });
  block.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((tagH) => {
    tagH.classList.add(...'dhls-container !ml-0 font-semibold'.split(' '));
    if (tagH.tagName.toLowerCase() === 'h5') {
      tagH.style.fontSize = '16px';
    }
    if (tagH.tagName.toLowerCase() === 'h3') {
      tagH.style.marginTop = '24px';
      tagH.style.marginBottom = '8px';
    }
  });

  // Styling
  block.classList.add(...'border-b border-gray-200 !pb-6 !mr-5 !lg:mr-0'.split(' '));
  applyResponsivePadding(block, '32px');

  block.querySelectorAll('[id^="overviewdesc_"]').forEach((container) => {
    if (!container) return;

    const imgDiv = container.querySelector('[id^="overviewimage_"]');

    const videoDiv = container.querySelector('[id^="overviewvideo_"]');

    const img = imgDiv?.querySelector('img[src]');

    // Filter out whitespace text nodes + ignore imgDiv
    const textNodes = Array.from(container.childNodes).filter((node) => {
      if (node === imgDiv) return false;
      if (node === videoDiv) return false;
      if (node?.textContent?.trim() === '') return false;
      if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return false;
      return true;
    });
    // Reset container
    container.className = '';

    // check for video tag extensions
    const allowedVideoExtensions = ['.mp4', '.webm', '.ogg']; // manage here
    let embedVideo;
    // ======================================================
    // CASE 1: Video + Text → Two-column layout
    // ======================================================
    if (videoDiv && textNodes.length > 0) {
      const videoFrame = videoDiv?.querySelector('iframe');

      // eslint-disable-next-line max-len
      if (videoFrame && allowedVideoExtensions.some((ext) => videoFrame?.src?.toLowerCase().includes(ext))) {
        embedVideo = `<video src="${videoFrame?.src}" width="100%" height="100%" style="position: absolute;" controls  loop > <source type="video/mp4"></video>`;
        videoDiv?.insertAdjacentHTML('beforeend', embedVideo);
        videoFrame?.remove();
      }

      // eslint-disable-next-line max-len
      if (videoFrame && !allowedVideoExtensions.some((ext) => videoFrame?.src?.toLowerCase().includes(ext))) {
        videoFrame.style.width = '100%';
        videoFrame.style.height = '100%';
        videoFrame.style.position = 'absolute';
      }
      const position = videoDiv.getAttribute('data-position')?.toLowerCase() || 'right';

      container.className = 'grid md:grid-cols-2 py-3 w-full gap-12 items-start';

      const textWrapper = div({
        class: 'w-full flex flex-col gap-2 text-left',
      });

      textNodes.forEach((node) => {
        // ---- Case A: Pure text node → wrap in <p> ----
        if (node.nodeType === Node.TEXT_NODE) {
          const pTag = p();
          pTag.textContent = node.textContent.trim();
          textWrapper.appendChild(pTag);
          return;
        }

        // ---- Case B: If already <p>, append as-is (no duplication) ----
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'P') {
          textWrapper.appendChild(node);
          return;
        }
        // ---- Case C: Any other element (<h3>, <ul>, etc.) ----
        textWrapper.appendChild(node);
      });

      // video left or right ordering
      if (position === 'left') {
        videoDiv.className = 'order-1 flex justify-start lg:max-h-[499px] relative pb-[56.25%]';
        textWrapper.classList.add('order-2');
      } else {
        videoDiv.className = 'order-2 flex justify-end lg:max-h-[499px]  relative pb-[56.25%]';
        textWrapper.classList.add('order-1');
      }

      container.replaceChildren(textWrapper, videoDiv);
      return;
    }

    // ======================================================
    // CASE 1: Image + Text → Two-column layout
    // ======================================================
    if (img && textNodes.length > 0 && !videoDiv) {
      const position = imgDiv.getAttribute('data-position')?.toLowerCase() || 'right';

      container.className = 'grid md:grid-cols-2 py-3 w-full gap-12 items-start';

      const textWrapper = div({
        class: 'w-full flex flex-col gap-2 text-left',
      });

      textNodes.forEach((node) => {
        // ---- Case A: Pure text node → wrap in <p> ----
        if (node.nodeType === Node.TEXT_NODE) {
          const pTag = p();
          pTag.textContent = node.textContent.trim();
          textWrapper.appendChild(pTag);
          return;
        }

        // ---- Case B: If already <p>, append as-is (no duplication) ----
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'P') {
          textWrapper.appendChild(node);
          return;
        }
        // ---- Case C: Any other element (<h3>, <ul>, etc.) ----
        textWrapper.appendChild(node);
      });

      // Image left or right ordering
      if (position === 'left') {
        imgDiv.className = 'order-1 flex justify-start lg:max-w-[499px]';
        textWrapper.classList.add('order-2');
      } else {
        imgDiv.className = 'order-2 flex justify-end lg:max-w-[499px]';
        imgDiv.querySelector('img').classList.add('max-w-full', 'h-auto', 'object-contain');
        textWrapper.classList.add('order-1');
      }

      container.replaceChildren(textWrapper, imgDiv);
      return;
    }

    // ======================================================
    // CASE 2: ONLY TEXT → Full width (NO wrapper div)
    // ======================================================
    if (!img && textNodes.length > 0 && !videoDiv) {
      container.className = 'w-full py-3';

      textNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          node.classList.add('w-full', 'text-left', 'block');
        }
      });
      return;
    }

    // ======================================================
    // CASE 3: ONLY IMAGE → Full width (NO wrapper div)
    // ======================================================
    if (img && textNodes.length === 0 && !videoDiv) {
      container.className = 'w-full flex justify-center items-center py-3';
      imgDiv.className = 'w-full flex justify-center my-3';
    }

    // ======================================================
    // CASE 3: ONLY Video → Full width (NO wrapper div)
    // ======================================================

    if (videoDiv && textNodes?.length === 0) {
      container.className = 'w-full flex justify-center items-center py-3';
      videoDiv.className = 'w-full flex justify-center my-3 relative pb-[56.25%]';
      const videoFrame = videoDiv?.querySelector('iframe');
      // eslint-disable-next-line max-len
      if (videoFrame && allowedVideoExtensions.some((ext) => videoFrame?.src?.toLowerCase().includes(ext))) {
        embedVideo = `<video src="${videoFrame?.src}" width="100%" height="100%" style="position: absolute;" controls  loop > <source type="video/mp4"></video>`;
        videoDiv?.insertAdjacentHTML('beforeend', embedVideo);
        videoFrame?.remove();
      }

      // eslint-disable-next-line max-len
      if (videoFrame && !allowedVideoExtensions.some((ext) => videoFrame?.src?.toLowerCase().includes(ext))) {
        videoFrame.style.width = '100%';
        videoFrame.style.height = '100%';
        videoFrame.style.position = 'absolute';
      }
    }
  });

  const paragraphs = block.querySelectorAll('p');
  paragraphs.forEach((pEle) => {
    if (pEle.textContent.trim() === '') {
      pEle.remove();
      return;
    }
    pEle.style.fontSize = '16px';
    pEle.style.lineHeight = '22px';
    // p.style.fontWeight = '200';
  });

  // Prepend heading
  // block.prepend(h1({ class: 'text-2xl text-black leading-8 font-medium', style: 'font-weight: 400 !important; font-size: 24px !important; margin-top: 0px !important' }, 'Description'));
  block.querySelectorAll('div').forEach((divEle) => {
    // get all element children (ignore text nodes)
    const elementChildren = [...divEle.children].filter(
      (el) => el.nodeType === Node.ELEMENT_NODE,
    );

    // if the div has *no* element children, apply text-xl
    if (elementChildren.length === 0) {
      divEle.style.fontSize = '16px';
      divEle.style.lineHeight = '22px';
    }
  });
}
