const state = () => ({
  firstname: '',
  tz: '',
})

const getters = {}

const mutations = {
  setSoldierInfo(state: any, params: { firstname: string; tz: string }) {
    state.firstname = params.firstname
    state.tz = params.tz
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
}
