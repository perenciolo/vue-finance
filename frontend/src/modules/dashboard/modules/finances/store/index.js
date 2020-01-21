import actions from '@/modules/dashboard/modules/finances/store/actions'
import mutations from '@/modules/dashboard/modules/finances/store/mutations'

const INITIAL_STATE = {
  filters: null,
  isFiltering: false,
  month: null
}

export default {
  namespaced: true,
  state: INITIAL_STATE,
  actions,
  mutations
}
