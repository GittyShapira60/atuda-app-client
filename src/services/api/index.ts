import { ServerRequestObject } from '@/interfaces/ServerRequestObject'

import { AxiosError, AxiosResponse } from 'axios'
import { ref } from 'vue'
import { axiosInstance } from '../axios'

export let errorMessage = ref('')

export class ApiService {
  get = async (path = '', params = {}) => {
    if (Object.keys(params).length !== 0) {
      const query = Object.entries(params)
        .map(([key, value]) => `${value}`)
        .join('/')
      path = path + `/${query}`
    }
    return await axiosInstance
      .get(`${path}`, { withCredentials: true })
      .then((response: AxiosResponse) => {
        errorMessage.value = ''
        return response
      })
      .catch((error: AxiosError) => {
        errorMessage.value = error.status
          ? error.status.toString()
          : error.message
        return error
      })
  }

  post = async (path = '', request: ServerRequestObject) => {
    return await axiosInstance
      .post(`${path}`, request)
      .then((response: AxiosResponse) => {
        errorMessage.value = ''
        return response
      })
      .catch((error: AxiosError) => {
        errorMessage.value = error.status
          ? error.status.toString()
          : error.message
        throw error
      })
  }
}
