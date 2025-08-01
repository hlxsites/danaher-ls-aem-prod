import {
  div, p, h2, a, img, span,
} from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  const baseUrl = `https://${window.DanaherConfig.host}`;
  const maxCards = 28;

  const [productCategoryId, blockTitle, blockBrand] = block.children;
  block?.parentElement?.parentElement?.removeAttribute('class');
  block?.parentElement?.parentElement?.removeAttribute('style');

  document.documentElement.style.scrollBehavior = 'smooth';
  const blockId = productCategoryId?.querySelector('p')?.textContent?.trim() || '';

  // const wrapper = block.closest(".product-categories-wrapper");
  const brandEl = blockBrand?.textContent?.trim().toLowerCase() || '';
  const titleEl = blockTitle?.textContent?.trim() || '';

  const authoredBrand = brandEl;
  const authoredTitle = titleEl;

  try {
    const response = await fetch(`${baseUrl}/us/en/products-index.json`);
    const raw = await response.json();
    let allProducts = Array.isArray(raw)
      ? raw
      : raw?.data || raw?.results || [];

    const filteredProducts = allProducts
      .filter(({ fullCategory }) => fullCategory && fullCategory.split('|').length === 1)
      .filter(({ type }) => type === 'Category')
      .filter(({ path }) => !path.includes('/product-coveo'));

    allProducts = filteredProducts.sort((item1, item2) => item1.title.localeCompare(item2.title));

    const createCard = (item) => {
      const title = item.title || '';
      const clickUri = item.path || item.url || item.ClickUri || '#';
      const image = item.image || item.images?.[0] || '';
      const absImg = image?.startsWith('http') ? image : `${baseUrl}${image}`;
      return div(
        {
          class:
            'border cursor-pointer transform transition duration-500 hover:scale-105  border-gray-300 overflow-hidden gap-3 hover:shadow-md  bg-white flex flex-col',
          onclick: () => window.open(
            clickUri,
            clickUri?.includes('http') ? '_blank' : '_self',
          ),
        },
        image
          && img({
            src:
             !absImg.includes('error') ? absImg : '/content/dam/danaher/products/fallbackImage.jpeg',
            alt: title,
            class: 'h-[164px] w-full object-contain !p-0',
          }),
        p(
          {
            class:
              'text-xl !m-0 !p-0  !px-3  text-black flex-grow font-medium leading-7 !line-clamp-2 !break-words',
          },
          title,
        ),
        a(
          {
            href: clickUri,
            target: clickUri?.includes('http') ? '_blank' : '_self',
            rel: 'noopener noreferrer',
            class:
              'text-danaherpurple-500 hover:text-danaherpurple-800 text-base font-semibold  [&_svg>use]:hover:stroke-danaherpurple-800 flex items-center  !px-3 !pb-3',
          },
          'Browse Products',
          span({
            class:
              'icon icon-arrow-right dhls-arrow-right-icon fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800',
          }),
        ),
      );
    };

    const sectionWrapper = div({
      class: 'w-full bg-white  dhls-container px-5 lg:px-10 dhlsBp:p-0 ',
    });
    const header = div(
      { class: 'flex flex-col gap-2 mb-6 scroll-mt-32', id: blockId },
      h2(
        {
          class: `!text-3xl text-black font-medium m-0 min-h-[40px] ${
            authoredTitle ? '' : ''
          }`,
        },
        authoredTitle || 'Categories',
      ),
    );

    const grid = div({
      class:
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5',
    });

    const filterBar = div({
      class: 'flex flex-wrap mb-6 gap-3',
    });

    const renderGrid = (list) => {
      grid.innerHTML = '';
      list.slice(0, maxCards).forEach((item) => {
        if (item.type === 'Category' && item.title !== '' && item.brand !== '') {
          grid.appendChild(createCard(item));
          decorateIcons(grid);
        }
      });
    };
    decorateIcons(sectionWrapper);
    // CASE 1: Authored Brand

    if (authoredBrand && authoredTitle) {
      // allProducts = allProducts.sort((item1, item2) => item1.title.localeCompare(item2.title));
      const filtered = allProducts.filter((item) => {
        const brandArray = item.brand?.split(',') || [];
        return brandArray.some((iBrand) => {
          const brand = iBrand;
          return (
            brand.toLowerCase() === authoredBrand
          );
        });
      });

      renderGrid(filtered);
      sectionWrapper.append(header, grid);
    } else {
      // CASE 2: All brands with filters from item.brand

      let activeBrand = 'all';

      // Build unique filters (exclude brands with commas)
      const filterSet = new Set();
      allProducts.forEach((item) => {
        const brand = item.brand?.trim();
        if (brand && !brand.includes(',')) filterSet.add(brand);
      });
      const allBrands = Array.from(filterSet).sort();

      const createFilterBtn = (label, value) => span(
        {
          class: `px-3 py-1 bg-gray-100 border-2 cursor-pointer border-danaherpurple-500 text-sm text-gray-500 font-medium leading-tight transition ${
            value === activeBrand
              ? 'border-danaherpurple-500'
              : 'border-gray-100'
          }`,
          onclick: (event) => {
            activeBrand = value;
            [...filterBar.children].forEach((btn) => btn.classList.remove(
              'border-danaherpurple-500',
              'border-gray-100',
            ));
            event.target.classList.add('border-danaherpurple-500');

            const list = value === 'all'
              ? allProducts
              : allProducts.filter((pr) => {
                const brands = pr.brand
                  ?.split(',')
                  .map((b) => b.trim().toLowerCase()) || [];
                return brands.includes(value);
              });
              // allProducts.sort((item1, item2) => item1.title.localeCompare(item2.title));
            renderGrid(list);
          },
        },
        label,
      );

      filterBar.appendChild(createFilterBtn('All', 'all'));
      allBrands.forEach((brand) => {
        filterBar.appendChild(createFilterBtn(brand, brand.toLowerCase()));
      });

      renderGrid(allProducts);

      sectionWrapper.append(header, filterBar, grid);
    }

    decorateIcons(grid);
    block.innerHTML = '';
    block.append(sectionWrapper);
  } catch (err) {
    // return null;
  }
  // return {};
}
