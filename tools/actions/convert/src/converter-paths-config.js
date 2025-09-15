/*
  *
  :::::::::::
     include / exclude eds page for Prod and Stage
  ::::::::::::::
  *
*/

const template = document.querySelector('meta[name="template"]')?.content;
let excludeProdPathsIni = [];
let includeProdPathsIni = [];
let excludeStagePathsIni = [];
let includeStagePathsIni = [];
 
if (template === 'pdp') {
// production paths to go through converter
  excludeProdPathsIni = [];
 
  // include pro paths
  includeProdPathsIni = ['e-buy', 'products/', 'brands', 'products.html', 'blog-eds', 'news-eds', 'products/product-coveo'];
 
  // exclude stage paths
  excludeStagePathsIni = ['topics-jck1'];
 
  // include stage paths
  includeStagePathsIni = ['e-buy', 'products/', 'brands', 'products.html', 'blog', 'news', 'library', 'we-see-a-way', 'products/product-coveo', 'products/family', 'products/sku', 'products/bundle'];
 
}
else {
  // production paths to go through converter
  excludeProdPathsIni = ['products/family', 'products/sku', 'products/bundle'];
 
  // include pro paths
  includeProdPathsIni = ['e-buy', 'products/', 'brands', 'products.html', 'blog-eds', 'news-eds', 'products/product-coveo'];
 
  // exclude stage paths
  excludeStagePathsIni = ['products/family', 'products/sku', 'products/bundle', 'topics-jck1'];
 
  // include stage paths
  includeStagePathsIni = ['e-buy', 'products/', 'brands', 'products.html', 'blog', 'news', 'library', 'we-see-a-way', 'products/product-coveo'];
}
 
export const excludeProdPaths = excludeProdPathsIni;
export const includeProdPaths = includeProdPathsIni;
export const excludeStagePaths = excludeStagePathsIni;
export const includeStagePaths = includeStagePathsIni;

