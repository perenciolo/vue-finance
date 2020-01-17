const RecordsHome = () =>
  import('@/modules/dashboard/modules/finances/views/RecordsHome.vue')

export default [
  {
    path: 'records',
    component: RecordsHome,
    meta: { requiresAuth: true },
    alias: ['home', '']
  }
]
