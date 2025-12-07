/*
  *
  :::::::::::
     include / exclude eds page for Prod and Stage
  ::::::::::::::
  *
*/
// production paths to go through converter
export const excludeProdPaths = ['products/family', 'products/sku', 'products/bundle', 'products/product-coveo'];

// include pro paths
export const includeProdPaths = ['e-buy', 'products/', 'brands', 'products.html', 'blog', 'news', 'videos', 'library', 'expert-eds', 'new-lab', 'application', 'solutions/analytical', 'solutions/digital/products', 'about-us'];

// exclude stage paths
export const excludeStagePaths = ['products/family', 'products/sku', 'products/bundle', 'products/product-coveo', 'topics-jck1'];

// include stage paths
export const includeStagePaths = ['e-buy', 'products/', 'brands', 'products.html', 'blog', 'news', 'videos', 'library', 'expert', 'new-lab', 'application', 'we-see-a-way', 'about-us', 'landing/home-eds'];
