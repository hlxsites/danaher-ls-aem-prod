import { buildBlock } from '../../scripts/lib-franklin.js';
import { buildArticleSchema } from '../../scripts/schema.js';
import {
  div,
} from '../../scripts/dom-builder.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function moveImageInstrumentation(picture) {
  if (picture.tagName === 'PICTURE') {
    moveInstrumentation(picture.parentElement, picture.querySelector('img'));
  }
}

export default async function buildAutoBlocks() {
  const main = document.querySelector('main');
  const section = main.querySelector(':scope > div:nth-child(2)');
  let blogH1 = '';
  let blogHeroP1 = '';
  let blogHeroP2 = '';
  const firstThreeChildren = Array.from(section.children).slice(0, 3);
  firstThreeChildren.every((child) => {
    if (child.tagName === 'H1' && !blogH1) {
      blogH1 = child;
    } else if (child.tagName === 'H2') {
      return false;
    } else if (child.tagName === 'P' && !blogHeroP1) {
      blogHeroP1 = child;
    } else if (child.tagName === 'P' && !blogHeroP2) {
      blogHeroP2 = child;
    }
    const imgElement = child.querySelector(':scope > picture, :scope > img');
    if (imgElement) return false;
    return true;
  });
  let blogHeroImage;
  if (blogHeroP2) {
    blogHeroImage = blogHeroP2.querySelector(':scope > picture, :scope > img');
    section.removeChild(blogHeroP1);
    section.removeChild(blogHeroP2);
    const divEl = div();
    divEl.append(blogH1, blogHeroP1);
    moveImageInstrumentation(blogHeroImage);
  } else if (blogHeroP1) {
    moveImageInstrumentation(blogHeroImage);
    section.removeChild(blogHeroP1);
  }
  const additionalContentSection = document.createElement('div');
  additionalContentSection.append(
    buildBlock('tags-list', { elems: [] }),
    buildBlock('related-articles', { elems: [] }),
  );
  buildArticleSchema();
}
