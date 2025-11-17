import {
  div, h2, h3, input, label, span, img,
} from '../../scripts/dom-builder.js';
import { generateUUID } from '../../scripts/scripts.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

function toggleAccordion(blockUUID, activeAccordion) {
  const allAccordions = document.querySelectorAll(
    `div#accordion-${blockUUID} div.accordion-item`,
  );
  allAccordions.forEach((accordion) => {
    const checkbox = accordion.querySelector('input[type="checkbox"]');
    const panel = accordion.querySelector('div[aria-expanded]');

    if (accordion.id === activeAccordion.id) {
      // Toggle the active accordion
      const isExpanded = checkbox.checked;
      checkbox.checked = !isExpanded;
      panel.setAttribute('aria-expanded', !isExpanded ? 'true' : 'false');
    } else if (checkbox.checked) {
      // Close other accordions
      checkbox.checked = false;
      panel.setAttribute('aria-expanded', 'false');
    }
  });
}

function createAccordionBlock(
  question,
  answer,
  uuid,
  parentElement,
  index,
  customUUID,
) {
  parentElement.innerHTML = '';
  parentElement.classList.add(
    'accordion-item',
    'relative',
    'py-6',
    'border-t',
    'border-gray-300',
  );
  parentElement.id = `accordion-item-${index}`;

  const inputId = `accordion-${uuid}-${index}`;
  const panelId = `panel-${uuid}-${index}`;

  const summaryInput = input({
    type: 'checkbox',
    class: 'peer hidden absolute',
    name: 'accordions',
    value: uuid,
    id: inputId,
    'aria-labelledby': question,
  });

  const summaryContent = label(
    {
      for: inputId,
      title: question,
      'aria-controls': panelId,
      class: `flex items-center justify-between w-full text-left font-semibold py-2 cursor-pointer
        peer-[&_span.chevron-up]:opacity-100 peer-checked:[&_span.chevron-up]:opacity-0
        peer-[&_span.chevron-down]:opacity-0 peer-checked:[&_span.chevron-down]:opacity-100`,
    },
    h3(
      { class: '!text-xl font-medium leading-7 my-0 mr-12', title: question },
      question,
    ),
    span({
      class:
        'icon icon-chevron-down w-6 h-6 absolute right-0 fill-current text-gray-500 chevron-up [&_svg>use]:stroke-gray-500',
    }),
    span({
      class:
        'icon icon-chevron-up w-6 h-6 absolute right-0 fill-current text-gray-500 chevron-down [&_svg>use]:stroke-gray-500',
    }),
  );

  const panel = div(
    {
      class: `grid text-sm overflow-hidden transition-all duration-300 ease-in-out
        grid-rows-[0fr] opacity-0 peer-checked:py-2
        peer-checked:grid-rows-[1fr] peer-checked:opacity-100`,
      'aria-expanded': 'false',
      id: panelId,
    },
    div({
      class:
        'accordion-answer text-base font-extralight leading-7 overflow-hidden',
    }),
  );

  answer.forEach((element) => {
    panel.querySelector('.accordion-answer').innerHTML += element;
  });

  const liElements = panel.querySelectorAll('p,ul,li,a');
  liElements.forEach((liEle) => {
    const strongElements = liEle.querySelectorAll('strong');
    if (strongElements?.length) {
      strongElements.forEach((strong) => {
        strong.classList.add('font-bold');
      });
    }
  });

  panel.querySelectorAll('a').forEach((link) => {
    link.classList.remove('btn', 'btn-outline-primary');
    link.classList.add(
      'text-black',
      'underline',
      'decoration-black',
      'hover:decoration-danaherpurple-500',
      'hover:bg-danaherpurple-25',
      'text-danaherpurple-500',
      'hover:bg-danaherpurple-25',
      'hover:text-danaherpurple-500',
    );
  });

  summaryContent.addEventListener('click', (event) => {
    event.preventDefault();
    toggleAccordion(customUUID, parentElement);
  });

  parentElement.append(summaryInput, summaryContent, panel);
  return parentElement;
}

export default async function decorate(block) {
  const wrapper = document.querySelector('.accordion-with-image-wrapper');
  wrapper?.parentElement?.removeAttribute('class');
  wrapper?.parentElement?.removeAttribute('style');

  const customUUID = generateUUID();

  // Extract super title
  const superTitleEl = block.querySelector('[data-aue-prop="super_title"]');
  const superTitle = superTitleEl?.textContent.trim() || '';

  // Extract image
  const imageEl = block.querySelector('picture');
  const imageAltEl = block.querySelector('[data-aue-prop="image_alt"]');
  const imageAlt = imageAltEl?.textContent.trim() || '';

  // Get accordion items (skip first row which has super title and image)
  const accordionItems = Array.from(block.children).slice(1);

  const dynamicData = accordionItems
    .map((element) => {
      const titleEl = element.querySelector('[data-aue-prop="item_title"]');
      const question = titleEl?.textContent.trim() || '';

      const descEl = element.querySelector('[data-aue-prop="item_description"]');
      const answer = descEl?.innerHTML || '';

      return { question, answer };
    })
    .filter((item) => item.question && item.answer);

  if (dynamicData.length > 0) {
    const accordionContainerWrapper = div({
      class: 'dhls-container mx-auto px-5 lg:px-0',
    });

    const layoutContainer = div({
      class: 'flex flex-col lg:flex-row gap-x-8 w-full max-w-7xl mx-auto',
    });

    // Left side - Image and Title
    const leftContainer = div(
      { class: 'lg:w-[400px] mb-8 lg:mb-0' },
    );

    if (superTitle) {
      leftContainer.appendChild(
        h2({ class: '!text-[32px] font-bold !mb-6' }, superTitle),
      );
    }

    if (imageEl) {
      const imageWrapper = div({ class: 'w-full' });
      const clonedImage = imageEl.cloneNode(true);
      const imgTag = clonedImage.querySelector(img);
      if (imgTag) {
        imgTag.classList.add('w-full', 'h-auto', 'rounded-lg');
        if (imageAlt) imgTag.alt = imageAlt;
      }
      imageWrapper.appendChild(clonedImage);
      leftContainer.appendChild(imageWrapper);
    }

    // Right side - Accordion
    const dynamicAccordionItems = dynamicData.map((data, index) => {
      const uuid = generateUUID();
      return createAccordionBlock(
        data.question,
        [data.answer],
        uuid,
        div(),
        index,
        customUUID,
      );
    });

    const accordionContainer = div(
      { class: 'lg:w-[840px] flex flex-col', id: `accordion-${customUUID}` },
      ...dynamicAccordionItems,
    );

    layoutContainer.append(leftContainer, accordionContainer);
    accordionContainerWrapper.append(layoutContainer);

    decorateIcons(accordionContainerWrapper);
    block.innerHTML = '';
    block.append(accordionContainerWrapper);
  }
}
