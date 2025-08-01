import {
  div, span, img, p,
} from './dom-builder.js';
import { getCommerceBase } from './commerce.js';
import { decorateIcons } from './lib-franklin.js';
import { getApiData } from './api-utils.js';

export const baseURL = getCommerceBase(); // base url for the intershop api calls

/*
 ::::::::::::::::::::::::
 Capitalize any string
 ::::::::::::::::::::::::::::::::::::
*/
export function capitalizeFirstLetter(str) {
  if (typeof str !== 'string' || str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/*
 ::::::::::::::::::::
 Show preloader (animation)
 :::::::::::::::::
 */
export function showPreLoader() {
  const mainPreLoader = document.querySelector('#mainPreLoader');
  mainPreLoader?.classList.remove('hidden');
}

/*
 ::::::::::::::::::::
 creates a preloader (animation)
 :::::::::::::::::
 */
export function preLoader() {
  return div(
    {
      class:
        ' flex w-full relative top-1/2 left-[46%] justify-start items-center',
      id: 'preLoader',
    },
    img({
      class: ' h-24',
      src: '/content/dam/loading_icon.gif',
    }),
  );
}

/*
::::::::::::::::::::::
function to remove preloader whenever required
:::::::::::::::::::::::
*/
export function removePreLoader() {
  const mainPreLoader = document.querySelector('#mainPreLoader');
  setTimeout(() => {
    mainPreLoader?.classList.add('hidden');
  });
}
const generatePreloader = div(
  {
    class: 'hidden',
    id: 'mainPreLoader',
  },
  preLoader(),
);
const getMainDiv = document.querySelector('body');
getMainDiv.insertAdjacentElement('afterbegin', generatePreloader);
/*
 ::::::::::::::::::::::::
 utility function to close the modal...
 can be imported and used globally
 for the modal created using utlility createModal function
 ::::::::::::::::::::::::::::::::::::
*/
export function closeUtilityModal() {
  const utilityModal = document.querySelector('#utilityModal');
  if (utilityModal) {
    utilityModal.remove();
  }
}
/*
  create modal function... Creates a popup/modal with the input content
  @param: content : html content to load into the modal
  @param hasCancelButton : boolean. Optional cancel button
  @param hasCloseButton : boolean. Optional close button
*/
export function createModal(content, hasCancelButton, hasCloseButton) {
  const modalWrapper = div({
    class:
      'inset-0 fixed w-full  bg-black z-50 bg-opacity-50 flex items-center justify-center',
    id: 'utilityModal',
  });
  const modalContainer = div({
    class: 'relative max-w-xl w-full items-center bg-white p-8',
    id: 'utilityModalWrapper',
  });

  let modalBody = div({});
  if (content) {
    modalBody = div(
      {
        class: 'modal-body py-6 pb-6',
      },
      content,
    );
  }
  let cancelButton = '';
  if (hasCancelButton) {
    cancelButton = span(
      {
        class: 'mt-6 text-danaherpurple-500 cursor-pointer',
        id: 'closeUtilityModal',
      },
      'Cancel',
    );
    if (content && modalBody) {
      const getModalButtonWrapper = modalBody.querySelector('.button-wrapper');
      if (getModalButtonWrapper) {
        getModalButtonWrapper.classList.add(
          'flex',
          'justify-between',
          'items-center',
        );
        getModalButtonWrapper.append(cancelButton);
      }
    }
    cancelButton.addEventListener('click', (e) => {
      e.preventDefault();
      closeUtilityModal();
    });
  }
  if (hasCloseButton) {
    const modalCloseButton = p(
      {
        class: 'close-button absolute right-10 top-6',
        name: 'close',
      },
      span({
        class: 'icon icon-close cursor-pointer',
      }),
    );
    modalCloseButton.addEventListener('click', (e) => {
      e.preventDefault();
      closeUtilityModal();
    });

    decorateIcons(modalCloseButton);
    modalContainer.append(modalCloseButton);
  }
  modalContainer.append(modalBody);

  modalWrapper.append(modalContainer);
  const mainContainer = document.querySelector('main');
  if (mainContainer) {
    mainContainer.append(modalWrapper);
  }
}

/**
 * Fetches product information from APIs based on product ID.
 * @param {string} id - Product ID to fetch data for.
 * @returns {Promise<Object|null>} - Product data or null if fetch fails.
 */
export async function getProductInfo(id, needInterShop = true) {
  const api = true;

  if (api) {
    try {
      const coveoResponse = await getApiData(
        `https://${window.DanaherConfig.host}/us/en/product-data/productInfo/?product=${id}`,
      );
      if (coveoResponse?.status === 'success') {
        let productData = {};
        const product = coveoResponse?.data?.results?.[0];
        if (!product) return {};
        const coveoData = {
          title: product?.title,
          url: product?.clickUri,
          images: product?.raw?.images,
          brand: product?.raw?.ec_brand[0],
          objecttype: product?.raw?.objecttype,
          description: product?.raw?.description,
          defaultcategoryname: product?.raw?.defaultcategoryname,
        };

        // if needs intershop data
        if (needInterShop) {
          const intershopProductId = id.slice(0, id.lastIndexOf('-'));
          const intershopData = await getApiData(
            `${baseURL}products/${intershopProductId}`,
          );

          if (intershopData?.status === 'success') {
            const shopData = intershopData.data;

            const showCart = shopData?.attributes?.some(
              (attr) => attr.name === 'show_add_to_cart' && attr.value === 'True',
            );

            productData = {
              title: coveoData?.title,
              url: coveoData?.url,
              images: coveoData?.images,
              brand: coveoData?.brand,
              objecttype: coveoData?.objecttype,
              description: coveoData?.description,
              defaultcategoryname: coveoData?.defaultcategoryname,
              availability: shopData?.availability?.inStockQuantity,
              uom:
                shopData.packingUnit > 0
                  ? `${shopData.packingUnit}/Bundle`
                  : '1/Bundle',
              minQty: shopData?.minOrderQuantity,
              maxQty: shopData?.maxOrderQuantity,
              showCart,
              price: shopData?.salePrice?.value,
            };
          } else {
            productData = {};
          }
        } else {
          productData = {
            title: coveoData?.title,
            url: coveoData?.url,
            images: coveoData?.images,
            brand: coveoData?.brand,
            objecttype: coveoData?.objecttype,
            description: coveoData?.description,
            defaultcategoryname: coveoData?.defaultcategoryname,
          };
        }
        return productData;
      }
      return {};
    } catch (e) {
      return { status: 'error', data: e };
    }
  } else {
    // Placeholder for future API implementation
    return {};
  }
}
export function renderProductJsonResponse(iterations) {
  const productsArray = [];
  for (let i = 0; i < iterations; i += 1) {
    const productSample = {
      systitle: 'DMi1 Inverted Microscope for Cell Culture',

      showonlms: 'true',

      ec_images:
        'https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-hero;https://danaherls.scene7.com/is/image/danaher/leica-dmi1-inverted-microscope-16-hero;https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-product-image1;https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-objectives-product-image3;https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-expansion-product-image7;https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-sliders-product-image-5;https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-colorsafe-led-ilumination-product-image4;https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-image35;https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-colorsafe-led-ilumination-product-image4-1;https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-image41;https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-image31;https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-image47;https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-image37;https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-image39;https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-image12;https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-image9',
      imageslms: [
        'https://danaherls.scene7.com/is/image/danaher/leica-dmi1-inverted-microscope-16-hero',
        'https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-hero',
        'https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-product-image1',
        'https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-objectives-product-image3',
        'https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-colorsafe-led-ilumination-product-image4',
        'https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-expansion-product-image7',
        'https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-image9',
        'https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-image12',
        'https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-image31',
        'https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-image35',
        'https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-image37',
        'https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-image39',
        'https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-image41',
        'https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-image47',
        'https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-sliders-product-image-5',
        'https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-colorsafe-led-ilumination-product-image4-1',
      ],

      sysurihash: 's3u5QJOWwvd0zzsr',

      inriverentityid: '535',

      urihash: 's3u5QJOWwvd0zzsr',

      workflowname: [
        'Monoclonal Antibody (MAbs)',

        'Monoclonal Antibody (MAbs)|Cell Line Development',

        'Oligonucleotide Therapy',

        'Oligonucleotide Therapy|Antisense Oligonucleotide Development and Manufacturing',

        'mRNA Therapy',

        'mRNA Therapy|mRNA Development and Manufacturing',

        'Gene Therapy',

        'Cell Therapy',

        'Plasmid DNA Development and Manufacturing',
      ],

      externallink:
        'https://www.leica-microsystems.com/products/light-microscopes/p/leica-dmi1/',

      sysuri:
        'https://lifesciences.danaher.com/us/en/products/family/dmi1-inverted-microscopes.html',

      sysprintableuri:
        'https://lifesciences.danaher.com/us/en/products/family/dmi1-inverted-microscopes.html',

      systransactionid: 340578,

      normalmodesamplevolumemetricmicrol: 0,

      public: 'true',

      sysconcepts:
        'smart choice ; cell culture ; DMi1 ; microscopes ; variety of accessories ; concentrate ; handling ; LED illumination ; Leica Microsystems ; color temperature ; energy costs ; low maintenance ; S40 condenser ; flexibility',

      concepts:
        'smart choice ; cell culture ; DMi1 ; microscopes ; variety of accessories ; concentrate ; handling ; LED illumination ; Leica Microsystems ; color temperature ; energy costs ; low maintenance ; S40 condenser ; flexibility',

      printableuri:
        'https://lifesciences.danaher.com/us/en/products/family/dmi1-inverted-microscopes.html',

      locale: 'en-us',

      mappingtype: 'Family',

      responsiblebu: 'CM',

      contenttype: 'Product',

      sysindexeddate: 1744811961000,

      categoriesname: [
        'Microscopes',

        'Microscopes|Light Microscopes',

        'Microscopes|Light Microscopes|Inverted Light Microscopes',
      ],

      description:
        'The DMi1 inverted microscope supports your specific work routine in your cell culture lab. Its operation is so intuitive, its handling so comfortable that you can fully concentrate on your work. Choose the functions you need, and, if necessary, you can easily add a variety of accessories that are important for your work.\nJust Right – Smart Choice',

      permanentid: 'dmi1-inverted-microscopes',

      workflow: [
        'mabs',

        'mabs|cell-line-development',

        'oligonucleotide-therapy',

        'oligonucleotide-therapy|antisense-oligonucleotide-development-manufacturing',

        'mrna-therapy',

        'mrna-therapy|mrna-development-manufacturing',

        'gene-therapy',

        'cell-therapy',

        'pdna-synthesis',
      ],

      syslanguage: ['English'],

      opco: 'Leica Microsystems',

      discontinued: 'false',

      transactionid: 340578,

      shopenabledcountry: ['EN-US'],

      title: 'DMi1 Inverted Microscope for Cell Culture',

      urlslug: 'dmi1-inverted-microscopes',

      ec_brand: ['Leica Microsystems'],

      typo3uid: '34845',

      date: 1744811961000,

      objecttype: 'Family',

      richlongdescription:
        '<h3>Just Right For Your Live Cell Lab</h3>\n<p>The well-thought-out design and quality control elements enable you to work in comfort, even during long routines</p>\n<h3>Cost Saving, Color Safe LED Illumination</h3>\n<p>All DMi1 microscopes feature 5W LED illumination for constant color temperature through all stages of intensity</p>\n<h3>All-In-One Visualization And Data Storage</h3>\n<p>The DMi1 camera version is an all-in-one solution for image capturing and cell culture documentation</p>\n<h3>Just Right For Your Live Cell Lab &ndash; Smart Choice For Quick Checks</h3>\n<p>The microscope&rsquo;s flexibility in accommodating an S40 condenser (40 &ndash; 50 mm working distance) or switching to an S80 condenser (80 mm working distance) is achieved by just a few hand moves. High-quality Leica objectives provide brilliant images.</p>\n<p>The well-thought-out design and quality control elements enable you to work in comfort, even during long routines.</p>\n<p>Smart features make your workflow smooth and efficient, saving time and resources. High-quality imaging technology from Leica Microsystems provides precise results and reduces the risk of errors.</p>\n<p>The microscope&rsquo;s LED illumination means low energy costs and minimal downtime. No need to replace lamps often, or wait for the right color temperature to develop.</p>\n<p>The DMi1 is the smart choice for excellent quality.</p>\n<h3>10x to 20x to 40x Phase Contrast With One Hand Move</h3>\n<p>The DMi1 is easy to use for phase contrast observation.</p>\n<p>With 40x PH1 objective from Leica Microsystems you can switch from 10x to 20x to 40x phase contrast by simply swiveling the nosepiece. There is no need to change the light ring in the slider &ndash; the PH1 light ring matches all three objectives!</p>\n<h3>Cost Saving, Color Safe LED Illumination</h3>\n<p>All DMi1 microscopes feature 5W LED illumination for constant color temperature through all stages of intensity.</p>\n<p>The cool LED light provides a perfect climate for delicate live specimens. There are no distortions of the device due to heat, which provides unchanged focus.</p>\n<p>Moreover, LED lamps make great economic sense. LED technology and a twohour auto-off-function reduce energy costs. Up to 20 years life cycle (40 working hrs / week) per lamp under regular conditions mean less downtime and low maintenance costs.</p>\n<h3>Auto Intensity</h3>\n<p>A smart sensor integrated in the slider makes sure that the light intensity automatically adjusts between brightfield and phase contrast. This feature protects the eyes, saves time, and adds comfort for the user.</p>\n<h3>Quick Change From 40 to 50 or 80 Millimeters Working Distance</h3>\n<p>A wide range of working distances makes the DMi1 the perfect partner for your live cell laboratory. Use the S40 condenser for optimal resolution with slides, petri dishes, multi-well dishes, and most types of flasks: The S40 provides an extra 10 mm of free space by simply moving it up.</p>\n<p>When working with taller flasks, simply exchange the S40 for an S80 condenser with a few steps. There is no need to remove the whole illumination arm.</p>\n<h3>All-In-One Visualization And Data Storage</h3>\n<p>The DMi1 camera version is an all-in-one solution for image capturing and cell culture documentation. The Leica 12 megapixel Flexacam C1 camera transforms your microscope into a stand-alone digital imaging station with no need for a PC. Simply connect the camera to your microscope, preferred viewing device such as HDMI monitor, and network and start working! Save images directly on a USB stick or to your local network.</p>\n<p>The camera is mounted at the back of the stand. No additional trinocular tube is needed, and you will have a clear view and easy access to the working area.</p>\n<p>Connect any HDMI monitor to the camera and discuss your observations without need of a PC.</p>\n<h3>Solid Construction</h3>\n<p>The Leica DMi1 is extremely stable due to its low center of gravity. The use of high-grade materials &ndash; almost exclusively metal &ndash; also helps avoid vibrations and resulting image blur. A scratch-resistant stage, high quality optical components, and a wide range of accessories promote a long product life with low maintenance costs.</p>\n<h3>Modular Expansion</h3>\n<p>More flexibility and cost savings by using existing Leica components across platforms. The object guide (accessory) allows the use of different holding frames for flasks, dishes, and multi-well plates.</p>',

      numresources: 6,

      richdescription:
        '<p>The DMi1 inverted microscope supports your specific work routine in your <span style="color: #e03e2d;">cell culture</span> lab. Its operation is so intuitive, its handling so comfortable that you can fully concentrate on your work. Choose the functions you need, and, if necessary, you can easily add a variety of accessories that are important for your work.</p>\n<h4>Just Right &ndash; Smart Choice</h4>',

      obsolete: 'false',

      longdescription:
        'Just Right – Smart Choice\n\nThe DMi1 inverted microscope supports your specific work routine in your cell culture lab. Its operation is so intuitive, its handling so comfortable that you can fully concentrate on your work. Choose the functions you need, and, if necessary, you can easily add a variety of accessories that are important for your work.\n\nJust Right For Your Live Cell Lab – Smart Choice For Quick Checks\nThe microscope’s flexibility in accommodating an S40 condenser (40 – 50 mm working distance) or switching to an S80 condenser (80 mm working distance) is achieved by just a few hand moves. High-quality Leica objectives provide brilliant images.\nThe well-thought-out design and quality control elements enable you to work in comfort, even during long routines.\nSmart features make your workflow smooth and efficient, saving time and resources. High-quality imaging technology from Leica Microsystems provides precise results and reduces the risk of errors.\nThe microscope’s LED illumination means low energy costs and minimal downtime. No need to replace lamps often, or wait for the right color temperature to develop.\nThe DMi1 is the smart choice for excellent quality.\n\n10x to 20x to 40x Phase Contrast With One Hand Move\nThe DMi1 is easy to use for phase contrast observation.\nWith 40x PH1 objective from Leica Microsystems you can switch from 10x to 20x to 40x phase contrast by simply swiveling the nosepiece. There is no need to change the light ring in the slider – the PH1 light ring matches all three objectives!\n\nCost Saving, Color Safe LED Illumination\nAll DMi1 microscopes feature 5W LED illumination for constant color temperature through all stages of intensity.\nThe cool LED light provides a perfect climate for delicate live specimens. There are no distortions of the device due to heat, which provides unchanged focus.\nMoreover, LED lamps make great economic sense. LED technology and a twohour auto-off-function reduce energy costs. Up to 20 years life cycle (40 working hrs / week) per lamp under regular conditions mean less downtime and low maintenance costs.\n\nAuto Intensity\nA smart sensor integrated in the slider makes sure that the light intensity automatically adjusts between brightfield and phase contrast. This feature protects the eyes, saves time, and adds comfort for the user.\n\nQuick Change From 40 to 50 or 80 Millimeters Working Distance\nA wide range of working distances makes the DMi1 the perfect partner for your live cell laboratory. Use the S40 condenser for optimal resolution with slides, petri dishes, multi-well dishes, and most types of flasks: The S40 provides an extra 10 mm of free space by simply moving it up.\nWhen working with taller flasks, simply exchange the S40 for an S80 condenser with a few steps. There is no need to remove the whole illumination arm.\n\nAll-In-One Visualization And Data Storage\nThe DMi1 camera version is an all-in-one solution for image capturing and cell culture documentation. The Leica 12 megapixel Flexacam C1 camera transforms your microscope into a stand-alone digital imaging station with no need for a PC. Simply connect the camera to your microscope, preferred viewing device such as HDMI monitor, and network and start working!  Save images directly on a USB stick or to your local network.\nThe camera is mounted at the back of the stand. No additional trinocular tube is needed, and you will have a clear view and easy access to the working area.\n\nSolid Construction\nThe Leica DMi1 is extremely stable due to its low center of gravity. The use of high-grade materials – almost exclusively metal – also helps avoid vibrations and resulting image blur. A scratch-resistant stage, high quality optical components, and a wide range of accessories promote a long product life with low maintenance costs.\n\nModular Expansion\nMore flexibility and cost savings by using existing Leica components across platforms. The object guide (accessory) allows the use of different holding frames for flasks, dishes, and multi-well plates.',

      metadescriptionlsig:
        'Discover the Leica DMi1 inverted microscope for efficient cell culture work. Its smart features streamline workflows. Enhance your research today!',

      metatitlelsig:
        'DMi1 Inverted Microscope for Cell Culture | Danaher Life Sciences',

      activeinsfdc: 'true',

      rowid: '1744811961047226807',

      titlelsig: 'DMi1 Inverted Microscope for Cell Culture',

      specificationsjson: '{}',

      ec_shortdesc:
        'The DMi1 inverted microscope supports your specific work routine in your cell culture lab. Its operation is so intuitive, its handling so comfortable that you can fully concentrate on your work. Choose the functions you need, and, if necessary, you can easily add a variety of accessories that are important for your work.\nJust Right – Smart Choice',

      size: 36,

      ec_name: 'DMi1 Inverted Microscope for Cell Culture',

      detectedtitle:
        'Just Right For Your Live Cell Lab – Smart Choice For Quick Checks',

      urlsluglsig: 'dmi1-inverted-microscopes',

      clickableuri:
        'https://lifesciences.danaher.com/us/en/products/family/dmi1-inverted-microscopes.html',

      syssource: 'PIM Catalog Source',

      model: 'DMi1',

      orderingid: 1744811950965,

      status: 'Current',

      syssize: 36,

      sysdate: 1744811961000,

      numspecifications: 0,

      categories: [
        'microscopes',

        'microscopes|light-microscopes',

        'microscopes|light-microscopes|inverted-light-microscopes',
      ],

      primaryid: 'OMZXKNKRJJHVO53WMQYHU6TTOIXDKOBUHE2C4ZDFMZQXK3DU',

      familyid: ['dmi1-inverted-microscopes'],

      wordcount: 322,

      sku: 'dmi1-inverted-microscopes',

      numbundles: 2,

      ec_category: ['microscopes|light-microscopes|inverted-light-microscopes'],

      showonlsig: 'true',

      source: 'PIM Catalog Source',

      ec_description:
        'Just Right – Smart Choice\n\nThe DMi1 inverted microscope supports your specific work routine in your cell culture lab. Its operation is so intuitive, its handling so comfortable that you can fully concentrate on your work. Choose the functions you need, and, if necessary, you can easily add a variety of accessories that are important for your work.\n\nJust Right For Your Live Cell Lab – Smart Choice For Quick Checks\nThe microscope’s flexibility in accommodating an S40 condenser (40 – 50 mm working distance) or switching to an S80 condenser (80 mm working distance) is achieved by just a few hand moves. High-quality Leica objectives provide brilliant images.\nThe well-thought-out design and quality control elements enable you to work in comfort, even during long routines.\nSmart features make your workflow smooth and efficient, saving time and resources. High-quality imaging technology from Leica Microsystems provides precise results and reduces the risk of errors.\nThe microscope’s LED illumination means low energy costs and minimal downtime. No need to replace lamps often, or wait for the right color temperature to develop.\nThe DMi1 is the smart choice for excellent quality.\n\n10x to 20x to 40x Phase Contrast With One Hand Move\nThe DMi1 is easy to use for phase contrast observation.\nWith 40x PH1 objective from Leica Microsystems you can switch from 10x to 20x to 40x phase contrast by simply swiveling the nosepiece. There is no need to change the light ring in the slider – the PH1 light ring matches all three objectives!\n\nCost Saving, Color Safe LED Illumination\nAll DMi1 microscopes feature 5W LED illumination for constant color temperature through all stages of intensity.\nThe cool LED light provides a perfect climate for delicate live specimens. There are no distortions of the device due to heat, which provides unchanged focus.\nMoreover, LED lamps make great economic sense. LED technology and a twohour auto-off-function reduce energy costs. Up to 20 years life cycle (40 working hrs / week) per lamp under regular conditions mean less downtime and low maintenance costs.\n\nAuto Intensity\nA smart sensor integrated in the slider makes sure that the light intensity automatically adjusts between brightfield and phase contrast. This feature protects the eyes, saves time, and adds comfort for the user.\n\nQuick Change From 40 to 50 or 80 Millimeters Working Distance\nA wide range of working distances makes the DMi1 the perfect partner for your live cell laboratory. Use the S40 condenser for optimal resolution with slides, petri dishes, multi-well dishes, and most types of flasks: The S40 provides an extra 10 mm of free space by simply moving it up.\nWhen working with taller flasks, simply exchange the S40 for an S80 condenser with a few steps. There is no need to remove the whole illumination arm.\n\nAll-In-One Visualization And Data Storage\nThe DMi1 camera version is an all-in-one solution for image capturing and cell culture documentation. The Leica 12 megapixel Flexacam C1 camera transforms your microscope into a stand-alone digital imaging station with no need for a PC. Simply connect the camera to your microscope, preferred viewing device such as HDMI monitor, and network and start working!  Save images directly on a USB stick or to your local network.\nThe camera is mounted at the back of the stand. No additional trinocular tube is needed, and you will have a clear view and easy access to the working area.\n\nSolid Construction\nThe Leica DMi1 is extremely stable due to its low center of gravity. The use of high-grade materials – almost exclusively metal – also helps avoid vibrations and resulting image blur. A scratch-resistant stage, high quality optical components, and a wide range of accessories promote a long product life with low maintenance costs.\n\nModular Expansion\nMore flexibility and cost savings by using existing Leica components across platforms. The object guide (accessory) allows the use of different holding frames for flasks, dishes, and multi-well plates.',

      collection: 'default',

      detectedlanguage: 1,

      indexeddate: 1744811961000,

      defaultcategoryname: 'Inverted Light Microscopes',

      filetype: 'txt',

      categoryclass: ['Categories'],

      descriptionlsig:
        'The DMi1 inverted microscope supports your specific work routine in your cell culture lab. Its operation is so intuitive, its handling so comfortable that you can fully concentrate on your work. Choose the functions you need, and, if necessary, you can easily add a variety of accessories that are important for your work.\nJust Right – Smart Choice',

      metatitle: 'Inverted Microscope for Cell Culture',

      sysclickableuri:
        'https://lifesciences.danaher.com/us/en/products/family/dmi1-inverted-microscopes.html',

      metadescription:
        'The DMi1 inverted microscope supports your specific work routine in your cell culture lab. Intuitive operation and comfortable handling - fully concentrate on your work.',

      sysfiletype: 'txt',

      language: ['English'],

      defaultcategory:
        'microscopes/light-microscopes/inverted-light-microscopes',

      sysrowid: '1744811961047226807',

      uri: 'https://lifesciences.danaher.com/us/en/products/family/dmi1-inverted-microscopes.html',

      numproducts: 2,

      clickableurilms:
        'https://shop.leica-microsystems.com/us/en/products/family/dmi1-inverted-microscopes.html',

      syscollection: 'default',

      images: [
        'https://danaherls.scene7.com/is/image/danaher/leica-dmi1-inverted-microscope-16-hero',

        'https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-hero',

        'https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-product-image1',

        'https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-objectives-product-image3',

        'https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-colorsafe-led-ilumination-product-image4',

        'https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-expansion-product-image7',

        'https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-image9',

        'https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-image12',

        'https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-image31',

        'https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-image35',

        'https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-image37',

        'https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-image39',

        'https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-image41',

        'https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-image47',

        'https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-sliders-product-image-5',

        'https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-colorsafe-led-ilumination-product-image4-1',
      ],

      productid: 'dmi1-inverted-microscopes',
    };
    productsArray.push(productSample);
  }
  return productsArray;
}
