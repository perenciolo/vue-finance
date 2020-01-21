const RecordsAdd = () =>
  import('@/modules/dashboard/modules/finances/views/RecordsAdd.vue')
const RecordsHome = () =>
  import('@/modules/dashboard/modules/finances/views/RecordsHome.vue')
const ReportsHome = () =>
  import('@/modules/dashboard/modules/finances/views/ReportsHome.vue')

export default [
  {
    path: 'records/add',
    name: 'recordsAdd',
    meta: { requiresAuth: true },
    component: RecordsAdd
  },
  {
    path: 'records',
    name: 'home',
    component: RecordsHome,
    meta: { requiresAuth: true },
    alias: ['home', '']
  },
  {
    path: 'reports',
    component: ReportsHome,
    meta: { requiresAuth: true }
  }
]
