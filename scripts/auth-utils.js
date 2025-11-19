import { div, span } from './dom-builder.js';
import { postApiData, getApiData } from './api-utils.js';
// eslint-disable-next-line import/no-cycle
import { getCommerceBase } from './commerce.js';
import {
  showPreLoader,
  createModal,
} from './common-utils.js';
import { setAuthenticationToken } from './token-utils.js';
import { getBasketDetails } from './cart-checkout-utils.js';
import { getIdToken, logout } from './auth.js';

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
const baseURL = getCommerceBase(); // base url for the intershop api calls

/*

 Login the user (Customer/Guest)

*/
async function getUserData(token) {
  try {
    const defaultHeader = new Headers({
      'Authentication-Token': token,
    });
    const userCustomerData = await getApiData(
      `${baseURL}/customers/-`,
      defaultHeader,
    );
    if (userCustomerData?.status === 'success') {
      const userData = await getApiData(
        `${baseURL}/customers/-/users/-`,
        defaultHeader,
      );
      if (userData?.status === 'success') {
        return {
          status: 'success',
          data: {
            customerData: userCustomerData.data,
            userData: userData.data,
          },
        };
      }
      return { status: 'error', data: 'User Not found.' };
    }
    return { status: 'error', data: 'User Not found.' };
  } catch (error) {
    return { status: 'error', data: error.message };
  }
}
/*

 Register the user (Customer)

*/
export async function userRegister(data = {}) {
  showPreLoader();
  try {
    let dataObject = {};
    if (data) {
      dataObject = {
        isBusinessCustomer: 'true',
        customerNo: data.userName,
        companyName: data.companyName,
        user: {
          title: ' ',
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.userName,
          businessPartnerNo: data.userName,
          preferredLanguage: 'en_US',
        },
        credentials: {
          login: data.userName,
          password: data.password,
        },
      };
    }
    // eslint-disable-next-line
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const userRegistered = await postApiData(
      `${baseURL}/customers`,
      JSON.stringify(dataObject),
      headers,
    );
    if (userRegistered?.status === 'success') {
      return userRegistered;
    }
    return {
      status: 'error',
      data: 'Error Registration. Please try again.',
    };
  } catch (error) {
    return { status: 'error', data: error.message };
  }
}
/*

 Login the user (Customer/Guest)

*/
export async function userLogin(type, data = {}, source = '') {
  if (!source) showPreLoader();
  let loginData = {};
  const getCurrentBasketData = JSON.parse(localStorage.getItem('basketData'));
  localStorage.removeItem(`${siteID}_${env}_currentBasketId`);
  localStorage.removeItem('productDetailObject');
  localStorage.removeItem('basketData');
  localStorage.removeItem('orderSubmitDetails');
  localStorage.removeItem('cartItemsDetails');
  localStorage.removeItem('useAddress');
  localStorage.removeItem('shippingMethods');
  localStorage.removeItem('discountDetails');
  localStorage.removeItem('submittedOrderData');
  localStorage.removeItem('alsoBoughtCachedProducts');

  let lastBasketId = '';
  if (getCurrentBasketData?.status === 'success' && !getCurrentBasketData?.data?.data?.customer) {
    lastBasketId = getCurrentBasketData?.data?.data?.id;
  }
  try {
    if (type === 'customer' && data) {
      loginData = {
        username: data.userName,
        password: data.password,
        grant_type: 'password',
        checkoutType: 'customer',
      };
    } else {
      loginData = {
        grant_type: 'anonymous',
        checkoutType: 'guest',
      };
    }
    // eslint-disable-next-line
    const grant_type = type === "customer" ? "password" : "anonymous";
    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Accept', 'application/json');
    const urlencoded = new URLSearchParams();
    urlencoded.append('grant_type', grant_type);
    // eslint-disable-next-line
    if (grant_type === "password") {
      urlencoded.append('scope', 'openid+profile');
      urlencoded.append('username', loginData.username);
      urlencoded.append('password', loginData.password);
    }
    try {
      let userInfoData = {};
      const auth0Token = await getIdToken();
      if (auth0Token) {
        const userLoggedInData = await getUserData(
          auth0Token,
        );
        if (userLoggedInData.status === 'success') {
          userInfoData = userLoggedInData.data;
        }
        setAuthenticationToken({ access_token: auth0Token }, userInfoData, type);
        return;
      }
      const userLoggedIn = await postApiData(
        `${baseURL}/token`,
        urlencoded,
        headers,
      );
      if (userLoggedIn?.status === 'success') {
        if (type !== 'guest') {
          const userLoggedInData = await getUserData(
            userLoggedIn?.data?.access_token,
          );
          if (userLoggedInData.status === 'success') {
            userInfoData = userLoggedInData.data;
          }
        }
        setAuthenticationToken(userLoggedIn.data, userInfoData, type);
        /*
       get the basket details and create if doen't exists
    */
        if (type !== 'guest') {
          const basketData = await getBasketDetails(type, lastBasketId, source);
          if (basketData?.status === 'success') {
            localStorage.setItem(`${siteID}_${env}_currentBasketId`, basketData?.data?.data?.id);
          }
        }
        return userLoggedIn;
      }
      return { status: 'error', data: userLoggedIn.data };
    } catch (error) {
      return { status: 'error', data: error.message };
    }
  } catch (error) {
    return { status: 'error', data: error.message };
  }
}
/*

function to remove session preloader whenever required

*/
export function removeSessionPreLoader() {
  setTimeout(() => {
    const sessionPreLoaderContainer = document.querySelector('#sessionPreLoader');
    sessionPreLoaderContainer?.remove();
  }, 1000);
}

/*

 creates a preloader for expired login session (animation)

 */
export function sessionPreLoader() {
  const sessionPreLoaderContent = div(
    {
      class:
        'text-center flex flex-col w-full relative h-24 justify-center items-center ',
      id: 'sessionPreLoader',
    },
    span(
      {
        class: 'text-red-500',
      },
      'Session Expired. Please login to continue.',
    ),
    span(
      {
        id: 'tempLoginButton',
        class: 'mt-6 text-green-500 font-bold cursor-pointer',
      },
      'Login Again',
    ),
  );
  return createModal(sessionPreLoaderContent, true, true);
}
/*

 Logout the user (Customer/Guest)

*/
function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
export async function userLogOut() {
  deleteCookie(`eb_${siteID}_${env}_apiToken`);
  deleteCookie(`${siteID}_${env}_user_data`);
  deleteCookie(`${siteID}_${env}_user_type`);
  deleteCookie('first_name');
  deleteCookie('last_name');
  deleteCookie('rationalized_id');
  sessionStorage.clear();
  localStorage.removeItem(`${siteID}_${env}_currentBasketId`);
  localStorage.removeItem('productDetailObject');
  localStorage.removeItem('basketData');
  localStorage.removeItem('orderSubmitDetails');
  localStorage.removeItem('cartItemsDetails');
  localStorage.removeItem('useAddress');
  localStorage.removeItem('shippingMethods');
  localStorage.removeItem('discountDetails');
  localStorage.removeItem('submittedOrderData');
  localStorage.removeItem('alsoBoughtCachedProducts');
  await logout();
}
