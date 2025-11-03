import {
  div, h4, input, label, span,
} from '../../scripts/dom-builder.js';
import { generateUUID } from '../../scripts/scripts.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import { extractJsonFromHtml } from '../../scripts/html-to-json-parser.js';

/**
 * Safely toggles accordion state while ensuring only one stays open.
 * @param {string} blockUUID
 * @param {HTMLElement} activeAccordion
 */
function toggleAccordion(blockUUID, activeAccordion) {
  if (!blockUUID || !activeAccordion) return;

  const allAccordions = document.querySelectorAll(
    `div#accordion-${blockUUID} div.accordion-item`,
  );

  allAccordions.forEach((accordion) => {
    const checkbox = accordion.querySelector('input[type="checkbox"]');
    const panel = accordion.querySelector('div[aria-expanded]');
    if (!checkbox || !panel) return;

    if (accordion.id === activeAccordion.id) {
      const isExpanded = checkbox.checked;
      checkbox.checked = !isExpanded;
      panel.setAttribute('aria-expanded', !isExpanded ? 'true' : 'false');
    } else if (checkbox.checked) {
      checkbox.checked = false;
      panel.setAttribute('aria-expanded', 'false');
    }
  });
}

/**
 * Creates one accordion item using DOM builder.
 */
function createAccordionItem(question, answer, index, uuid, parentUUID) {
  if (!question || !answer) return div();

  const accordionItem = div({
    class: 'accordion-item relative py-6 border-b border-gray-300',
    id: `accordion-item-${index}`,
  });

  const inputId = `accordion-${uuid}-${index}`;
  const panelId = `panel-${uuid}-${index}`;

  const checkboxInput = input({
    type: 'checkbox',
    class: 'peer hidden absolute',
    id: inputId,
  });

  const labelEl = label(
    {
      for: inputId,
      class: `flex items-center justify-between w-full text-left font-semibold py-2 cursor-pointer
        peer-[&_span.chevron-up]:opacity-100 peer-checked:[&_span.chevron-up]:opacity-0
        peer-[&_span.chevron-down]:opacity-0 peer-checked:[&_span.chevron-down]:opacity-100`,
    },
    h4(
      { class: 'leading-7 my-0 mr-12' },
      question,
    ),
    span({
      class:
        'icon icon-chevron-down w-6 h-6 absolute right-0 text-gray-500 chevron-up [&_svg>use]:stroke-gray-500',
    }),
    span({
      class:
        'icon icon-chevron-up w-6 h-6 absolute right-0 text-gray-500 chevron-down [&_svg>use]:stroke-gray-500',
    }),
  );

  const answerPanel = div(
    {
      class: `grid text-sm overflow-hidden transition-all duration-300 ease-in-out
        grid-rows-[0fr] opacity-0 peer-checked:py-2
        peer-checked:grid-rows-[1fr] peer-checked:opacity-100`,
      'aria-expanded': 'false',
      id: panelId,
    },
    div(
      { class: 'accordion-answer text-base font-extralight leading-7 overflow-hidden' },
      answer,
    ),
  );

  labelEl.addEventListener('click', (e) => {
    e.preventDefault();
    toggleAccordion(parentUUID, accordionItem);
  });

  accordionItem.append(checkboxInput, labelEl, answerPanel);
  return accordionItem;
}

/**
 * Decorates the FAQ accordion block.
 */
export default async function decorate(block) {
  if (!block) return;

  try {
    // Base block setup
    block.id = 'faqs-tab';
    block.append(div({ class: 'block-pdp-faqs' }));
    if (block?.parentElement?.parentElement) {
      block.parentElement.parentElement.style.padding = '0px 0px 0px 20px';
    }
    block.classList.add(
      ...'border-b border-gray-200 !pb-6 !mr-5 !lg:mr-0'.split(' '),
    );
    const response = JSON.parse(localStorage.getItem('eds-product-details'));
    let faqsResponse = [];
    const faqJson = response?.raw?.faqpreviewjson;
    if (typeof faqJson === 'string' && faqJson.trim() !== '') {
      faqsResponse = JSON.parse(faqJson);
    }

    // Safe JSON data — can later be fetched or localized
    const isPIM = document.querySelector('#authored-faqs')?.children[0]?.textContent;
    const elem = document.querySelector('#authored-faqs')?.children[3];
    let parsedData;

    if (elem) parsedData = extractJsonFromHtml(elem);

    if (isPIM === 'only-authored') {
      if (!parsedData) {
        block.innerHTML = `<h3>Please check ${document.querySelector('#authored-faqs')?.querySelector('.authored-tab-type').textContent} JSON </h3>`;
        block.classList.add(...'border-b border-gray-200 !pb-6 !mr-5 !lg:mr-0 pt-2 md:pt-0'.split(' '));
        return;
      }
      faqsResponse = parsedData;
    } else if (isPIM === 'pim-authored') {
      if (!parsedData) {
        block.innerHTML = `<h3>Please check ${document.querySelector('#authored-faqs')?.querySelector('.authored-tab-type').textContent} JSON </h3>`;
        block.classList.add(...'border-b border-gray-200 !pb-6 !mr-5 !lg:mr-0 pt-2 md:pt-0'.split(' '));
        return;
      }
      if (parsedData?.length > 0) faqsResponse.push(...parsedData);
    }
    if (!(faqsResponse.length > 0)) return;
    const faqsData = faqsResponse
    || [
      {
        Id: '11',
        Question: 'Quel',
        Answer: 'Ans',
        AvailableCountry:
          'en-us;en-ca;zh-cn;en-gb;de-de;ch-ch;it-it;fr-fr;es-es',
      },
      {
        Id: '1',
        Question: 'FAQ 1',
        Answer: 'FAQ 1 Ans',
        AvailableCountry: 'en-us;en-ca',
      },
    ];

    if (!Array.isArray(faqsData) || faqsData.length === 0) return;

    const customUUID = generateUUID();
    const accordionWrapper = div({
      class: 'block-pdp-faqs-container flex flex-col w-full',
      id: `accordion-${customUUID}`,
    });

    faqsData.forEach((faq, index) => {
      const item = createAccordionItem(
        faq?.Question || `Question ${index + 1}`,
        faq?.Answer || '',
        index,
        customUUID,
        customUUID,
      );
      accordionWrapper.append(item);
    });

    decorateIcons(accordionWrapper);

    const faqBlock = block.querySelector('.block-pdp-faqs');
    if (faqBlock) faqBlock.append(accordionWrapper);
  } catch (err) {
    // Fail-safe: prevent any runtime crash from breaking the page
    console.error('Error decorating FAQ accordion:', err);
  }
  block?.classList.add('dhls-container');
  block.prepend(div({ class: 'text-2xl mt-12 text-black leading-8 font-medium', style: 'font-weight: 400 !important;' }, 'FAQs'));
}
