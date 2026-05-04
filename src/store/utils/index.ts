import { ApiService } from '../../services/api/index'

export const apiService = new ApiService()

export async function performRequest(
  commit: (type: string, payload: any) => void,
  request: () => Promise<any>,
  setData: any,
  successMessage: string,
  errorMessagePrefix: string,
) {
  commit('setLoading', true)
  try {
    const res = await request()
    commit(setData, res.data)
    commit('setStatus', res.status)
    commit('setMessage', successMessage)
    commit('setError', false)
    commit('setLoading', true)
  } catch (error) {
    commit('setError', true)
    commit('setMessage', `${errorMessagePrefix}`)
  } finally {
    commit('setLoading', false)
  }
}

export function ErrorExecutingRequest(
  commit: (type: string, payload: any) => void,
  errorMessage: string,
) {
  commit('setError', true)
  commit('setStatus', 400)
  commit('setMessage', `${errorMessage}`)
  commit('setLoading', false)
}
