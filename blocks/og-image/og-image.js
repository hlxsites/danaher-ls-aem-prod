import { div, img } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  block.parentElement.parentElement.style.padding = '0';
  block.parentElement.parentElement.style.margin = '0';

  const [imageCell, altTextCell, showImageCell] = block.children;

  // Extract values from the block
  const imgEl = imageCell?.querySelector('img');
  const imageSrc = imgEl?.getAttribute('src') || '';
  const altText = altTextCell?.textContent.trim() || imgEl?.getAttribute('alt') || '';
  const showImage = showImageCell?.textContent.trim().toLowerCase();

  // Determine if image should be visible
  const isVisible = showImage === 'true' || showImage === 'yes' || showImage === '1';

  // Create the image element
  const imageElement = img({
    src: imageSrc,
    alt: altText,
    loading: 'lazy',
    decoding: 'async',
    class: 'w-full h-auto object-contain',
  });

  // Create the image container with conditional visibility
  const imageContainer = div(
    {
      class: `block w-full ${!isVisible ? 'hidden' : ''}`,
    },
    imageElement,
  );

  // Wrap in main container with standard styling
  const container = div(
    {
      class: 'dhls-container px-5 lg:px-10 dhlsBp:p-0',
    },
    imageContainer,
  );

  block.textContent = '';
  block.append(container);
}
