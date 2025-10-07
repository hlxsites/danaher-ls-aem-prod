// eslint-disable-next-line import/no-cycle
import { getCookie, setCookie } from './scripts.js';
// eslint-disable-next-line import/no-cycle

const siteID = window.DanaherConfig?.siteID;
const hostName = window.location.hostname;
let env;
if (hostName.includes('local')) {
  env = 'local';
} else if (hostName.includes('dev')) {
  env = 'dev';
} else if (hostName.includes('stage')) {
  env = 'stage';
} else {
  env = 'prod';
}
function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

async function processBasket(type, lastBasketId, source, token) {
  /*
get the basket details and create if doen't exists
*/
  // eslint-disable-next-line import/no-cycle
  const module = await import('./cart-checkout-utils.js');
  // eslint-disable-next-line prefer-destructuring
  const getBasketDetails = module.getBasketDetails;
  return getBasketDetails(type, lastBasketId, source, token);
  /*
    if (basketData.status === 'success') {
      localStorage.setItem(`${siteID}_${env}_currentBasketId`, basketData?.data?.data?.id);
      if (type !== 'guest') {
        const useAddressObject = {};
        let addressDetails = '';
        if (basketData?.data?.data?.invoiceToAddress) {
          const invoiceToAddressURI = basketData?.data?.data?.invoiceToAddress?.split(':')[4];
          addressDetails = await getAddressDetails(
            `customers/-/addresses/${invoiceToAddressURI}`, token
          );
          Object.assign(useAddressObject, {
            invoiceToAddress: addressDetails,
          });
        }
        if (basketData.data.data.commonShipToAddress) {
          const commonShipToAddressURI = basketData?.data?.data?.commonShipToAddress?.split(':')[4];
          addressDetails = await getAddressDetails(
            `customers/-/addresses/${commonShipToAddressURI}`, token
          );
          Object.assign(useAddressObject, {
            commonShipToAddress: addressDetails,
          });
        }
        sessionStorage.setItem(
          'useAddress',
          JSON.stringify({ status: 'success', data: useAddressObject }),
        );
      }
    } */
}
/*
Gets the Authentication-Token for user (Customer/Guest)
*/
export const getAuthenticationToken = async () => {
  try {
    const profileData = getCookie('ProfileData');
    const usertype = profileData ? 'customer' : 'guest';
    const tokenInStore = sessionStorage.getItem(`${siteID}_${env}_apiToken`);
    const parsedToken = JSON.parse(tokenInStore);
    if (!parsedToken) {
      return { status: 'error', data: 'Login Session Expired.' };
    }
    const getCurrentBasketId = localStorage.getItem(`${siteID}_${env}_currentBasketId`);
    const getCurrentBasketData = JSON.parse(localStorage.getItem('basketData'));
    if (!getCurrentBasketData) {
      setTimeout(async () => {
        await processBasket(usertype, getCurrentBasketId, true, { access_token: parsedToken.token, status: 'success' });
      }, 3000);
    }
    return {
      access_token: parsedToken.token,
      user_type: usertype,
      user_data: profileData,
    };
  } catch (error) {
    return { status: 'error', data: error.message };
  }
};

/*
Gets the Authentication-Token for user (Customer/Guest)
*/
export const setAuthenticationToken = (tokenData, loginData, type) => {
  try {
    deleteCookie(`${siteID}_${env}_apiToken`);
    deleteCookie(`${siteID}_${env}_user_data`);
    deleteCookie(`${siteID}_${env}_user_type`);
    deleteCookie('first_name');
    deleteCookie('last_name');
    deleteCookie('rationalized_id');
    sessionStorage.setItem(`eb_${siteID}_${env}_apiToken`, tokenData.access_token, tokenData.expires_in);
    setCookie(`${siteID}_${env}_apiToken`, tokenData.access_token);
    if (type === 'customer') {
      setCookie(`${siteID}_${env}_user_data`, JSON.stringify(loginData));
      setCookie('first_name', loginData?.userData?.firstName);
      setCookie('last_name', loginData?.userData?.lastName);
      setCookie('rationalized_id', loginData?.userData?.email);
    }
    setCookie(`${siteID}_${env}_user_type`, type === 'guest' ? 'guest' : 'customer');
    return {};
  } catch (error) {
    return { status: 'error', data: error.message };
  }
};
