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
  async deleteFile(
    { commit }: { commit: (type: string, payload: any) => void },
    payload: { requestId: string; detailId?: number },
  ) {
    const { requestId, detailId } = payload || ({} as any)
    if (!requestId) return ErrorExecutingRequest(commit, 'requestId is missing')
    if (!detailId ) {
      return ErrorExecutingRequest(commit, 'detailId  is required')
    }
    await performRequest(
      commit,
      () =>
        apiService.post(`${path}/${requestId}/delete`, {
          detailId,
        } as any),
      'setResponse',
      'Deleting file was successful',
      'Deleting file was rejected!',
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
