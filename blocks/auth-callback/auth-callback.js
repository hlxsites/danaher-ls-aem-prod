import { userLogin } from '../../scripts/auth-utils.js';
import { initAuth0, getIdToken } from '../../scripts/auth.js';

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

export default async function decorate(block) {
  block.innerHTML = '<p>Signing you in...</p>';

  try {
    const auth0Client = await initAuth0();
    const result = await auth0Client.handleRedirectCallback();
    const idToken = await getIdToken();
    sessionStorage.setItem(
      `${window.DanaherConfig?.siteID}_${env}_apiToken`,
      JSON.stringify({ access_token: idToken }),
    );
    await userLogin('customer', idToken);
    const target = result?.appState?.returnTo || '/';
    window.location.href = target;
  } catch (err) {
    block.innerHTML = '<p>Authentication failed. Please refresh or try again.</p>';
  }
}
