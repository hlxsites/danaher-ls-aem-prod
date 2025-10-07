import { div } from '../../scripts/dom-builder.js';
import { cartItem } from './cartItem.js';
import emptyCart from './emptyCart.js';
import { recommendedProducts } from './recommendedproducts.js';
import addProducts from './addproducts.js';
import {
  getBasketDetails,
  checkoutSummary,
} from '../../scripts/cart-checkout-utils.js';
import { getAuthenticationToken } from '../../scripts/token-utils.js';

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
  const cartItems = document.querySelectorAll('#cartItemContainer');
  if (cartItems) {
    const myCartListContainer = document.getElementById('myCartListContainer');
    const myCartEmptyContainer = document.getElementById(
      'myCartEmptyContainer',
    );
    if (newQuantity === 0) {
      if (myCartListContainer) myCartListContainer.classList.add('hidden');
      if (myCartEmptyContainer) myCartEmptyContainer.classList.remove('hidden');
    } else {
      if (myCartListContainer) myCartListContainer.classList.remove('hidden');
      if (myCartEmptyContainer) myCartEmptyContainer.classList.add('hidden');
    }
  }
  return { status: 'success' };
};

export const mycart = async () => {
  const authenticationToken = await getAuthenticationToken();
  const recommendedProductsContainer = await recommendedProducts();
  if (authenticationToken?.status === 'error') {
    // return false;
    // await userLogin('guest');
  }
  const basketDetail = await getBasketDetails();
  let totalProductQuantity;
  const basketData = JSON.parse(localStorage.getItem('basketData'));

  if (basketData) {
    totalProductQuantity = basketData.totalProductQuantity;
  }

  const myCartParentWrapper = div({
    class: 'dhls-container mt-0',
    id: 'myCartParentWrapper',
  });
  const myCartContainerWrapper = div({
    class: 'self-stretch px-10 py-14 bg-gray-50 inline-flex justify-center items-start gap-2 w-full',
    id: 'myCartContainerWrapper',
  });
  const myCartProductsWrapper = div({
    class: 'px-5 lg:px-10',
    id: 'myCartProductsWrapper',
  });
  const myCartEmptyContainer = div({
    class: '',
    id: 'myCartEmptyContainer',
  });
  const myCartListContainer = div({
    class: 'flex-1 inline-flex flex-col justify-start items-start gap-5 w-full',
    id: 'myCartListContainer',
  });
  if (
    basketDetail.status === 'error'
    || basketDetail.data.totalProductQuantity === 0
  ) {
    if (myCartEmptyContainer.classList.contains('hidden')) {
      myCartEmptyContainer.classList.remove('hidden');
    } else {
      myCartListContainer.classList.add('hidden');
    }
  } else if (totalProductQuantity > 0) {
    if (myCartListContainer.classList.contains('hidden')) {
      myCartListContainer.classList.remove('hidden');
    } else {
      myCartEmptyContainer.classList.add('hidden');
    }
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
    class: 'w-full inline-flex lg:flex-row flex-col gap-[4rem]',
  });
  const containerListWrapper = div({
    class: 'inline-flex flex-col gap-2 md:max-w-[70%] max-w-[100%] ',
    id: 'containerListWrapper',
  });
  const description = div(
    {
      class:
        'w-[70%] break-normal justify-start text-black text-base font-extralight ',
    },
    'Welcome to your cart. Review your selections, make any last-minute adjustments, and prepare for a seamless checkout experience tailored just for you.',
  );
  myCartWrapper.append(container);
  myCartWrapper.append(description);
  myCartListContainer.append(myCartWrapper);
  // myCartListContainer.append(description);
  // myCartListContainer.append(
  //   div({
  //     class: 'h-[26px]',
  //   }),
  // );
  const priceContainer = await checkoutSummary();
  const searchBlock = await addProducts();
  const cartItems = await cartItem();

  if (cartItems.hasChildNodes() === false) {
    myCartListContainer.classList.add('hidden');
    myCartEmptyContainer.classList.remove('hidden');
    recommendedProductsContainer.querySelector('#othersBought').classList.add('hidden');
    containerListWrapper.append(cartItems);
  } else {
    myCartListContainer.classList.remove('hidden');
    myCartEmptyContainer.classList.add('hidden');
    recommendedProductsContainer.querySelector('#othersBought').classList.remove('hidden');
    recommendedProductsContainer.querySelector('#recentlyVisited').classList.add('hidden');
    containerListWrapper.append(cartItems);
  }
  cartWrapper.append(containerListWrapper);
  cartWrapper.append(priceContainer);
  myCartListContainer.append(cartWrapper);
  myCartListContainer.append(
    div({
      class: 'h-[26px]',
    }),
  );
  myCartListContainer.append(searchBlock);
  myCartListContainer.append(recommendedProductsContainer);

  myCartContainerWrapper.append(myCartListContainer);
  myCartParentWrapper.append(myCartContainerWrapper);
  myCartParentWrapper.append(recommendedProductsContainer);
  myCartParentWrapper.append(myCartProductsWrapper);
  return myCartParentWrapper;
};
