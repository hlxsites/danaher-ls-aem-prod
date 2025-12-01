import { div, span } from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
// eslint-disable-next-line import/no-cycle
import { getProductInfo } from '../../scripts/common-utils.js';
import renderGridCard from './grid-data.js';
import renderListCard from './listData.js';

//Scroll functions for pagination
function scrollToFirstCard() {
  setTimeout(() => {
    const productsWrapper = document.querySelector('.pdp-related-products-wrapper');
    const firstCard = productsWrapper
      ? productsWrapper.querySelector(':first-child')
      : null;
    if (firstCard) {
      firstCard.style.scrollMarginTop = "90px"; 
      firstCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 100);
}

/**
 * Determines the number of cards to display per page in grid view based on window width.
 * @returns {number} - Number of cards per page (1 for mobile, 2 for tablet, 4 for desktop).
 */
function getCardsPerPageGrid() {
  if (window.innerWidth < 640) return 1;
  if (window.innerWidth < 1024) return 2;
  return 6;
}

/**
 * Main function to decorate the top-selling block with a relatedProducts of product cards.
 * @param {HTMLElement} block - The block element to decorate.
 */
async function relatedProducts(headingText, productIds, divId) {
  const topSellingWrapper = div({
    class:
      'dhls-container top-selling-rendered mx-auto flex flex-col md:flex-row gap-6',
    id: divId,
  });

  let cardsPerPageGrid = getCardsPerPageGrid();
  const cardsPerPageList = 6;
  let currentPage = 1;
  let currentIndex = 0;
  let isGridView = true;
  const relatedProductsContainer = div({
    class: 'relatedProducts-container flex flex-col gap-y-6 w-full justify-center p-3 md:p-0',
  });
  const relatedProductsHead = div({
    class: 'w-full flex flex-row justify-between md:h-10',
  });

  const leftGroup = div({
    class: 'flex md:flex-row flex-col sm:flex-nowrap md:items-center gap-6',
  });
  leftGroup.append(
    div(
      {
        class: 'text-2xl text-black font-medium', style: 'font-weight: 400 !important;',
      },
      headingText ?? '',
    ),
  );
  decorateIcons(leftGroup);

  const arrows = div({
    class:
      'inline-flex md:flex-row flex-col-reverse justify-end items-center gap-6',
  });

  const viewModeGroup = div({
    class: 'flex justify-start items-center pt-1 md:pt-0',
  });
  const listBtn = div(
    {
      class:
        'w-8 h-8 bg-white rounded-tl-[20px] rounded-bl-[20px] outline outline-1 outline-offset-[-1px] outline-danaherpurple-500 flex justify-center items-center overflow-hidden cursor-pointer',
    },
    div(
      { class: 'w-5 h-5 relative overflow-hidden' },
      span({
        class:
          'icon icon-view-list w-5 h-5 absolute fill-current text-gray-600 [&_svg>use]:stroke-gray-600',
      }),
    ),
  );
  const gridBtn = div(
    {
      class:
        'w-8 h-8 bg-danaherpurple-500 hover:bg-danaherpurple-600 rounded-tr-[20px] rounded-br-[20px] outline outline-1 outline-offset-[-1px] outline-danaherpurple-500 flex justify-center items-center overflow-hidden cursor-pointer',
    },
    div(
      { class: 'w-5 h-5 relative overflow-hidden' },
      span({
        class:
          'icon icon-view-grid w-5 h-5 absolute fill-current text-white [&_svg>use]:stroke-white',
      }),
    ),
  );
  viewModeGroup.append(listBtn, gridBtn);
  decorateIcons(viewModeGroup);

  arrows.append(viewModeGroup);
  relatedProductsHead.append(leftGroup, arrows);

  const productCards = div({
    class: `relatedProducts-cards flex justify-center lg:justify-normal gap-5 w-full flex-wrap ${isGridView ? 'md:flex-nowrap' : ''
    }`,
  });

  const paginationContainer = div({
    class:
      'pagination-container flex justify-center items-center gap-2 mt-8 w-full',
    style: 'display: none;',
  });
  const results = await Promise.allSettled(
    // making false as we don't need intershop data for top selling products as of now
    productIds?.map((id) => getProductInfo(id, false, false)),
  );
  const products = results
    .filter((result) => result.status === 'fulfilled' && result.value?.title?.trim())
    .map((result) => result.value);

  // Hide viewModeGroup if no products are available
  if (products.length === 0) {
    topSellingWrapper.style.display = 'none';
  }

  /**
   * Updates the relatedProducts by rendering cards based on the current view (grid or list).
   */
  function updatePage() {
    productCards.innerHTML = '';
    productCards.className = `w-full py-2 flex gap-5 ${isGridView ? 'flex-row' : 'flex-col'
      }`;
    productCards.className = ` ${isGridView ? 'relatedProducts-cards grid gap-5 w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-center lg:justify-normal' : 'relatedProducts-cards  flex justify-center lg:justify-normal gap-5 w-full flex-wrap'
      }`;

    /* Render pagination */
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(products.length / cardsPerPageList);
    const paginationWrapper = div({
      class: 'self-stretch h-9 relative w-full',
    });
    const grayLine = div({
      class: 'w-full h-px absolute left-0 top-0 bg-gray-200 z-0',
    });
    const contentWrapper = div({
      class:
        'w-full left-0 top-0 absolute flex justify-between items-center px-4',
    });
    const startIndex = (currentPage - 1) * cardsPerPageList;
    const endIndex = Math.min(startIndex + cardsPerPageList, products.length);
    const cardsToDisplay = products.slice(startIndex, endIndex);
    if (isGridView) {
      if (products.length === 0) {
        productCards.style.transform = 'translateX(0)';
      } else {
        // Render all cards for continuous sliding
        cardsToDisplay.forEach((item) => productCards.append(renderGridCard(item)));
      }
    } else {
      cardsToDisplay.forEach((item) => productCards.append(renderListCard(item)));
      productCards.style.transform = 'translateX(0)';
    }
    paginationContainer.style.display = products.length < 7 ? 'none' : 'flex';
    // Previous Button
    const prevEnabled = currentPage > 1;
    const prevButton = div({
      'data-direction': 'Previous',
      'data-state': prevEnabled ? 'Default' : 'Disabled',
      class: 'inline-flex flex-col justify-start items-start',
    });
    prevButton.append(
      div({ class: 'self-stretch h-0.5 bg-transparent' }),
      div(
        {
          class: `self-stretch pr-1 pt-4 inline-flex justify-start items-center gap-3 cursor-${prevEnabled ? 'pointer' : 'not-allowed'
            } z-10`,
        },
        div(
          { class: 'w-5 h-5 relative overflow-hidden' },
          span({
            class: `icon icon-arrow-left w-5 h-5 absolute fill-current ${prevEnabled ? 'text-danaherpurple-500' : 'text-gray-400'
              } [&_svg>use]:stroke-current`,
          }),
        ),
        div(
          {
            class: `justify-start text-${prevEnabled ? 'danaherpurple-500' : 'gray-400'
              } text-sm font-medium leading-tight`,
          },
          'Previous',
        ),
      ),
    );
    decorateIcons(prevButton);
    prevButton.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage -= 1;
        updatePage();
        scrollToFirstCard();
      }
    });

    // Page Numbers
    const pageNumbersContainer = div({
      class: 'flex justify-center items-start gap-2 z-10',
    });
    const maxVisiblePages = 5;
    let startPage = Math.max(
      1,
      currentPage - Math.floor(maxVisiblePages / 2),
    );
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Helper function to create page number buttons
    const createPageNumber = (page) => {
      const pageNumber = div({
        'data-current': currentPage === page ? 'True' : 'False',
        'data-state': 'Default',
        class: 'inline-flex flex-col justify-start items-start',
      });
      pageNumber.append(
        div({
          class: `self-stretch h-0.5 ${currentPage === page ? 'bg-danaherpurple-500' : 'bg-transparent'
            }`,
        }),
        div(
          {
            class:
              'self-stretch px-4 pt-4 inline-flex justify-center items-start cursor-pointer',
          },
          div(
            {
              class: `text-center justify-start text-${currentPage === page ? 'danaherpurple-500' : 'gray-700'
                } text-sm font-medium leading-tight`,
            },
            page.toString(),
          ),
        ),
      );
      pageNumber.addEventListener('click', () => {
        currentPage = page;
        updatePage();
        scrollToFirstCard();
      });
      return pageNumber;
    };

    if (startPage > 1) {
      pageNumbersContainer.append(createPageNumber(1));
      if (startPage > 2) {
        pageNumbersContainer.append(
          div(
            {
              class: 'inline-flex flex-col justify-start items-start',
            },
            div({ class: 'self-stretch h-0.5 bg-transparent' }),
            div(
              {
                class:
                  'self-stretch px-4 pt-4 inline-flex justify-center items-start',
              },
              div(
                {
                  class:
                    'text-center justify-start text-gray-700 text-sm font-medium leading-tight',
                },
                '...',
              ),
            ),
          ),
        );
      }
    }

    for (let i = startPage; i <= endPage; i += 1) {
      pageNumbersContainer.append(createPageNumber(i));
    }

    if (endPage < totalPages - 1) {
      pageNumbersContainer.append(
        div(
          {
            class: 'inline-flex flex-col justify-start items-start',
          },
          div({ class: 'self-stretch h-0.5 bg-transparent' }),
          div(
            {
              class:
                'self-stretch px-4 pt-4 inline-flex justify-center items-start',
            },
            div(
              {
                class:
                  'text-center justify-start text-gray-700 text-sm font-medium leading-tight',
              },
              '...',
            ),
          ),
        ),
      );
    }
    if (endPage < totalPages) {
      pageNumbersContainer.append(createPageNumber(totalPages));
    }

    // Next Button
    const nextEnabled = currentPage < totalPages;
    const nextButton = div({
      'data-direction': 'Next',
      'data-state': nextEnabled ? 'Default' : 'Disabled',
      class: 'inline-flex flex-col justify-start items-start',
    });
    nextButton.append(
      div({ class: 'self-stretch h-0.5 bg-transparent' }),
      div(
        {
          class: `self-stretch pl-1 pt-4 inline-flex justify-start items-center gap-3 cursor-${nextEnabled ? 'pointer' : 'not-allowed'
            } z-10`,
        },
        div(
          {
            class: `justify-start text-${nextEnabled ? 'danaherpurple-500' : 'gray-400'
              } text-sm font-medium leading-tight`,
          },
          'Next',
        ),
        div(
          { class: 'w-5 h-5 relative overflow-hidden' },
          span({
            class: `icon icon-arrow-right w-5 h-5 absolute fill-current ${nextEnabled ? 'text-danaherpurple-500' : 'text-gray-400'
              } [&_svg>use]:stroke-current`,
          }),
        ),
      ),
    );
    decorateIcons(nextButton);
    nextButton.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage += 1;
        updatePage();
        scrollToFirstCard();
      }
    });
    contentWrapper.append(prevButton, pageNumbersContainer, nextButton);
    paginationWrapper.append(grayLine, contentWrapper);
    paginationContainer.append(paginationWrapper);
  }

  // Toggle between grid and list view
  const toggleView = (toGridView) => {
    isGridView = toGridView;
    currentPage = 1;
    currentIndex = 0;
    cardsPerPageGrid = getCardsPerPageGrid();

    gridBtn.classList.replace(
      toGridView ? 'bg-white' : 'bg-danaherpurple-500',
      toGridView ? 'bg-danaherpurple-500' : 'bg-white',
    );
    gridBtn
      .querySelector('.icon')
      .classList.replace(
        toGridView ? 'text-gray-600' : 'text-white',
        toGridView ? 'text-white' : 'text-gray-600',
      );
    gridBtn
      .querySelector('.icon')
      .classList.replace(
        toGridView ? '[&_svg>use]:stroke-gray-600' : '[&_svg>use]:stroke-white',
        toGridView ? '[&_svg>use]:stroke-white' : '[&_svg>use]:stroke-gray-600',
      );

    listBtn.classList.replace(
      toGridView ? 'bg-danaherpurple-500' : 'bg-white',
      toGridView ? 'bg-white' : 'bg-danaherpurple-500',
    );
    listBtn
      .querySelector('.icon')
      .classList.replace(
        toGridView ? 'text-white' : 'text-gray-600',
        toGridView ? 'text-gray-600' : 'text-white',
      );
    listBtn
      .querySelector('.icon')
      .classList.replace(
        toGridView ? '[&_svg>use]:stroke-white' : '[&_svg>use]:stroke-gray-600',
        toGridView ? '[&_svg>use]:stroke-gray-600' : '[&_svg>use]:stroke-white',
      );

    updatePage();
  };

  listBtn.addEventListener('click', () => toggleView(false));
  gridBtn.addEventListener('click', () => toggleView(true));

  window.addEventListener('resize', () => {
    const newCardsPerPageGrid = getCardsPerPageGrid();
    if (newCardsPerPageGrid !== cardsPerPageGrid) {
      cardsPerPageGrid = newCardsPerPageGrid;
      currentIndex = 0;
      updatePage();
      scrollToFirstCard();
    }
  });

  updatePage();
  relatedProductsContainer.append(relatedProductsHead, productCards, paginationContainer);
  topSellingWrapper.append(relatedProductsContainer);
  // block.innerHTML = '';
  // block.style = '';
  // block.append(topSellingWrapper);
  return topSellingWrapper;
}
export default async function decorate(block) {
  block.id = 'related-products-tab';
  const response = JSON.parse(localStorage.getItem('eds-product-details'));
  const relatedProductsWrapper = div(
    {
      class: 'block-pdp-related-products',
    },
  );
  const skuarray = JSON.parse(response?.raw?.associatedfamilys);
  const realtedProductsContainer = await relatedProducts(
    'Related Products',
    skuarray,
    'relatedproducts-tab',
  );
  relatedProductsWrapper?.append(realtedProductsContainer);
  block.parentElement.parentElement.style.padding = '0px 0px 0px 20px';
  block.classList.add(...'border-b border-gray-200 !pb-6 !mr-5 !lg:mr-0'.split(' '));
  block.append(relatedProductsWrapper);
}
