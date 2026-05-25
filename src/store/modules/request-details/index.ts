import {
  apiService,
  ErrorExecutingRequest,
  performRequest,
} from '../../utils/index'

const path = '/request-details'

const state = () => ({
  response: null,
  requestsDetails: [],
  status: 200,
  message: '',
  error: false,
  loading: false,
})

const getters = {}

const actions = {
  async get(
    { commit }: { commit: (type: string, payload: any) => void },
    requestId: { requestId: string },
  ) {
    if (requestId && Object.values(requestId).every((value) => value !== '')) {
      await performRequest(
        commit,
        () => apiService.get(path, requestId),
        'setResponse',
        'Sending the request to the server was successful',
        'Sending the request to the server was rejected!',
      )
    } else {
      ErrorExecutingRequest(commit, 'requestId cannot be empty')
    }
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
