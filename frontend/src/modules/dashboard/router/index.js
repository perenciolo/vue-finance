import financesRoutes from '@/modules/dashboard/modules/finances/router'

const Dashboard = () => import('@/modules/dashboard/views/Dashboard.vue')

export default [
  {
    path: '/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
    children: [...financesRoutes]
  }
]
