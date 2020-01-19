const RecordsAdd = () =>
  import('@/modules/dashboard/modules/finances/views/RecordsAdd.vue')
const RecordsHome = () =>
  import('@/modules/dashboard/modules/finances/views/RecordsHome.vue')

export default [
  {
    path: 'records/add',
    name: 'recordsAdd',
    meta: { requiresAuth: true },
    component: RecordsAdd
  },
  {
    path: 'records',
    component: RecordsHome,
    meta: { requiresAuth: true },
    alias: ['home', '']
  }
]
