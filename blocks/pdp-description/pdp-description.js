import { div } from '../../scripts/dom-builder.js';
import { applyResponsivePadding } from '../../scripts/common-utils.js';

export default async function decorate(block) {
  const response = JSON.parse(localStorage.getItem('eds-product-details') || '{}');
  block.replaceChildren();
  block.id = 'overview-tab';

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

  // Styling
  block.classList.add(...'border-b border-gray-200 !pb-6 !mr-5 !lg:mr-0'.split(' '));
  applyResponsivePadding(block, '32px');

  const paragraphs = block.querySelectorAll('p');
  paragraphs.forEach((p) => {
    p.style.fontSize = '16px';
    p.style.lineHeight = '22px';
   // p.style.fontWeight = '200';
  });

  block.querySelectorAll('[id^="overviewdesc_"]').forEach((container) => {
    const imgDiv = container.querySelector('[id^="overviewimage_"]');
    const img = imgDiv?.querySelector('img[src]');
    const text = container.querySelectorAll('p');

    // Reset
    container.className = '';
    if (imgDiv) imgDiv.className = '';
    if (text) text.className = '';

    if (img && text.length > 0) {
      const position = imgDiv.getAttribute('data-position')?.toLowerCase() || 'right';

      container.className = 'grid md:grid-cols-2 py-3 w-full gap-12';
      const textWrapper = div({ class: 'w-full text-left' });
      text.forEach((p) => {
        p.className = 'w-full text-left';
        textWrapper.appendChild(p);
      });

      if (position === 'left') {
        imgDiv.className = 'order-1 flex items-center justify-start';
        textWrapper.className += ' order-2';
      } else {
        imgDiv.className = 'order-2 flex items-start lg:max-h-[499px]';
        textWrapper.className += ' order-1';
      }
      container.replaceChildren(imgDiv, textWrapper);
    } else if (text.length > 0) {
      //container.className = 'flex justify-center items-center w-full';
      text.forEach((p) => {
        p.className = 'text-left w-full';
      });
    } else if (img) {
      container.className = 'flex justify-center items-center w-full';
      imgDiv.className = 'my-3';
    }
  });

  // Prepend heading
  block.prepend(div({ class: 'text-2xl text-black leading-8 font-medium', style: 'font-weight: 400 !important;' }, 'Description'));
}
