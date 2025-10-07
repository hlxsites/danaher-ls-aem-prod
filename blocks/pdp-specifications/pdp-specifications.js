import {
  div, table, tbody, td, th, tr,
} from '../../scripts/dom-builder.js';
import { extractJsonFromHtml } from '../../scripts/html-to-json-parser.js';

export default async function decorate(block) {
  block.replaceChildren();
  block.id = 'specifications-tab';
  block.parentElement.parentElement.style.padding = '0px 0px 0px 20px';

  const isPIM = document.querySelector('#authored-specifications')?.children[0]?.textContent;
  const response = JSON.parse(localStorage.getItem('eds-product-details'));
  let attrJson = [];
  if (response?.raw?.attributejson) attrJson = JSON.parse(response.raw.attributejson);

  const elem = document.querySelector('#authored-specifications')?.children[3];
  let parsedData;
  if (elem) parsedData = extractJsonFromHtml(elem);

  if (isPIM === 'only-authored') {
    if (!parsedData) {
      block.innerHTML = `<h3>Please check ${document.querySelector('#authored-specifications')?.querySelector('.authored-tab-type').textContent} JSON </h3>`;
      block.classList.add(...'border-b border-gray-200 !pb-6 !mr-5 !lg:mr-0 pt-2 md:pt-0'.split(' '));
      return;
    }
    attrJson = parsedData;
  } else if (isPIM === 'pim-authored') {
    if (!parsedData) {
      block.innerHTML = `<h3>Please check ${document.querySelector('#authored-specifications')?.querySelector('.authored-tab-type').textContent} JSON </h3>`;
      block.classList.add(...'border-b border-gray-200 !pb-6 !mr-5 !lg:mr-0 pt-2 md:pt-0'.split(' '));
      return;
    }
    if (parsedData?.length > 0) attrJson.push(...parsedData);
  }

  function cleanValue(val) {
    if (val === null || val === undefined) return '-';
    if (typeof val === 'string') {
      if (val.trim() === '' || val.toLowerCase() === 'null') return '-';
      return val;
    }
    if (Array.isArray(val)) {
      const filtered = val.filter((v) => v !== null
        && v !== undefined
        && v.toString().trim() !== ''
        && v.toString().toLowerCase() !== 'null');
      if (filtered?.length === 0) return '-';
      return filtered.join(', ');
    }
    return val.toString();
  }

  block.innerHTML = '';
  block.append(div({ class: 'text-2xl text-black py-6' }, 'Specifications'));

  const attrWrapper = div({ class: 'attr-wrapper' });

  if (Array.isArray(attrJson) && attrJson?.length > 0) {
    attrJson.forEach((item, idx) => {
      if (!item.label || item.label.trim() === '') return;

      const tableTag = table({ class: 'min-w-full border-[0.5px] lg:border divide-gray-300 mb-6' });

      const caption = document.createElement('caption');
      caption.className = idx === 0
        ? 'font-medium leading-6 text-black pb-6 text-left'
        : 'font-medium leading-6 text-black py-6 text-left';
      caption.style.fontSize = '14px';
      caption.style.lineHeight = '20px';
      caption.style.captionSide = 'top';
      caption.textContent = item.label;
      tableTag.appendChild(caption);

      const tbodyTag = tbody();
      if (Array.isArray(item.value)) {
        item.value.forEach((items) => {
          if (!items.label || items.label.trim() === '') return;

          const displayValue = cleanValue(items.value);
          const displayUnit = displayValue !== '-' ? (items.unit || '') : '';

          // Single row, two cells: stacked vertically on mobile, side-by-side on desktop
          const trTag = tr({ class: 'flex flex-col md:table-row w-full' });

          const thTag = th({ class: 'p-4 text-base font-medium text-gray-900 bg-gray-100 align-middle border border-gray-300 text-left w-full md:w-1/4' });

          thTag.style.fontSize = '14px';
          thTag.style.lineHeight = '20px';
          thTag.textContent = items.label;

          const tdTag = td({ class: 'p-4 text-sm text-black break-words align-middle border-[0.5px] lg:border border-gray-300 text-left w-full md:w-2/4' });
          tdTag.textContent = displayValue;
          if (displayUnit) {
            const unitSpan = document.createElement('span');
            unitSpan.className = 'px-1';
            unitSpan.textContent = displayUnit;
            tdTag.appendChild(unitSpan);
          }

          trTag.appendChild(thTag);
          trTag.appendChild(tdTag);
          tbodyTag.appendChild(trTag);
        });
      }
      tableTag.appendChild(tbodyTag);
      attrWrapper.appendChild(tableTag);
    });

    block.innerHTML = '';
    block.append(div({ class: 'text-2xl text-black leading-8 font-medium py-6', style: 'font-weight: 400 !important;' }, 'Specifications'));
    block.append(attrWrapper);
  }

  block.classList.add(...'border-b border-gray-200 !pb-6 !mr-5 !lg:mr-0 pt-2 md:pt-0'.split(' '));
}
