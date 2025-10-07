import {
  div,
  span,
  button,
  a,
  img,
  input,
  h1,
} from '../../scripts/dom-builder.js';
import {
  getProductDetails,
} from '../../scripts/commerce.js';
import {
  createOptimizedS7Picture,
  decorateModals,
} from '../../scripts/scripts.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import { decorateBuyButton } from '../../scripts/delayed.js';

function showImage(e) {
  const selectedImageContainer = document.querySelector('.image-content');
  const targetElement = e.target.closest('picture') || e.target.closest('div:not(.image-content):not(.view-more)');
  if (targetElement && selectedImageContainer) {
    const parentContainer = targetElement.parentElement;
    const currentActive = parentContainer.querySelector('.active');
    if (currentActive && currentActive.classList.contains('active')) {
      currentActive.classList.remove('active');
    }
    targetElement.classList.add('active');
    const pictureToShow = targetElement.tagName === 'PICTURE' ? targetElement : targetElement.querySelector('picture');

    if (pictureToShow) {
      const clonedPicture = pictureToShow.cloneNode(true);
      const cloneimg = clonedPicture.querySelector('img');
      if (cloneimg) {
        cloneimg.style.width = '100%';
        cloneimg.style.height = '100%';
        cloneimg.style.objectFit = 'contain';
      }
      selectedImageContainer.innerHTML = '';
      selectedImageContainer.appendChild(clonedPicture);
    }
  }
}

function loadMore() {
  const allImageContainer = document.querySelector('.vertical-gallery-container > div > div:not(:nth-child(1))');
  const shownImage = allImageContainer.querySelectorAll('div:not(.hidden):not(.view-more), picture:not(.hidden)');
  const notShownImage = allImageContainer.querySelectorAll('div.hidden, picture.hidden');
  if (shownImage.length > 0) {
    if (
      shownImage[shownImage.length - 1].nextElementSibling
      && !shownImage[shownImage.length - 1].nextElementSibling.classList.contains('view-more')
    ) {
      shownImage[0].classList.add('hidden');
      shownImage[shownImage.length - 1].nextElementSibling.classList.remove('hidden');
    } else {
      // REMOVE THE LASTS FIRST-INDEXED NON-HIDDEN VALUE
      const firstNonActive = allImageContainer.querySelector('div.hidden, picture.hidden');
      if (firstNonActive) firstNonActive.classList.remove('hidden');
      // HIDE THE LAST-HIDDEN-ELEMENT'S NEXT-SIBLING
      notShownImage[notShownImage.length - 1].nextElementSibling?.classList.add('hidden');
    }
  }
}

function imageSlider(allImages, productName = 'product') {
  let slideContent = '';
  const filteredImages = allImages.filter((aImg) => !aImg.toLowerCase().endsWith('.pdf'));

  if (!filteredImages.length || filteredImages[0].includes('.pdf')) {
    const fallbackImg = img({ src: '/content/dam/danaher/products/fallbackImage.jpeg', alt: `${productName} - fallback image` });
    slideContent = div({ class: 'image-content' }, div({ class: 'active' }, fallbackImg));
  } else {
    const optimizedImage = createOptimizedS7Picture(filteredImages[0], `${productName} - image`, true);
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'image';
    preloadLink.href = optimizedImage?.querySelector('img')?.src;
    preloadLink.fetchPriority = 'high'; // Optional but recommended
    document.head.appendChild(preloadLink);
    slideContent = div({ class: 'image-content' }, optimizedImage);
  }
  const verticalSlides = div();
  filteredImages.forEach((image, index) => {
    let element;
    const imageClass = [(index === 0) ? 'active' : '', index > 2 ? 'hidden' : ''].filter(Boolean).join(' ').trim();
    const pictureElement = createOptimizedS7Picture(image, `${productName} - image ${index + 1}`, false);
    if (pictureElement.tagName === 'PICTURE') {
      element = pictureElement;
    } else {
      element = div(pictureElement);
    }
    if (imageClass) element.className = imageClass;
    element.addEventListener('click', showImage);
    verticalSlides.append(element);
  });
  if (filteredImages.length > 3) {
    const showMore = div({ class: 'view-more' }, 'View More');
    showMore.innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-4 h-4" viewBox="0 0 12 12">
      <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8"/>
    </svg>`;
    showMore.addEventListener('click', loadMore);
    verticalSlides.append(showMore);
  }
  return div({ class: 'vertical-gallery-container' }, div(slideContent, verticalSlides));
}

// Currency format function
function getCurrencySymbol(currencyCode, locale = 'en-US') {
  return (0).toLocaleString(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).replace(/\d|,|\./g, '').trim();
}

function formatMoney(number) {
  return number.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function updateOrderQuantity(event) {
  const wrapper = event.target.closest('.inline-flex');
  const buyBtn = wrapper?.querySelector('.add-to-cart-btn');

  if (buyBtn) {
    buyBtn.setAttribute('minOrderQuantity', event.target.value || 1);
  }
}

export default async function decorate(block) {
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  block.parentElement.parentElement.style.padding = '0';

  const titleEl = block.querySelector('h1');
  titleEl?.classList.add('title');
  titleEl?.parentElement.parentElement.remove();
  const result = JSON.parse(localStorage.getItem('eds-product-details'));
  const productInfo = await getProductDetails(result?.raw?.sku);
  const allImages = result?.raw.images;
  const verticalImageGallery = imageSlider(allImages, result?.Title);
  const opco = result?.raw?.opco?.toLowerCase();

  const brandMap = {
    'beckman coulter life sciences': 'beckman-coulter-life-sciences',
    sciex: 'sciex',
    abcam: 'abcam',
    'molecular devices': 'molecular-devices',
    phenomenex: 'phenomenex',
    'leica microsystems': 'leica',
    idbs: 'idbs',
  };

  const opcoBrandUrl = opco === 'genedata'
    ? 'https://genedata.com/?utm_source=dhls_website'
    : `/us/en/products/brands/${brandMap[opco] || ''}`;

  const defaultContent = div({
    class:
      'self-stretch inline-flex flex-col justify-start items-start gap-9 ',
  });
  const headingDiv = div(
    {
      class: 'self-stretch flex flex-col justify-start items-start gap-2',
    },
  );

  const itemInfoHead = div(
    {
      class: 'self-stretch flex flex-col justify-start items-start gap-2',
    },
    result?.raw.opco ? (div(
      {
        class: 'self-stretch justify-start text-danaherpurple-800 text-[18px] font-medium leading-normal',
      },
      a({ href: opcoBrandUrl }, result?.raw.opco),
    )) : '',
  );

  const itemInfoDiv = div(

    {
      class: 'self-stretch flex flex-col justify-start items-start gap-4',
    },
    (result?.raw?.titlelsig || result?.raw?.title) ? (
      h1(
        {
          class: 'self-stretch justify-start text-black font-medium leading-[48px] m-0',
          style: 'font-size: 40px; font-weight: 400 !important',
        },
        result?.raw?.titlelsig ? result?.raw?.titlelsig : result?.raw?.title,
      )) : '',
    result?.raw?.objecttype === 'Product'
      || result?.raw?.objecttype === 'Bundle'
      ? div(
        {
          class: 'flex flex-col justify-start items-start',
        },
        div(
          {
            class: 'justify-start text-gray-700 text-base font-extralight leading-snug',
          },
          result?.raw?.objecttype === 'Product'
          || result?.raw?.objecttype === 'Bundle' ? result?.raw?.sku : '',
        ),
      ) : '',
    result?.raw?.richdescription ? (
      div(
        { class: 'self-stretch flex flex-col justify-start items-start' },
        div(
          {
            class:
          'hero-desc self-stretch justify-start text-black text-base font-extralight leading-snug',
          },
          '',
        ),
      )) : '',
  );

  const heroDesc = itemInfoDiv.querySelector('.hero-desc');
  if (heroDesc) {
    heroDesc.innerHTML = result?.raw?.richdescription || '';
  }

  headingDiv.append(itemInfoHead, itemInfoDiv);
  defaultContent.append(headingDiv);

  const infoTab = div(
    {
      class: 'self-stretch md:flex justify-start items-center gap-9',
    },
    div(
      {
        class: 'starts-at-price justify-start text-black text-4xl font-normal',
      },
      div({ class: 'starts-at-label text-black text-base font-extralight' }, 'Starts at'),
    ),
    div(
      {
        class: 'flex-1 py-3 flex justify-start items-start',
      },

      div({
        class: 'uom-seperator-line w-12 h-0 hidden md:block flex-grow-0 mt-[26px] rotate-90 outline outline-1 outline-offset-[-0.50px] outline-gray-300',
      }),
      productInfo?.data?.packingUnit ? (
        div(
          {
            class: 'w-28 inline-flex flex-col justify-center items-start gap-2',
          },
          div(
            {
              class: 'w-28 justify-start text-black text-base font-extralight',
            },
            'Unit of Measure',
          ),
          div(
            {
              class: 'pdp-packingUnit text-right justify-start text-black text-base font-bold',
            },
            `${productInfo?.data?.packingUnit} /Bundle`,
          ),
        )) : '',

      productInfo?.data?.packingUnit ? (div({
        class: 'w-12 h-0 flex-grow-0 mt-[26px] rotate-90 outline outline-1 outline-offset-[-0.50px] outline-gray-300',
      })) : '',
      div(
        {
          class: 'w-28 inline-flex flex-col justify-center items-start gap-2',
        },
        div(
          {
            class: 'w-28 justify-start text-black text-base font-extralight',
          },
          'Min. Order Qty',
        ),
        div(
          {
            class: 'pdp-minOrderQuantity text-right justify-start text-black text-base font-bold',
          },
          productInfo?.data?.minOrderQuantity || '1',
        ),
      ),
    ),
  );

  const shipInfo = div(
    productInfo?.data?.manufacturer
      ? div(
        {
          class:
          'w-full self-stretch inline-flex flex-col justify-start items-start gap-2',
        },
        div(
          {
            class: 'inline-flex justify-start items-center gap-2',
          },
          div(
            {
              class: 'w-20 justify-start text-black text-base font-extralight',
            },
            'Ship From',
          ),
          div(
            {
              class: 'pdp-manufacturer text-right justify-start text-black text-base font-bold',
            },
            productInfo?.data?.manufacturer,
          ),
        ),
        div(
          {
            class: 'inline-flex justify-start items-center gap-2',
          },
          div(
            {
              class: 'w-20 justify-start text-black text-base font-extralight',
            },
            'Sold By',
          ),
          div(
            {
              class: 'pdp-manufacturer-2 text-right justify-start text-black text-base font-bold',
            },
            productInfo?.data?.manufacturer,
          ),
        ),
      )
      : '',
  );

  const pricingQuoteButton = div(
    {
      class:
        'inline-flex justify-start items-center gap-3',
    },
    div(
      {
        class: 'pricingQuoteButton starts-at-price font-bold justify-start text-black text-2xl font-normal',
      },
      div(
        { class: 'starts-at-label text-black text-base font-bold' },
        'Starts at',
      ),
      result?.raw?.listpriceusd
        ? `$${numberWithCommas(result.raw.listpriceusd)}`
        : '',
    ),
    // For future implementation
    input({
      type: 'number',
      value: '1',
      min: '1',
      id: 'pr-input',
      class:
        'pr-input w-14 self-stretch py-1.5 bg-white rounded-md shadow-sm outline outline-1 outline-offset-[-1px] outline-gray-300 text-black text-base font-medium leading-normal text-center [&::-webkit-inner-spin-button]:mr-2',
      oninput: (event) => {
        event.stopImmediatePropagation();
        updateOrderQuantity(event);
      },
    }),
    // (result.raw.listpriceusd && result?.raw?.externallink) ?
    button(
      {
        class:
          'buy-btn cursor-pointer pr-bn px-5 py-2 bg-danaherpurple-500 hover:bg-danaherpurple-800 text-white rounded-[20px] flex justify-center items-center overflow-hidden h-12 inherit text-base font-medium leading-snug',
      },
      'Buy',
    ),
    div(
      {
        class:
          'show-modal-btn pr-rfq cursor-pointer px-5 py-2 h-12 text-danaherpurple-500 hover:text-white bg-white hover:bg-danaherpurple-500 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-[#7523FF] flex justify-center items-center overflow-hidden',
      },
      span(
        {
          class: 'inherit text-base font-medium leading-snug',
        },
        'Request a Quote',
      ),
    ),
  );

  const priceInfoDiv = div({
    class: 'self-stretch flex flex-col justify-start items-start gap-5',
  });
  priceInfoDiv.append(infoTab, shipInfo);
  if (result?.raw?.objecttype === 'Product' || result?.raw?.objecttype === 'Bundle') {
    defaultContent.append(priceInfoDiv);
  }

  if (!productInfo?.data?.salePrice?.value && !result?.raw.listpriceusd) {
    priceInfoDiv.style.display = 'none';
  }
  // Intershop
  if (productInfo?.data?.salePrice?.value > 0.0 && productInfo?.data?.attributes[0]?.value === 'True') {
    infoTab.querySelector('.starts-at-label').style.display = 'none';

    const currency = getCurrencySymbol(productInfo?.data?.salePrice?.currencyMnemonic);
    const value = productInfo?.data?.salePrice?.value ?? '';
    const priceText = `${currency}${value}`;
    if (priceText) infoTab.querySelector('.starts-at-price')?.append(numberWithCommas(priceText));

    pricingQuoteButton.querySelector('.starts-at-price').style.display = 'none';
    const prInput = pricingQuoteButton.querySelector('.pr-input');
    const buyBtn = pricingQuoteButton.querySelector('.buy-btn');

    if (prInput) prInput.min = productInfo?.data?.minOrderQuantity || 1;

    if (buyBtn) {
      buyBtn.classList.add('add-to-cart-btn');
      buyBtn.setAttribute('minOrderQuantity', prInput?.value || 1);
      buyBtn.setAttribute('sku', productInfo?.data?.sku || result?.raw?.sku || '');
    }
    defaultContent.append(pricingQuoteButton);
  } else {
    // Coveo
    infoTab.querySelector('.starts-at-price').style.display = 'none';
    infoTab.querySelector('.uom-seperator-line').style.display = 'none';
    pricingQuoteButton.querySelector('.starts-at-price').style.display = 'none';
    pricingQuoteButton.querySelector('.pr-input').style.display = 'none';
    pricingQuoteButton.querySelector('.buy-btn').style.display = 'none';

    const availableOnlineRaw = result?.raw?.availableonline;
    const availableOnline = Array.isArray(availableOnlineRaw)
      ? availableOnlineRaw.map((c) => c.toUpperCase()) : [];

    const showskupricelistusd = result?.raw.listpriceusd;
    const currncyFormat = Number(showskupricelistusd);

    const hasValidPrice = Number.isFinite(currncyFormat) && currncyFormat > 0;
    const hideListPrice = result?.raw?.hidelistprice?.toString().toLowerCase() === 'true';
    const showListPrice = !hideListPrice;

    const showRFQ = availableOnline.length > 0;

    const buyDetail = div(
      {
        class: 'inline-flex justify-start items-center gap-3',
      },
      ...(result?.raw?.listpriceusd ? [
        div(
          {
            class: 'buyDetail starts-at-price font-bold justify-start text-black text-2xl font-normal',
          },
          div({ class: 'starts-at-label text-black text-base font-bold' }, 'Starts at'),
          `$${numberWithCommas(result?.raw?.listpriceusd)}`,
        ),
        (result.raw.listpriceusd && result?.raw?.externallink) ? a(
          {
            class:
            'cursor-pointer pr-bn px-5 py-2 bg-danaherpurple-500 hover:bg-danaherpurple-800 text-white rounded-[20px] flex justify-center items-center overflow-hidden h-12',
          },
          span(
            {
              class: 'inherit text-base font-medium leading-snug',
            },
            'Buy',
          ),
        ) : '',
      ] : []),
      button(
        {
          class:
          'show-modal-btn cursor-pointer text-danaherpurple-500 hover:text-white hover:bg-danaherpurple-500 flex-1 px-5 py-2 bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-[#7523FF] flex justify-center items-center overflow-hidden h-12',
        },
        div(
          {
            class: 'inherit text-base font-medium leading-snug',
          },
          'Request a Quote',
        ),
      ),
    );

    if (result?.raw?.objecttype !== 'Family') {
      defaultContent.append(pricingQuoteButton);
    }
    // if (result?.raw?.objecttype === 'Bundle') {
    //   defaultContent.append(quoteButton);
    // }
    if (result?.raw?.objecttype === 'Family') {
      defaultContent.append(buyDetail);
    }

    if (hasValidPrice && showListPrice) {
      pricingQuoteButton.querySelector('.buy-btn').style.display = 'block';
      const priceEl = infoTab.querySelector('.starts-at-price');

      if (priceEl) {
        priceEl.append(formatMoney(currncyFormat));
        // if (priceEl.childNodes[1]) {
        //   priceEl.append(formatMoney(currncyFormat))
        //   //priceEl.childNodes[1].textContent = `${formatMoney(currncyFormat)}`;
        // }
        priceEl.style.display = 'block';
        infoTab.querySelector('.uom-seperator-line').style.display = 'block';
      }
    }

    if (showRFQ) {
      pricingQuoteButton.querySelector('.pr-rfq')?.classList.remove('hidden');
    }
    if (['Family'].includes(result?.raw?.objecttype) && hasValidPrice && showListPrice) {
      const familyPR = pricingQuoteButton.querySelector('.pr-starts-at-price');
      if (familyPR) {
        familyPR.childNodes[1].textContent = `${formatMoney(currncyFormat)}`;
        familyPR.style.display = 'block';
      }
    }

    // Buy Now logic
    const externallinkRaw = result?.raw?.externallink;
    let btnHref = '';

    if (externallinkRaw) {
      btnHref = `${externallinkRaw}`;
    }
    const handleBuyClick = () => {
      if (btnHref) {
        window.open(btnHref, '_blank');
      }
    };

    // Attach event listeners
    const pricingBuy = pricingQuoteButton.querySelector('.pr-bn');
    if (pricingBuy) {
      pricingBuy.classList.remove('hidden');
      pricingBuy.addEventListener('click', handleBuyClick);
    }

    const buyDetailButton = buyDetail.querySelector('.pr-bn');
    if (buyDetailButton) {
      buyDetailButton.classList.remove('hidden');
      buyDetailButton.addEventListener('click', handleBuyClick);
    }
  }

  const globeImg = div(
    {
      class: 'w-9 h-9 relative overflow-hidden cursor-pointer',
    },
    span({
      class:
        'icon icon-Globe-alt w-9 h-9 fill-current [&_svg>use]:stroke-black [&_svg>use]:hover:stroke-danaherpurple-800',
    }),
  );
  const externalLink = div(
    {
      class: 'w-9 h-9 relative flex items-center justify-center overflow-hidden cursor-pointer',
    },
    span({
      class:
        'icon icon-External-link w-6 h-6 fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800',
    }),
  );
  const externalButton = div(
    { class: 'flex justify-center items-center text-base font-extralight leading-snug gap-3 hover:text-danaherpurple-800' },
    `To learn more visit ${result?.raw.opco} `,
    externalLink,
  );
  const clickableLink = result?.raw?.externallink;
  const externalURL = `${clickableLink}?utm_source=dhls_website`;
  const openLink = () => {
    const target = externalURL.includes(window.DanaherConfig.host) ? '_self' : '_blank';
    window.open(externalURL, target);
  };

  externalButton.addEventListener('click', openLink);
  globeImg.addEventListener('click', openLink);

  const info = div(
    {
      class:
        'self-stretch inline-flex justify-start items-center gap-3 py-3 cursor-pointer',
    },
    globeImg,
    externalButton,
  );
  decorateIcons(info);

  // decorateModals(quoteButton);

  const collectionButton = div(
    {
      class: 'w-9 h-9',
    },
    span({
      class:
        'icon icon-Collection w-9 h-9 fill-current [&_svg>use]:stroke-black [&_svg>use]:hover:stroke-danaherpurple-800',
    }),
  );
  const categoryLink = div(
    {
      class: 'w-full inline-flex flex-col group',
    },
    div(
      {
        class:
          'self-stretch inline-flex justify-start items-center gap-3 cursor-pointer',
      },
      collectionButton,
      div(
        {
          class: 'w-full inline-flex flex-col',
        },
        div(
          {
            class: 'justify-start text-black text-base font-extralight leading-snug',
          },
          'See all product Family in this line',
        ),
        div(
          {
            class: 'w-56 h-[1rem] mt-[-10px]',
          },
          span({
            class:
              'icon icon-Rectangle w-full h-[1rem] fill-current [&_svg>use]:stroke-danaherpurple-500 group-hover:[&_svg>use]:stroke-danaherpurple-800',
          }),
        ),
      ),
    ),
    div(
      {
        class: 'inline-flex justify-center items-center',
      },
      span({
        class:
          'icon icon-chevron-down w-4 h-4 fill-current [&_svg>use]:stroke-danaherpurple-500 group-hover:[&_svg>use]:stroke-danaherpurple-800',
      }),
    ),
  );

  decorateIcons(categoryLink);

  categoryLink.addEventListener('click', () => {
    const main = block.closest('main');
    const productTab = main.querySelector('#products-tab');
    if (productTab) {
      productTab.scrollIntoView({ behavior: 'smooth' });
    }
  });

  const categoryLinkSku = div(
    {
      class: 'inline-flex flex-col justify-start py-3',
    },
    div(
      {
        class:
          'self-stretch inline-flex justify-start items-center gap-3 cursor-pointer',
      },
      div(
        {
          class: 'w-9 h-9 relative',
        },
        span({
          class:
            'icon icon-Collection w-9 h-9 fill-current [&_svg>use]:stroke-black [&_svg>use]:hover:stroke-danaherpurple-800',
        }),
      ),
      div(
        {
          class: 'w-full inline-flex flex-col ',
        },
        div(
          {
            class: 'justify-start text-black text-base',
          },
          'See all products in this family',
        ),
      ),
    ),
  );
  decorateIcons(categoryLinkSku);
  categoryLinkSku.addEventListener('click', () => {
    window.open(externalURL, '_blank');
  });

  const clipBoard = div(
    {
      class: 'w-9 h-9 relative',
    },
    span({
      class: 'icon icon-ClipboardList w-9 h-9 fill-current [&_svg>use]:stroke-black [&_svg>use]:hover:stroke-danaherpurple-800',
    }),
  );
  const bundleLink = div(
    {
      class: 'w-full inline-flex flex-col group',
    },
    div(
      {
        class:
          'self-stretch inline-flex justify-start gap-3 cursor-pointer',
      },
      clipBoard,
      div(
        {
          class: 'w-full inline-flex flex-col',
        },
        div(
          {
            class: 'justify-start text-black text-base',
          },
          'See all items in this bundle',
        ),
        div(
          {
            class: 'w-[190px] h-[1rem] mt-[-10px]',
          },
          span({
            class:
              'icon icon-Rectangle w-full h-[1rem] fill-current [&_svg>use]:stroke-danaherpurple-500 group-hover:[&_svg>use]:stroke-danaherpurple-800',
          }),
        ),

        div(
          {
            class: 'w-[190px] inline-flex justify-center items-center',
          },
          span({
            class:
              'icon icon-chevron-down w-4 h-4 fill-current [&_svg>use]:stroke-danaherpurple-500 group-hover:[&_svg>use]:stroke-danaherpurple-800',
          }),
        ),
      ),
    ),
  );

  let content;

  if (result?.raw?.numproducts > 0) {
    content = result?.raw?.objecttype === 'Bundle' ? bundleLink : categoryLink;
  }

  const bundleTab = div(
    {
      class: 'w-full inline-flex gap-6 flex-col md:flex-row',
    },
    content,
  );

  decorateIcons(bundleTab);
  bundleLink.addEventListener('click', () => {
    const main = block.closest('main');
    const bundleTabList = main.querySelector('#parts-tab');
    if (bundleTabList) {
      bundleTabList.scrollIntoView({ behavior: 'smooth' });
    }
  });

  if (result?.raw?.objecttype === 'Family') {
    defaultContent.append(
      div(
        {
          class: 'inline-flex justify-start items-center gap-6 flex-col',
        },
        div(
          {
            class: 'w-full inline-flex gap-6',
          },
          categoryLink,
          div({ class: 'w-full inline-flex flex-col h-[0px]' }),
        ),
      ),
    );

    if (info) {
      defaultContent.append(
        div(
          {
            class:
              'w-full border-t border-b border-gray-300 inline-flex justify-start items-center gap-6',
          },
          info,
        ),
      );
    }
  } else if (result?.raw?.objecttype === 'Bundle') {
    defaultContent.append(
      div(
        {
          class:
            'inline-flex justify-start items-center gap-6 flex-col',
        },
        bundleTab,
      ),
    );
    if (info) {
      defaultContent.append(
        div(
          {
            class:
              'w-full border-t border-b border-gray-300 flex justify-start items-center gap-6',
          },
          info,
        ),
      );
    }
  } else {
    defaultContent.append(
      result?.raw?.externallink ? div(
        {
          class:
        'w-full border-t border-b border-gray-300 inline-flex justify-start items-center',
        },
        div(
          {
            class: 'w-full inline-flex gap-6 flex-col md:flex-row',
          },
          result?.raw?.externallink ? categoryLinkSku : '',
          ...(result?.raw?.externallink ? [info] : []),
        ),
      ) : '',
    );
  }
  const categoryDiv = (label, href) => {
    const list = div(
      {
        class:
          'px-4 py-1 bg-danaherpurple-50 flex justify-center items-center gap-2.5 cursor-pointer',
      },
      a(
        {
          class:
            'text-center justify-start text-danaherpurple-500 text-lg leading-normal font-medium',
          href: `/us/en/products/${href}`,
        },
        label,
      ),
    );
    return list;
  };

  const categoriesDiv = div({
    class: 'flex-wrap inline-flex justify-start items-start gap-2',
  });
  const names = result?.raw?.categoriesname || [];
  const slugs = result?.raw?.categories || [];

  const seen = new Set();

  names.forEach((name, i) => {
    const slug = slugs[i] || '';

    // label = last part
    const label = name.split('|').pop().trim();

    // href = replace "|" with "/", replace spaces with "-", lowercase
    const href = slug
      .replace(/\|/g, '/')
      .replace(/\s+/g, '-')
      .toLowerCase()
      .trim();

    const key = `${label}|${href}`;
    if (!seen.has(key)) {
      seen.add(key);
      categoriesDiv.append(categoryDiv(label, href));
    }
  });

  defaultContent.append(categoriesDiv);

  // MutationObserver to ensure categoriesDiv stays at the end
  const observer = new MutationObserver(() => {
    const lastChild = defaultContent.lastElementChild;
    if (lastChild !== categoriesDiv) {
      defaultContent.appendChild(categoriesDiv); // Move it back to the end
    }
  });

  observer.observe(defaultContent, { childList: true, subtree: true });

  block.parentElement.classList.add(...'stretch'.split(' '));
  // block.innerHTML = '';
  block.append(
    div(
      { class: 'pdp-hero-content' },
      div({ class: 'hero-default-content w-full' }, defaultContent),
      verticalImageGallery,
    ),
  );
  decorateModals(block);
  decorateBuyButton(pricingQuoteButton);
}
