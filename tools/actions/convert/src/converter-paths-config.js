/*
  *
  :::::::::::
     include / exclude eds page for Prod and Stage
  ::::::::::::::
  *
*/
// production paths to go through converter
export const excludeProdPaths = ['products/family', 'products/sku', 'products/bundle', 'products/product-coveo', 'solutions/digital/products', 'solutions/products'];

// include pro paths
export const includeProdPaths = ['e-buy', 'products/', 'brands', 'products.html', 'blog', 'news', 'videos-eds', 'library', 'new-lab/excedr'];

// exclude stage paths
export const excludeStagePaths = ['products/family', 'products/sku', 'products/bundle', 'products/product-coveo', 'topics-jck1'];

// include stage paths
export const includeStagePaths = ['e-buy', 'products/', 'brands', 'products.html', 'blog', 'news', 'videos', 'library', 'expert', 'new-lab/excedr', 'we-see-a-way', 'about-us', 'landing/home-eds'];
