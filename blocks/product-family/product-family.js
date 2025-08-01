/* eslint-disable import/no-unresolved */
/* eslint-disable no-use-before-define */
/* eslint-disable no-console */
import { getProductsForCategories } from '../../scripts/commerce.js';
import {
  div,
  span,
  button,
  fieldset,
  input,
  p,
} from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import { buildItemListSchema } from '../../scripts/schema.js';
import renderProductGridCard from './gridData.js';
import renderProductListCard from './listData.js';

const productSkeleton = div(
  {
    class:
      'dhls-container coveo-skeleton flex flex-col w-full lg:flex-row grid-rows-1 lg:grid-cols-5 gap-x-10 gap-y-4',
  },
  div(
    { class: 'col-span-4 w-full' },
    div({
      class: 'max-w-xs bg-neutral-200 rounded-md p-4 animate-pulse mb-16',
    }),
    div(
      { class: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5' },
      div(
        { class: 'flex flex-col gap-y-2 animate-pulse' },
        div({ class: 'h-72 rounded bg-danaheratomicgrey-200 opacity-500' }),
        div({
          class:
            'w-2/4 h-7 bg-danaheratomicgrey-200 rounded [&:not(:first-child)]:opacity-40',
        }),
        div(
          { class: 'space-y-1' },
          p({
            class:
              'w-3/4 h-4 bg-danaheratomicgrey-200 rounded [&:not(:first-child):even]:opacity-40',
          }),
          p({
            class:
              'w-2/5 h-3 bg-danaheratomicgrey-200 rounded [&:not(:first-child):odd]:opacity-20',
          }),
          p({
            class:
              'w-4/5 h-5 bg-danaheratomicgrey-200 rounded [&:not(:first-child):even]:opacity-40',
          }),
        ),
        div(
          { class: 'grid grid-cols-3 gap-4' },
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-2' }),
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-1' }),
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-2' }),
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-1' }),
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-1' }),
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-1' }),
        ),
      ),
      div(
        { class: 'flex flex-col gap-y-2 animate-pulse' },
        div({ class: 'h-72 rounded bg-danaheratomicgrey-200 opacity-500' }),
        div({
          class:
            'w-2/4 h-7 bg-danaheratomicgrey-200 rounded [&:not(:first-child)]:opacity-40',
        }),
        div(
          { class: 'space-y-1' },
          p({
            class:
              'w-3/4 h-4 bg-danaheratomicgrey-200 rounded [&:not(:first-child):even]:opacity-40',
          }),
          p({
            class:
              'w-2/5 h-3 bg-danaheratomicgrey-200 rounded [&:not(:first-child):odd]:opacity-20',
          }),
          p({
            class:
              'w-4/5 h-5 bg-danaheratomicgrey-200 rounded [&:not(:first-child):even]:opacity-40',
          }),
        ),
        div(
          { class: 'grid grid-cols-3 gap-4' },
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-2' }),
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-1' }),
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-1' }),
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-2' }),
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-1' }),
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-1' }),
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-1' }),
        ),
      ),
      div(
        { class: 'flex flex-col gap-y-2 animate-pulse' },
        div({ class: 'h-72 rounded bg-danaheratomicgrey-200 opacity-500' }),
        div({
          class:
            'w-2/4 h-7 bg-danaheratomicgrey-200 rounded [&:not(:first-child)]:opacity-40',
        }),
        div(
          { class: 'space-y-1' },
          p({
            class:
              'w-3/4 h-4 bg-danaheratomicgrey-200 rounded [&:not(:first-child):even]:opacity-40',
          }),
          p({
            class:
              'w-2/5 h-3 bg-danaheratomicgrey-200 rounded [&:not(:first-child):odd]:opacity-20',
          }),
          p({
            class:
              'w-4/5 h-5 bg-danaheratomicgrey-200 rounded [&:not(:first-child):even]:opacity-40',
          }),
        ),
        div(
          { class: 'grid grid-cols-3 gap-4' },
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-2' }),
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-1' }),
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-2' }),
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-1' }),
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-1' }),
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-1' }),
        ),
      ),
    ),
  ),
);

/**
 * Function to get hash params
 */
const hashParams = () => {
  const hash = window.location.hash.substr(1);
  const params = {};
  hash.split('&').forEach((param) => {
    const [key, value] = param.split('=');
    params[decodeURIComponent(key)] = decodeURIComponent(value);
  });
  return params;
};

/**
 * Function to get array from url hash params
 */
function getArrayFromHashParam(param) {
  if (!param) return [];
  if (param.includes(',')) return param.split(',');
  return [param];
}

/**
 * Function to check if object is empty
 */
function isEmptyObject(obj) {
  return obj && Object.keys(obj)?.at(0) === '';
}

/**
 * Function to toggle facet on button click
 */
function facetButtonClick(e) {
  e.preventDefault();
  const facetButton = e.target.closest('button');
  const isExpanded = facetButton.getAttribute('aria-expanded') === 'true';
  facetButton.setAttribute('aria-expanded', !isExpanded);
  const parentElement = facetButton.closest('div.facet');
  const contents = parentElement.querySelector('.facet-contents');
  const searchWrapper = parentElement.querySelector('.search-wrapper');
  const icon = facetButton.querySelector('.icon');

  icon.classList.toggle('icon-plus-gray', isExpanded);
  icon.classList.toggle('icon-minus-gray', !isExpanded);
  contents.classList.toggle('hidden', isExpanded);
  searchWrapper?.classList.toggle('hidden', isExpanded);
  decorateIcons(parentElement);
}

/**
 * Function to render a facet item (for opco)
 */
const facetItem = (filter, valueObj) => {
  const isSelected = opco.has(valueObj.value);
  return div(
    { class: 'inline-flex justify-start' },
    button(
      {
        class: 'text-left flex flex-row gap-2',
        'aria-pressed': isSelected,
        'data-type': filter.facetId,
        part: valueObj.value,
        onclick: filterButtonClick,
      },
      div(
        { class: 'pr-2' },
        span({
          class: `checkbox-icon icon ${
            isSelected ? 'icon-check-purple-square' : 'icon-square'
          } w-4 min-w-4 min-h-4 pt-1`,
        }),
      ),
    ),
    div(
      { class: 'flex items-center gap-2' },
      div(
        { class: 'justify-start text-black text-sm font-medium leading-5' },
        `${valueObj.value} (${valueObj.numberOfResults})`,
      ),
    ),
  );
};

/**
 * Function to iterate through hierarchical facet children (for workflowname)
 */
function iterateChildren(filter, node, searchQuery = '') {
  const path = node.path?.join(',') || node.value;
  const isSelected = workflowName.has(node.value);
  const nodeValueLower = node.value.toLowerCase();
  const searchQueryLower = searchQuery.toLowerCase();

  // Skip rendering if the node doesn't match the search query and has no matching children
  let hasMatchingChild = false;
  if (node.children && node.children.length > 0) {
    hasMatchingChild = node.children.some((child) => {
      const childValueLower = child.value.toLowerCase();
      return (
        childValueLower.includes(searchQueryLower)
        || iterateChildren(filter, child, searchQuery)
      );
    });
  }

  if (
    searchQuery
    && !nodeValueLower.includes(searchQueryLower)
    && !hasMatchingChild
  ) {
    return null;
  }

  const liEl = div(
    { class: 'inline-flex flex-col justify-start items-start gap-2' },
    div(
      { class: 'inline-flex justify-start' },
      button(
        {
          class: `${filter.facetId} text-left flex flex-row gap-2`,
          'aria-pressed': isSelected,
          'data-type': filter.facetId,
          'data-path': path,
          part: node.value,
          onclick: filterButtonClick,
        },
        div(
          { class: 'pr-2' },
          span({
            class: `checkbox-icon icon ${
              isSelected ? 'icon-check-purple-square' : 'icon-square'
            } w-4 min-w-4 min-h-4 pt-1`,
          }),
        ),
      ),
      div(
        { class: 'flex items-center gap-2' },
        div(
          { class: 'flex items-center gap-2' },
          div(
            { class: 'justify-start text-black text-sm font-medium leading-5' },
            `${node.value} (${node.numberOfResults})`,
          ),
        ),
      ),
    ),
  );

  if (node.children && node.children.length > 0) {
    const ulSubParent = div({
      class: 'ml-4 flex flex-col justify-start items-start gap-2',
    });
    node.children.forEach((child) => {
      const childEl = iterateChildren(filter, child, searchQuery);
      if (childEl) {
        ulSubParent.appendChild(childEl);
      }
    });
    if (ulSubParent.children.length > 0) {
      liEl.appendChild(ulSubParent);
    }
  }

  const isActive = lastQuery() === node.value;
  if (isActive) {
    liEl.classList.add('font-bold');
  }

  return liEl;
}

/**
 * Function to render a facet
 */
const renderFacet = (filter, isFirst = false) => {
  // Skip rendering the facet if it has no values for 'opco' or 'workflowname'
  if ((filter.facetId === 'opco' || filter.facetId === 'workflowname') && (!filter.values || filter.values.length === 0)) {
    return null;
  }

  const facetDiv = div({
    class:
      'facet py-3 self-stretch bg-white border-t border-gray-300 flex flex-col justify-start items-start gap-y-3',
  });

  // Facet header
  const header = button(
    {
      class:
        'facet-header-btn self-stretch pr-3 pt-2 pb-2.5 inline-flex justify-between items-start gap-2',
      'aria-expanded': isFirst ? 'true' : 'false',
      onclick: facetButtonClick,
    },
    div(
      {
        class:
          'flex-1 flex items-start text-left text-black text-base font-bold leading-snug',
      },
      filter.label || (filter.facetId === 'opco' ? 'Brand' : 'Process Step'),
    ),
    div(
      { class: 'w-4 h-4 relative mb-2' },
      span({
        class: `icon ${
          isFirst ? 'icon-minus-gray' : 'icon-plus-gray'
        } p-1 ml-1`,
      }),
    ),
  );
  // Facet contents
  const contents = fieldset({
    class: `facet-contents flex flex-col justify-start items-start gap-4 ${
      isFirst ? '' : 'hidden'
    }`,
  });

  // Add search bar for workflowname and opco
  let itemsContainer = null;
  let originalItems = null;
  // Check if workflowname or opco has more than 10 values, show search for that facet only
  const needsSearch = (filter.facetId === 'workflowname' && filter.values.length > 10)
    || (filter.facetId === 'opco' && filter.values.length > 10);

  if (needsSearch) {
    const searchBar = div(
      {
        class: `search-wrapper self-stretch h-8 px-3 py-1.5 bg-gray-100 outline outline-[0.50px] outline-gray-300 inline-flex justify-start items-center gap-1.5 ${
          isFirst ? '' : 'hidden'
        }`,
      },
      div(
        { class: 'flex justify-start items-center gap-1.5' },
        span({ class: 'icon icon-search w-4 h-4 text-gray-400' }),
        input({
          class:
            'justify-start text-gray-500 text-sm font-medium leading-5 pt-1 bg-transparent outline-none flex-1',
          type: 'text',
          placeholder: 'Search',
          'aria-label': `Search for values in the ${
            filter.label || filter.facetId
          } facet`,
        }),
      ),
    );
    decorateIcons(searchBar);
    contents.append(searchBar);

    // Store original items for filtering
    originalItems = div({ class: 'hidden' });
    itemsContainer = div({
      class: 'items-container flex flex-col justify-start items-start gap-2',
    });

    if (filter.facetId === 'workflowname') {
      filter.values.forEach((valueObj) => {
        const item = iterateChildren(filter, valueObj);
        if (item) {
          originalItems.append(item.cloneNode(true));
          itemsContainer.append(item);
        }
      });
    } else if (filter.facetId === 'opco') {
      filter.values.forEach((valueObj) => {
        const item = facetItem(filter, valueObj);
        originalItems.append(item.cloneNode(true));
        itemsContainer.append(item);
      });
    }

    contents.append(originalItems, itemsContainer);

    // Add event listener for search input
    const searchInput = searchBar.querySelector('input');
    searchInput.addEventListener('input', (e) => {
      const searchQuery = e.target.value.trim().toLowerCase();
      itemsContainer.innerHTML = '';

      let hasMatches = false;
      if (filter.facetId === 'workflowname') {
        originalItems.childNodes.forEach((item) => {
          const workflowButton = item.querySelector('button.workflowname');
          if (workflowButton) {
            const labelDiv = item.querySelector('div:nth-child(2)');
            const label = labelDiv ? labelDiv.textContent.toLowerCase() : '';
            if (!searchQuery || label.includes(searchQuery)) {
              const clonedItem = item.cloneNode(true);
              const btnEle = clonedItem.querySelector('button');
              if (btnEle) btnEle.addEventListener('click', filterButtonClick);
              itemsContainer.append(clonedItem);
              hasMatches = true;
            }
          }
        });
      } else {
        originalItems.childNodes.forEach((item) => {
          const facetButton = item.querySelector('button');
          if (facetButton) {
            const labelDiv = item.querySelector('div:nth-child(2)');
            const label = labelDiv ? labelDiv.textContent.toLowerCase() : '';
            if (!searchQuery || label.includes(searchQuery)) {
              const clonedItem = item.cloneNode(true);
              clonedItem
                .querySelector('button')
                .addEventListener('click', filterButtonClick);
              itemsContainer.append(clonedItem);
              hasMatches = true;
            }
          }
        });
      }

      if (!hasMatches) {
        itemsContainer.append(
          div(
            { class: 'text-gray-500 text-sm' },
            `No ${
              filter.facetId === 'workflowname' ? 'process steps' : 'brands'
            } found`,
          ),
        );
      }
    });
  } else {
    // Render facet items for facets without search
    if (filter.facetId === 'workflowname') {
      filter.values.forEach((valueObj) => {
        const item = iterateChildren(filter, valueObj);
        if (item) contents.append(item);
      });
    }
    if (filter.facetId === 'opco') {
      filter.values.forEach((valueObj) => {
        contents.append(facetItem(filter, valueObj));
      });
    }
  }

  facetDiv.append(header, contents);
  return facetDiv;
};

let workflowName = new Set(getArrayFromHashParam(hashParams().workflowname));
let opco = new Set(getArrayFromHashParam(hashParams().opco));

/**
 * Function to get last query from workflowName
 */
const lastQuery = () => [...workflowName][workflowName.size - 1];

/**
 * Function to update facet checkbox states
 */
function updateFacetCheckboxes(isWorkflow = true, isOpco = false) {
  if (isWorkflow) {
    const workflowButtons = document.querySelectorAll('button.workflowname');
    workflowButtons.forEach((workBtn) => {
      const value = workBtn.getAttribute('part');
      const isSelected = workflowName.has(value);
      workBtn.setAttribute('aria-pressed', isSelected.toString());
      const icon = workBtn.querySelector('.checkbox-icon');
      if (icon) {
        icon.classList.toggle('icon-check-purple-square', isSelected);
        icon.classList.toggle('icon-square', !isSelected);
        decorateIcons(workBtn);
      }
    });
  }

  if (isOpco) {
    const opcoButtons = document.querySelectorAll('button[data-type="opco"]');
    opcoButtons.forEach((workBtn) => {
      const value = workBtn.getAttribute('part');
      const isSelected = opco.has(value);
      workBtn.setAttribute('aria-pressed', isSelected.toString());
      const icon = workBtn.querySelector('.checkbox-icon');
      if (icon) {
        icon.classList.toggle('icon-check-purple-square', isSelected);
        icon.classList.toggle('icon-square', !isSelected);
        decorateIcons(workBtn);
      }
    });
  }
}

/**
 * Function to clear all filters
 */
function clearFilter(e, isWorkflow = true, isOpco = false) {
  e.preventDefault();
  if (isWorkflow) workflowName.clear();
  if (isOpco) opco.clear();
  const params = getFilterParams();
  const queryString = Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&');
  window.history.replaceState({}, '', queryString ? `#${queryString}` : '#');
  currentPage = 1;
  // Update facet checkboxes after clearing filters
  updateFacetCheckboxes(isWorkflow, isOpco);
  updateProductDisplay();
}

/**
 * Function to remove a specific workflow step
 */
function removeWorkflowStep(step) {
  workflowName.delete(step);
  const params = getFilterParams();
  const queryString = Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&');
  window.history.replaceState({}, '', queryString ? `#${queryString}` : '#');
  currentPage = 1;
  // Update facet checkboxes after removing a workflow step
  updateFacetCheckboxes(true, false);
  updateProductDisplay();
}

/**
 * Function to remove a specific opco
 */
function removeOpcoStep(step) {
  opco.delete(step);
  const params = getFilterParams();
  const queryString = Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&');
  window.history.replaceState({}, '', queryString ? `#${queryString}` : '#');
  currentPage = 1;
  // Update facet checkboxes after removing an opco step
  updateFacetCheckboxes(false, true);
  updateProductDisplay();
}

/**
 * Function to add breadcrumb filter for workflowName
 */
const breadcrumbWFFilter = (filter) => {
  const parent = filter.querySelector('.breadcrumb-list');
  if (workflowName.size > 0) {
    [...workflowName].forEach((step) => {
      const breadcrumbElement = div(
        {
          class:
            'breadcrumb px-2 py-1 rounded-md flex justify-center items-center gap-1.5 cursor-pointer bg-[#EADEFF]',
          part: 'breadcrumb-button',
          onclick: () => removeWorkflowStep(step),
          title: `Process Step: ${step}`,
          'aria-label': `Remove inclusion filter on Process Step: ${step}`,
        },
        div(
          {
            class:
              'justify-start text-danaherpurple-500 text-sm font-medium leading-5 overflow-wrap break-word',
          },
          `Process Step: ${step}`,
        ),
        div(
          { class: 'relative overflow-hidden flex-shrink-0' },
          span({
            class:
              'icon icon-cross w-3 h-3 danaherpurple-500 [&_svg>use]:stroke-danaherpurple-500',
          }),
        ),
      );
      decorateIcons(breadcrumbElement);
      parent.appendChild(breadcrumbElement);
    });
  }
};

/**
 * Function to add breadcrumb filter for opco
 */
const breadcrumbOpcoFilter = (filter) => {
  const parent = filter.querySelector('.breadcrumb-list');
  if (opco.size > 0) {
    [...opco].forEach((step) => {
      const breadcrumbElement = div(
        {
          class:
            'breadcrumb px-2 py-1 rounded-md flex justify-center items-center gap-1.5 cursor-pointer bg-[#EADEFF]',
          part: 'breadcrumb-button',
          onclick: () => removeOpcoStep(step),
          title: `Brand: ${step}`,
          'aria-label': `Remove inclusion filter on Brand: ${step}`,
        },
        div(
          {
            class:
              'justify-start text-danaherpurple-500 hover:text-danaherpurple-800 text-sm font-medium leading-tight overflow-wrap break-word',
          },
          `Brand: ${step}`,
        ),
        div(
          { class: 'relative overflow-hidden flex-shrink-0' },
          span({
            class:
              'icon icon-cross w-3 h-3 danaherpurple-500 hover:[&_svg>use]:stroke-danaherpurple-800 [&_svg>use]:stroke-danaherpurple-500',
          }),
        ),
      );
      decorateIcons(breadcrumbElement);
      parent.appendChild(breadcrumbElement);
    });
  }
};

/**
 * Function to get filter params from current state
 */
function getFilterParams() {
  const params = {};
  if (workflowName.size > 0) params.workflowname = [...workflowName].join(',');
  if (opco.size > 0) params.opco = [...opco].join(',');
  return params;
}

/**
 * Function to clear values after current value
 */
function clearValuesAfterCurrent(set, currentValue) {
  const iterator = set.values();
  let next = iterator.next();
  while (!next.done) {
    if (next.value === currentValue) {
      while (!next.done) {
        set.delete(next.value);
        next = iterator.next();
      }
      break;
    }
    next = iterator.next();
  }
}

/**
 * Function to update opco
 */
const updateOpco = (value, ariaPressed) => {
  if (!ariaPressed) opco.add(value);
  else opco.delete(value);
};

/**
 * Function to update workflow name
 */
const updateWorkflowName = (value, ariaPressed) => {
  if (value === 'automated-cell-imaging-systems') {
    workflowName.clear();
    workflowName.add(value);
  } else if (!ariaPressed) {
    clearValuesAfterCurrent(workflowName, value);
    workflowName.add(value);
  } else if (ariaPressed) {
    workflowName.delete(value);
  } else {
    workflowName.clear();
  }
};

/**
 * Function to handle filter button click
 */
function filterButtonClick(e) {
  e.preventDefault();
  const buttonEl = e.target.closest('button');
  if (!buttonEl) return;

  const icon = buttonEl.querySelector('.checkbox-icon');
  icon?.classList.toggle('icon-square');
  icon?.classList.toggle('icon-check-purple-square');
  decorateIcons(buttonEl);

  const filterValue = buttonEl.getAttribute('part');
  const isWorkflowName = buttonEl.dataset.type === 'workflowname';
  const ariaPressed = buttonEl.getAttribute('aria-pressed') === 'true';

  if (filterValue === 'automated-cell-imaging-systems') {
    workflowName = new Set(['automated-cell-imaging-systems']);
    buttonEl.setAttribute('aria-pressed', 'true');
    window.history.replaceState(
      {},
      '',
      '#workflowname=automated-cell-imaging-systems',
    );
    currentPage = 1;
    updateProductDisplay();
    return;
  }

  if (isWorkflowName) {
    updateWorkflowName(filterValue, ariaPressed);
  } else {
    updateOpco(filterValue, ariaPressed);
  }

  buttonEl.setAttribute('aria-pressed', ariaPressed ? 'false' : 'true');

  const params = getFilterParams();
  const queryString = Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&');

  window.history.replaceState({}, '', queryString ? `#${queryString}` : '#');
  currentPage = 1;
  updateProductDisplay();
}

// Constants for pagination
const GRID_ITEMS_PER_PAGE = 21;
const LIST_ITEMS_PER_PAGE = 7;
let currentPage = 1;
let isGridView = true;

let productContainer;
let productCount;
let paginationContainerWrapper;
let listBtn;
let gridBtn;
let breadcrumbContainer;

/**
 * Function to scroll to the top of the first card or product container
 */
function scrollToFirstCard() {
  setTimeout(() => {
    const productsWrapper = productContainer.querySelector('.products-wrapper');
    const firstCard = productsWrapper
      ? productsWrapper.querySelector(':first-child')
      : null;
    if (firstCard) {
      firstCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      firstCard.classList.add('scroll-mt-32');
    } else {
      // Fallback: scroll productContainer to top
      productContainer.classList.add('scroll-mt-32');
      productContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 100);
}

/**
 * Function to render pagination
 */
function renderPagination(totalProducts, paginationWrapper) {
  paginationWrapper.innerHTML = '';
  const itemsPerPage = isGridView ? GRID_ITEMS_PER_PAGE : LIST_ITEMS_PER_PAGE;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  if (totalPages <= 1) {
    paginationWrapper.style.display = 'none';
    return;
  }

  paginationWrapper.style.display = 'flex';

  const localPaginationContainer = div({
    class: 'self-stretch h-9 relative w-full',
  });
  const grayLine = div({
    class: 'w-full h-px absolute left-0 top-0 bg-gray-200 z-0',
  });
  const contentWrapper = div({
    class:
      'w-full left-0 top-0 absolute flex justify-between items-center px-4',
  });

  // Previous Button
  const prevEnabled = currentPage > 1;
  const prevButton = div({
    'data-direction': 'Previous',
    'data-state': prevEnabled ? 'Default' : 'Disabled',
    class: 'inline-flex flex-col justify-start items-start',
  });
  prevButton.append(
    div({ class: 'self-stretch h-0.5 bg-transparent' }),
    div(
      {
        class: `self-stretch pr-1 pt-4 inline-flex justify-start items-center gap-3 cursor-${
          prevEnabled ? 'pointer' : 'not-allowed'
        } z-10`,
      },
      div(
        { class: 'w-5 h-5 relative overflow-hidden' },
        span({
          class: `icon icon-arrow-left w-5 h-5 absolute fill-current ${
            prevEnabled ? 'text-danaherpurple-500' : 'text-gray-400'
          } [&_svg>use]:stroke-current`,
        }),
      ),
      div(
        {
          class: `justify-start text-${
            prevEnabled ? 'danaherpurple-500' : 'gray-400'
          } text-sm font-medium leading-5`,
        },
        'Previous',
      ),
    ),
  );
  decorateIcons(prevButton);
  prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage -= 1;
      const newUrl = new URL(window.location);
      newUrl.searchParams.set('page', currentPage);
      window.history.replaceState({}, '', newUrl.toString());
      updateProductDisplay();
      scrollToFirstCard();
    }
  });

  // Page Numbers
  const pageNumbersContainer = div({
    class: 'flex justify-center items-start gap-2 z-10 hidden md:flex',
  });
  let startPage = 1;
  let endPage = totalPages;

  if (totalPages >= 5) {
    if (currentPage <= 3) {
      startPage = 1;
      endPage = currentPage + 2;
    } else if (currentPage >= totalPages - 2) {
      startPage = currentPage - 2;
      endPage = totalPages;
    } else {
      startPage = currentPage - 2;
      endPage = currentPage + 2;
    }
  }

  // Helper function to create page number buttons
  const createPageNumber = (page) => {
    const pageNumber = div({
      'data-current': currentPage === page ? 'True' : 'False',
      'data-state': 'Default',
      class: 'inline-flex flex-col justify-start items-start',
    });
    pageNumber.append(
      div({
        class: `self-stretch h-0.5 ${
          currentPage === page ? 'bg-danaherpurple-500' : 'bg-transparent'
        }`,
      }),
      div(
        {
          class:
            'self-stretch px-4 pt-4 inline-flex justify-center items-start cursor-pointer',
        },
        div(
          {
            class: `text-center justify-start text-${
              currentPage === page ? 'danaherpurple-500' : 'gray-700'
            } text-sm font-medium leading-tight`,
          },
          page.toString(),
        ),
      ),
    );
    pageNumber.addEventListener('click', () => {
      currentPage = page;
      // Update hash with page param using URL API
      const newUrl = new URL(window.location);
      newUrl.searchParams.set('page', page);
      window.history.replaceState({}, '', newUrl.toString());
      updateProductDisplay();
      scrollToFirstCard();
    });
    return pageNumber;
  };

  if (startPage > 1) {
    pageNumbersContainer.append(createPageNumber(1));
    if (startPage > 2) {
      pageNumbersContainer.append(
        div(
          {
            class: 'inline-flex flex-col justify-start items-start',
          },
          div({ class: 'self-stretch h-0.5 bg-transparent' }),
          div(
            {
              class:
                'self-stretch px-4 pt-4 inline-flex justify-center items-start',
            },
            div(
              {
                class:
                  'text-center justify-start text-gray-700 text-sm font-medium leading-tight',
              },
              '...',
            ),
          ),
        ),
      );
    }
  }

  for (let i = startPage; i <= endPage; i += 1) {
    pageNumbersContainer.append(createPageNumber(i));
  }

  if (endPage < totalPages - 1) {
    pageNumbersContainer.append(
      div(
        {
          class: 'inline-flex flex-col justify-start items-start',
        },
        div({ class: 'self-stretch h-0.5 bg-transparent' }),
        div(
          {
            class:
              'self-stretch px-4 pt-4 inline-flex justify-center items-start',
          },
          div(
            {
              class:
                'text-center justify-start text-gray-700 text-sm font-medium leading-tight',
            },
            '...',
          ),
        ),
      ),
    );
  }

  if (endPage < totalPages) {
    pageNumbersContainer.append(createPageNumber(totalPages));
  }

  // Next Button
  const nextEnabled = currentPage < totalPages;
  const nextButton = div({
    'data-direction': 'Next',
    'data-state': nextEnabled ? 'Default' : 'Disabled',
    class: 'inline-flex flex-col justify-start items-start',
  });
  nextButton.append(
    div({ class: 'self-stretch h-0.5 bg-transparent' }),
    div(
      {
        class: `self-stretch pl-1 pt-4 inline-flex justify-start items-center gap-3 cursor-${
          nextEnabled ? 'pointer' : 'not-allowed'
        } z-10`,
      },
      div(
        {
          class: `justify-start text-${
            nextEnabled ? 'danaherpurple-500' : 'gray-400'
          } text-sm font-medium leading-5`,
        },
        'Next',
      ),
      div(
        { class: 'w-5 h-5 relative overflow-hidden' },
        span({
          class: `icon icon-arrow-right w-5 h-5 absolute fill-current ${
            nextEnabled ? 'text-danaherpurple-500' : 'text-gray-400'
          } [&_svg>use]:stroke-current`,
        }),
      ),
    ),
  );
  decorateIcons(nextButton);
  nextButton.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage += 1;
      const newUrl = new URL(window.location);
      newUrl.searchParams.set('page', currentPage);
      window.history.replaceState({}, '', newUrl.toString());
      updateProductDisplay();
      scrollToFirstCard();
    }
  });

  contentWrapper.append(prevButton, pageNumbersContainer, nextButton);
  localPaginationContainer.append(grayLine, contentWrapper);
  paginationWrapper.append(localPaginationContainer);
}

/**
 * Function to update product display
 */
async function updateProductDisplay() {
  productContainer.innerHTML = '';
  productContainer.append(productSkeleton.cloneNode(true));

  const params = getFilterParams();
  let response;
  try {
    response = await getProductsForCategories(params, isGridView, currentPage);
  } catch (err) {
    console.error('Error fetching products:', err);
    response = { results: [], facets: [], totalCount: 0 };
  }

  try {
    const skeleton = productContainer.querySelector('.coveo-skeleton');
    if (skeleton) {
      productContainer.removeChild(skeleton);
    }
  } catch (error) {
    console.error('Error removing skeleton:', error);
  }

  if (response.totalCount > 0) {
    buildItemListSchema(response.results, 'product-family');
  }

  const products = response.results || [];

  productCount.textContent = `${response.totalCount} Products Available`;

  if (workflowName.size > 0 || opco.size > 0) {
    const breadcrumbList = breadcrumbContainer.querySelector('.breadcrumb-list');
    const clearButtonContainer = breadcrumbContainer.querySelector(
      '.clear-button-container',
    );
    breadcrumbList.innerHTML = '';
    clearButtonContainer.innerHTML = '';

    // Add selected filters to breadcrumb-list
    breadcrumbWFFilter(breadcrumbContainer);
    breadcrumbOpcoFilter(breadcrumbContainer);

    // Add Clear button to clear-button-container
    // In the updateProductDisplay function, update the clearButtonWrapper:
    const clearButtonWrapper = button(
      {
        class: 'px-3 py-1 flex justify-start items-center gap-2',
        onclick: (e) => clearFilter(e, true, true),
      },
      div(
        { class: 'flex items-center gap-2' },
        div(
          { class: 'w-3.5 h-3.5 mt-[-10px]' },
          span({
            class:
              'icon icon-step-close [&_svg>use]:stroke-gray-200 w-[14px] h-[14px]',
          }),
        ),
        div(
          {
            class:
              'h-4 justify-start text-black text-sm font-medium leading-5 overflow-wrap break-word',
          },
          'Clear Results',
        ),
      ),
    );
    decorateIcons(clearButtonWrapper);
    clearButtonContainer.appendChild(clearButtonWrapper);

    breadcrumbContainer.style.display = 'block'; // Ensure it's visible
  } else {
    breadcrumbContainer.style.display = 'none'; // Hide when no filters are selected
  }

  if (!products || products.length === 0) {
    let errorMessage = 'No products match the selected filters. Please try different filters.';
    if (params.workflowname) {
      errorMessage = `No products found for ${params.workflowname}. Please try a different filter.`;
    }
    const noProductsMessage = div(
      { class: 'w-full text-center py-8 text-gray-600 text-lg' },
      errorMessage,
    );
    productContainer.append(noProductsMessage);
    paginationContainerWrapper.style.display = 'none';
    return;
  }

  const productsWrapper = isGridView
    ? div({
      class:
          'products-wrapper w-full flex flex-wrap gap-5 justify-center lg:justify-start',
    })
    : div({ class: 'products-wrapper w-full flex flex-col gap-4' });

  products.forEach((item) => {
    productsWrapper.append(
      isGridView ? renderProductGridCard(item) : renderProductListCard(item),
    );
  });

  productContainer.append(productsWrapper);
  renderPagination(response.totalCount, paginationContainerWrapper);
}

/**
 * Function to decorate product list
 */
export async function decorateProductList(block, blockId) {
  block.innerHTML = '';
  block.append(productSkeleton);

  // Add smooth scroll behavior to the html tag
  document.documentElement.style.scrollBehavior = 'smooth';

  const params = isEmptyObject(hashParams()) ? {} : hashParams();
  let response;
  try {
    response = await getProductsForCategories(params, isGridView, currentPage);
  } catch (err) {
    console.error('Error fetching products:', err);
    response = { results: [], facets: [], totalCount: 0 };
  }

  block.removeChild(productSkeleton);
  block.classList.add(
    ...'dhls-container flex flex-col lg:flex-row w-full mx-auto pt-10'.split(
      ' ',
    ),
  );

  const facetDiv = div({ id: blockId, class: 'max-w-sm mx-auto scroll-mt-32' });
  const contentWrapper = div({
    class: 'max-w-5xl w-full mx-auto flex-1 flex flex-col gap-4',
  });

  const filterWrapper = div({
    class:
      'w-72 p-5 inline-flex flex-col justify-start items-start gap-3 min-h-fit',
  });

  const header = div(
    { class: 'self-stretch inline-flex justify-start items-center gap-4' },
    div(
      { class: 'w-12 h-12 relative bg-danaherpurple-50 rounded-3xl' },
      div(
        { class: 'w-6 h-6 left-[12px] top-[12px] absolute overflow-hidden' },
        span({
          class:
            'icon icon-adjustments w-6 h-6 absolute [&_svg>use]:stroke-danaherpurple-500',
        }),
      ),
    ),
    div(
      { class: 'flex-1 h-6 relative' },
      div(
        { class: 'w-64 h-6 left-0 top-0 absolute' },
        div(
          {
            class:
              'w-64 left-0 top-[-6px] absolute justify-start text-black !text-3xl font-medium !leading-10',
          },
          'Filters',
        ),
      ),
    ),
  );

  // Initialize breadcrumbContainer with adjusted styling
  breadcrumbContainer = div(
    {
      class:
        'self-stretch p-3 bg-gray-50 inline-flex justify-start items-center gap-4 flex-wrap content-center w-[251px]',
    },
    div({
      class:
        'breadcrumb-list flex-1 flex justify-start items-center gap-3 flex-wrap content-center',
    }),
    div({ class: 'clear-button-container mt-4' }),
  );

  const expandAll = div(
    {
      class:
        'self-stretch h-5 p-3 inline-flex justify-end items-center gap-2.5',
      onclick: () => {
        const facetButtons = filterWrapper.querySelectorAll('.facet-header-btn');
        const isAllExpanded = Array.from(facetButtons).every(
          (btn) => btn.getAttribute('aria-expanded') === 'true',
        );

        facetButtons.forEach((btn) => {
          const shouldExpand = !isAllExpanded;
          btn.setAttribute('aria-expanded', shouldExpand.toString());
          const parent = btn.closest('div.facet');
          const contents = parent.querySelector('.facet-contents');
          const searchWrapper = parent.querySelector('.search-wrapper');
          const icon = btn.querySelector('.icon');
          icon.classList.toggle('icon-plus-gray', !shouldExpand);
          icon.classList.toggle('icon-minus-gray', shouldExpand);
          contents.classList.toggle('hidden', !shouldExpand);
          searchWrapper?.classList.toggle('hidden', !shouldExpand);
          decorateIcons(parent);
        });

        const toggleButton = expandAll.querySelector('button');
        const chevron = expandAll.querySelector('.icon-chevron-down');
        if (isAllExpanded) {
          toggleButton.childNodes[0].textContent = 'Expand All';
          chevron.classList.remove('transform', 'rotate-180');
        } else {
          toggleButton.childNodes[0].textContent = 'Collapse All';
          chevron.classList.add('transform', 'rotate-180');
        }
      },
    },
    button(
      {
        class:
          'text-right flex items-center gap-1 text-danaherpurple-500 hover:text-danaherpurple-800 text-base font-bold leading-snug group',
      },
      'Expand All',
      div(
        { class: 'relative mb-1 flex items-center' },
        span({
          class:
            'icon icon-chevron-down [&_svg>use]:stroke-danaherpurple-500 group-hover:[&_svg>use]:stroke-danaherpurple-800 ml-1',
        }),
      ),
    ),
  );

  decorateIcons(expandAll);
  decorateIcons(header);

  const facetContainer = div({
    class: 'self-stretch flex flex-col justify-start items-start w-[251px]',
  });
  const facets = response.facets || [];
  facets.forEach((filter, index) => {
    const facetElement = renderFacet(filter, index === 0);
    if (facetElement) {
      facetContainer.append(facetElement);
    }
  });

  filterWrapper.append(header, breadcrumbContainer, expandAll, facetContainer);
  decorateIcons(filterWrapper);
  facetDiv.append(filterWrapper);

  const headerWrapper = div({
    class:
      'w-full flex justify-between items-center mb-4 flex-wrap gap-2 min-w-0',
  });
  productCount = div(
    { class: 'text-black text-2xl font-medium' },
    `${response.totalCount} Products Available`,
  );
  const viewToggleWrapper = div({ class: 'flex items-center gap-2 min-w-fit' });
  const viewModeGroup = div({ class: 'flex justify-start items-center gap-0' });

  listBtn = div(
    {
      class: [
        'px-3 py-2 bg-white',
        'rounded-tl-[20px] rounded-bl-[20px]',
        'outline outline-1 outline-offset-[-1px] outline-danaherpurple-500',
        'flex justify-center items-center',
        'overflow-visible cursor-pointer z-10',
      ].join(' '),
    },
    div(
      { class: 'w-5 h-5 flex justify-center items-center' },
      span({
        class:
          'icon icon-view-list w-6 h-6 fill-current text-gray-600 [&_svg>use]:stroke-gray-600',
      }),
    ),
  );

  gridBtn = div(
    {
      class: [
        'px-3 py-2 bg-danaherpurple-500',
        'rounded-tr-[20px] rounded-br-[20px]',
        'outline outline-1 outline-offset-[-1px] outline-danaherpurple-500',
        'flex justify-center items-center',
        'overflow-visible cursor-pointer z-10',
      ].join(' '),
    },
    div(
      { class: 'w-5 h-5 flex justify-center items-center' },
      span({
        class:
          'icon icon-view-grid w-6 h-6 fill-current text-white [&_svg>use]:stroke-white',
      }),
    ),
  );

  viewModeGroup.append(listBtn, gridBtn);
  decorateIcons(viewModeGroup);
  viewToggleWrapper.append(viewModeGroup);
  headerWrapper.append(productCount, viewToggleWrapper);
  contentWrapper.append(headerWrapper);

  productContainer = div({ class: 'w-full' });
  contentWrapper.append(productContainer);

  paginationContainerWrapper = div({
    class:
      'pagination-container flex justify-center items-center gap-2 mt-8 w-full',
  });
  contentWrapper.append(paginationContainerWrapper);

  listBtn.addEventListener('click', () => {
    if (isGridView) {
      isGridView = false;
      currentPage = 1;
      listBtn.classList.replace('bg-white', 'bg-danaherpurple-500');
      listBtn
        .querySelector('.icon')
        .classList.replace('text-gray-600', 'text-white');
      listBtn
        .querySelector('.icon')
        .classList.replace(
          '[&_svg>use]:stroke-gray-600',
          '[&_svg>use]:stroke-white',
        );
      gridBtn.classList.replace('bg-danaherpurple-500', 'bg-white');
      gridBtn
        .querySelector('.icon')
        .classList.replace('text-white', 'text-gray-600');
      gridBtn
        .querySelector('.icon')
        .classList.replace(
          '[&_svg>use]:stroke-white',
          '[&_svg>use]:stroke-gray-600',
        );
      updateProductDisplay();
    }
  });

  gridBtn.addEventListener('click', () => {
    if (!isGridView) {
      isGridView = true;
      currentPage = 1;
      gridBtn.classList.replace('bg-white', 'bg-danaherpurple-500');
      gridBtn
        .querySelector('.icon')
        .classList.replace('text-gray-600', 'text-white');
      gridBtn
        .querySelector('.icon')
        .classList.replace(
          '[&_svg>use]:stroke-gray-600',
          '[&_svg>use]:stroke-white',
        );
      listBtn.classList.replace('bg-danaherpurple-500', 'bg-white');
      listBtn
        .querySelector('.icon')
        .classList.replace('text-white', 'text-gray-600');
      listBtn
        .querySelector('.icon')
        .classList.replace(
          '[&_svg>use]:stroke-white',
          '[&_svg>use]:stroke-gray-600',
        );
      updateProductDisplay();
    }
  });
  if (response?.facets?.length > 0 && response?.facets?.length > 0) {
    block.append(facetDiv, contentWrapper);
    updateProductDisplay();
  } else {
    block.classList.remove(
      ...'dhls-container flex flex-col lg:flex-row w-full mx-auto gap-6 pt-10'.split(
        ' ',
      ),
    );
  }
}

export default async function decorate(block) {
  const blockId = block?.querySelector('p')?.textContent || '';
  decorateProductList(block, blockId);
}
