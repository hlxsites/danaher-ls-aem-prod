// eslint-disable-next-line import/no-cycle
import { getCookie, setCookie } from './scripts.js';
// eslint-disable-next-line import/no-cycle

import { getIdToken, getExpiryTime } from './auth.js';

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

export const getAuthenticationToken = async () => {
  try {
    const idToken = await getIdToken();
    const expiryTime = await getExpiryTime();
    if (idToken) {
      return {
        access_token: idToken,
        user_type: 'customer',
        user_data: JSON.stringify(getCookie(`${siteID}_${env}_user_data`)),
        expiry_time: expiryTime,
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
    sessionStorage.setItem(`eb_${siteID}_${env}_apiToken`, tokenData.access_token);
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
