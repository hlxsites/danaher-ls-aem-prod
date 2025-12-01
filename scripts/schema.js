import { getMetadata } from './lib-franklin.js';
// eslint-disable-next-line import/no-cycle
import { makePublicUrl, setJsonLd } from './scripts.js';

// eslint-disable-next-line import/prefer-default-export
export function buildArticleSchema() {
  const data = {
    '@context': 'http://schema.org',
    '@type': 'Article',
    '@id': `https://lifesciences.danaher.com${makePublicUrl(window.location.pathname)}`,
    headline: getMetadata('og:title'),
    image: getMetadata('og:image'),
    datePublished: getMetadata('publishdate'),
    publisher: {
      '@type': 'Organization',
      name: 'Danaher Life Sciences',
      logo: {
        '@type': 'ImageObject',
        url: 'https://lifesciences.danaher.com/content/dam/danaher/brand-logos/danaher/Logo.svg',
      },
    },
    description: getMetadata('description'),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://lifesciences.danaher.com${makePublicUrl(window.location.pathname)}`,
    },
  };

  if (getMetadata('creationdate')) data.datePublished = getMetadata('creationdate');
  if (getMetadata('updatedate')) data.dateModified = getMetadata('updatedate');
  if (getMetadata('authorname')) {
    data.author = {
      '@type': 'Person',
      name: getMetadata('authorname'),
    };
  }

  setJsonLd(data, 'article');
}

// Convert attributejson to additionalProperty schema
function additionalPropertyToSchema(attr) {
  if (!Array.isArray(attr)) return [];

  return attr.flatMap((section) => {
    // Ensure section is a valid object
    if (!section || typeof section !== 'object') return [];

    const sectionLabel = 'PropertyValue';
    // typeof section.label === 'string' ? section.label.trim() : '';
    if (!sectionLabel) return [];

    const values = Array.isArray(section.value) ? section.value : [];

    return values
      .filter((item) => item && typeof item === 'object')
      .filter((item) => typeof item.label === 'string' && item.label.trim() !== '')
      .map((item) => {
        const label = item.label?.trim?.() || '';
        const value = typeof item.value === 'string' ? item.value.trim() : String(item.value ?? '-');
        const unit = typeof item.unit === 'string' ? item.unit.trim() : '';

        return {
          '@type': sectionLabel,
          name: label,
          value: unit ? `${value} ${unit}` : value,
        };
      });
  });
}

// Parse attributejson safely
function parseAdditionalProperty(attributejson) {
  try {
    const parsed = JSON.parse(attributejson);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return additionalPropertyToSchema(parsed);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error parsing attributejson:', error);
    return [];
  }
}

// eslint-disable-next-line import/prefer-default-export
export function buildProductSchema(response) {
  const data = {
    '@context': 'http://schema.org',
    '@type': 'Product',
    '@id': `https://lifesciences.danaher.com${makePublicUrl(window.location.pathname)}`,
    name: getMetadata('og:title').replace(' | Danaher Life Sciences', ''),
    image: {
      '@type': 'ImageObject',
      url: getMetadata('og:image'),
      width: 600,
      height: 800,
    },
    description: getMetadata('description'),
    brand: {
      '@type': 'Brand',
      name: getMetadata('brand'),
      url: response?.[0]?.raw?.externallink || ''
    },
    sku: getMetadata('sku') || response?.[0]?.raw?.sku || '',
    mpn: getMetadata('sku') || response?.[0]?.raw?.sku || '',
    category: response?.[0]?.raw?.categoriesname || '',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: getMetadata('listpriceusd'),
      availability: getMetadata('availability'),
      url: `https://lifesciences.danaher.com${makePublicUrl(window.location.pathname)}`,
      seller: {
        '@type': 'Organization',
        name: getMetadata('brand'),
        url: response?.[0]?.raw?.externallink || '',
      },
    },
    manufacturer: {
      '@type': 'Organization',
      name: getMetadata('brand'),
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://lifesciences.danaher.com${makePublicUrl(window.location.pathname)}`,
    },
    datePublished: getMetadata('publishdate') || new Date(response?.[0]?.raw?.date).toLocaleString("en-US") || '',
    dateModified: getMetadata('updatedDate') || new Date(response?.[0]?.raw?.date).toLocaleString("en-US") || '',
  };
  // Add additionalProperty if attributejson exists
  if (response?.[0]?.raw?.attributejson) {
    data.additionalProperty = parseAdditionalProperty(response?.[0]?.raw?.attributejson);
  }

  if (getMetadata('creationdate')) data.datePublished = getMetadata('creationdate');
  if (getMetadata('updatedate')) data.dateModified = getMetadata('updatedate');
  if (getMetadata('authorname')) {
    data.manufacturer = {
      '@type': 'Organization',
      name: getMetadata('authorname'),
    };
  }

  setJsonLd(
    data,
    'product',
  );
}

function generateProductSchema(type, position, url, name, image, description) {
  return {
    '@type': 'ListItem',
    position,
    item: {
      '@type': type,
      '@id': url,
      name,
      image,
      description,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}

function generateItemListElement(type, position, url, name, image, description) {
  return {
    '@type': 'ListItem',
    position,
    item: {
      '@type': type,
      '@id': url,
      name,
      image,
      description,
    },
  };
}

const productType = ['product-family', 'product-category'];

// eslint-disable-next-line import/prefer-default-export
export function buildItemListSchema(srcObj, type) {
  let name;
  if (productType.includes(type)) name = `${document.querySelector('h1').textContent} - Types`;
  else if (type === 'workflow') name = `${document.querySelector('h1').textContent} Process Steps`;
  else if (type === 'solution-products-steps') name = `${document.querySelector('h1').textContent} - Products`;
  else name = document.querySelector('h1').textContent;

  const data = {
    '@context': 'http://schema.org',
    '@type': 'ItemList',
    '@id': `https://lifesciences.danaher.com${makePublicUrl(window.location.pathname)}`,
    name,
    image: getMetadata('og:image'),
    description: getMetadata('description'),
    itemListElement: [],
  };

  let title;
  let position;
  let url;
  let image;
  let description;

  srcObj.forEach((obj, index) => {
    switch (type) {
      case 'product-family':
        data.itemListElement.push(generateProductSchema(
          'Product',
          index + 1,
          obj.clickUri,
          obj.title,
          obj?.raw?.images?.at(0),
          obj?.raw?.description,
        ));
        break;
      case 'product-category':
        data.itemListElement.push(generateProductSchema(
          'Product',
          index + 1,
          `https://lifesciences.danaher.com${makePublicUrl(obj.path)}`,
          obj.title,
          `https://lifesciences.danaher.com${obj.image}`,
          obj.description,
        ));
        break;
      case 'workflow':
        position = obj.querySelector('p:nth-child(2) > strong')?.textContent;
        title = `${name} - ${obj.querySelector('p:nth-child(3)')?.textContent}`;
        url = obj.querySelector('p:nth-child(4) > a')?.href;
        image = obj.querySelector('p > picture > img')?.src;
        data.itemListElement.push(generateItemListElement(
          'ListItem',
          position,
          makePublicUrl(url),
          title,
          image,
          description,
        ));
        break;
      case 'process-steps':
        position = obj.querySelector('div:first-child')?.textContent;
        title = `${name} - ${obj.querySelector('div:nth-child(2) > h2')?.textContent}`;
        url = obj.querySelector('div:nth-child(2) > p > a')?.href;
        image = obj.querySelector('div:last-child > p > picture > img')?.src;
        description = obj.querySelector('div:nth-child(2) > p:nth-child(3)')?.textContent;
        data.itemListElement.push(generateItemListElement(
          'ListItem',
          position,
          makePublicUrl(url),
          title,
          image,
          description,
        ));
        break;
      case 'solution-products-steps':
      case 'solution-products':
        data.itemListElement.push(generateItemListElement(
          'Product',
          index + 1,
          obj.clickUri,
          obj.title,
          obj?.raw?.images?.at(0),
          obj?.raw?.description,
        ));
        break;
      case 'resources':
        data.itemListElement.push(generateItemListElement(
          'ListItem',
          index + 1,
          makePublicUrl(obj.path),
          obj.title,
          obj.image,
          obj.description,
        ));
        break;
      default:
        break;
    }
  });

  setJsonLd(
    data,
    'itemList',
  );
}

export function buildBreadcrumbSchema() {
  const rootUrl = window.location.origin;
  const breadcrumbSelector = ".breadcrumb-wrapper ul[role='list'] > li";
  const elements = document.querySelectorAll(breadcrumbSelector);

  const items = [];
  elements.forEach((li, idx) => {
    const a = li.querySelector('a');
    if (a) {
      const name = a.textContent.trim() || 'Home';
      const href = a.getAttribute('href') || '/';
      const item = href.startsWith('http') ? href : rootUrl + href;
      items.push({
        '@type': 'ListItem',
        position: idx + 1,
        name,
        item,
      });
    }
  });

  if (items.length) {
    const schema = {
      '@context': 'https://schema.org/',
      '@type': 'BreadcrumbList',
      itemListElement: items,
    };
    setJsonLd(schema, 'breadcrumb');
  }
}

export function buildImageSchemaObject(response) {
  let name = '';
  let description = '';
  let imageUrl = '';
  try {
    if (!response || response[0] === null || response[0].raw === null) {
      imageUrl = document.querySelector('img')?.src || '';
    } else if (response.length > 0 && response[0].raw) {
      name = response[0].raw.metatitle || '';
      description = response[0].raw.metadescription || '';
      const images = response?.[0]?.raw?.images || [];
      const nonPdfImage = images.find((img) => typeof img === 'string' && !img.toLowerCase().endsWith('.pdf'));
      const imgElement = nonPdfImage || document.querySelector('img')?.src;
      imageUrl = typeof imgElement === 'string' ? imgElement : (imgElement || '');
    }

    if (imageUrl !== '' && imageUrl !== null && imageUrl !== undefined) {
      const schema = {
        '@context': 'https://schema.org',
        '@type': 'ImageObject',
        name,
        description,
        url: imageUrl,
        width: '1000',
        height: '442',
        contentUrl: imageUrl,
        thumbnail: {
          '@type': 'ImageObject',
          url: `${imageUrl}?$danaher-mobile$`,
          width: '400',
          height: '177',
        },
      };
      setJsonLd(schema, 'imageSchema');
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error creating ImageObject schema:', error);
  }
}

// Build FAQ Schema
export function buildFAQSchema(response) {
  const faqJson = response?.[0]?.raw?.faqpreviewjson;
  let faqsResponse = [];

  if (typeof faqJson === 'string' && faqJson.trim() !== '') {
    try {
      faqsResponse = JSON.parse(faqJson);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error parsing FAQ JSON:', err);
    }
  }
  let faqSchema = null;

  if (Array.isArray(faqsResponse) && faqsResponse.length > 0) {
    faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqsResponse.map((faq) => ({
        '@type': 'Question',
        name: faq.Question || '',
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.Answer || '',
        },
      })),
    };
  }
  if (faqSchema) {
    setJsonLd(faqSchema, 'faqs');
  }
}
