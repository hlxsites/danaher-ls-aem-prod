import {
  ul, a, p, div, span, h4, li,
} from '../../scripts/dom-builder.js';
import { makePublicUrl, imageHelper } from '../../scripts/scripts.js';

// Manually authored product data
const products = [
  {
    title: 'Aivia AI Image Analysis Software',
    image: 'https://danaherls.scene7.com/is/image/danaher/Aivia-card-2',
    brand: 'Leica Microsystems',
    description: '',
    path: '/us/en/products/family/aivia-ai-image-analysis-softwares.html',
  },
  {
    title: 'IN Carta Image Analysis Software',
    image: 'https://danaherls.scene7.com/is/image/danaher/moldev-in-carta-image-analysis-software-image1',
    brand: 'Molecular Devices',
    description: '',
    path: '/us/en/products/family/in-carta-image-analysis-software.html',
  },
  {
    title: 'Genedata Screener',
    image: 'https://danaherls.scene7.com/is/image/danaher/gd-screener-50-hero-2',
    brand: 'Genedata',
    description: '',
    path: 'https://www.genedata.com/platform/screener.html',
  },
  {
    title: 'Polar BioPharma Lifecycle Management (BPLM)',
    image: 'https://danaherls.scene7.com/is/image/danaher/card-idbs-polar',
    brand: 'IDBS',
    description: '',
    path: '/us/en/products/family/polar.html',
  },
];

export function createCard(product, idx, firstCard = false) {
  const image = product.image || 'https://s7d9.scene7.com/is/image/danaherstage/no-image-availble';
  return li({
    class: 'w-full flex flex-col col-span-1 relative mx-auto justify-center transform transition duration-500 border hover:scale-105 shadow-lg rounded-lg overflow-hidden bg-white max-w-xl',
  },
    a(
      {
        href: makePublicUrl(product.path),
        title: product.title,
        index: idx + 1,
      },
      imageHelper(image, product.title, firstCard),
      div(
        { class: 'brand-title-align flex flex-col gap-1 px-6 pt-4 pb-0' },
        p(
          {
            class: 'brand text-danaherpurple-500 font-bold m-0',
          },
          product.brand,
        ),
        h4(
          {
            class: 'title !text-lg !font-semibold !text-danahergray-900 !line-clamp-3 !break-words !h-14 m-0',
          },
          product.title,
        ),
      ),
      p(
        {
          class: '!px-7 mb-4 text-sm text-gray-900 break-words line-clamp-4 !h-20',
        },
        product.description,
      ),
      div(
        { class: 'inline-flex items-center w-full px-6 py-5 space-x-4 bg-gray-100' },
        span({ class: 'btn-primary-purple border-8 px-2 !rounded-full' }, 'View Products'),
      ),
    )
  );
}

export default function decorate(block) {
  const cardList = ul({
    class: 'container grid max-w-7xl w-full mx-auto gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-4 pt-8 sm:px-0 justify-items-center mt-3 mb-3',
  });
  products.forEach((product, idx) => {
    cardList.append(createCard(product, idx, idx === 0));
  });
  block.innerHTML = '';
  block.append(cardList);
}
