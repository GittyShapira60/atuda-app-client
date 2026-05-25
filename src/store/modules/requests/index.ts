import { ServerRequestObject } from '@/interfaces/ServerRequestObject'
import {
  apiService,
  ErrorExecutingRequest,
  performRequest,
} from '../../utils/index'

const path = '/requests'

const state = () => ({
  response: null,
  status: 200,
  message: '',
  error: false,
  loading: false,
})

const getters = {}

const actions = {
  async create(
    { commit }: { commit: (type: string, payload: any) => void },
    request: ServerRequestObject,
  ) {
    if (request && Object.values(request).every((value) => value !== '')) {
      await performRequest(
        commit,
        () => apiService.post(path, request),
        'setResponse',
        'Sending the request to the server was successful',
        'Sending the request to the server was rejected!',
      )
    } else ErrorExecutingRequest(commit, 'Data cannot be empty')
  },
  async addFiles(
    { commit }: { commit: (type: string, payload: any) => void },
    payload: { requestId: string; requestDetails: any },
  ) {
    const { requestId, requestDetails } = payload || ({} as any)
    if (!requestId) return ErrorExecutingRequest(commit, 'requestId is missing')
    if (!requestDetails)
      return ErrorExecutingRequest(commit, 'requestDetails is missing')

    await performRequest(
      commit,
      () => apiService.post(`${path}/${requestId}/files`, requestDetails),
      'setResponse',
      'Uploading files was successful',
      'Uploading files was rejected!',
    )
  },
  
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
