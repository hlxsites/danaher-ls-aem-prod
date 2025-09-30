import { div, img, a } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  block.parentElement.parentElement.style.padding = '0';
  block.parentElement.parentElement.style.margin = '0';

  const [imageCell, altTextCell, hrefCell, targetCell] = block.children;

  // Extract values from the block
  const imgEl = imageCell?.querySelector('img');
  const imageSrc = imgEl?.getAttribute('src') || '';
  const altText = altTextCell?.textContent.trim() || imgEl?.getAttribute('alt') || '';
  const href = hrefCell?.textContent.trim() || '';
  const target = targetCell?.textContent.trim() || '';

  // Create the image element
  const imageElement = img({
    src: imageSrc,
    alt: altText,
    loading: 'lazy',
    decoding: 'async',
    class: 'w-full h-auto object-contain',
  });

  // Create the container
  let imageContainer;

  if (href) {
    // If href is provided, wrap image in a link
    const linkTarget = target.toLowerCase() === 'true' || target.toLowerCase() === '_blank' ? '_blank' : '_self';
    imageContainer = a(
      {
        href,
        target: linkTarget,
        class: 'block w-full',
      },
      imageElement,
    );
  } else {
    // If no href, just wrap in a div
    imageContainer = div(
      {
        class: 'block w-full',
      },
      imageElement,
    );
  }

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
