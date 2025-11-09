import {
  div, img, span,
} from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  const buildQuote = div(span({ class: 'icon icon-quote' }));
  block.classList.add('py-6');
  const divEl = block.querySelector('div');
  divEl.classList.add(...'flex items-center gap-8 justify-center'.split(' '));
  const divOfDivEl = block.querySelector(':scope div > div:nth-child(2)') || block?.firstElementChild?.nextElementSibling;
  // const divOfDivEl = block?.firstElementChild?.nextElementSibling;
  divOfDivEl.classList.add(...'text-2xl leading-9 font-medium text-danahergreyblue-500 relative'.split(' '));
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
    const finaldivOfDivEl = div({ class: 'text-2xl leading-9 font-medium text-danahergreyblue-500 relative' });
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
      const quoteIcon = div(span({ class: 'icon icon-quote' }));
      decorateIcons(quoteIcon);
      const icon = quoteIcon.querySelector('.icon-quote');
      if (icon) {
        icon.classList.add('absolute', 'top-16', 'left-28', 'text-indigo-200', 'w-36', 'h-36', '-translate-x-8', '-translate-y-24', 'transform', 'opacity-50');
      }
      finaldivOfDivEl.append(quoteIcon);
    }
    divEl.append(finalimageDiv);
    divEl.append(finaldivOfDivEl);
    block.append(divEl);
}
