/* eslint-disable import/no-unresolved */
/* eslint-disable no-use-before-define */
import {
  getProductsForCategories,
} from '../../scripts/commerce.js';
import {
  div, span, button, fieldset, ul, li, input, a, img, p,
} from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

const productSkeleton = div(
  { class: 'coveo-skeleton flex flex-col w-full lg:flex-row grid-rows-1 lg:grid-cols-5 gap-x-10 gap-y-4' },
  div(
    { class: 'col-span-1 border shadow rounded-lg w-full p-4 max-w-sm w-full' },
    div(
      { class: 'flex flex-col gap-y-4 animate-pulse' },
      div({ class: 'w-2/4 h-7 bg-danaheratomicgrey-200 rounded [&:not(:first-child)]:opacity-40' }),
      div({ class: 'w-3/4 h-4 bg-danaheratomicgrey-200 rounded [&:not(:first-child):even]:opacity-40' }),
      div({ class: 'w-2/5 h-3 bg-danaheratomicgrey-200 rounded [&:not(:first-child):odd]:opacity-20' }),
      div({ class: 'w-4/5 h-5 bg-danaheratomicgrey-200 rounded [&:not(:first-child):even]:opacity-40' }),
    ),
  ),
  div(
    { class: 'col-span-4 w-full' },
    div({ class: 'max-w-xs bg-neutral-300 rounded-md p-4 animate-pulse mb-4' }),
    div(
      { class: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5' },
      div(
        { class: 'flex flex-col gap-y-2 animate-pulse' },
        div({ class: 'h-72 rounded bg-danaheratomicgrey-200 opacity-500' }),
        div({ class: 'w-2/4 h-7 bg-danaheratomicgrey-200 rounded [&:not(:first-child)]:opacity-40' }),
        div(
          { class: 'space-y-1' },
          p({ class: 'w-3/4 h-4 bg-danaheratomicgrey-200 rounded [&:not(:first-child)]:opacity-40' }),
          p({ class: 'w-2/5 h-3 bg-danaheratomicgrey-200 rounded [&:not(:first-child)]:opacity-20' }),
          p({ class: 'w-4/5 h-5 bg-danaheratomicgrey-200 rounded [&:not(:first-child):even]:opacity-40' }),
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
        div({ class: 'w-2/4 h-7 bg-danaheratomicgrey-200 rounded [&:not(:first-child)]:opacity-40' }),
        div(
          { class: 'space-y-1' },
          p({ class: 'w-3/4 h-4 bg-danaheratomicgrey-200 rounded [&:not(:first-child):even]:opacity-40' }),
          p({ class: 'w-2/5 h-3 bg-danaheratomicgrey-200 rounded [&:not(:first-child):odd]:opacity-20' }),
          p({ class: 'w-4/5 h-5 bg-danaheratomicgrey-200 rounded [&:not(:first-child):even]:opacity-40' }),
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
        div({ class: 'w-2/4 h-7 bg-danaheratomicgrey-200 rounded [&:not(:first-child)]:opacity-40' }),
        div(
          { class: 'space-y-1' },
          p({ class: 'w-3/4 h-4 bg-danaheratomicgrey-200 rounded [&:not(:first-child):even]:opacity-40' }),
          p({ class: 'w-2/5 h-3 bg-danaheratomicgrey-200 rounded [&:not(:first-child):odd]:opacity-20' }),
          p({ class: 'w-4/5 h-5 bg-danaheratomicgrey-200 rounded [&:not(:first-child):even]:opacity-40' }),
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
  * @returns {Object} hash params
  * */
function getHashParams() {
  const hash = window.location.hash.substr(1);
  const params = {};

  hash.split('&').forEach((param) => {
    const [key, value] = param.split('=');
    params[decodeURIComponent(key)] = decodeURIComponent(value);
  });
  return params;
}

/**
 * Function to check if object is empty
 * @param {Object} obj
 * */
function isEmptyObject(obj) {
  return obj && Object.keys(obj)?.at(0) === '';
}

/**
 * Function to decorate icons and hide the facet on button click
 *  @param {Event} e
 * */
function facetButtonClick(e) {
  e.preventDefault();
  e.target.setAttribute('aria-expanded', e.target.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
  const parentElement = e.target.closest('div.button');
  const contents = parentElement.querySelector('.contents');
  const searchWrapper = parentElement.querySelector('.search-wrapper');
  const icon = parentElement.querySelector('.icon');

  icon.classList.toggle('icon-dash');
  icon.classList.toggle('icon-plus');
  contents.classList.toggle('hidden');
  searchWrapper?.classList.toggle('hidden');
}

function getSelectedProcessStep(filter) {
  return filter.values.filter((v) => v.state === 'selected' && filter.facetId === 'workflowname');
}

function addFilter(filter, element) {
  return li(
    { class: 'flex flex-row items-center space-x-2' },
    button(
      {
        class: `${filter.facetId} btn-text-neutral group w-full flex items-center px-2 py-2.5 text-left truncate no-outline space-x-2`,
        'aria-pressed': element.state === 'selected',
        'data-type': filter.facetId,
        part: element.value,
        onclick: filterButtonClick,
      },
      span({ part: 'value-label', class: 'value-label truncate peer-hover:text-error' }, element.value),
      span({ part: 'value-count', class: 'value-count' }, `( ${element.numberOfResults} )`),
    ),
  );
}

function iterateChildren(filter, element) {
  const childFilters = addFilter(filter, element[0]);
  if (element[0].children && element[0].children.length > 0) {
    element[0].children.forEach((child) => iterateChildren(child));
  }

  return ul({ part: 'values', class: 'mt-3' }, childFilters);
}

/**
  * Function to add all values in the facet
 * @param {*} filter
 * @param {*} processStepList
 * update {HTMLElement} processStepList
 */
function addFacetFilters(filter, fecetList) {
  let facet = [];
  const fieldUL = ul({ part: 'values', class: 'mt-3' });
  const selectedFilter = getSelectedProcessStep(filter);

  if (selectedFilter.length === 1) {
    facet = addFilter(filter, selectedFilter[0]);
    fieldUL.append(facet);
    facet.append(iterateChildren(filter, selectedFilter[0].children));
  } else {
    filter.values.forEach((element) => {
      facet = addFilter(filter, element);
      fieldUL.append(facet);
      const opco = fieldUL.querySelector('.opco');
      if (element.state === 'idle') opco?.insertBefore(span({ class: 'icon icon-square pr-2' }), opco.firstChild);
      else opco?.insertBefore(span({ class: 'icon icon-check-square pr-2' }), opco.firstChild);
    });
  }

  fecetList.append(fieldUL);
}

/**
 * Function to add search block in brand facet
 * @param {HTMLElement} facetsObj
 * update {HTMLElement} facetsObj
 * */
function addSearch(facetsObj) {
  facetsObj.querySelector('.label-button').textContent = 'Process Step';
  facetsObj.querySelector('.btn-text-transparent').after(div(
    { class: 'search-wrapper px-2 mt-3', part: 'search-wrapper' },
    div(
      { class: 'relative h-10' },
      input({
        part: 'search-input',
        class: 'input-primary w-full h-full px-9 placeholder-neutral-dark text-sm group border border-neutral rounded-lg',
        type: 'text',
        placeholder: 'Search',
        'aria-label': 'Search for values in the Process Step facet',
      }),
      div(
        { class: 'search-icon pointer-events-none absolute inline-flex justify-center items-center left-0 w-9 h-full text-on-background' },
        span({ class: 'icon icon-search' }),
      ),
    ),
  ));
}

/**
 * Function to decorate Facet Heading
 * @param {HTMLElement} parentElement
 * @param {String} name
 * update {HTMLElement} facetsObj
 * */
function addFacetHeading(facetsObj, name) {
  facetsObj.append(button(
    {
      class: 'btn-text-transparent flex font-bold justify-between w-full py-1 px-2 text-lg rounded-none',
      title: 'Collapse the facet',
      'aria-expanded': 'true',
      onclick: (e) => {
        facetButtonClick(e);
        decorateIcons(facetsObj);
      },
      part: 'label-button',
    },
    div({ class: 'label-button truncate' }, name),
    span({ class: 'icon icon-dash' }),
  ));
  facetsObj.append(fieldset(
    { class: 'contents all-facet-list' },
  ));
}

/**
 * Function to decorate product list results
 * @param {Object} response
 * @param {HTMLElement} categoryDiv
 * update {HTMLElement} categoryDiv
 * */
function resultList(response, categoryDiv) {
  categoryDiv.append(
    div(
      { class: 'status flex flex-row justify-between mt-3' },
      div(
        { class: 'text-on-background space-x-2' },
        'Result  ',
        span({ class: 'font-bold' }, '1'),
        span({ class: 'text-on-background' }, 'of'),
        span({ class: 'font-bold' }, response.totalCount),
      ),
    ),
  );
  categoryDiv.append(
    div(
      { class: 'list-wrapper display-grid density-compact image-small mt-6' },
      div({ class: 'result-list grid grid-cols-1 lg:grid-cols-3 gap-6', part: 'result-list' }),
    ),
  );

  response.results.forEach((product) => {
    const productDiv = div(
      { class: 'w-full flex flex-col col-span-1 relative mx-auto justify-center transform transition duration-500 border hover:scale-105 shadow-lg rounded-lg overflow-hidden bg-white max-w-xl' },
      a(
        { href: product.clickUri, target: '_self' },
        div(
          { class: 'result-root display-grid density-compact image-small' },
          div(
            { class: 'relative w-full h-full flex flex-col border rounded-md cursor-pointer transition z-10' },
            div(
              img({
                class: 'category-image mb-2 h-48 w-full object-cover', src: `${product.raw.images[0]}?$danaher-mobile$&fmt=webp&wid=300`, alt: product.title, loading: 'lazy',
              }),
            ),
            div(
              a({ class: '!px-7 !text-lg !font-semibold !text-danahergray-900 !line-clamp-3 !break-words !h-14', href: product.clickUri, target: '_self' }, product.title),
              div({ class: 'description !px-7 mb-4 text-sm text-gray-900 break-words line-clamp-4 !h-20 py-4' }, product.raw.description),
            ),
            div(
              { class: 'inline-flex items-center w-full px-6 py-5 space-x-4 bg-gray-100' },
              span({ class: 'btn-primary-purple border-8 px-2 !rounded-full', 'aria-label': 'View Products' }, 'View Products'),
            ),
          ),
        ),
      ),
    );
    categoryDiv.querySelector('.result-list').append(productDiv);
  });

  return categoryDiv;
}

/**
 * Function to render facets
 * @param {Object} response
 * @param {HTMLElement} facetDiv
 * update {HTMLElement} facetDiv
 */
function facets(response, facetDiv) {
  const name = 'Brand';
  response.facets.forEach((filter) => {
    if (filter.values.length === 0) return;
    const facetsObj = div({ class: 'button bg-background border border-neutral rounded-lg p-4 mt-4' });
    addFacetHeading(facetsObj, name);

    if (filter.facetId === 'workflowname') {
      addSearch(facetsObj);
    }

    const fecetList = facetsObj.querySelector('.all-facet-list');
    addFacetFilters(filter, fecetList);

    facetDiv.append(facetsObj);
  });
  decorateIcons(facetDiv);
  return facetDiv;
}

/**
 * Function to decorate product list
 * @param {HTMLElement} block
 * */
export async function decorateProductList(block) {
  block.innerHTML = '';
  block.append(productSkeleton);
  const params = isEmptyObject(getHashParams()) ? {}
    : getHashParams();
  await getProductsForCategories(params).then((res) => {
    const facetDiv = div({ class: 'max-w-sm w-full mx-auto' });
    const categoryDiv = div({ class: 'max-w-5xl w-full mx-auto' });
    block.classList.add('pt-10');
    if (res.totalCount === 0) {
      block.removeChild(productSkeleton);
      return;
    }
    facets(res, facetDiv);
    resultList(res, categoryDiv);
    block.removeChild(productSkeleton);
    block.classList.add(...'flex flex-col lg:flex-row w-full mx-auto gap-6'.split(' '));
    block.append(facetDiv, categoryDiv);
  }).catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
  });
}

const hashParams = getHashParams();
function getArrayFromHashParam(param) {
  // eslint-disable-next-line no-nested-ternary
  return param ? (param.includes(',') ? param.split(',') : [param]) : [];
}

let workflowName = getArrayFromHashParam(hashParams.workflowname);
let opco = getArrayFromHashParam(hashParams.opco);

/**
 * Function to get query string
 * @param {HTMLElement} buttonEl
 * */
function getQueryString(buttonEl) {
  const queryMap = new Map();
  const isWorkflowName = buttonEl.dataset.type === 'workflowname';
  const { value } = buttonEl.part;

  if (buttonEl.getAttribute('aria-pressed') === 'true') {
    if (isWorkflowName) workflowName.push(value);
    else opco.push(value);
  } else if (isWorkflowName) workflowName = workflowName.filter((v) => v !== value);
  else opco = opco.filter((v) => v !== value);

  if (workflowName.length > 0) queryMap.set('workflowname', workflowName.join(','));
  if (opco.length > 0) queryMap.set('opco', opco.join(','));

  const queryString = Array.from(queryMap.entries())
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&');

  return queryString;
}

/**
 * Function to add hash params to searchValue on click
 * @param {Event} e
 * update hash
 * */
// eslint-disable-line no-use-before-define
function filterButtonClick(e) {
  e.preventDefault();
  const buttonEl = e.target.closest('button');
  buttonEl.setAttribute('aria-pressed', buttonEl.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
  const icon = buttonEl.querySelector('span.icon');
  icon?.classList.toggle('icon-square');
  icon?.classList.toggle('icon-check-square');
  decorateIcons(buttonEl);

  // eslint-disable-next-line no-restricted-globals
  history.replaceState({}, '', `#${getQueryString(buttonEl)}`);
  decorateProductList(document.querySelector('.category-family'));
}

export default async function decorate(block) {
  decorateProductList(block);
}
