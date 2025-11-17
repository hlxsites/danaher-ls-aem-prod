import {
  div,
  span,
  button,
  a,
  img,
  input,
  h1,
  label,
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
import { querySummary } from '../../scripts/coveo/pdp-listing/controllers/pdp-controllers.js';

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// ::::: Dropdown implementation Starts:::::
const keyAliases = { moidification: 'modification', Moidication: 'modification' };
function normalizeKeys(obj) {
  return Object.keys(obj).reduce((acc, k) => {
    acc[keyAliases[k] || k] = obj[k];
    return acc;
  }, {});
}
function getDropdownKeys(data) {
  return Array.from(
    new Set(data.flatMap((obj) => Object.keys(normalizeKeys(obj)))),
  ).filter((k) => k !== 'price' && k !== 'sku'); // exclude SKU and price
}
function getOptions(data, key, filters) {
  return Array.from(
    new Set(
      data
        .map(normalizeKeys)
        .filter((obj) => Object.entries(filters)
          .every(([fKey, fVal]) => !fVal || obj[fKey] === fVal))
        .map((obj) => obj[key])
        .filter(Boolean),
    ),
  );
}
function buildDropdown({
  key, options, selectedValue, onChange,
}) {
  if (!options.length) return null; // hide if no options
  let isOpen = false;
  const outer = div({ class: 'individual-dd' });
  const dropdownLabel = label(
    { class: 'mb-1 text-sm font-medium text-gray-700' },
    `Select ${key.charAt(0).toUpperCase() + key.slice(1)}`,
  );
  // dropdownLabel.style.fontFamily = 'Inter';
  const display = div(
    {
      class: 'pdp-hero-dd',
      tabIndex: 0,
      role: 'button',
    },
    selectedValue || `Select ${key}`,
    span({
      class:
        'icon icon-chevron-down w-5 h-5 [&_svg>use]:stroke-gray-500 group-hover:[&_svg>use]:stroke-gray-800 ml-1',
    }),
  );
  decorateIcons(display);
  const list = div({
    class: 'individual-dd-options absolute left-0 hidden mt-1 border bg-white shadow text-sm z-10 w-full',
  });
  options.forEach((opt) => {
    const isSelected = opt === selectedValue;
    const optionDiv = div(
      {
        class: [
          'px-4', 'py-2', 'cursor-pointer hover:bg-danaherpurple-50',
          isSelected ? 'text-danaherpurple-500 font-semibold' : '',
        ].join(' '),
      },
      opt,
    );
    optionDiv.addEventListener('click', () => {
      onChange(key, opt);
      isOpen = false;
      list.classList.add('hidden');
      display.childNodes[0].textContent = opt;
    });
    list.appendChild(optionDiv);
  });
  function closeAllDropdowns(exceptList) {
    document.querySelectorAll('.individual-dd-options').forEach((dd) => {
      if (dd !== exceptList) dd.classList.add('hidden');
    });
  }
  function toggleDropdown(e) {
    isOpen = !isOpen;
    closeAllDropdowns(list);
    list.classList.toggle('hidden', !isOpen);
    e.stopPropagation();
  }
  display.addEventListener('click', toggleDropdown);
  display.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') toggleDropdown(e);
    if (e.key === 'Escape' && isOpen) {
      isOpen = false;
      list.classList.add('hidden');
      display.focus();
    }
  });
  document.addEventListener('click', (e) => {
    if (!outer.contains(e.target)) {
      isOpen = false;
      list.classList.add('hidden');
    }
  });
  outer.append(dropdownLabel, display, list);
  return outer;
}
function getCurrentPrice(filtered, keys, selectedVals, dataNorm) {
  // If no selections made, show first record’s price
  const selectedCount = Object.values(selectedVals).filter(Boolean).length;
  if (selectedCount === 0 && dataNorm.length > 0) {
    return dataNorm[0].price;
  }
  // If only one matching record
  if (filtered.length === 1) return filtered[0].price;
  return 'Select options';
}
function printSelectedAndPrice(selected, finalPrice) {
  const priceEl = document.querySelector('.dd-price');
  if (!priceEl) return;
  const startsAtLabel = priceEl.querySelector('.starts-at-label');
  if (startsAtLabel) startsAtLabel.style.display = 'none';
  priceEl.childNodes.forEach((node) => {
    if (
      node.nodeType === Node.TEXT_NODE
      && (
        node.textContent.trim().startsWith('$')
        || node.textContent.trim() === 'Select options for price'
        || node.textContent.trim() === 'Select options'
      )
    ) {
      if (finalPrice === 'Select options') {
        priceEl.setAttribute(
          'style',
          'font-weight: 400 !important; line-height: 32px; font-size: 24px;',
        );
        node.textContent = 'Select options for price';
      } else {
        node.textContent = `$${numberWithCommas(finalPrice)}`;
      }
    }
  });
}
export function dynamicDropdownInit({ data, containerId, priceLabelId }) {
  const dataNorm = data.map(normalizeKeys);
  const keys = getDropdownKeys(dataNorm);
  const selected = Object.fromEntries(keys.map((k) => [k, '']));
  const container = document.getElementById(containerId);
  const priceLabel = document.getElementById(priceLabelId);
  // Pre-fill selections with first record’s values
  const firstRecord = dataNorm[0];
  if (firstRecord) {
    keys.forEach((k) => {
      if (firstRecord[k]) selected[k] = firstRecord[k];
    });
  }
  function onChange(changedKey, value) {
    selected[changedKey] = value;
    // eslint-disable-next-line no-use-before-define
    renderDropdown();
  }
  function renderDropdown() {
    container.innerHTML = '';
    const filtered = dataNorm.filter(
      (obj) => keys.every((k) => !selected[k] || obj[k] === selected[k]),
    );
    // Auto-select dropdowns for single matching record
    if (filtered.length === 1) {
      const row = filtered[0];
      keys.forEach((k) => {
        if (row[k]) selected[k] = row[k];
      });
    }
    keys.forEach((key) => {
      const filters = { ...selected, [key]: '' };
      const options = getOptions(dataNorm, key, filters);
      if (options.length > 0) {
        const dropdown = buildDropdown({
          key,
          options,
          selectedValue: selected[key],
          onChange,
        });
        if (dropdown) container.appendChild(dropdown);
      }
    });
    const filteredNow = dataNorm.filter(
      (obj) => keys.every((k) => !selected[k] || obj[k] === selected[k]),
    );
    const finalPrice = getCurrentPrice(filteredNow, keys, selected, dataNorm);
    if (priceLabel) priceLabel.textContent = finalPrice;
    printSelectedAndPrice(selected, finalPrice);
  }
  renderDropdown();
}

// ::::: Dropdown implementation Ends:::::

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
  block.parentElement.parentElement.style.padding = '0';

  const titleEl = block.querySelector('h1');
  titleEl?.classList.add('title');
  titleEl?.parentElement.parentElement.remove();
  const result = JSON.parse(localStorage.getItem('eds-product-details'));
  let sku = result?.raw?.sku || '';
  sku = sku.replace(/-(abcam|phenomenex|leica)$/i, '');
  const productInfo = await getProductDetails(sku);
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
        class: 'starts-at-price dd-price justify-start text-black text-4xl font-normal',
      },
      div({ class: 'starts-at-label text-black text-base font-extralight' }, 'Starts at'),
    ),
    div(
      {
        class: 'flex-1 py-3 flex justify-start items-start',
      },

      div({
        class: 'uom-seperator-line hidden md:block w-12 h-0 hidden md:block flex-grow-0 mt-[26px] rotate-90 outline outline-1 outline-offset-[-0.50px] outline-gray-300',
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
        'pdp-pqb flex flex-col justify-start gap-4',
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
    div(
      { class: 'inline-flex justify-start items-center gap-3' },
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
    ),
    div({ id: 'dropdowns', class: 'flex flex-wrap gap-3' }),
  );
  const priceInfoDiv = div({
    class: 'self-stretch flex flex-col justify-start items-start gap-5',
  });
  priceInfoDiv.append(infoTab, shipInfo);
  if (result?.raw?.objecttype === 'Product' || result?.raw?.objecttype === 'Bundle' || result?.raw?.objecttype === 'Family') {
    defaultContent.append(priceInfoDiv);
  }

  if (!productInfo?.data?.salePrice?.value && !result?.raw.listpriceusd) {
    priceInfoDiv.style.display = 'none';
  }
  // Intershop
  if (productInfo?.data?.salePrice?.value > 0.0 && productInfo?.data?.attributes?.[0]?.value === 'True') {
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
    // infoTab.querySelector('.uom-seperator-line').style.display = 'none';
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
    let skusizeDetailsLength = 0;
    if (result?.raw?.skusizedetails !== undefined
      && result?.raw?.skusizedetails !== null) {
      skusizeDetailsLength = JSON.parse(result?.raw?.skusizedetails)?.length;
    }
    const buyDetail = div(
      {
        class: 'flex flex-col-reverse md:flex-row-reverse md:items-end justify-start gap-4',
      },
      div(
        { class: 'inline-flex justify-start items-center gap-3' },
        ...(result?.raw?.listpriceusd
          || (result?.raw?.familyskusizeflag !== undefined
            && result?.raw?.familyskusizeflag !== null && result?.raw?.familyskusizeflag?.includes('True|') && skusizeDetailsLength > 0) ? [
            // div(
            //   {
            //     class: 'buyDetail starts-at-price dd-price
            // font-bold justify-start text-black text-2xl font-normal',
            //   },
            //   div({ class: 'starts-at-label text-black text-base font-bold' }, 'Starts at'),
            //   `$${result?.raw?.listpriceusd ? numberWithCommas(result?.raw?.listpriceusd) : ''}`,
            // ),
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
          'show-modal-btn cursor-pointer text-danaherpurple-500 hover:text-white hover:bg-danaherpurple-500 px-5 py-2 bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-[#7523FF] flex justify-center items-center overflow-hidden h-12',
          },
          div(
            {
              class: 'inherit text-base font-medium leading-snug',
            },
            'Request a Quote',
          ),
        ),
      ),
      div({ id: 'dropdowns', class: 'flex flex-wrap gap-3' }),
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
        infoTab.querySelector('.starts-at-label').classList.add('md:block', 'hidden');
        // infoTab.querySelector('.uom-seperator-line').style.display = 'block';
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
      onclick: () => {
        window.open(result?.raw?.externallink, '_blank');
      },
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
    {
      class: 'flex justify-center items-center text-base font-extralight leading-snug gap-3 hover:text-danaherpurple-800',
      onclick: () => {
        window.open(result?.raw?.externallink, '_blank');
      },
    },
    `To learn more visit ${result?.raw.opco} `,
    externalLink,
  );
  const host = window?.DanaherConfig?.host || 'lifesciences.danaher.com';
  const familyIds = Array.isArray(result?.raw?.familyid) ? result.raw.familyid : [];
  const external = result?.raw?.externallink || '';

  const familyId = familyIds.length > 0 && typeof familyIds[0] === 'string' ? familyIds[0].trim() : '';

  const clickableLink = familyId
    ? `https://${host}/us/en/products/family/${encodeURIComponent(familyId)}`
    : external;

  const externalURL = String(clickableLink || '');

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
    window.open(externalURL, '_self');
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
          class: 'all-family inline-flex justify-start items-center gap-6 flex-col',
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
    if (result?.raw?.externallink) {
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
      result?.raw?.familyid?.length > 0 ? div(
        {
          class:
        'w-full border-t border-b border-gray-300 inline-flex justify-start items-center',
        },
        div(
          {
            class: 'w-full inline-flex gap-6 flex-col md:flex-row',
          },
          result?.raw?.familyid?.length > 0 ? categoryLinkSku : '',
          ...(result?.raw?.externallink ? [info] : []),
        ),
      ) : '',
    );
  }
  const categoryDiv = (priceLabel, href) => {
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
        priceLabel,
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
    const labelEle = name.split('|').pop().trim();

    // href = replace "|" with "/", replace spaces with "-", lowercase
    const href = slug
      .replace(/\|/g, '/')
      .replace(/\s+/g, '-')
      .toLowerCase()
      .trim();

    const key = `${labelEle}|${href}`;
    if (!seen.has(key)) {
      seen.add(key);
      categoriesDiv.append(categoryDiv(labelEle, href));
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
  if (result?.raw?.numproducts === 0 || result?.raw?.familyskusizeflag?.includes('True|')) {
    block.querySelector('.all-family')?.remove();
    document.querySelector('.pdp-products-container')?.remove();
  }

  let globalTotalcounter = 0;
  querySummary.subscribe(() => {
    const count = querySummary.state.total;
    globalTotalcounter += 1;
    if (globalTotalcounter === 3 && count === 0) {
      globalTotalcounter = 0;
      if (block instanceof HTMLElement) {
        block.querySelector('.all-family')?.remove();
      }
    }
  });
  if (result?.raw?.familyskusizeflag !== undefined && result?.raw?.familyskusizeflag !== null
    && result?.raw?.familyskusizeflag?.includes('True|') && result?.raw?.skusizedetails !== undefined
    && result?.raw?.skusizedetails !== null
    && JSON.parse(result?.raw?.skusizedetails)?.length > 0) {
    const data = JSON.parse(result?.raw?.skusizedetails);
    dynamicDropdownInit({
      data,
      containerId: 'dropdowns',
    });
  }
}
