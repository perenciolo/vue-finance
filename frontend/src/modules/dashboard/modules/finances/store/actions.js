import * as types from '@/modules/dashboard/modules/finances/store/mutation-types'

export default {
  setFilters({ commit }, payload) {
    commit(types.SET_FILTERS, payload)
  },
  setMonth({ commit }, payload) {
    commit(types.SET_MONTH, payload)
  }
}
