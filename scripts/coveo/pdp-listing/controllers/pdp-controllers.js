/* eslint-disable */
import {
  buildResultList,
  buildPager,
  buildFacet,
  buildBreadcrumbManager,
  buildQuerySummary,
  buildCategoryFacet,
  buildSearchBox
} from 'https://static.cloud.coveo.com/headless/v3/headless.esm.js';

import { pdpEngine } from "../pdp-engine.js";

export const searchBoxController = buildSearchBox(pdpEngine, {
  options: {
    numberOfSuggestions: 5,
    highlightOptions: {
      notMatchDelimiters: {
        open: '<strong>',
        close: '</strong> &nbsp;',
      },
      correctionDelimiters: {
        open: '<i>',
        close: '</i> &nbsp;',
      },
    },
  },
});

export const pdpResultList = buildResultList(pdpEngine, {
  options: {
    fieldsToInclude: [
      "sku",
      "title",
      "description",
      "richdescription",
      "images",
      "opco",
      "availability",
      "minOrderQuantity",
      "packingUnit",
      "skushowdetail",
    ],
  },
});

export const facetBreadcrumb = buildBreadcrumbManager(pdpEngine)

// facets 
export const productTypeFacetController = buildCategoryFacet(pdpEngine, { 
  options: { 
    numberOfValues: 10,
    field: 'categoriesname',
    facetId: 'categoriesname',
    delimitingCharacter: '|'
  },
});

export const brandFacetController = buildFacet(pdpEngine, {
  options: { 
    numberOfValues: 10,
    field: 'opco',
    facetId: 'opco'
  },
});

//Modification filter
export const modificationFacetController = buildFacet(pdpEngine, {
  options: { 
    numberOfValues: 10,
    field: 'skumodification',
    facetId: 'skumodification'
  },
});

//Specifications filter
// export const specificationsFacetController = buildFacet(pdpEngine, {
//   options: { 
//     numberOfValues: 10,
//     field: 'specifications',
//     facetId: 'specifications'
//   },
// });

//Unit of Measure filter
export const unitOfMeasureFacetController = buildFacet(pdpEngine, {
  options: { 
    numberOfValues: 10,
    field: 'unitofmeasure',
    facetId: 'unitofmeasure'
  },
});

//Unit of Measure filter
export const skuSizeDetailsFacetController = buildFacet(pdpEngine, {
  options: { 
    numberOfValues: 10,
    field: 'skusizedetails',
    facetId: 'skusizedetails'
  },
});

// //Specifications filter
// export const specificationsjsonFacetController = buildFacet(pdpEngine, {
//   options: { 
//     numberOfValues: 10,
//     field: 'specificationsjson',
//     facetId: 'specificationsjson'
//   },
// });

export const documentTypeFacetController = buildFacet(pdpEngine, {
  options: { 
    numberOfValues: 10,
    field: 'documenttype',
    facetId: 'documenttype'
  },
});

// pagination controller
export const paginationController = buildPager(pdpEngine);

// query summary controller
export const querySummary = buildQuerySummary(pdpEngine);
