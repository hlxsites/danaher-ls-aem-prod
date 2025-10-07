import { input } from '../../../dom-builder.js';
import { decorateIcons } from '../../../lib-franklin.js';
import { decorateModals } from '../../../scripts.js';

function updateOrderQuantity(event) {
  const wrapper = event.target.closest('.flex');
  const buyBtn = wrapper?.querySelector('.add-to-cart-btn');

  if (buyBtn) {
    buyBtn.setAttribute('minOrderQuantity', event.target.value || 1);
  }
}

export async function buildProductTile(result, getCommerceBase, domHelpers, viewType) {
  const {
    div, img, h3, p, a, span, button,
  } = domHelpers;

  let storedProduct = {};

  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    // Add more if needed
  };

  if (result.raw?.sku) {
    try {
      const response = await fetch(`${getCommerceBase()}/products/${result.raw.sku}`);
      const product = await response.json();

      // Store in localStorage with SKU-specific key
      localStorage.setItem('product-intershop-data', JSON.stringify(product));
      storedProduct = product;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('no results found for sku:', result.raw?.sku);
    }
  }
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  const formatCurrency = (value, currency) => {
    const symbol = currencySymbols[currency] || currency || 'USD';
    return value
      ? `${symbol}${numberWithCommas(value)}`
      : '';
  };

  const hasPrice = () => storedProduct?.salePrice?.value > 0;
  const showCTA = result?.raw?.skushowdetail === undefined || String(result?.raw?.skushowdetail).trim().toLowerCase() === 'true';
  const viewDetailsButton = div(
    {
      class: `self-stretch md:py-3 !mt-[-10px] md:mt-0 flex justify-start items-center ${
        showCTA ? '' : 'hidden'
      } mt-auto`,
    },
    a(
      {
        href: result.clickUri,
        target: result.clickUri.includes(window.DanaherConfig.host) ? '_self' : '_blank',
        class: `${
          viewType === 'grid' ? '!pl-3' : ''
        } group text-danaherpurple-500 hover:text-danaherpurple-800 flex items-center text-base font-bold leading-snug`,
      },
      'View Details',
      span({
        class:
        'icon icon-arrow-right !size-5 pl-1.5 fill-current group-hover:[&_svg>use]:stroke-danaherpurple-800 [&_svg>use]:stroke-danaherpurple-500',
      }),
    ),
  );
  decorateIcons(viewDetailsButton);
  /**
   * Function to render a grid card
   */
  function renderProductGridCard(item) {
    const card = div({
      class:
        'lg:w-[338px] w-[338px] min-h-80 bg-white outline outline-1 outline-gray-300 flex flex-col justify-start items-start ',
    });

    const fallbackImagePath = '/content/dam/danaher/products/fallbackImage.jpeg';

    // Compact image creation with fallback
    const createImageWithFallback = (src, alt) => {
      const imageElement = img({
        src: src || fallbackImagePath,
        height: '164px',
        alt: alt || 'Product image not available',
        class: 'w-full h-40 object-contain',
        onclick: () => window.open(
          item.clickUri,
          item.clickUri.includes(window.DanaherConfig.host) ? '_self' : '_blank',
        ),
        loading: 'lazy',
        decoding: 'async',
      });

      return div({ class: 'w-full h-40 overflow-hidden cursor-pointer' }, imageElement);
    };

    const imageElement = createImageWithFallback(item?.raw?.images?.[1], item?.title);

    const titleElement = div(
      { class: 'p-3' },
      p(
        {
          class: 'text-black text-xl font-medium leading-7 line-clamp-2 cursor-pointer',
          onclick: () => window.open(
            item.clickUri,
            item.clickUri.includes(window.DanaherConfig.host) ? '_self' : '_blank',
          ),
        },
        (item?.title || '').trim().replace(/<[^>]*>/g, ''),
      ),
    );

    const contentWrapper = div({
      class: 'flex flex-col justify-center items-start w-full h-20',
    });

    contentWrapper.append(titleElement);

    // Combine pricingDetails and actionButtons in one block
    let pricingAndActions;
    if (hasPrice()) {
      pricingAndActions = div(
        { class: 'self-stretch bg-gray-50 flex flex-col gap-0' },
        div(
          {
            class: 'px-4 py-3 inline-flex flex-col justify-start items-end',
          },
          div(
            {
              class: 'text-right justify-start text-black text-2xl font-medium',
            },
            formatCurrency(
              storedProduct.salePrice?.value,
              storedProduct.salePrice?.currencyMnemonic,
            ),
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
                storedProduct?.packingUnit || 'EA',
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
                storedProduct?.minOrderQuantity || 1,
              ),
            ),
          ),
        ),
        div(
          {
            class: 'px-4 py-3 inline-flex justify-evenly items-center gap-3',
          },
          div(
            { class: 'flex gap-3' },
            input({
              type: 'number',
              min: storedProduct?.minOrderQuantity || 1,
              value: '1',
              class: 'border rounded w-14 text-center text-sm',
              id: (storedProduct?.sku !== undefined || storedProduct?.sku !== null) ? storedProduct?.sku : result.raw?.sku || '',
            }),
            button(
              {
                class:
                'px-8 py-2 bg-danaherpurple-500 hover:bg-danaherpurple-800 text-white rounded-[20px] flex justify-center items-center overflow-hidden inherit text-base font-medium leading-snug add-to-cart-btn',
                minOrderQuantity: storedProduct?.minOrderQuantity || 1,
                sku: (storedProduct?.sku !== undefined || storedProduct?.sku !== null) ? storedProduct?.sku : result.raw?.sku || '',
              },
              'Buy',
            ),
            button(
              {
                class:
                'show-modal-btn w-full text-base font-medium leading-snug cursor-pointer px-5 py-2 text-danaherpurple-500 hover:text-white bg-white hover:bg-danaherpurple-500 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-[#7523FF] flex justify-center items-center overflow-hidden',
              },
              'Quote',
            ),
          ),
        ),
      );
    } else {
      pricingAndActions = div(
        {
          class: 'self-stretch px-4 py-3 bg-gray-50 inline-flex flex-col justify-center items-center mt-auto',
        },
        div(
          {
            class: 'self-stretch inline-flex justify-start gap-3 min-h-[96px]',
          },
          div(
            { class: 'flex-1 inline-flex flex-col justify-start items-start' },
            div(
              {
                class:
                  'self-stretch line-clamp-4 overflow-hidden text-black text-base font-extralight leading-snug',
              },
              (result.raw.description || '').trim(),
            ),
          ),
        ),
        div(
          { class: 'self-stretch inline-flex justify-start items-center gap-3 !pt-3' },
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
                    'two show-modal-btn cursor-pointer text-danaherpurple-500 hover:text-white hover:bg-danaherpurple-500 flex-1 px-5 py-2 bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-[#7523FF] flex justify-center items-center overflow-hidden',
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

    card.append(
      imageElement,
      contentWrapper,
      pricingAndActions,
      showCTA ? viewDetailsButton : '',
    );
    return card;
  }

  const unitOfMeasure = storedProduct?.packingUnit || 'EA';
  const minOrderQuantity = storedProduct?.minOrderQuantity ?? 1;
  const availability = storedProduct?.availability ? 'Available' : 'Check Back Soon';

  let ProductCard = '';
  if (viewType === 'list') {
    ProductCard = div(
      { class: 'flex flex-row bg-white border outline-gray-300 md:gap-7 flex-wrap' },

      // Image Section
      div(
        { class: 'flex-none flex justify-center p-6 cursor-pointer' },
        a(
          {
            href: result.clickUri,
            target: result.clickUri.includes(window.DanaherConfig.host) ? '_self' : '_blank',
          },
          img({
            src: result?.raw?.images?.[1] || '/content/dam/danaher/products/fallbackImage.jpeg',
            alt: result?.title || '',
            loading: 'lazy',
            width: '100px',
            height: '100px',
            class: 'w-[100px] h-[100px] object-contain border rounded bg-gray-50',
          }),
        ),
      ),

      // Product Details Section
      div(
        { class: 'flex-1 flex flex-col py-6 gap-3' },
        h3({ class: 'm-0', style: 'font-weight: 400 !important; font-size:20px !important; line-height:28px !important' }, result.title || ''),
        p(
          { class: 'text-gray-700 text-base font-extralight leading-snug line-clamp-4 overflow-hidden' },
          result.raw.description || '',
        ),
        viewDetailsButton,
      ),

      // Pricing & Action Section
      div(
        { class: 'flex p-6 flex-col items-end gap-2 self-stretch bg-gray-100 md:w-[331px] w-full' },
        ...(hasPrice()
          ? [
            // Price
            h3(
              {
                class: hasPrice()
                  ? 'text-black text-right text-xl font-normal leading-[32px] m-0'
                  : 'text-xl font-bold m-0',
              },
              hasPrice()
                ? formatCurrency(
                  storedProduct.salePrice?.value,
                  storedProduct.salePrice?.currencyMnemonic,
                )
                : 'Request for Price',
            ),

            // Availability (Placeholder for Phase 2)
            div(
              { class: 'hidden text-black text-base font-extralight flex w-full flex-row justify-between items-start mt-2 leading-snug' },
              'Availability',
              span({ class: 'font-bold text-green-700 text-black text-right text-base leading-snug' }, availability),
            ),

            // Unit of Measure
            div(
              { class: 'text-black text-base font-extralight flex w-full flex-row justify-between items-start leading-snug' },
              'Unit of Measure',
              span({ class: 'font-bold text-black text-right text-base leading-snug' }, unitOfMeasure),
            ),

            // Minimum Order Quantity
            div(
              { class: 'text-black text-base font-extralight flex w-full flex-row justify-between items-start mb-2 leading-snug' },
              'Min. Order Qty',
              span({ class: 'font-bold text-black text-right text-base leading-snug' }, `${minOrderQuantity}`),
            ),

            // Buttons
            div(
              { class: 'flex gap-3 self-start' },
              input({
                type: 'number',
                min: 1,
                value: minOrderQuantity,
                class: 'border rounded w-14 text-center text-sm',
                id: (storedProduct?.sku !== undefined || storedProduct?.sku !== null) ? storedProduct?.sku : result.raw?.sku || '',
                oninput: (event) => {
                  event.stopImmediatePropagation();
                  updateOrderQuantity(event);
                },
              }),
              button(
                {
                  class:
                'add-to-cart-btn px-8 py-2 bg-danaherpurple-500 hover:bg-danaherpurple-800 text-white rounded-[20px] flex justify-center items-center overflow-hidden inherit text-base font-medium leading-snug',
                  minOrderQuantity,
                  sku: (storedProduct?.sku !== undefined || storedProduct?.sku !== null) ? storedProduct?.sku : result.raw?.sku || '',
                },
                'Buy',
              ),
              button(
                {
                  class:
                'show-modal-btn w-full text-base font-medium leading-snug cursor-pointer px-5 py-2 text-danaherpurple-500 hover:text-white bg-white hover:bg-danaherpurple-500 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-[#7523FF] flex justify-center items-center overflow-hidden',
                },
                'Quote',
              ),
            ),
          ]
          : [
            div(
              { class: 'w-full' },
              button(
                {
                  class:
                'show-modal-btn w-full cursor-pointer px-5 py-2 text-danaherpurple-500 hover:text-white bg-white hover:bg-danaherpurple-500 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-[#7523FF] flex justify-center items-center overflow-hidden',
                },
                span(
                  {
                    class: 'inherit text-base font-medium leading-snug',
                  },
                  'Quote',
                ),
              ),
            ),
          ]),
      ),
    );
  }
  if (viewType === 'grid') {
    ProductCard = renderProductGridCard(result);
  }
  decorateModals(ProductCard);
  return ProductCard;
}

export async function renderResults({
  results, getCommerceBase, domHelpers, resultsGrid, viewType,
}) {
  const { div } = domHelpers;
  resultsGrid.innerHTML = '';

  if (!results.length) {
    resultsGrid.append(
      div({ class: 'text-center text-gray-400 py-11' }, 'No products found'),
    );
    return;
  }

  const tiles = await Promise.all(
    results.map((r) => buildProductTile(r, getCommerceBase, domHelpers, viewType)),
  );

  const frag = document.createDocumentFragment();
  tiles.forEach((tile) => frag.append(tile));

  resultsGrid.innerHTML = '';
  resultsGrid.append(frag);
}
