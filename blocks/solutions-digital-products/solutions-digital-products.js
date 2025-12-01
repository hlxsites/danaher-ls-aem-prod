import {
  ul, a, p, div, span, h4, li,
} from '../../scripts/dom-builder.js';
import { makePublicUrl, imageHelper } from '../../scripts/scripts.js';

// Manually authored product data
const products = [
  {
    title: 'Mica Microhub',
    image: 'https://danahersls.scene7.com/is/image/danaher/leica-mica-see-through-light-path-e93369ff44f-hero',
    description: 'This changes everything. More than a highly automated microscope, Mica unites widefield and confocal imaging in a sample protecting, incubating...',
    path: '/en/products/family/mica.html',
  },
  {
    title: 'Leica DM IL LED Inverted Laboratory Microscope',
    image: 'https://danahersls.scene7.com/is/image/danaher/leica-dmil-led-inverted-microscope-hero',
    description: 'With high-performance optics and ergonomic design, the Leica DM IL LED is ideal for cell culture, micromanipulation, documentation of...',
    path: '/en/products/family/dmil.html',
  },
  {
    title: 'DMi1 Inverted Microscope for Cell Culture',
    image: 'https://danahersls.scene7.com/is/image/danaher/leica-dmi1-inverted-microscope-hero',
    description: 'The DMi1 inverted microscope supports your specific work routine in your cell culture lab. Its operation is so intuitive, its handling so comfortable that you can...',
    path: '/en/products/family/dmi1.html',
  },
  {
    title: 'SpectraMax® iD3s and iD5e Multi-Mode Microplate',
    image: 'https://danahersls.scene7.com/is/image/danaher/spectramax-id3s-id5e-hero',
    description: 'Tunable wavelength selection, onboard injectors, and optional environmental controls to support cell-based & microbial assays.',
    path: '/en/products/family/spectramax.html',
  },
];

export function createCard(product, idx, firstCard = false) {
  const image = product.image || '/content/dam/danaher/products/fallbackImage.jpeg';
  return li(
    {
      class: 'w-full flex flex-col col-span-1 relative mx-auto justify-center transform transition duration-500 border hover:scale-105 shadow-lg rounded-lg overflow-hidden bg-white max-w-xl',
    },
    a(
      {
        href: makePublicUrl(product.path),
        title: product.title,
        index: idx + 1,
      },
      imageHelper(image, product.title, firstCard),
      h4(
        {
          class: '!px-7 !text-lg !font-semibold !text-danahergray-900 !line-clamp-3 !break-words !h-14',
        },
        product.title,
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
    ),
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
