import { div, h1, p } from '../../scripts/dom-builder.js';
import { applyResponsivePadding } from '../../scripts/common-utils.js';

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
      li.classList.add(...'mb-2'.split(' '));
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
      tagH.style.marginTop = '0px';
    }
  });

  // Styling
  block.classList.add(...'border-b border-gray-200 !pb-6 !mr-5 !lg:mr-0'.split(' '));
  applyResponsivePadding(block, '32px');

  block.querySelectorAll('[id^="overviewdesc_"]').forEach((container) => {
    if (!container) return;

    const imgDiv = container.querySelector('[id^="overviewimage_"]');
    const img = imgDiv?.querySelector('img[src]');

    // Filter out whitespace text nodes + ignore imgDiv
    const textNodes = Array.from(container.childNodes).filter((node) => {
      if (node === imgDiv) return false;
      if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return false;
      return true;
    });

    // Reset container
    container.className = '';

    // ======================================================
    // CASE 1: Image + Text → Two-column layout
    // ======================================================
    if (img && textNodes.length > 0) {
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
        imgDiv.className = 'order-1 flex justify-start lg:max-h-[499px]';
        textWrapper.classList.add('order-2');
      } else {
        imgDiv.className = 'order-2 flex justify-end lg:max-h-[499px]';
        textWrapper.classList.add('order-1');
      }

      container.replaceChildren(textWrapper, imgDiv);
      return;
    }

    // ======================================================
    // CASE 2: ONLY TEXT → Full width (NO wrapper div)
    // ======================================================
    if (!img && textNodes.length > 0) {
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
    if (img && textNodes.length === 0) {
      container.className = 'w-full flex justify-center items-center py-3';
      imgDiv.className = 'w-full flex justify-center my-3';
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
  block.prepend(h1({ class: 'text-2xl text-black leading-8 font-medium', style: 'font-weight: 400 !important; font-size: 24px !important; margin-top: 0px !important' }, 'Description'));
}
