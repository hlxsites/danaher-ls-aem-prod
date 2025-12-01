import {
  div, a, span, button, p,
} from '../../scripts/dom-builder.js';
import { cartItem } from './cartItem.js';
import emptyCart from './emptyCart.js';
import { recommendedProducts } from './recommendedproducts.js';
import addProducts from './addproducts.js';
import {
  getBasketDetails,
  checkoutSummary,
  checkoutSkeleton,
  clearCart,
  updateHeaderCart,
  getPromotionData,
} from '../../scripts/cart-checkout-utils.js';
import { getAuthenticationToken } from '../../scripts/token-utils.js';
import { removePreLoader, showNotification, showPreLoader } from '../../scripts/common-utils.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

export const prodQuantity = (totalProductQuantity) => div(
  {
    class:
      'inline-flex justify-start text-black text-base font-bold gap-4',
    id: 'totalProduct-Quantity',
  },
  div(
    {
      class:
        'justify-start text-black text-base font-normal',
    },
    'Add to order template |',
  ),
  `${totalProductQuantity} Items`,
);

export const updateCartQuantity = (newQuantity) => {
  const myCartListContainer = document.getElementById('myCartListContainer');
  const myCartEmptyContainer = document.getElementById(
    'myCartEmptyContainer',
  );
  if (myCartListContainer && myCartEmptyContainer) {
    const cartItems = myCartListContainer.querySelector('#cartItemContainer');
    if (cartItems) {
      if (newQuantity === 0) {
        cartItems.textContent = '';
        if (myCartListContainer) myCartListContainer.classList.add('hidden');
        if (myCartEmptyContainer) myCartEmptyContainer.classList.remove('hidden');
      } else {
        if (myCartListContainer) myCartListContainer.classList.remove('hidden');
        if (myCartEmptyContainer) myCartEmptyContainer.classList.add('hidden');
      }
    }
  }
  return { status: 'success' };
};

// generate promotion bar
function generatePromotionBar(basketData, promotion, qualify = true) {
  const qualifyDiv = div(
    {
      class: 'flex justify-between gap-2 items-center',
    },
    span(
      {
        class: 'icon icon-check-plain [&_svg>use]:stroke-green-700 w-3 h-3',
      },
    ),
    span(
      {
        class: 'font-semibold text-base text-green-700',
      },
      'You Qualify',
    ),
  );
  const notQualifyDiv = div(
    {
      class: 'flex justify-between gap-2 items-center',
    },
    span(
      {
        class: 'icon icon-cross [&_svg>use]:stroke-red-700 w-3 h-3',
      },
    ),
    span(
      {
        class: 'font-semibold text-base text-red-700',
      },
      'Not Quite Eligible',
    ),
  );
  const promotionBar = div(
    {
      class: 'w-full p-4 items-center justify-between flex border border-gray-400 justify-between',
    },
    p(
      {
        class: 'font-semibold text-base',
      },
      span(
        qualify ? promotion?.name?.replace(/<[^>]*>/g, '') : promotion?.replace(/<[^>]*>/g, ''),
      ),
    ),
    qualify ? qualifyDiv : notQualifyDiv,
  );
  decorateIcons(promotionBar);
  return promotionBar;
}

// update promotions
export async function updatePromotions() {
  const basketData = await getBasketDetails();
  const promotionsWrapper = document.querySelector('#promotions-wrapper');
  const promotionsItemsContainer = promotionsWrapper?.querySelector('#promotions-item-container');
  const promotions = basketData?.data?.included?.lineItems_discounts;
  const dynamicMessages = basketData?.data?.data?.discounts?.dynamicMessages;
  if (dynamicMessages?.length > 0) {
    dynamicMessages?.forEach((message) => {
      promotionsWrapper?.querySelector('#promotions-item-container')?.append(generatePromotionBar(basketData, message, false));
    });
  }
  if (promotions && typeof promotions === 'object' && promotionsItemsContainer && promotionsWrapper) {
    promotionsItemsContainer.textContent = '';
    Object.entries(promotions)?.forEach((promotion) => {
      promotionsWrapper?.querySelector('#promotions-item-container')?.append(generatePromotionBar(basketData, promotion));
    });
  }
}
export default async function decorate(block) {
  document.querySelector('main')?.classList.add('bg-checkout');
  // showPreLoader();
  block.parentElement.parentElement.style.padding = '0';
  block.parentElement.parentElement.style.margin = '0';
  block.parentElement.style.padding = '0';
  block.parentElement.style.margin = '0';
  block.parentElement.style.display = 'flex';
  block.parentElement.style.maxWidth = '100%';
  block.parentElement.style.width = '100%';
  block.parentElement.style.justifyContent = 'center';
  block.style.display = 'flex';
  block.style.width = '100%';
  block.style.justifyContent = 'center';
  block.style.flexDirection = 'column';
  const authenticationToken = await getAuthenticationToken();
  if (authenticationToken?.status === 'error') {
    // return false;
    // await userLogin('guest');
  }
  const basketDetail = await getBasketDetails();
  let totalProductQuantity = 0;
  if (basketDetail) {
    totalProductQuantity = basketDetail?.data?.data?.totalProductQuantity || 0;
  }

  const myCartParentWrapper = div({
    class: 'dhls-container mt-0',
    id: 'myCartParentWrapper',
  });
  block.append(myCartParentWrapper);
  const myCartContainerWrapper = div({
    class: 'self-stretch p-4 md:px-10 md:py-14 bg-gray-50 inline-flex dhls-container mt-0 p-0 justify-center items-start gap-2 w-full',
    id: 'myCartContainerWrapper',
  });

  const promotionsWrapper = div(
    {
      class: 'w-full bg-danaherpurple-25 p-6',
      id: 'promotions-wrapper',
    },
    div(
      {
        class: 'dhls-container mt-0 w-full md:px-10 flex-col gap-6 flex',
        id: 'promotions-container',
      },
      div(
        {
          class: 'flex justify-between w-full',
        },

        p(
          {
            class: 'text-base text-black',
          },
          'Discounted Pricing',
        ),
        div(
          {
            id: 'hide-promotion-tab',
            class: 'flex gap-2 cursor-pointer',
          },
          button(
            {
              class: 'font-semibold text-base text-danaherpurple-500',
            },
            'Hide',
          ),
          span(
            {
              id: 'promotion-chevron',
              class: 'icon icon-chevron-up [&_svg>use]:stroke-danaherpurple-500 transition cursor-pointer',
            },
          ),
        ),
      ),
      div(
        {
          class: 'flex flex-col gap-6 transition-all duration-100 ease-in-out',
          id: 'promotions-item-container',
        },
      ),
    ),
  );
  let isVisible = true;
  promotionsWrapper?.querySelector('#hide-promotion-tab')?.addEventListener('click', () => {
    const promotionChevron = promotionsWrapper?.querySelector('#promotion-chevron');
    const promotionItems = promotionsWrapper?.querySelector('#promotions-item-container');
    if (isVisible) {
      promotionItems.classList.add('max-h-0', 'hidden', 'z-0', 'opacity-0');
      promotionItems.classList.remove('max-h-screen');
    } else {
      promotionItems.classList.remove('max-h-0', 'hidden', 'z-0', 'opacity-0');
      promotionItems.classList.add('max-h-screen');
    }
    isVisible = !isVisible;
    if (promotionChevron?.classList?.contains('rotate-180')) {
      promotionChevron?.classList?.remove('rotate-180');
    } else {
      promotionChevron?.classList?.add('rotate-180');
    }
  });
  if (authenticationToken?.user_type === 'customer') {
    promotionsWrapper?.querySelector('#promotions-container')?.append(checkoutSkeleton());
    // handle promotions
    const appliedDiscounts = basketDetail?.data?.included?.discounts;
    const itemPromotionIds = basketDetail?.data?.included?.lineItems_discounts;
    // eslint-disable-next-line max-len
    const lineItemPromotionIds = itemPromotionIds ? Object.values(itemPromotionIds).map(({ promotion }) => promotion) : [];
    // eslint-disable-next-line max-len
    const promotionIds = appliedDiscounts ? Object.values(appliedDiscounts).map(({ promotion }) => promotion) : [];
    const uniquePromotionIds = [...new Set([...promotionIds, ...lineItemPromotionIds])];
    if (uniquePromotionIds?.length > 0) {
      uniquePromotionIds?.forEach(async (gpid) => {
        const promoData = await getPromotionData(gpid);
        promotionsWrapper?.querySelector('#promotions-item-container')?.append(generatePromotionBar(basketDetail, promoData));
        promotionsWrapper?.querySelector('#promotions-container')?.querySelector('#checkoutSkeleton')?.remove();
      });
    }
    const dynamicMessages = basketDetail?.data?.data?.discounts?.dynamicMessages;
    if (dynamicMessages?.length > 0) {
      dynamicMessages?.forEach((message) => {
        promotionsWrapper?.querySelector('#promotions-item-container')?.append(generatePromotionBar(basketDetail, message, false));
      });
    }
    if (uniquePromotionIds?.length > 0 || (dynamicMessages?.length > 0 || dynamicMessages)) {
      block?.append(promotionsWrapper);
    }
  } else {
    promotionsWrapper?.classList?.add('hidden');
  }
  const myCartProductsWrapper = div({
    class: 'px-5 lg:px-10',
    id: 'myCartProductsWrapper',
  });
  const myCartEmptyContainer = div({
    class: '',
    id: 'myCartEmptyContainer',
  });
  const myCartListContainer = div({
    class: 'flex-1 inline-flex hidden flex-col justify-start items-start gap-5 w-full',
    id: 'myCartListContainer',
  });

  if (
    basketDetail?.status === 'error'
    || basketDetail?.data?.data?.totalProductQuantity === 0
  ) {
    if (myCartEmptyContainer.classList.contains('hidden')) {
      myCartEmptyContainer.classList.remove('hidden');
    } else {
      myCartListContainer.classList.add('hidden');
    }
  } else if (totalProductQuantity > 0) {
    if (myCartListContainer.classList.contains('hidden')) {
      myCartListContainer.classList.remove('hidden');
    }
    myCartEmptyContainer.classList.add('hidden');
  }

  const emptyCartContainer = emptyCart();
  const containerWrapper = div({
    class: 'inline-flex justify-between gap-4 w-full',
  });
  const emptyDiv = div({
    class: 'h-[0px]',
  });
  containerWrapper.append(emptyCartContainer);
  myCartEmptyContainer.append(containerWrapper);
  myCartEmptyContainer.append(emptyDiv);
  myCartContainerWrapper.append(myCartEmptyContainer);

  const myCartWrapper = div(
    { class: 'self-stretch flex flex-col justify-start items-start gap-2' },
    div({
      class: 'self-stretch inline-flex flex-col justify-start items-start gap-4',
    }),
  );

  const container = div(
    {
      class: 'inline-flex items-start gap-4 max-w-[70%]',
    },
    div(
      {
        class:
          'w-[40rem] left-[60px] justify-start text-black text-4xl font-bold',
      },
      'My Cart',
    ),
  );
  const cartWrapper = div({
    class: 'w-full inline-flex lg:flex-row flex-col gap-6',
  });
  const containerListWrapper = div({
    class: 'inline-flex flex-col gap-2 md:w-[70%] max-w-[100%] ',
    id: 'containerListWrapper',
  });
  containerListWrapper?.append(checkoutSkeleton());
  const description = div(
    {
      class:
        'w-[70%] break-normal justify-start text-black text-base flex-col md:flex-row flex md:pr-5',
    },
    div(
      {
        id: 'description-content',
      },
      span(
        {},
        'Welcome to your cart. Review your selections, make any last-minute adjustments, and prepare for a seamless checkout experience tailored just for you.',
      ),
    ),
  );
  if (
    authenticationToken?.status === 'success'
    && authenticationToken?.user_type === 'customer') {
    description?.querySelector('#description-content')?.append(a(
      {
        href: window.EbuyConfig?.requestedQuotesPageUrl,
        class: 'text-danaherpurple-500 hover:text-danaherpurple-800 font-medium',
      },
      ' See all available quotes',
    ));
  }
  const clearCartButton = button(
    {
      class: 'text-danaherpurple-500 hover:text-danaherpurple-800 font-medium w-32 flex items-end',
    },
    'Clear Cart',
  );
  clearCartButton?.addEventListener('click', async () => {
    showPreLoader();
    const clearCartResponse = await clearCart();
    if (clearCartResponse?.status === 'success') {
      localStorage.removeItem('basketData');
      localStorage.setItem('productDetailObject', JSON.stringify([]));
      await updateHeaderCart();
      updateCartQuantity(0);
      removePreLoader();
      showNotification('All items removed from your cart.', 'success');
    }
  });
  description?.append(clearCartButton);
  myCartWrapper.append(container);
  myCartWrapper.append(description);
  myCartListContainer.append(myCartWrapper);
  cartWrapper.append(containerListWrapper);
  const priceContainer = await checkoutSummary();
  if (priceContainer?.status !== 'error') cartWrapper.append(priceContainer);
  myCartListContainer.append(cartWrapper);
  myCartListContainer.append(
    div({
      class: 'h-[26px]',
    }),
  );

  myCartContainerWrapper.append(myCartListContainer);
  block.append(myCartContainerWrapper);

  myCartParentWrapper.append(myCartProductsWrapper);
  block.append(myCartParentWrapper);

  const searchblockWrapper = div(
    {
      class: 'w-full bg-white md:p-10',
    },
  );
  const searchBlock = await addProducts();
  if (searchblockWrapper && searchBlock) {
    searchblockWrapper.append(searchBlock);
    block.append(searchblockWrapper);
  }

  const recommendedProductsWrapper = div({ class: 'dhls-container w-full bg-white' });
  recommendedProductsWrapper.append(checkoutSkeleton());
  block.append(recommendedProductsWrapper);
  setTimeout(async () => {
    const cartItems = await cartItem();
    if (cartItems?.hasChildNodes() === false) {
      myCartListContainer.classList.add('hidden');
      containerListWrapper.textContent = '';
      containerListWrapper.append(cartItems);
    } else {
      myCartListContainer.classList.remove('hidden');
      containerListWrapper.textContent = '';
      containerListWrapper.append(cartItems);
    }
    const recommendedProductsContainer = await recommendedProducts();
    myCartListContainer.append(recommendedProductsContainer);
    myCartParentWrapper.append(recommendedProductsContainer);
    if (cartItems?.hasChildNodes() === false) {
      recommendedProductsContainer.querySelector('#othersBought').classList.add('hidden');
    } else {
      recommendedProductsContainer.querySelector('#othersBought').classList.remove('hidden');
      recommendedProductsContainer.querySelector('#recentlyVisited').classList.add('hidden');
    }
    recommendedProductsWrapper?.remove();
    const rcpWrapper = div(
      {
        class: 'w-full bg-white md:px-20',
      },
    );
    if (rcpWrapper && recommendedProductsContainer) {
      rcpWrapper.append(recommendedProductsContainer);
      block.append(rcpWrapper);
    }
  }, 0);
  decorateIcons(block);
}
