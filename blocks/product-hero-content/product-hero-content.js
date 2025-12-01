import {
  a, div, p,
  span,
} from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

function buildSubCategorySchema(categoryName, description, pageUrl) {
  const existingScript = document.head.querySelector('script[data-name="subCategorySchema"]');

  // If schema already exists → append new ListItem
  if (existingScript) {
    try {
      const existingData = JSON.parse(existingScript.textContent.trim());

      if (!Array.isArray(existingData.itemListElement)) {
        existingData.itemListElement = [];
      }

      const newItem = {
        '@type': 'ListItem',
        position: existingData.itemListElement.length + 1,
        name: categoryName,
        description,
        url: pageUrl,
      };

      existingData.itemListElement.push(newItem);

      // Update script with new schema
      existingScript.textContent = JSON.stringify(existingData, null, 2);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error updating existing subcategory schema:', err);
    }
  } else {
    // If schema does NOT exist → create new ItemList schema
    const data = {
      '@context': 'https://schema.org/',
      '@type': 'ItemList',
      name: document.querySelector('meta[name="categorytitle"]')?.content || document.title,
      description: document.querySelector('meta[name="description"]')?.content || document.title,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: categoryName,
          description,
          url: pageUrl,
        },
      ],
    };

    const script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('data-name', 'subCategorySchema');
    script.textContent = JSON.stringify(data, null, 2);
    document.head.appendChild(script);
  }
}

export default function decorate(block) {
  block.parentElement.parentElement.style.padding = '0';
  block.parentElement.parentElement.style.margin = '0';
  const blockId = block.firstElementChild?.firstElementChild?.firstElementChild?.textContent.trim() || '';
  const productHeroContentWrapper = div({
    class:
      'dhls-container mx-auto flex flex-col md:flex-row gap-6 px-5 lg:px-0 scroll-mt-32',
    id: blockId,
  });
  // Extract title and description
  const subProductTitle = block.firstElementChild?.firstElementChild?.children[1]?.textContent?.trim() || '';
  const subProductDescription = block.firstElementChild?.firstElementChild?.children[2]?.textContent?.trim() || '';
  const readMoreLabel = block.children[1]?.firstElementChild?.firstElementChild?.textContent.trim() || '';
  const readMoreLink = block.children[1]?.querySelector('a')?.href || '';
  const openNewTab = block.children[2]?.querySelector('p')?.textContent;

  // Title section
  const titleDiv = div(
    {
      style: '',
      class: 'w-full lg:w-[400px] flex justify-start items-start gap-12',
    },
    div(
      {
        id: subProductTitle.toLowerCase().replace(/\s+/g, '-'),
        class: 'sch-subProdTitle flex-1 text-black text-[32px] !font-medium !leading-10',
      },
      subProductTitle,
    ),
  );

  // Description section
  const descriptionDiv = div(
    {
      class: 'flex-1 w-full flex flex-col justify-start items-start gap-y-1',
    },
    div(
      {
        class: 'prod-desc relative self-stretch w-full justify-start line-clamp-3 text-black text-base font-extralight leading-snug',
      },
      p({ class: 'desc-para' }, subProductDescription),
    ),
  );
  if (readMoreLabel.trim().length > 0 && readMoreLink.trim().length > 0) {
    const readMore = a({
      class: 'sch-explore-link text-danaherpurple-500 hover:text-danaherpurple-800 font-bold text-base leading-snug group flex gap-x-2',
      href: readMoreLink,
      target: `${openNewTab === 'true' ? '_blank' : '_self'}`,
    }, readMoreLabel, span({ class: 'icon icon icon-arrow-right w-[18px] fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800 group-hover:[&_svg>use]:stroke-danaherpurple-800' }));
    descriptionDiv.append(readMore);
  }
  decorateIcons(descriptionDiv);

  // Inner container
  const innerContainer = div(
    {
      class:
        'self-stretch w-full flex flex-col lg:flex-row justify-start items-start gap-3 md:gap-5',
    },
    titleDiv,
    descriptionDiv,
  );

  // Outer container
  const outerContainer = div(
    {
      class:
        'self-stretch w-full bg-white flex flex-col justify-center items-start gap-8 md:gap-12 overflow-hidden',
    },
    innerContainer,
  );

  productHeroContentWrapper.append(outerContainer);
  // Clear block content and append
  block.innerHTML = '';
  block.appendChild(productHeroContentWrapper);
  buildSubCategorySchema(block.querySelector('.sch-subProdTitle').textContent.trim(), subProductDescription, block.querySelector('.sch-explore-link') ? block.querySelector('.sch-explore-link').href : window.location.href);
}
