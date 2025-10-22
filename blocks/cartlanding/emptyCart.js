import { div, button, img } from '../../scripts/dom-builder.js';

export default function emptyCart() {
  const container = div({
    class:
      'self-stretch px-10 py-14 bg-gray-50 inline-flex justify-start items-center gap-5 w-full',
  });

  // Browse button with event listener
  const browseButton = button(
    {
      class:
        'show-modal-btn cursor-pointer px-5 py-2 text-danaherpurple-500 hover:text-white bg-white hover:bg-danaherpurple-500 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-[#7523FF] flex justify-center items-center overflow-hidden',
      id: 'browse-product',
    },
    'Browse Products',
  );
  browseButton.addEventListener('click', () => {
    window.location.href = '/us/en/products.html';
  });

  const wrapperEmptyCart = div({
    class: 'flex-1 inline-flex flex-col justify-start items-center gap-9',
  });
  const cartImage = img({
    class: '',
    src: '/icons/shopping-cart.png',
  });
  // Cart Empty Message Section
  const cartMessage = div(
    {
      class: 'self-stretch flex flex-col justify-start items-center gap-2',
    },
    div(
      {
        class: 'inline-flex flex-col justify-start items-center gap-4',
      },
      div(
        {
          class:
            'w-full text-center justify-start text-gray-900 text-4xl font-normal  leading-[48px]',
        },
        'Your Cart is Empty',
      ),
      div(
        {
          class: 'w-full flex flex-col justify-start items-start',
        },
        div(
          {
            class:
              'self-stretch text-center justify-start text-black text-base font-extralight leading-snug',
          },
          'Explore our top products for your workflow needs',
        ),
      ),
    ),
  );

  const browseButtonWrapper = div(
    {
      class: 'self-stretch flex flex-col justify-start items-center gap-6',
    },
    div(
      {
        class: 'self-stretch inline-flex justify-center items-center gap-3',
      },
      div(
        {
          class: 'flex justify-start items-start gap-3',
        },
        browseButton,
      ),
    ),
  );
  wrapperEmptyCart.append(cartImage, cartMessage, browseButtonWrapper);

  // Append everything to the container
  container.appendChild(wrapperEmptyCart);
  return container;
}
