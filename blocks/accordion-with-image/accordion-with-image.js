import {
  div, h2, h3, input, label, span,
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
        peer-[&_span.plus-icon]:opacity-100 peer-checked:[&_span.plus-icon]:opacity-0
        peer-[&_span.minus-icon]:opacity-0 peer-checked:[&_span.minus-icon]:opacity-100`,
    },
    h3(
      { class: '!text-xl font-medium leading-7 my-0 mr-12', title: question },
      question,
    ),
    span({
      class:
        'icon icon-dam-Plus w-6 h-6 absolute right-0 fill-current text-gray-500 plus-icon [&_svg>use]:stroke-gray-500',
    }),
    span({
      class:
        'icon icon-dam-Minus w-6 h-6 absolute right-0 fill-current text-gray-500 minus-icon [&_svg>use]:stroke-gray-500',
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

  // Add answer content
  panel.querySelector('.accordion-answer').innerHTML = answer;

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
  /* const wrapper = document.querySelector('.accordion-with-image-wrapper');
   wrapper?.parentElement?.removeAttribute('class');
  wrapper?.parentElement?.removeAttribute('style');
 */
  const customUUID = generateUUID();

  // Get all direct children of the block (safely)
  let blockChildren = [];
  if (block && block.children) {
    try {
      blockChildren = Array.from(block.children);
    } catch (e) {
      blockChildren = [];
    }
  }
  if (!Array.isArray(blockChildren)) blockChildren = [];

  let superTitle = '';
  let imageEl = null;
  const accordionItemElements = [];

  // Loop through all children to find title, image, and accordion items
  blockChildren.forEach((child) => {
    const innerDiv = child.querySelector(':scope > div');

    // Check if this child has a picture (image)
    const picture = child.querySelector('picture') || innerDiv?.querySelector('picture');
    if (picture && !imageEl) {
      imageEl = picture;
    }

    // Check if this child has the super title
    const pTags = innerDiv?.querySelectorAll('p') || [];

    // If it's a single p tag without picture and no super title yet, it might be the title
    if (pTags.length === 1 && !pTags[0].querySelector('picture') && !superTitle) {
      const potentialTitle = pTags[0].textContent.trim();
      // Check if it looks like a title (not too long, doesn't have accordion item structure)
      if (potentialTitle && potentialTitle.length < 100) {
        superTitle = potentialTitle;
      }
    }

    // If it has 2+ p tags, it's likely an accordion item
    if (pTags.length >= 2) {
      accordionItemElements.push(child);
    }
  });

  const dynamicData = accordionItemElements
    .map((element) => {
      // Each accordion item has the structure: <div><div><p>Title</p><p>Description</p></div></div>
      const innerDiv = element.querySelector(':scope > div');
      if (!innerDiv) return null;

      const pTags = innerDiv.querySelectorAll('p');
      if (pTags.length < 2) return null;

      const question = pTags[0].textContent.trim();

      // Get all content after the first p tag as answer
      const answerContent = Array.from(pTags).slice(1).map((p) => p.outerHTML).join('');
      return { question, answer: answerContent };
    })
    .filter((item) => item && item.question && item.answer);

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
      const imgTag = clonedImage.querySelector('img');
      if (imgTag) {
        imgTag.classList.add('w-full', 'h-auto', 'rounded-lg');
      }
      imageWrapper.appendChild(clonedImage);
      leftContainer.appendChild(imageWrapper);
    } else {
      console.warn('No image found in the first child element');
    }

    // Right side - Accordion
    const dynamicAccordionItems = dynamicData.map((data, index) => {
      const uuid = generateUUID();
      return createAccordionBlock(
        data.question,
        data.answer,
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

    // Clear block and add new content
    block.innerHTML = '';
    block.append(accordionContainerWrapper);
  }
}
