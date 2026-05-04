import type { Configuration } from '@azure/msal-browser'

const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_APP_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_APP_TENANT_ID}`,
    navigateToLoginRequestUrl: true,
    redirectUri: import.meta.env.VITE_APP_REDIRECT_URL,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
}

const loginRequest = {
  scopes: ['User.Read'],
}

export { loginRequest, msalConfig }
