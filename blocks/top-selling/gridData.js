import {
  div,
  p,
  img,
  a,
  button,
  input,
  span,
} from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import { decorateModals } from '../../scripts/scripts.js';

// Helper function to create a badge based on item.carrierFree
function createCarrierFreeBadge(carrierFreeText) {
  return div(
    {
      class:
        'absolute bottom-2 left-2 px-2 py-1 bg-danaherpurple-50 inline-flex justify-center items-center gap-2.5 z-10',
    },
    div(
      {
        class:
          'text-center text-danaherpurple-500 hover:text-danaherpurple-800 text-sm font-medium leading-tight truncate max-w-[150px]',
      },
      carrierFreeText,
    ),
  );
}

/**
 * Renders a product card in grid view.
 * @param {Object} item - Product data containing title, url, images, description, price, etc.
 * @returns {HTMLElement} - The rendered grid card element.
 */
export default function renderGridCard(item) {
  const card = div({
    class:
      'transform transition duration-500 hover:shadow-md min-w-[100%] w-full md:min-w-[305px] md:w-[305px] min-h-[485px] bg-white border border-1 border-gray-300 flex flex-col justify-start items-start',
  });

  const fallbackImagePath = '/content/dam/danaher/products/fallbackImage.jpeg';

  // Create image with fallback functionality
  const createImageWithFallback = (src, alt) => {
    const imageElement = img({
      src: src || fallbackImagePath,
      alt: alt || 'Product image',
      class: 'w-full h-[164px] object-contain',
    });

    imageElement.addEventListener('error', () => {
      imageElement.src = fallbackImagePath;
      imageElement.alt = 'Product image not available';
    });

    return imageElement;
  };

  const imageWrapper = div({ class: 'relative w-full' });
  const imageUrl = item.images?.[0] || '';
  const imageElement = div(
    { class: 'block w-full' },
    createImageWithFallback(imageUrl, item.title),
  );

  imageWrapper.append(
    imageElement,
    ...(item.carrierFree ? [createCarrierFreeBadge(item.carrierFree)] : []),
  );

  const contentWrapper = div({
    class: 'flex flex-col p-3 justify-start items-start w-full flex-grow',
  });
  contentWrapper.append(
    p(
      { class: 'font-medium text-black text-xl leading-7 line-clamp-2' },
      (item.title || '').trim().replace(/<[^>]*>/g, ''),
    ),
  );

  // Combine pricingDetails and actionButtons in one block
  let pricingAndActions;
  // if (item.showCart && item.price !== undefined) {
  if (item.showCart && item.price === 'abc123') {
    pricingAndActions = div(
      { class: 'self-stretch bg-gray-50 flex flex-col gap-0' },
      div(
        {
          class:
          'px-4 py-3 inline-flex flex-col justify-start items-end gap-6',
        },
        div(
          {
            class:
              'text-right justify-start text-black text-2xl font-medium',
          },
          `$${item.price.toLocaleString()}`,
        ),
        div(
          { class: 'self-stretch flex flex-col justify-start items-start gap-2' },
          div(
            { class: 'flex justify-between items-center w-full' },
            div(
              { class: 'text-black text-base font-extralight leading-snug' },
              'Unit of Measure:',
            ),
            div(
              { class: 'text-black text-base font-bold leading-snug' },
              item?.uom || '',
            ),
          ),
          div(
            { class: 'flex justify-between items-center w-full' },
            div(
              { class: 'text-black text-base font-extralight leading-snug' },
              'Min. Order Qty:',
            ),
            div(
              { class: 'text-black text-base font-bold leading-snug' },
              item?.minQty || '',
            ),
          ),
        ),
      ),
      div(
        {
          class:
            'px-4 py-3 inline-flex justify-start items-center gap-3',
        },
        input({
          type: 'number',
          value: '1',
          min: '1',
          class:
            'w-14 self-stretch py-1.5 bg-white rounded-md shadow-sm outline outline-1 outline-offset-[-1px] outline-gray-300 text-black text-base font-medium leading-normal text-center [&::-webkit-inner-spin-button]:mr-2',
        }),
        a(
          {
            href: item.url,
            class:
              'w-24 px-5 py-2 bg-danaherpurple-500 hover:bg-danaherpurple-800 text-white rounded-[20px] flex justify-center items-center overflow-hidden',
          },
          span(
            {
              class: 'inherit text-base font-medium leading-snug',
            },
            'Buy',
          ),
        ),
        div(
          {
            class:
              'show-modal-btn cursor-pointer px-5 py-2 text-danaherpurple-500 hover:text-white bg-white hover:bg-danaherpurple-500 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-[#7523FF] flex justify-center items-center overflow-hidden',
          },
          span(
            {
              class: 'inherit text-base font-medium leading-snug',
            },
            'Quote',
          ),
        ),
      ),
    );
  } else {
    pricingAndActions = div(
      {
        class:
      'self-stretch px-4 py-3 bg-gray-50 inline-flex flex-col justify-center items-center gap-6',
      },
      div(
        {
          class: 'self-stretch h-28 inline-flex justify-start gap-3',
        },
        div(
          { class: 'flex-1 inline-flex flex-col justify-start items-start' },
          div(
            {
              class:
            'self-stretch justify-start text-black text-base font-extralight leading-snug line-clamp-4',
            },
            (item.description || '').trim().replace(/<[^>]*>/g, ''),
          ),
        ),
      ),
      // Buttons section - conditional based on showAvailability
      div(
        { class: 'self-stretch inline-flex justify-start items-center gap-3' },
        ...(item.showAvailability
          ? [
            a(
              {
                href: item.url || '#',
                class:
              'px-5 py-2 bg-danaherpurple-500 hover:bg-danaherpurple-800 rounded-[20px] flex justify-center items-center overflow-hidden',
              },
              div(
                {
                  class:
                'justify-start text-white text-base font-medium leading-snug',
                },
                'Price & Availability',
              ),
            ),
            div(
              {
                class:
              'show-modal-btn cursor-pointer text-danaherpurple-500 hover:bg-danaherpurple-500 hover:text-white px-5 py-2 bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-[#7523FF] flex justify-center items-center overflow-hidden',
              },
              div(
                {
                  class:
                'justify-start inherit text-base font-medium leading-snug',
                },
                'Quote',
              ),
            ),
          ]
          : [
            button(
              {
                class:
              'show-modal-btn cursor-pointer text-danaherpurple-500 hover:text-white hover:bg-danaherpurple-500 flex-1 px-5 py-2 bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-[#7523FF] flex justify-center items-center overflow-hidden',
              },
              div(
                {
                  class: 'inherit text-base font-medium leading-snug',
                },
                'Quote',
              ),
            ),
          ]),
      ),
    );
  }

  const viewDetailsButton = div(
    { class: 'self-stretch p-3 flex justify-start items-center' },
    a(
      {
        href: item.url,
        class: 'text-danaherpurple-500 hover:text-danaherpurple-800 flex items-center text-base font-bold leading-snug [&_svg>use]:hover:stroke-danaherpurple-800',
      },
      'View Details',
      span({
        class:
          'icon icon-arrow-right !size-5 pl-1.5 fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800',
      }),
    ),
  );

  decorateIcons(viewDetailsButton);

  card.append(
    imageWrapper,
    contentWrapper,
    pricingAndActions,
    viewDetailsButton,
  );

  decorateModals(card);

  return card;
}
