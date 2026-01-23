import { div, h2, strong } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  // Extract super title from first row if it exists
  const firstRow = block.firstElementChild;
  const superTitleParagraph = firstRow?.querySelector('p');
  const superTitle = superTitleParagraph?.textContent.trim() || '';

  // Get content rows - skip first row only if it has a super title
  const contentRows = superTitle ? Array.from(block.children).slice(1) : Array.from(block.children);

  // Create layout container similar to accordion-in-column.js
  const layoutContainer = div({
    class: 'flex flex-col md:flex-row gap-x-12 md:divide-x w-full',
  });

  // Create content container (right side)
  const contentContainer = div({ class: 'col-right w-full mt-4 lg:mt-0 lg:w-2/3 xl:w-2/3 pt-4 pb-10 space-y-4 divide-y' });

  contentRows.forEach((row) => {
    row?.classList.add(...'w-full card flex flex-col md:flex-row py-4 gap-x-2 gap-y-4 items-start md:items-center'.split(' '));
    row.querySelectorAll('picture').forEach((picItem) => {
      picItem?.parentElement?.classList.add(...'card-image flex'.split(' '));
      picItem?.classList.add(...'w-64 h-64 block md:w-52 md:h-36 rounded-md shrink-0 mb-3 md:mb-0 object-cover aspect-video'.split(' '));
    });
    const pEl = row.querySelector('p');
    pEl?.parentElement.classList.add(...'card-body w-full'.split(' '));
    pEl?.classList.add(...'text-sm font-semibold break-words text-danaherpurple-500 !mb-0'.split(' '));
    const h2El = row.querySelector('h2');
    h2El?.classList.add(...'text-base tracking-tight text-gray-900 font-semibold !mt-0'.split(' '));
    row.querySelectorAll('p > strong').forEach((tagItem) => {
      const tagsEl = tagItem.innerHTML.split(', ');
      const tagsParent = tagItem.parentElement;
      tagsParent.classList.add(...'space-x-2'.split(' '));
      tagsParent.innerHTML = '';
      tagsEl.forEach((tagName) => {
        const strongTag = strong({ class: 'text-xs font-semibold tracking-wide px-3 py-1 text-danaherpurple-500 bg-danaherpurple-50 rounded-full font-sans' }, tagName);
        tagsParent.append(strongTag);
      });
    });
    const allBtns = row.querySelectorAll('p.button-container');
    if (allBtns.length > 0) {
      const actions = div({ class: 'flex flex-col md:flex-row gap-5' });
      allBtns.forEach((btnEl) => {
        btnEl.querySelector('a')?.classList.add(...'px-6 rounded-full !no-underline'.split(' '));
        actions.append(btnEl);
      });
      row.append(actions);
    }
    contentContainer.append(row);
  });

  // Assemble the layout
  if (superTitle) {
    // Create super title container (left side) only when needed
    const superTitleContainer = div(
      { class: 'col-left lg:w-1/3 xl:w-1/3 pr-11' },
      h2({ class: 'pt-6 pb-4 my-0 text-3xl leading-6' }, superTitle),
    );
    layoutContainer.append(superTitleContainer, contentContainer);
  } else {
    layoutContainer.append(contentContainer);
  }

  // Clear block and add new layout
  block.innerHTML = '';
  block.append(layoutContainer);
}
