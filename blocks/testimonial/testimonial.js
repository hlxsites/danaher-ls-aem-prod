import {
  div, img, span,
} from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  // const [quoteIconCell] = block.children;

  const toBoolean = (v) => {
    if (typeof v === 'boolean') return v;
    if (v == null) return false;
    const s = String(v).trim().toLowerCase();
    return s === 'true' || s === 'yes' || s === '1' || s === 'on';
  };

  // Robustly find the quoteIcon field rendered by the CMS
  const quoteSelectors = [
    '[data-name="quoteIcon"]',
    '[data-field="quoteIcon"]',
    '[data-key="quoteIcon"]',
    '[data-property="quoteIcon"]',
    '[name="quoteIcon"]',
    'input[name="quoteIcon"]',
    'input[data-name="quoteIcon"]',
  ];
  let quoteElem = null;
  for (const sel of quoteSelectors) {
    quoteElem = block.querySelector(sel);
    if (quoteElem) break;
  }
  // Fallback to the 5th direct child (model order) or the last child if present
  if (!quoteElem) {
    const fallback = block.querySelector(':scope > *:nth-child(5)') || block.lastElementChild;
    quoteElem = fallback;
  }

  // Extract a usable value for quoteIcon
  let quoteValue = false;
  if (quoteElem) {
    if (quoteElem.tagName === 'INPUT') {
      if (quoteElem.type === 'checkbox' || quoteElem.type === 'radio') {
        quoteValue = quoteElem.checked;
      } else {
        quoteValue = quoteElem.value;
      }
    } else if (quoteElem.dataset && Object.keys(quoteElem.dataset).length) {
      // CMS might store the value in a data attribute
      quoteValue = quoteElem.dataset.value ?? quoteElem.dataset.default ?? quoteElem.textContent;
    } else {
      quoteValue = quoteElem.textContent;
    }
  }
  const showQuoteIcon = toBoolean(quoteValue);
  const buildQuote = div(span({ class: 'icon icon-quote' }));
  block.classList.add('py-6');
  const divEl = block.querySelector('div');
  divEl.classList.add(...'flex items-center gap-8 justify-center'.split(' '));
  const divOfDivEl = block.querySelector(':scope div > div:nth-child(2)') || block?.firstElementChild?.nextElementSibling;
  // const divOfDivEl = block?.firstElementChild?.nextElementSibling;
  divOfDivEl.classList.add(...'text-2xl leading-9 font-medium text-danaherpurple-500 relative'.split(' '));
  const picDivEl = divEl.parentNode.querySelector(':scope div > div:nth-child(1)');
  picDivEl.classList.add(...'hidden lg:block lg:flex-shrink-0'.split(' '));
  decorateIcons(buildQuote);
  buildQuote.firstChild.classList.add('absolute', 'top-16', 'left-28', 'text-indigo-200', 'w-36', 'h-36', '-translate-x-8', '-translate-y-24', 'transform', 'opacity-50');
  const image = block.querySelector('img');
  const imagecopy = image ? img({ src: image?.src, class: 'rounded-full h-16 w-16' }) : null;
  if (image) {
    block.classList.add('has-image');
    image.classList.add(...'main-image w-64 h-64 rounded-full'.split(' '));
  }
  const authorTextDiv = block?.firstElementChild?.nextElementSibling?.nextElementSibling;
  block.innerHTML = '';
  const finalimageDiv = div({ class: 'hidden lg:block lg:flex-shrink-0' });
  if (image) {
    finalimageDiv.append(image);
  }
  const finaldivOfDivEl = div({ class: 'text-2xl leading-9 font-medium text-danaherpurple-500 relative' });
  if (divOfDivEl) {
    finaldivOfDivEl.innerHTML = divOfDivEl.innerHTML;
    let authorImageEl = '';
    if (imagecopy) {
      authorImageEl = img({ src: imagecopy.src, class: 'rounded-full h-16 w-16' });
    }
    const footerElem = div(
      { class: 'testimonial-footer flex text-base leading-6 font-medium text-danahergray-900 mt-4 items-center gap-4' },
      authorImageEl,
      div({ class: 'flex flex-col' }, authorTextDiv || ''),
    );
    finaldivOfDivEl.append(footerElem);
    if (showQuoteIcon) {
      const quoteIcon = div(span({ class: 'icon icon-quote' }));
      decorateIcons(quoteIcon);
      const icon = quoteIcon.querySelector('.icon-quote');
      if (icon) {
        icon.classList.add('absolute', 'top-16', 'left-28', 'text-indigo-200', 'w-36', 'h-36', '-translate-x-8', '-translate-y-24', 'transform', 'opacity-50');
      }
      finaldivOfDivEl.append(quoteIcon);
    }
  }
  divEl.append(finalimageDiv);
  divEl.append(finaldivOfDivEl);
  block.append(divEl);
}
