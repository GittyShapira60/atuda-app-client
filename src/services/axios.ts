import type { AxiosInstance } from 'axios'
import axios from 'axios'

let baseUrl: string = ''
if (import.meta.env.VITE_API_BASE_URL) {
  baseUrl = import.meta.env.VITE_API_BASE_URL
} else if (import.meta.env.PROD) {
  baseUrl = `${window.location.origin}/bakashot-api`
} else if (import.meta.env.DEV) {
  baseUrl = `http://localhost:3000/bakashot-api`
} else {
  console.error('Cannot locate api url to choose from')
}

const createAxiosInstance = (url: string): AxiosInstance => {
  return axios.create({
    baseURL: baseUrl,
    withCredentials: true,
  })
}

const axiosInstance = createAxiosInstance(baseUrl)

function injectToken(token: string) {
  axiosInstance.defaults.headers.common = {
    Authorization: `Bearer ${token}`,
  }
}

export { axiosInstance, injectToken }
