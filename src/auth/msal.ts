import * as msal from '@azure/msal-browser'
import { msalConfig } from './authConfig'

const msalInstance = new msal.PublicClientApplication(msalConfig)

async function acquireMyIDFToken() {
  const accounts = msalInstance.getAllAccounts()
  if (accounts?.length > 0) {
    try {
      return await msalInstance.acquireTokenSilent({
        account: accounts[0],
        scopes: [],
      })
    } catch (error) {
      await msalInstance.acquireTokenRedirect({
        scopes: [],
      })
    }
  }
  return null
}

const getConnectedAuthorityObject = async () => {
  await msalInstance.initialize()
  let authorityObject = await msalInstance.handleRedirectPromise()
  if (!authorityObject) authorityObject = await acquireMyIDFToken()
  return authorityObject
}

const getConnectedAccount = async () => {
  const authorityObject = await getConnectedAuthorityObject()
  const accounts = msalInstance.getAllAccounts()

  if (authorityObject && accounts[0] !== undefined) {
    const account = accounts[0]

    return { account, authorityObject }
  }
  return { account: null, authorityObject: null }
}

export { getConnectedAccount, msalInstance }
