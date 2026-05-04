import { ref } from 'vue'
import { useStore } from 'vuex'
import { axiosInstance, injectToken } from '../services/axios'
import { loginRequest } from './authConfig'
import { getConnectedAccount, msalInstance } from './msal'
export let statusError = ref('')

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const checkSkipLogin = async (): Promise<boolean> => {
  if (
    import.meta.env.VITE_APP_NODE !== 'dev' &&
    import.meta.env.VITE_APP_NODE !== 'preprod'
  )
    return false
  await sleep(500)
  const skipLogin = localStorage.getItem('skip_login')
  return skipLogin === 'true'
}

async function getToken(tz: string) {
  return (await axiosInstance.post('token/getToken', { tz })).data.idToken
}

const validateAuthorization = async () => {
  const store = useStore()
  try {
    const account = await validateAuth()
    if (account) {
      if (await checkSkipLogin()) {
        account['username'] =
          localStorage.getItem('username') ||
          import.meta.env.VITE_DEFAULT_USER_NAME
        account['name'] =
          localStorage.getItem('firstname') || import.meta.env.VITE_DEFAULT_NAME
        const token = await getToken(account['username'].split('@')[0])
        injectToken(token)
      }
      const checkUser = await axiosInstance.get(`/cookie`)
      const tz = account.username.split('@')[0] || null
      store.commit('soldier/setSoldierInfo', {
        firstname: account.name,
        tz: tz,
      })
      statusError.value = ''
      return checkUser.status == 200
    }
  } catch (error: any) {
    statusError.value = error.status ? error.status : error.message
    return false
  }
}

const validateAuth = async () => {
  const { account, authorityObject } = await getConnectedAccount()

  try {
    if (account && authorityObject?.idToken) {
      injectToken(authorityObject.idToken)
      return account
    } else {
      await msalInstance.loginRedirect(loginRequest)
    }
  } catch (error: any) {
    statusError.value = error.status ? error.status : error.message
    return false
  }
}

export { validateAuthorization as validateAuth }
