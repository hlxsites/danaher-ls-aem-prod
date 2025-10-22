// eslint-disable-next-line import/no-cycle
import {
  buildInputElement, removePreLoader, showPreLoader,
  buildSearchWithIcon,
  showNotification,
  scrollViewToTop,
} from '../../scripts/common-utils.js';
import {
  h2, h4, div, p, span, button, input, label,
} from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
// eslint-disable-next-line import/no-cycle
import {
  checkoutSkeleton,
  getBasketDetails, getPaymentMethods, validateBasket,
} from '../../scripts/cart-checkout-utils.js';
import {
  loadStripe,
  getSavedCards,
  setGetCardAsDefault,
  setUseCard,
  postSetupIntent,
  loadStripeScript,
  addCardToOrder,
  canLoadStripe,
  removeCard,
} from '../../scripts/stripe_utils.js';
import { getAuthenticationToken } from '../../scripts/token-utils.js';
import { updateBasketDetails } from '../cartlanding/cartSharedFile.js';

let stripeElements;
let stripe;
let stripeLoaded = false;
let paymentMethodType = 'Card';
const emptyCardsListWrapper = (
  cardSearchedLength,
  searchedWord = null,
) => {
  const emptyCardListContainer = div(
    {
      class: 'self-stretch p-14 inline-flex justify-start items-start gap-5',
    },
    div(
      {
        class: 'flex-1 inline-flex flex-col justify-start items-center gap-9',
      },
      div(
        {
          class:
            'self-stretch flex flex-col justify-start items-center gap-2',
        },
        div(
          {
            class:
              'self-stretch flex flex-col justify-start items-center gap-4',
          },
          div(
            {
              class: 'w-[656px] flex flex-col text-center justify-start',
            },
            span(
              {
                class: '!text-gray-900 text-4xl font-normal leading-[48px]',
              },
              'We’re sorry. ',
            ),
            span(
              {
                class: 'text-gray-900 text-2xl font-normal leading-loose',
              },
              cardSearchedLength !== 0
                ? 'We could not find any Card for the relevant account.'
                : `We could not find a Card match for “${searchedWord}"`,
            ),
          ),
          div(
            {
              class: 'w-[692px] flex flex-col justify-start items-start',
            },
            div(
              {
                class:
                  'self-stretch text-center justify-start text-black text-base font-extralight leading-snug',
              },
              cardSearchedLength !== 0
                ? 'Try adding the address'
                : 'Check for typos, spelling errors, search by part number or try an different keyword',
            ),
          ),
        ),
      ),
    ),
  );
  return emptyCardListContainer;
};

export function createCardItem(item, defaultCard, isValidated = '') {
  const useCard = sessionStorage.getItem('useStripeCardId');
  const itemObject = {
    expiryMonth: item?.card?.exp_month ? String(item?.card?.exp_month).padStart(2, '0') : '',
    expiryYear: item?.card?.exp_year,
    lastFourDigits: item?.card?.last4,
    brand: item?.card?.brand,
    itemId: item?.id,
  };
  let defaultPaymentCheckbox = '';
  let defaultPaymentCheckboxText = '';
  defaultPaymentCheckbox = input(
    {
      type: 'checkbox',
      name: 'defaultStripeCard',
      class: 'input-focus-checkbox',
      id: `c_${itemObject.itemId}`,
      value: itemObject.itemId,
      'data-required': false,
      'aria-label': 'Default Payment',
    },
  );

  defaultPaymentCheckboxText = 'Make this my default payment';

  sessionStorage.setItem('selectedStripeMethod', 'savedCard');
  if (defaultCard === itemObject.itemId && !useCard) {
    defaultPaymentCheckbox.checked = true;
    sessionStorage.setItem('useStripeCardId', itemObject.itemId);
    defaultPaymentCheckboxText = 'Default Payment';
  }
  let useCardLabel = 'Use Card';
  if (useCard === itemObject.itemId) {
    useCardLabel = 'Selected Card';
  }
  const itemCard = div(
    {
      class: `bg-checkout payment-card-wrapper ${itemObject?.lastFourDigits ? '' : 'hidden'} border p-3 md:p-6 flex flex-col gap-6 ${useCard === itemObject.itemId && !isValidated ? 'border-danaherpurple-500' : ''}`,
      id: `card${item.id}`,
    },
    div(
      {
        class: 'payment-card-details bg-white items-start md:items-center flex justify-between w-full p-3 md:p-6 gap-6 flex-col md:flex-row',
      },
      div(
        {
          class: 'flex gap-6 items-start md:items-center flex-col md:flex-row',
        },
        div(
          {
            class: 'payment-card-icon flex items-start md:items-center w-16',
          },
          span({
            class: `icon flex-none icon-${itemObject?.brand || 'icon-visa'} 16 h-12 w-full`,
          }),
        ),
        div(
          {
            class: 'payment-card-description flex flex-col',
          },
          h4(
            {
              class: 'font-medium text-xl m-0 p-0 leading-7 text-black',
            },
            `Card ending in ${itemObject?.lastFourDigits || ''}`,
          ),
          p(
            {
              class: 'font-normal text-base',
            },
            `Expires ${itemObject?.expiryMonth || ''}/${itemObject?.expiryYear || ''}`,
          ),
        ),
      ),
      isValidated === true ? button(
        {
          class: 'stripe-card-remove-button cursor-pointer text-xl  border-danaherpurple-500 border-solid btn btn-lg font-medium btn-outline-primary bg-white  hover:bg-danaherpurple-500 rounded-full px-6 m-0',
          id: itemObject?.itemId,
        },
        'Remove Card',
      ) : button(
        {
          class: `stripe-card-use-button cursor-pointer text-xl  border-danaherpurple-500 border-solid btn btn-lg font-medium  ${useCardLabel === 'Selected Card' ? 'btn-primary-purple  hover:bg-danaherpurple-800' : 'btn-outline-primary bg-white  hover:bg-danaherpurple-500'}  rounded-full px-6 m-0`,
          id: itemObject?.itemId,
        },
        useCardLabel,
      ),
    ),
    div(
      {
        class: 'flex gap-3',
      },
      defaultPaymentCheckbox,
      label(
        {
          for: `c_${itemObject.itemId}`,
          class: 'text-base font-normal',
        },
        defaultPaymentCheckboxText,
      ),
    ),
  );
  return itemCard;
}

function handleCardSearch(savedStripeCardsHeader, checkSavedStripeCards, savedStripeCardsList) {
  /*
   search functionality for search for cards list
   */
  const cardsListSearchInput = savedStripeCardsHeader.querySelector(
    '#searchWithIcon input',
  );
  if (cardsListSearchInput) {
    cardsListSearchInput.addEventListener('input', (e) => {
      e.preventDefault();
      if (checkSavedStripeCards?.length > 0) {
        const searchTerm = e.target.value.toLowerCase();
        const searchedCards = checkSavedStripeCards?.filter((cd) => {
          const cardNumber = String(cd?.card?.last4 || '');
          const expiryMonth = String(cd?.card?.exp_month).padStart(2, '0');
          const expiryYear = String(cd?.card?.exp_year || '');
          return (
            cardNumber.includes(searchTerm)
            || expiryMonth.includes(searchTerm)
            || expiryYear.includes(searchTerm)
          );
        });
        savedStripeCardsList.innerHTML = '';
        searchedCards?.forEach((item) => {
          savedStripeCardsList?.append(createCardItem(item));
          decorateIcons(savedStripeCardsList);
        });
        if (searchedCards?.length === 0) {
          // eslint-disable-next-line max-len
          savedStripeCardsList?.append(emptyCardsListWrapper(searchedCards?.length, searchTerm));
        }
        decorateIcons(savedStripeCardsList);
      }
    });
  }
}

function isStripeScriptLoaded() {
  return !!document.querySelector(`script[src="${window.EbuyConfig?.stripeLibrary}"]`);
}

function mountStripeElements({
  clientSecret,
  appearance,
  paymentWrapper,
  addressWrapper,
  options,
}) {
  if (!clientSecret || !paymentWrapper || !addressWrapper) return;

  stripeElements = stripe.elements({ clientSecret, appearance, disallowedCardBrands: ['discover_global_network'] });
  const addressEl = stripeElements.create('address', {
    mode: 'billing',
    display: {},
    blockPoBox: true,
    fields: { phone: 'always' },
  });

  const paymentEl = stripeElements.create('payment', options);

  setTimeout(() => {
    addressEl.mount(`#${addressWrapper.id}`);
    paymentEl.mount(`#${paymentWrapper.id}`);

    paymentEl.on('change', (event) => {
      const selectedType = event.value?.type;
      paymentMethodType = selectedType;
      if (selectedType === 'card') {
        // Handle card-specific logic
        paymentMethodType = 'Card';
      } else if (selectedType === 'us_bank_account') {
        // Handle bank-specific logic
        paymentMethodType = 'Bank';
      }
    });
  }, 1000);
}

/*
 generates the payment module for the checkout module/page
 */
export const paymentModule = async (isValidated) => {
  try {
    if (!canLoadStripe()) return false;
    if (!isStripeScriptLoaded()) {
      await loadStripeScript(`${window.EbuyConfig?.stripeLibrary}`);
    }
    if (!stripeLoaded) {
      stripe = await loadStripe();
      stripeLoaded = true;
    }
    if (!isValidated) {
      /*

      validating basket.

      */
      const validateData = {
        adjustmentsAllowed: true,
        scopes: [
          'InvoiceAddress',
          'ShippingAddress',
          'Addresses',
          'Shipping',
        ],
      };
      if (!window.location.pathname === window.EbuyConfig?.paymentPageUrl) return false;
      const authenticationToken = await getAuthenticationToken();
      if (authenticationToken?.status === 'error') {
        throw new Error('Unauthorized Access');
      }

      const validatingBasket = await validateBasket(validateData);
      if (validatingBasket?.status === 'error') throw new Error('Invalid Basket');
    }
    const moduleContent = div({});
    const moduleHeader = div(
      {
        class: 'relative flex flex-col mb-6',
      },
      h2(
        {
          class:
            'text-black text-left text-3xl font-dhlsMedium leading-12 p-0 m-0 pb-6',
        },
        'Choose your payment method',
      ),
      p(
        {},
        'Simplify your logistics by shipping with our trusted carrier. Enjoy competitive rates, real-time tracking, and reliable delivery for all your products. Let us handle the shipping while you focus on your business.',
      ),
    );
    const paymentMethodsWrapper = div({
      id: 'paymentMethodsWrapper',
      class: 'flex flex-col w-full hidden',
    });
    let stripeCardsWrapper = div({ class: '' });
    let invoiceWrapper = div({ class: 'hidden' });

    // get available payment methods
    const allPaymentMethods = await getPaymentMethods();
    if (allPaymentMethods?.status !== 'success') throw new Error('No Payment methods Available.');

    const invoiceNumber = buildInputElement(
      'invoiceNumber',
      'Invoice Number',
      'text',
      'invoiceNumber',
      false,
      false,
      'invoiceNumber',
      '',
    );
    invoiceNumber.className = '';
    invoiceNumber.classList.add('w-full');
    invoiceNumber?.querySelector('input')?.classList?.add('outline-none');
    if (invoiceNumber?.querySelector('label')?.classList?.contains('font-semibold')) {
      invoiceNumber?.querySelector('label')?.classList?.remove('font-semibold');
    }
    invoiceNumber?.querySelector('label')?.classList?.add('font-normal');
    if (invoiceNumber?.querySelector('label')?.classList.contains('pl-4')) {
      invoiceNumber?.querySelector('label')?.classList.remove('pl-4');
    }

    let getPI;
    let addressElements;
    let addressOptions;
    const options = {
      setup_future_usage: 'off_session',
      layout: {
        type: 'tabs',
        defaultCollapsed: false,
        radios: true,
        spacedAccordionItems: true,
      },
      fields: {
        cardDetails: {
          cardHolderName: 'auto',
        },
        billingDetails: {
          address: 'auto',
          name: 'auto',
        },
      },
    };
    let savedStripeCardsHeader = '';
    let getSavedStripeCardsList = '';
    let newStripeCardPaymentWrapper = '';
    let newStripeCardAddressWrapper = '';
    let newStripeCardsWrapper = '';
    let checkSavedStripeCards = '';
    let savedStripeCardsList = '';

    const getBasketData = await getBasketDetails();

    const basketData = getBasketData?.data;
    const invoiceToAddress = basketData?.data?.invoiceToAddress;
    const commonShipToAddress = basketData?.data?.commonShipToAddress;
    // eslint-disable-next-line max-len
    allPaymentMethods?.data?.sort((b, a) => b.displayName.localeCompare(a.displayName))?.forEach(async (pm, ind) => {
      try {
        if (pm?.id === 'STRIPE_PAYMENT') {
          const stripeCardsContainer = div(
            {
              id: 'stripeCardsContainer',
              class: 'flex-col flex w-full items-start',
            },
          );
          stripeCardsContainer.append(checkoutSkeleton());
          const savedStripeCardsWrapper = div(
            {
              class: 'saved-cards-wrapper w-full flex flex-col gap-6',
            },
          );
          stripeCardsWrapper.innerHTML = '';
          stripeCardsWrapper = div(
            {
              id: `paymentMethod${pm?.id}`,
              class:
                `border-solid border-gray-300 flex flex-col gap-3 items-start p-3 md:p-4 border-2  items-start  ${ind > 0 ? 'border-t-0 ' : ''}`,
            },
            div(
              {
                class: 'flex justify-between w-full flex-col md:flex-row gap-6',
              },
              div(
                {
                  class: 'border-solid border-gray-300 flex gap-2 flex-none items-center',
                },
                buildInputElement(
                  pm?.id,
                  pm?.displayName,
                  'radio',
                  'paymentMethod',
                  true,
                  false,
                  'mt-6',
                  pm?.id,
                ),
              ),
              span({
                class: 'icon flex-none icon-payment-cards h-9 w-40',
              }),
            ),
          );
          if (stripeCardsWrapper?.querySelector('input')) {
            stripeCardsWrapper.querySelector('input').checked = true;
          }
          stripeCardsWrapper.append(stripeCardsContainer);
          paymentMethodsWrapper?.append(stripeCardsWrapper);
          // get saved stripe cards
          getSavedStripeCardsList = await getSavedCards();
          if (getSavedStripeCardsList?.status !== 'success') throw new Error('No Saved Cards Found.');

          savedStripeCardsHeader = div(
            {
              class: `flex ${(getSavedStripeCardsList?.status === 'success' && getSavedStripeCardsList?.data?.data?.length > 0) ? '' : 'hidden'} justify-between items-center w-full bg-white flex-col md:flex-row gap-6`,
              id: 'savedStripeCardsHeader',
            },
            buildSearchWithIcon(
              'search',
              'search',
              'text',
              'search',
              false,
              false,
              'search',
              'Search Card',
            ),
            div(
              {
                class: 'flex justify-between gap-2',
                id: 'addNewCard',
              },
              button(
                {
                  class: 'flex w-full text-white text-xl  btn btn-lg font-medium btn-primary-purple rounded-full px-6',
                  id: 'addNewStripeCard',
                },
                'Add New Card',
              ),
            ),
          );
          savedStripeCardsList = div(
            {
              class: 'w-full gap-6 flex flex-col max-h-[645px] pr-2 overflow-auto flex flex-col gap-6 pt-0 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500',
              id: 'savedStripeCardsList',
            },
          );
          // check if has saved cards and render list
          checkSavedStripeCards = getSavedStripeCardsList?.data?.data;
          const getDefaultCard = await setGetCardAsDefault();
          let defaultCard = '';
          if (getDefaultCard?.status !== 'success') throw new Error('Error getting default card');

          const postingSetupIntent = await postSetupIntent();
          if (postingSetupIntent?.status !== 'success') throw new Error('Error Setting Payment Intent');

          defaultCard = getDefaultCard?.data?.invoice_settings?.default_payment_method?.id;
          if (checkSavedStripeCards?.length > 0) {
            checkSavedStripeCards?.forEach((item) => {
              savedStripeCardsList?.append(createCardItem(item, defaultCard, isValidated));
            });
          }

          newStripeCardsWrapper = div(
            {
              class: `no-cards-wrapper ${(getSavedStripeCardsList?.status === 'success' && getSavedStripeCardsList?.data?.data?.length > 0) ? 'hidden' : ''}  flex-1 flex-col flex p-6  gap-6 w-full items-start bg-checkout`,
              id: 'newStripeCardsWrapper',
            },
            div(
              {
                class: 'flex flex-col w-full gap-2 items-start',
              },
              buildInputElement(
                'sameAsShipping',
                'Same as shipping Address',
                'radio',
                'stripeAddress',
                true,
                false,
                `mt-6 checked:bg-danaherpurple-500  ${commonShipToAddress ? '' : 'hidden'}`,
                'sameAsShipping',
              ),
              buildInputElement(
                'sameAsBilling',
                'Same as bill to Address',
                'radio',
                'stripeAddress',
                true,
                false,
                `mt-6 checked:bg-danaherpurple-500 ${invoiceToAddress ? '' : 'hidden'}`,
                'sameAsBilling',
              ),
              buildInputElement(
                'newAddress',
                'New Address',
                'radio',
                'stripeAddress',
                true,
                false,
                'mt-6 checked:bg-danaherpurple-500',
                'newAddress',
              ),
            ),
          );

          newStripeCardPaymentWrapper = div(
            {
              id: 'newStripeCardPaymentWrapper',
              class: 'bg-white w-full p-6',
            },
          );
          newStripeCardAddressWrapper = div(
            {
              id: 'newStripeCardAddressWrapper',
              class: 'bg-white w-full p-6',
            },
          );

          newStripeCardsWrapper?.querySelectorAll('label')?.forEach((item) => {
            if (item?.classList.contains('font-semibold')) {
              item?.classList?.remove('font-semibold');
            }
            item?.classList?.add('font-normal');
          });
          newStripeCardsWrapper?.querySelectorAll('label')?.forEach((item) => {
            if (item?.classList.contains('font-semibold')) {
              item?.classList?.remove('font-semibold');
            }
            item?.classList?.add('font-normal');
          });
          newStripeCardsWrapper?.querySelectorAll('.field-wrapper')?.forEach((item) => {
            if (item?.classList.contains('w-full')) {
              item?.classList.remove('w-full');
            }

            if (item?.classList.contains('w-full')) {
              item?.classList.remove('w-full');
            }
            const inputElement = item?.querySelector('input');
            if (inputElement) {
              inputElement.className = '';
              inputElement.classList.add('!mt-0', 'absolute', 'left-0');
            }
            item?.classList.add(
              'flex',
              'flex-row-reverse',
              'items-center',
              'gap-2',
            );
            const inpuLabel = item?.querySelector('label');
            if (inpuLabel?.classList.contains('font-normal')) {
              inpuLabel?.classList.remove('font-normal');
            }
            if (inpuLabel?.classList.contains('text-sm')) {
              inpuLabel?.classList.remove('text-sm');
            }
            inpuLabel?.classList.add('text-base', 'font-semibold', 'ml-[-30px]', '!pl-10', 'z-10', 'relative');
          });
          if (newStripeCardsWrapper?.querySelector('#newAddress')) {
            newStripeCardsWrapper.querySelector('#newAddress').checked = true;
          }

          newStripeCardPaymentWrapper.querySelectorAll('.field-wrapper')?.forEach((fld) => {
            fld.className = '';
            const inputField = fld?.querySelector('input');
            const inputLabel = fld?.querySelector('label');
            if (inputField.id !== 'expirationDate' && inputField.id !== 'cardCvc') {
              fld.classList.add('w-full');
            }
            if (inputField.id === 'expirationDate') {
              fld.classList.add('w-[70%]');
            }
            if (inputField.id === 'cardCvc') {
              fld.classList.add('w-[30%]');
            }
            inputField?.classList?.add('outline-none');
            if (inputLabel?.classList.contains('font-semibold')) {
              inputLabel?.classList?.remove('font-semibold');
            }
            inputLabel?.classList?.add('font-normal');
          });
          const stripeCardsButtons = div(
            {
              class: 'flex justify-between w-full gap-6',
            },
          );
          // adding new card form
          newStripeCardsWrapper.append(newStripeCardAddressWrapper);
          newStripeCardsWrapper.append(newStripeCardPaymentWrapper);
          stripeCardsButtons.append(button({ class: `${getSavedStripeCardsList?.data?.data?.length > 0 ? '' : 'hidden'} w-full m-0 stripe-card-use-button text-xl border-danaherpurple-500 border-solid btn btn-lg font-medium bg-white btn-outline-primary rounded-full px-6 hover:bg-danaherpurple-500 max-w-xs`, id: 'showStripePaymentList' }, 'Back'));

          stripeCardsButtons.append(button({ 'data-customer': getSavedStripeCardsList?.data?.requestParams?.customer, class: `flex w-full text-white text-xl  btn btn-lg font-medium btn-primary-purple rounded-full px-6 ${isValidated ? '' : 'hidden'}`, id: 'saveStripeCard' }, 'Save Card'));

          newStripeCardsWrapper.append(stripeCardsButtons);
          stripeCardsContainer.textContent = '';
          stripeCardsContainer.append(newStripeCardsWrapper);

          // adding saved cards header and list
          savedStripeCardsWrapper.append(savedStripeCardsHeader);
          // add saved stripe cards list

          savedStripeCardsWrapper.append(savedStripeCardsList);
          stripeCardsContainer.append(savedStripeCardsWrapper);
          getPI = getSavedStripeCardsList;
          if (getPI?.status === 'success') {
            if (postingSetupIntent?.status === 'success') {
              const postSIData = postingSetupIntent?.data || '';
              const clientSecret = postSIData?.client_secret || '';

              if (!clientSecret) throw new Error('Error Loading Payment Method.');

              if (clientSecret) {
                const appearance = {
                  theme: 'stripe',
                  variables: {
                    colorPrimary: '#7523FF',
                    colorBackground: '#ffffff',
                    colorText: '#4b5563',
                    colorDanger: '#df1b41',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    spacingUnit: '4px',
                    borderRadius: '4px',
                  },
                  rules: {
                    '.AccordionItem': {
                      border: 'none',
                      boxShadow: 'none',
                      paddingLeft: '0',
                      paddingRight: '0',
                    },
                  },
                };
                addressOptions = {
                  mode: 'billing', display: {}, blockPoBox: true, fields: { phone: 'always' },
                };
                mountStripeElements({
                  stripe,
                  clientSecret,
                  appearance,
                  paymentWrapper: newStripeCardPaymentWrapper,
                  addressWrapper: newStripeCardAddressWrapper,
                  options,
                });
              }
            }
          }

          // show new cards wrapper when clicked add new card
          savedStripeCardsHeader?.querySelector('#addNewStripeCard')?.addEventListener('click', async () => {
            sessionStorage.setItem('selectedStripeMethod', 'newCard');
            const newAddressCheckbox = document.querySelector('#newAddress');
            if (newAddressCheckbox) newAddressCheckbox.checked = true;
            const savedCardsHeader = document.querySelector('#savedStripeCardsHeader');
            const savedCardList = document.querySelector('#savedStripeCardsList');
            const getStripeCardsWrapper = document.querySelector('#newStripeCardsWrapper');
            if (getStripeCardsWrapper?.classList.contains('hidden')) {
              getStripeCardsWrapper.classList.remove('hidden');
            }
            // getStripeCardsWrapper?.append(checkoutSkeleton());
            savedCardsHeader.classList.add('hidden');
            savedCardList.classList.add('hidden');
            const newPostingSetupIntent = await postSetupIntent();
            if (newPostingSetupIntent?.status !== 'success') throw new Error('Error Setting Payment Intent');

            const newPostSIData = newPostingSetupIntent?.data || '';
            const newClientSecret = newPostSIData?.client_secret || '';
            if (!newClientSecret) throw new Error('Error Loading Payment Method.');
            const appearance = {
              theme: 'stripe',
              variables: {
                colorPrimary: '#7523FF',
                colorBackground: '#ffffff',
                colorText: '#4b5563',
                colorDanger: '#df1b41',
                fontFamily: 'Inter, system-ui, sans-serif',
                spacingUnit: '4px',
                borderRadius: '4px',
              },
              rules: {
                '.AccordionItem': {
                  border: 'none',
                  boxShadow: 'none',
                  paddingLeft: '0',
                  paddingRight: '0',
                },
              },
            };
            addressOptions = {
              mode: 'billing', display: {}, blockPoBox: true, fields: { phone: 'always' },
            };
            mountStripeElements({
              stripe,
              newClientSecret,
              appearance,
              paymentWrapper: newStripeCardPaymentWrapper,
              addressWrapper: newStripeCardAddressWrapper,
              options,
            });
          });
          // show payment methods list
          newStripeCardsWrapper?.querySelector('#showStripePaymentList')?.addEventListener('click', () => {
            sessionStorage.setItem('selectedStripeMethod', 'savedCard');
            const savedCardsHeader = document.querySelector('#savedStripeCardsHeader');
            const savedCardList = document.querySelector('#savedStripeCardsList');
            const getStripeCardsWrapper = document.querySelector('#newStripeCardsWrapper');
            getStripeCardsWrapper.classList.add('hidden');
            if (savedCardsHeader?.classList.contains('hidden')) {
              savedCardsHeader.classList.remove('hidden');
            }
            if (savedCardList?.classList.contains('hidden')) {
              savedCardList.classList.remove('hidden');
            }
          });

          // set default payment
          savedStripeCardsList?.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
              const allPaymentCards = savedStripeCardsList.querySelectorAll('.payment-card-wrapper');
              const currentTarget = e.target;
              if (currentTarget.textContent === 'Selected Card') return false;
              if (currentTarget?.classList.contains('stripe-card-remove-button')) {
                const pMId = currentTarget.id;
                if (pMId) {
                  showPreLoader();
                  const response = await removeCard(pMId);
                  removePreLoader();
                  if (response?.status === 'success') {
                    savedStripeCardsList.querySelector(`#card${pMId}`)?.remove();
                    showNotification('Card removed successfully', 'success');
                  } else {
                    throw new Error('Error removing card');
                  }
                }
              }
              if (currentTarget?.classList.contains('stripe-card-use-button')) {
                const pMId = currentTarget.id;
                if (pMId) {
                  showPreLoader();
                  const settingUseCard = await setUseCard(pMId);

                  if (settingUseCard?.status !== 'success') {
                    const selectedData = {
                      name: 'SelectedPM',
                      value: JSON.stringify({
                        id: pMId,
                        type: 'Card',
                      }),
                      type: 'String',
                    };
                    const updateCard = await addCardToOrder(selectedData);
                    if (updateCard?.status !== 'success') throw new Error('Error processing request');
                    await updateBasketDetails();
                  }
                  sessionStorage.setItem('useStripeCardId', pMId);

                  allPaymentCards.forEach((method) => {
                    if (method?.classList.contains('border-danaherpurple-500')) {
                      method.classList.remove('border-danaherpurple-500');
                    }
                    const methodUseButton = method.querySelector('button');
                    if (methodUseButton) {
                      methodUseButton.textContent = 'Use Card';
                      methodUseButton.classList.remove('btn-primary-purple', 'hover:bg-danaherpurple-800');
                      methodUseButton.classList.add('bg-white', 'btn-outline-primary');
                    }
                  });
                  savedStripeCardsList?.querySelector(`#card${pMId}`)?.classList.add('border-danaherpurple-500');
                  currentTarget.textContent = 'Selected Card';
                  currentTarget.classList.add('btn-primary-purple', 'hover:bg-danaherpurple-800');
                  currentTarget.classList.remove('bg-white', 'btn-outline-primary');
                  await updateBasketDetails();
                  removePreLoader();
                  showNotification('Setup to use for current order.', 'success');
                }
              }
              let targetCheckbox;
              let checkboxId;

              // If label clicked, find associated checkbox
              if (currentTarget.tagName === 'LABEL') {
                checkboxId = currentTarget.getAttribute('for');
                targetCheckbox = document.getElementById(checkboxId);
              }
              // If checkbox clicked directly
              if (currentTarget.name === 'defaultStripeCard') {
                targetCheckbox = currentTarget;
              }
              if (!targetCheckbox) return false;

              if (targetCheckbox) {
                showPreLoader();
                // eslint-disable-next-line prefer-destructuring
                const value = targetCheckbox.value;
                const setAsDefault = await setGetCardAsDefault(value);
                if (setAsDefault?.status !== 'success') throw new Error('Error processing request');
                allPaymentCards.forEach((method) => {
                  const methodCheckbox = method.querySelector('input[name="defaultStripeCard"]');
                  const methodCheckboxLabel = methodCheckbox.nextElementSibling;
                  if (methodCheckboxLabel) {
                    methodCheckboxLabel.textContent = 'Make this my default payment';
                  }
                  if (methodCheckbox) {
                    methodCheckbox.checked = false;
                  }
                });
                const targetLabel = targetCheckbox.nextElementSibling;
                if (targetLabel) {
                  targetLabel.textContent = 'Default Payment';
                }
                targetLabel?.classList.add('pointer-events-none');
                targetCheckbox.checked = true;

                targetCheckbox.dispatchEvent(
                  new Event('input', { bubbles: true }),
                );
                removePreLoader();
                showNotification('Setup as default payment method.', 'success');
              }
              return true;
            } catch (error) {
              scrollViewToTop();
              removePreLoader();
              showNotification(error.message, 'error');
              return false;
            }
          });

          handleCardSearch(savedStripeCardsHeader, checkSavedStripeCards, savedStripeCardsList);
        }
        if (pm?.id?.toLowerCase() === 'invoice' && !isValidated) {
          const invoiceNumberWrapper = div(
            {
              id: 'invoiceNumberWrapper',
              class: 'flex-col flex p-6 w-full items-start bg-checkout hidden',
            },
          );
          invoiceNumberWrapper.append(invoiceNumber);
          invoiceWrapper.innerHTML = '';
          invoiceWrapper = div(
            {
              id: `paymentMethod${pm?.id}`,
              class:
                `border-solid border-gray-300 flex flex-col gap-6 items-start p-4 border-2 ${ind > 0 ? 'border-t-0 ' : ''} items-start`,
            },
            buildInputElement(
              pm?.id,
              pm?.displayName,
              'radio',
              'paymentMethod',
              false,
              false,
              'mt-6',
              pm?.id,
            ),
          );
          invoiceWrapper.append(invoiceNumberWrapper);
          paymentMethodsWrapper?.append(invoiceWrapper);
        }
      } catch (error) {
        scrollViewToTop();
        showNotification(error.message, 'error');
      }
    });

    if (allPaymentMethods?.data?.length > 0) {
      if (paymentMethodsWrapper?.classList.contains('hidden')) {
        paymentMethodsWrapper.classList.remove('hidden');
      }
      paymentMethodsWrapper
        ?.querySelectorAll('.field-wrapper')
        ?.forEach((inp) => {
          if (inp?.classList.contains('w-full')) {
            inp?.classList.remove('w-full');
          }
          const inputElement = inp?.querySelector('input');
          if (inputElement) {
            inputElement.className = '';
            inputElement.classList.add('!mt-0', 'absolute', 'left-0');
          }
          inp?.classList.add(
            'flex',
            'flex-row-reverse',
            'items-center',
            'gap-2',
          );
          const inpuLabel = inp?.querySelector('label');
          if (inpuLabel?.classList.contains('font-normal')) {
            inpuLabel?.classList.remove('font-normal');
          }
          if (inpuLabel?.classList.contains('text-sm')) {
            inpuLabel?.classList.remove('text-sm');
          }
          inpuLabel?.classList.add('text-base', 'font-semibold', 'ml-[-30px]', '!pl-10', 'z-10', 'relative');
        });
      decorateIcons(stripeCardsWrapper);

      paymentMethodsWrapper?.addEventListener('click', async (c) => {
        try {
          // if (!stripeElements) throw new Error('Error Loading payment methods.');
          let targetRadio;
          let targetRadioId;
          let targetFrom;

          const eventTarget = c.target;
          // If label clicked, find associated radio
          if (eventTarget.matches('label')) {
            const radioId = eventTarget.getAttribute('for');
            targetRadio = document.getElementById(radioId);
            targetRadioId = radioId;
            targetFrom = 'label';
          }
          // If radio clicked directly
          if (eventTarget.matches('input[type="radio"]')) {
            targetRadio = eventTarget;
            targetFrom = 'radio';
            targetRadioId = eventTarget.id;
          }
          // check if radio input available
          if (!targetRadio) {
            return;
          }
          const getInvoiceNumberWrapper = paymentMethodsWrapper.querySelector('#invoiceNumberWrapper');
          const getStripeCardsWrapper = paymentMethodsWrapper.querySelector('#stripeCardsContainer');

          // this is for selecting invoice payment method
          if (targetRadioId.toLowerCase() === 'invoice') {
            if (getInvoiceNumberWrapper?.classList?.contains('hidden')) {
              getInvoiceNumberWrapper?.classList?.remove('hidden');
            }
            getStripeCardsWrapper?.classList?.add('hidden');
            if (targetFrom === 'label') targetRadio.checked = true;
          }
          // this is for selecting stripe payment method
          if (targetRadioId === 'STRIPE_PAYMENT') {
            if (getStripeCardsWrapper?.classList?.contains('hidden')) {
              getStripeCardsWrapper?.classList?.remove('hidden');
            }
            getInvoiceNumberWrapper?.classList?.add('hidden');
            if (targetFrom === 'label') targetRadio.checked = true;

            if (!(getSavedStripeCardsList?.data?.data?.length > 0)) {
              const newAddressCheckbox = document.querySelector('#newAddress');
              if (newAddressCheckbox) newAddressCheckbox.checked = true;
            }
          }

          if (targetRadioId === 'sameAsShipping' || targetRadioId === 'sameAsBilling') {
            let basketAddressData;

            if (targetRadioId === 'sameAsShipping') {
              if (targetFrom === 'label') targetRadio.checked = true;
              newStripeCardAddressWrapper?.classList.add('hidden');
              basketAddressData = basketData?.included?.commonShipToAddress?.[commonShipToAddress];
            }
            if (targetRadioId === 'sameAsBilling') {
              if (targetFrom === 'label') targetRadio.checked = true;
              newStripeCardAddressWrapper?.classList.add('hidden');

              basketAddressData = basketData?.included?.invoiceToAddress[invoiceToAddress];
            }
            const defaultData = {
              name: `${basketAddressData?.firstName} ${basketAddressData?.lastName}`,
              address: {
                line1: basketAddressData?.addressLine1,
                line2: basketAddressData?.addressLine2,
                city: basketAddressData?.city,
                state: basketAddressData?.mainDivisionCode,
                postal_code: basketAddressData?.postalCode,
                country: basketAddressData?.countryCode,
              },
            };

            addressElements?.destroy();

            addressOptions = {
              mode: 'billing', display: {}, blockPoBox: true, fields: { phone: 'always' }, defaultValues: defaultData,
            };
            if (newStripeCardAddressWrapper && stripeElements) {
              // mount address elements
              addressElements = stripeElements.create('address', addressOptions);
              addressElements.mount('#newStripeCardAddressWrapper');
            }
          }
          if (targetRadioId === 'newAddress') {
            if (targetFrom === 'label') targetRadio.checked = true;
            if (newStripeCardAddressWrapper?.classList.contains('hidden')) {
              newStripeCardAddressWrapper?.classList.remove('hidden');
            }

            addressOptions = {
              mode: 'billing',
              display: {},
              blockPoBox: true,
              fields: { phone: 'always' },
              defaultValues: {
                name: '',
                phone: '',
                address: {
                  line1: '',
                  line2: '',
                  city: '',
                  state: '',
                  postal_code: '',
                  country: '',
                },
              },
            };
            addressElements?.destroy();
            addressElements = stripeElements.create('address', addressOptions);
            addressElements.mount('#newStripeCardAddressWrapper');
          }
        } catch (error) {
          scrollViewToTop();
          showNotification(error.message, 'error');
        }
      });
    } else if (paymentMethodsWrapper) {
      if (paymentMethodsWrapper?.classList?.contains('hidden')) {
        paymentMethodsWrapper?.classList.remove('hidden');
      }
      paymentMethodsWrapper.append(h4({ class: 'text-xl text-center' }, 'No Payment method available'));
    }
    const savedCardsSearchWrapper = paymentMethodsWrapper?.querySelector('#searchWithIcon');
    if (savedCardsSearchWrapper) {
      savedCardsSearchWrapper.classList.add('max-w-xs', 'w-full');
      savedCardsSearchWrapper?.querySelector('.search-with-icon')?.classList.add('w-full');
    }
    const savedCardsSearch = paymentMethodsWrapper?.querySelector('#search');
    if (savedCardsSearch) {
      savedCardsSearch.className = 'h-10 pl-9 input-focus text-base w-full block px-2 py-4 text-gray-600  border border-solid border-gray-600 outline-none';
    }
    moduleContent?.append(moduleHeader, paymentMethodsWrapper);
    decorateIcons(moduleContent);
    return moduleContent;
  } catch (error) {
    scrollViewToTop();
    showNotification(error.message, 'error');
    if (error.message === 'Unauthorized Access') {
      window.location.href = window.EbuyConfig?.cartPageUrl;
    }
    if (error.message === 'Invalid Basket') {
      window.location.href = window.EbuyConfig?.addressPageUrl;
    }
    return false;
  }
};
export function getStripeInstance() {
  return stripe;
}
export function getStripeElements() {
  return stripeElements;
}
export function getPaymentMethodType() {
  return paymentMethodType;
}
export default paymentModule;
