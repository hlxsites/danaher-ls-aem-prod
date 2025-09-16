/* global WebImporter */

async function getProductTitle(url, host) {
  if (url.pathname.match(/^\/content\/danaher\/ls\/us\/en\/products\/(family\/|sku\/|bundles\/)/)) {
    const urlStr = url.pathname.replace(/^\/content\/danaher\/ls/, '').replace(/\.html$/, '');
    const productMeta = await fetch(`${host}/metadata-products.json`)
      .then((response) => response.json())
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Error:', error);
      });
    const reqestedProduct = Array.from(productMeta.data)
      .filter((product) => product.URL === urlStr);
    if (reqestedProduct.length === 1) {
      return reqestedProduct[0].title;
    }
  }
  return 0;
}

const createProductHero = async (main, document, param, url) => {
  const host = param.opts?.converterCfg?.internalHost;
  const product = main.querySelector('product-page');
  const template = document.querySelector('meta[name="template"]')?.content;
  if (product || (template !== undefined && template === 'pdp')) {
    let tag = document.createElement('meta');
    tag.setAttribute('property', 'edspdptagrj');
    tag.content = 'PDP tag test for EDS';
    document.head.appendChild(tag);
    const productCells = [
      ['Product Hero'],
    ];
    const title = document.createElement('h1');
    const titleVal = await getProductTitle(url, host);
    title.textContent = titleVal;
    if (titleVal) productCells.push([title]);

    const btnText = product.getAttribute('rfqbuttontext');
    if (btnText) productCells.push([btnText]);

    if (productCells.length > 1) {
      const block = WebImporter.DOMUtils.createTable(productCells, document);
      product.append(block, document.createElement('hr'));
    }
  }
};
export default createProductHero;
