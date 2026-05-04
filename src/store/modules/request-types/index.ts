import { apiService, performRequest } from '../../utils/index'

const path = '/request-types'

const state = () => ({
  response: null,
  status: 200,
  message: '',
  error: false,
  loading: false,
})

const getters = {}

const actions = {
  async get({ commit }: { commit: (type: string, payload: any) => void }) {
    await performRequest(
      commit,
      () => apiService.get(path),
      'setResponse',
      'Sending the request to the server was successful',
      'Sending the request to the server was rejected!',
    )
  },
}

const mutations = {
  setResponse(state: any, payload: any) {
    state.response = payload
  },
  setStatus(state: any, payload: any) {
    state.status = payload
  },
  setError(state: any, payload: any) {
    state.error = payload
  },
  setMessage(state: any, payload: any) {
    state.message = payload
  },
  setLoading(state: any, payload: any) {
    state.loading = payload
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
