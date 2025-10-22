import {
  div, img, a,
} from '../../scripts/dom-builder.js';

// eslint-disable-next-line import/prefer-default-export
export const quoteItems = (response) => {
  const groupedByBrand = response.items.reduce((acc, item) => {
    const brand = item.brand || 'Unknown';
    if (!acc[brand]) {
      acc[brand] = [];
    }
    acc[brand].push(item);
    return acc;
  }, {});

  const quoteLogoDiv = (itemToBeDisplayed) => {
    const quoteLogoDivInner = div(
      {
        class: 'self-stretch py-3 bg-gray-50 border-t border-b border-gray-300 inline-flex justify-start items-center gap-1',
      },
      div(
        {
          class: 'w-80 px-5 flex justify-start items-center gap-3',
        },
        div({
          class: 'justify-start text-black text-base font-bold leading-snug',
        }, itemToBeDisplayed[1][0].brand),
      ),
      div({
        class: 'w-20 justify-start text-right text-black text-base font-bold leading-snug',
      }, 'QTY'),
      div({
        class: 'w-36 text-right justify-start text-black text-base font-bold leading-snug',
      }, 'Total'),
    );
    // quoteLogoDivContainer.append(quoteLogoDivInner);
    return quoteLogoDivInner;
  };

  const unitPriceDiv = (quoteItemValue) => {
    // eslint-disable-next-line max-len
    const formattedAmount = (orderTotal) => parseFloat(orderTotal).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    // eslint-disable-next-line max-len, no-unsafe-optional-chaining
    const listPriceValue = quoteItemValue?.quantity?.value * quoteItemValue?.product?.listPrice?.value;
    // eslint-disable-next-line max-len, no-unsafe-optional-chaining
    const salesPriceValue = quoteItemValue?.quantity?.value * quoteItemValue?.product?.salePrice?.value;
    if (listPriceValue !== salesPriceValue) {
      return div(
        {
          class: 'w-52 inline-flex flex-col justify-start items-end',
        },
        div(
          {
            class:
              'self-stretch text-right justify-start text-gray-500 text-base font-extralight line-through leading-snug',
          },
          `$${formattedAmount(listPriceValue)}`,
        ),
        div(
          {
            class:
              'self-stretch text-right justify-start text-black text-base font-bold leading-snug',
          },
          `$${formattedAmount(salesPriceValue)}`,
        ),
      );
    }

    return div(
      {
        class: 'w-[150px] justify-start text-black text-base font-semibold',
      },
      div(
        {
          class:
            'unit-price w-[150px] text-right justify-start text-black text-base',
        },
        `$${formattedAmount(salesPriceValue)}`,
      ),
    );
  };
  const quoteItemDiv = (quoteItemValue) => {
    const productSKU = quoteItemValue?.product?.sku;
    const itemsscontainer = a(
      {
        href: `/us/en/products/sku/${productSKU}`,
        class:
         'self-stretch pb-4 relative border-b border-gray-300 inline-flex md:flex-row flex-col justify-start items-center',
        id: quoteItemValue?.id,
      },
      div(
        {
          class: 'w-80 flex justify-start items-center gap-3.5 ',
        },
        div(
          {
            class: 'w-28 p-2 flex justify-start items-center gap-3 ',
          },
          div(
            {
              class: 'p-2.5 bg-white border border-solid border-gray-300 flex justify-start items-center gap-2.5',
            },
            img({
              class: 'w-16 self-stretch relative',
              src: quoteItemValue.product?.image ? quoteItemValue.product.image : 'https://s7d9.scene7.com/is/image/danaherstage/no-image-availble',
            }),
          ),
        ),
        div(
          {
            class: 'w-48 inline-flex flex-col justify-start items-start',
          },
          div(
            {
              class: 'self-stretch justify-start text-black text-base font-bold leading-snug',
            },
            quoteItemValue?.product?.productName,
          ),
          div(
            {
              class:
               'self-stretch justify-start text-gray-500 text-sm font-normal leading-tight ',
            },
            quoteItemValue?.product?.sku,
          ),

        ),
      ),
      div(
        {
          class: 'inline-flex justify-start',
        },
        div(
          {
            class: 'w-20 text-right justify-start text-black text-base font-bold leading-snug',
          },
          quoteItemValue?.quantity?.value,
        ),
        unitPriceDiv(quoteItemValue),
      ),

    );
    return itemsscontainer;
  };

  const quoteItemDisplayContainer = div({
    class: 'self-stretch bg-white flex flex-col justify-start items-start',

  });
  Object.entries(groupedByBrand).forEach((itemToBeDisplayed) => {
    const manufacturerName = itemToBeDisplayed[0];
    const matchingLineItems = response.items.filter(
      (item) => item.brand === manufacturerName && item.sku,
    );
    if (matchingLineItems.length > 0) {
      const quoteItemDisplayWrapper = div({
        class: 'self-stretch flex flex-col justify-start items-start gap-3',
      });
      const quoteLogoDivDisplay = quoteLogoDiv(itemToBeDisplayed);
      quoteItemDisplayWrapper.append(quoteLogoDivDisplay);
      matchingLineItems.forEach((cartItem) => {
        quoteItemDisplayWrapper.append(quoteItemDiv(cartItem));
        quoteItemDisplayContainer.append(quoteItemDisplayWrapper);
      });
    } else {
      document.querySelector('#quoteItemTitle')?.classList?.add('hidden');
    }
  });
  return quoteItemDisplayContainer;
};
