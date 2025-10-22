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

/*
Gets the Authentication-Token for user (Customer/Guest)
*/
// export const getAuthenticationToken = async () => {
//   try {
//     const profileData = getCookie('ProfileData');
//     const usertype = profileData ? 'customer' : 'guest';
//     const tokenInStore = sessionStorage.getItem(`${siteID}_${env}_apiToken`);
//     const parsedToken = JSON.parse(tokenInStore);
//     if (!parsedToken) {
//       return { status: 'error', data: 'Login Session Expired.' };
//     }
//     const getCurrentBasketId = localStorage.getItem(`${siteID}_${env}_currentBasketId`);
//     const getCurrentBasketData = JSON.parse(localStorage.getItem('basketData'));
//     if (!getCurrentBasketData) {
//       setTimeout(async () => {
// eslint-disable-next-line max-len
//         await processBasket(usertype, getCurrentBasketId, true, { access_token: parsedToken.token, status: 'success' });
//       }, 3000);
//     }
//     return {
//       access_token: parsedToken.token,
//       user_type: usertype,
//       user_data: profileData,
//     };
//   } catch (error) {
//     return { status: 'error', data: error.message };
//   }
// };

export const getAuthenticationToken = async () => {
  try {
    if (getCookie(`eb_${siteID}_${env}_apiToken`)) {
      return {
        access_token: getCookie(`eb_${siteID}_${env}_apiToken`),
        user_type: getCookie(`${siteID}_${env}_user_type`),
        user_data: JSON.stringify(getCookie(`${siteID}_${env}_user_data`)),
      };
    }
    return { status: 'error', data: 'Login Session Expired.' };
  } catch (error) {
    return { status: 'error', data: error.message };
  }
};

/*
Gets the Authentication-Token for user (Customer/Guest)
*/
export const setAuthenticationToken = (tokenData, loginData, type) => {
  try {
    deleteCookie(`eb_${siteID}_${env}_apiToken`);
    deleteCookie(`${siteID}_${env}_user_data`);
    deleteCookie(`${siteID}_${env}_user_type`);
    deleteCookie('first_name');
    deleteCookie('last_name');
    deleteCookie('rationalized_id');
    sessionStorage.setItem(`eb_${siteID}_${env}_apiToken`, tokenData.access_token, tokenData.expires_in);
    setCookie(`eb_${siteID}_${env}_apiToken`, tokenData.access_token);
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
