import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '@/lib/api-client'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/register'
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/dashboard/events'
        },
        {
          path: 'events',
          name: 'Events',
          component: () => import('@/views/dashboard/EventsView.vue')
        },
        {
          path: 'events/:id',
          name: 'EventDetail',
          component: () => import('@/views/dashboard/EventDetailView.vue')
        },
        // {
        //   path: 'boardroom',
        //   name: 'Boardroom',
        //   component: () => import('@/views/dashboard/BoardroomView.vue')
        // },
        // {
        //   path: 'employees',
        //   name: 'Employees',
        //   component: () => import('@/views/dashboard/EmployeesView.vue')
        // },
        // {
        //   path: 'news',
        //   name: 'News',
        //   component: () => import('@/views/dashboard/NewsView.vue')
        // },
        {
          path: ':pathMatch(.*)*',
          name: 'DashboardNotFound',
          component: () => import('@/views/dashboard/NotFoundView.vue')
        }
      ]
    },
    // {
    //   path: '/events/:id',
    //   name: 'EventDetails',
    //   component: () => import('@/views/EventDetailsView.vue'),
    //   meta: { requiresAuth: true }
    // }
  ],
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authenticated = isAuthenticated()
  
  if (to.meta.requiresAuth && !authenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && authenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
