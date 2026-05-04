import { createStore } from 'vuex'
import requestDetails from './modules/request-details/index'
import requestTypes from './modules/request-types/index'
import requestsStages from './modules/requests-stages/index'
import requests from './modules/requests/index'
import soldier from './modules/soldier/index'

export default createStore({
  modules: {
    requests,
    requestsStages,
    requestTypes,
    requestDetails,
    soldier,
  },
})
