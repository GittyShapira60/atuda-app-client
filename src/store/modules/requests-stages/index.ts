import {
  apiService,
  ErrorExecutingRequest,
  performRequest,
} from '../../utils/index'

const path = '/requests-stages'

const state = () => ({
  response: null,
  flowOptions: null,
  stages: null,
  status: 0,
  message: '',
  error: false,
  loading: false,
})

const getters = {}

const actions = {
  async getFlowOptions(
    {
      commit,
    }: {
      commit: (type: string, payload: any) => void
    },
    params: { id: string },
  ) {
    if (params && Object.values(params).every((value) => value !== '')) {
      await performRequest(
        commit,
        () => apiService.get(path, params),
        'setFlowOptions',
        'Sending the request to the server was successful',
        'Sending the request to the server was rejected!',
      )
    } else {
      ErrorExecutingRequest(commit, 'ID cannot be empty')
    }
  },
  async getStages(
    {
      commit,
    }: {
      commit: (type: string, payload: any) => void
    },
    params: { id: string; stage: string },
  ) {
    if (params && Object.values(params).every((value) => value !== '')) {
      await performRequest(
        commit,
        () => apiService.get(path, params),
        'setStages',
        'Sending the request to the server was successful',
        'Sending the request to the server was rejected!',
      )
    } else ErrorExecutingRequest(commit, 'Params cannot be empty')
  },
}

const mutations = {
  setResponse(state: any, payload: any) {
    state.response = payload
  },
  setFlowOptions(state: any, payload: any) {
    state.flowOptions = payload
  },
  setStages(state: any, payload: any) {
    state.stages = payload
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
