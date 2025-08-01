import {
  div, p, a, img, span,
} from '../../scripts/dom-builder.js';
import { getProductInfo } from '../../scripts/common-utils.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

async function createCarousel(
  side,
  carouselTitle,
  carouselProducts,
  carouselLinkText,
) {
  const bgColor = side === 'left' ? 'bg-gray-100' : 'bg-[#E5E7EB]';
  const carouselWrapper = div({
    id: `${side}CarouselWrapper`,
    class: `dualCarouselItem flex flex-col gap-6 p-[20px] ${bgColor}`,
  });
  const carouselContent = div({
    class: `${side}CarouselItems flex gap-[22px] duration-1000 ease-in-out transition-transform transform`,
  });
  const carouselLeftArrow = div(
    {
      class: '',
      title: 'Scroll Left',
    },
    span({
      class:
        'icon icon-Arrow-circle-left w-8 h-8 cursor-pointer [&_svg>use]:stroke-gray-300 [&_svg>use]:hover:stroke-danaherpurple-800',
    }),
  );

  const carouselRightArrow = div(
    {
      class: '',
      title: 'Scroll Right',
    },
    span({
      class:
        'icon icon-Arrow-circle-right cursor-pointer w-8 h-8 fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800',
    }),
  );
  const carouselTitleWrapper = div(
    {
      class: `${side}CarouselTitleWrapper flex gap-4 flex justify-between items-center`,
    },
    p({ class: 'text-2xl font-medium text-gray-800' }, carouselTitle),
    div({ class: 'flex items-center' }, carouselLeftArrow, carouselRightArrow),
  );
  decorateIcons(carouselTitleWrapper);

  const productsList = await carouselProducts;
  productsList.forEach((product) => {
    const card = a(
      {
        href: product?.url,
        target: product?.url?.includes('http') ? '_blank' : '_self',
        class:
          'flex-shrink-0 hover:shadow-md transform transition duration-500  cursor-pointer hover:scale-105  flex flex-col gap-3 pt-0 bg-white border space-y-4 w-full md:w-1/2 md:max-w-[48%]',
      },
      img({
        src: product?.images?.[0],
        alt: product?.title || '',
        class: 'w-full h-[164px] p-0 object-contain',
      }),
      p(
        {
          class: 'text-sm !m-0 !p-0 !px-3 font-medium text-danaherpurple-800',
        },
        product?.brand ?? '',
      ),
      p(
        {
          class:
            'text-xl !m-0 !p-0  !px-3  text-black flex-grow font-medium leading-7 !line-clamp-2 !break-words',
        },
        product?.title || '',
      ),
      a(
        {
          href: product?.url,
          target: product?.url?.includes('http') ? '_blank' : '_self',
          class:
            'text-danaherpurple-500  [&_svg>use]:hover:stroke-danaherpurple-800  hover:text-danaherpurple-800 !px-3  !m-0 !pb-3 text-base font-semibold flex items-center',
        },
        carouselLinkText || '',

        carouselLinkText
          ? span({
            class:
                'icon icon-arrow-right size-6 dhls-arrow-right-icon fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800',
          })
          : '',
      ),
    );
    const cardImage = card.querySelector('img');

    if (cardImage && cardImage?.getAttribute('src')?.includes('no-image')) {
      cardImage.setAttribute(
        'src',
        '/content/dam/danaher/products/fallbackImage.jpeg',
      );
      cardImage.onerror = () => {
        if (!cardImage.getAttribute('data-fallback-applied')) {
          cardImage.src = '/content/dam/danaher/products/fallbackImage.jpeg';
          cardImage.setAttribute('data-fallback-applied', 'true');
        }
      };
    }
    if (product?.title !== '' && product?.title !== undefined) {
      carouselContent.appendChild(card);
    }
  });

  const totalCards = carouselContent.children.length;

  let currentIndex = 0;
  const isMobile = window.innerWidth < 768;
  const visibleCards = isMobile ? 1 : 2;
  const updateArrows = () => {
    if (currentIndex <= 0) {
      carouselLeftArrow
        .querySelector('span')
        ?.classList.add('[&_svg>use]:stroke-gray-300', 'pointer-events-none');
      carouselLeftArrow
        .querySelector('span')
        ?.classList.remove('[&_svg>use]:stroke-danaherpurple-500');
    } else {
      carouselLeftArrow
        .querySelector('span')
        ?.classList.remove(
          '[&_svg>use]:stroke-gray-300',
          'pointer-events-none',
        );
      carouselLeftArrow
        .querySelector('span')
        ?.classList.add('[&_svg>use]:stroke-danaherpurple-500');
    }
    if (currentIndex >= totalCards - visibleCards) {
      carouselRightArrow
        .querySelector('span')
        ?.classList.add('[&_svg>use]:stroke-gray-300', 'pointer-events-none');
      carouselRightArrow
        .querySelector('span')
        ?.classList.remove('[&_svg>use]:stroke-danaherpurple-500');
    } else {
      carouselRightArrow
        .querySelector('span')
        ?.classList.remove(
          '[&_svg>use]:stroke-gray-300',
          'pointer-events-none',
        );
      carouselRightArrow
        .querySelector('span')
        ?.classList.add('[&_svg>use]:stroke-danaherpurple-500');
    }
  };

  const scrollToIndex = (index) => {
    const card = carouselContent.children[0];
    if (!card) return;
    const cardWidth = card.offsetWidth + 22;
    carouselContent.style.transform = `translateX(calc(-${
      cardWidth * index
    }px))`;
    currentIndex = index;
    updateArrows();
  };

  carouselLeftArrow.addEventListener('click', () => {
    if (currentIndex > 0) scrollToIndex(currentIndex - visibleCards);
  });

  carouselRightArrow.addEventListener('click', () => {
    if (currentIndex < totalCards - visibleCards) scrollToIndex(currentIndex + visibleCards);
  });

  setTimeout(updateArrows, 100);

  carouselWrapper.append(carouselTitleWrapper, carouselContent);
  return carouselWrapper;
}
export default async function decorate(block) {
  const [
    leftTitle,
    leftLinkLable,
    leftProductIds,
    rightTitle,
    rightLinkLabel,
    rightProductIds,
  ] = block.children;

  block?.parentElement?.parentElement?.removeAttribute('class');
  block?.parentElement?.parentElement?.removeAttribute('style');

  const dualCarouselWrapper = div({
    class:
      'dhls-container px-5 lg:px-10 dhlsBp:p-0  flex flex-col md:flex-row gap-5',
  });
  const leftCarouselTitle = leftTitle?.textContent
    .trim()
    .replace(/<[^>]*>/g, '');
  const leftCarouselProductIdsRaw = leftProductIds?.textContent
    .trim()
    .replace(/<[^>]*>/g, '');

  const leftCarouselProductIds = leftCarouselProductIdsRaw
    ? leftCarouselProductIdsRaw.split(',')
    : [];
  const leftCarouselLinkText = leftLinkLable?.textContent.trim().replace(/<[^>]*>/g, '') || 'Continue';
  const rightCarouselTitle = rightTitle?.textContent
    .trim()
    .replace(/<[^>]*>/g, '');
  const rightCarouselProductIdsRaw = rightProductIds?.textContent
    .trim()
    .replace(/<[^>]*>/g, '');

  const rightCarouselProductIds = rightCarouselProductIdsRaw
    ? rightCarouselProductIdsRaw.split(',')
    : [];

  const rightCarouselLinkText = rightLinkLabel?.textContent.trim().replace(/<[^>]*>/g, '')
    || 'View Details';

  let leftCarouselProducts = '';
  let leftCarouselScrollWrapper = '';
  if (leftCarouselProductIds?.length > 0) {
    leftCarouselProducts = (
      await Promise.allSettled(
        leftCarouselProductIds.map(async (sku) => getProductInfo(sku, false)),
      )
    )
      .filter((product) => product.status !== 'error')
      .map((product) => product.value);
    leftCarouselScrollWrapper = div(
      {
        id: 'leftCarouselScrollWrapper',
        class: `${
          leftCarouselProducts ? '' : 'hidden'
        } md:w-1/2 overflow-hidden flex flex-col`,
      },
      await createCarousel(
        'left',
        leftCarouselTitle ?? '',
        leftCarouselProducts ?? '',
        leftCarouselLinkText ?? '',
      ),
    );
  }

  let rightCarouselProducts = '';
  let rightCarouselScrollWrapper = '';
  if (rightCarouselProductIds?.length > 0) {
    rightCarouselProducts = (
      await Promise.allSettled(
        rightCarouselProductIds.map(async (sku) => getProductInfo(sku, false)),
      )
    )
      .filter((product) => product.status !== 'error')
      .map((product) => product.value);
    rightCarouselScrollWrapper = div(
      {
        id: 'rightCarouselScrollWrapper',
        class: `${
          rightCarouselProducts ? '' : 'hidden'
        }  md:w-1/2 overflow-hidden flex flex-col `,
      },
      await createCarousel(
        'right',
        rightCarouselTitle ?? '',
        rightCarouselProducts ?? '',
        rightCarouselLinkText ?? '',
      ),
    );
  }

  if (!leftCarouselScrollWrapper && rightCarouselScrollWrapper) {
    const rightCarouselParent = rightCarouselScrollWrapper.parentElement;
    if (rightCarouselParent?.classList.contains('dhls-container')) {
      rightCarouselParent.classList.remove('gap-5');
    }
  }
  dualCarouselWrapper.append(
    leftCarouselScrollWrapper,
    rightCarouselScrollWrapper,
  );
  decorateIcons(dualCarouselWrapper);
  const arrowLeftIcon = document.querySelector(
    '#icons-sprite-Arrow-circle-left path',
  );
  if (arrowLeftIcon) {
    arrowLeftIcon.setAttribute('fill', 'white');
  }
  block.textContent = '';
  block.append(dualCarouselWrapper);
}
