import { buildBlock } from '../../scripts/lib-franklin.js';

export default async function buildAutoBlocks() {
  const main = document.querySelector('main');
  main.classList.add('mx-auto', 'max-w-7xl', 'flex', 'flex-row', 'gap-8', 'max-w-7xl', 'mx-auto', 'w-full', 'bg-white');
  const mainWrapper = main.querySelector(':scope > div');
  let blogH1 = '';
  let blogHeroP1 = '';
  let blogHeroP2 = '';

  const firstThreeChildren = Array.from(mainWrapper.children).slice(1, 4);
  firstThreeChildren.every((child) => {
    if (child.tagName === 'H1' && !blogH1) {
      blogH1 = child;
    } else if (child.tagName === 'P' && !blogHeroP1) {
      blogHeroP1 = child;
    } else if (child.tagName === 'P' && !blogHeroP2) {
      blogHeroP2 = child;
    }

    const imgElement = child.querySelector(':scope > picture, :scope > img');
    if (imgElement) return false;
    return true;
  });

  mainWrapper.removeChild(blogH1);
  let heroBlock = '';
  let heroElements = [];
  if (blogHeroP2) {
    const blogHeroImage = blogHeroP2.querySelector(':scope > picture, :scope > img');
    mainWrapper.removeChild(blogHeroP1);
    mainWrapper.removeChild(blogHeroP2);
    heroElements = [blogH1, blogHeroP1, blogHeroImage];
  } else if (blogHeroP1) {
    const blogHeroImage = blogHeroP1.querySelector(':scope > picture, :scope > img');
    mainWrapper.removeChild(blogHeroP1);
    heroElements = [blogH1, blogHeroImage];
  } else {
    heroElements = [blogH1];
  }

  heroBlock = buildBlock('blog-hero', { elems: heroElements });
  mainWrapper.prepend(
    buildBlock('social-media', { elems: [] }),
    heroBlock,
  );
  mainWrapper.append(
    buildBlock('social-media', { elems: [] }),
    buildBlock('related-articles', { elems: [] }),
  );
}
