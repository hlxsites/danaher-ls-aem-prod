import { div, span } from '../../../dom-builder.js';
import { decorateIcons } from '../../../lib-franklin.js';
import { paginationController } from '../controllers/pdp-controllers.js';

const renderPagination = () => {
  const paginationElement = document.getElementById('pagination');
  paginationElement.innerHTML = '';

  const {
    currentPages, hasNextPage, hasPreviousPage, currentPage,
  } = paginationController.state;

  // Container
  const pagerDiv = div({ class: 'flex items-center py-6 w-full justify-between' });
  const pagerSpan = div({ class: 'border-t border-gray-200 flex items-center w-full justify-between' });

  // Left container for previous button
  const leftContainer = div({ class: 'flex items-center justify-start w-1/4' });
  leftContainer.className = 'flex items-center justify-start w-1/4';
  // Previous Button
  const prevButton = div({
    class: `inline-flex justify-start items-center gap-3 cursor-${hasPreviousPage ? 'pointer' : 'not-allowed'}`,
  });
  prevButton.append(
    div(
      { class: 'w-5 h-5 relative overflow-hidden' },
      span({
        class: `icon icon-arrow-left w-5 h-5 absolute fill-current ${
          hasPreviousPage ? 'text-danaherpurple-500' : 'text-gray-400'
        } [&_svg>use]:stroke-current`,
      }),
    ),
    div({
      class: `justify-start text-${hasPreviousPage ? 'danaherpurple-500' : 'gray-400'} text-sm font-medium leading-tight`,
    }, 'Previous'),
  );
  prevButton.disabled = !hasPreviousPage;
  prevButton.onclick = () => {
    if (hasPreviousPage) {
      paginationController.previousPage();
      const target = document.getElementById('products-tab');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  decorateIcons(prevButton);
  leftContainer.appendChild(prevButton);

  // Center container for page buttons
  const centerContainer = div({ class: 'hidden md:flex items-center justify-center space-x-2 w-1/2 gap-2' });

  currentPages.forEach((page) => {
    const pageButton = document.createElement('button');
    const isActive = page === currentPage;
    pageButton.innerText = page.toString();
    pageButton.className = isActive
      ? 'w-10 h-42 border-t-2 text-danaherpurple-500 border-danaherpurple-500'
      : 'w-10 h-42 text-gray-700 hover:bg-danaherpurple-50';
    pageButton.style = 'height: 42px';
    pageButton.disabled = isActive;
    pageButton.onclick = () => {
      if (!isActive) {
        paginationController.selectPage(page);
        const target = document.getElementById('products-tab');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };
    centerContainer.appendChild(pageButton);
  });

  // Right container for next button
  const rightContainer = div({ class: 'flex items-center justify-end w-1/4' });

  // Next Button
  const nextButton = div({
    class: `inline-flex justify-start items-center gap-3 cursor-${hasNextPage ? 'pointer' : 'not-allowed'}`,
  });
  nextButton.append(
    div({
      class: `justify-start text-${hasNextPage ? 'danaherpurple-500' : 'gray-400'} text-sm font-medium leading-tight`,
    }, 'Next'),
    div(
      { class: 'w-5 h-5 relative overflow-hidden' },
      span({
        class: `icon icon-arrow-right w-5 h-5 absolute fill-current ${
          hasNextPage ? 'text-danaherpurple-500' : 'text-gray-400'
        } [&_svg>use]:stroke-current`,
      }),
    ),
  );
  nextButton.disabled = !hasNextPage;
  nextButton.onclick = () => {
    if (hasNextPage) {
      paginationController.nextPage();
      const target = document.getElementById('products-tab');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  decorateIcons(nextButton);
  rightContainer.appendChild(nextButton);

  // Append all to pagerDiv
  pagerSpan.appendChild(leftContainer);
  pagerSpan.appendChild(centerContainer);
  pagerSpan.appendChild(rightContainer);
  pagerDiv.appendChild(pagerSpan);

  paginationElement.appendChild(pagerDiv);
};

export default renderPagination;
