import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/catalog',
      name: 'catalog',
      component: () => import('../views/CatalogView.vue'),
    },
    {
      path: '/catalog/specialist/:id',
      name: 'catalogSpecialist',
      component: () => import('../views/CatalogSpecialistView.vue'),
      props: true,
    },
    {
      path: '/planner',
      name: 'planner',
      component: () => import('../views/PlannerView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/tenders',
      name: 'tenders',
      component: () => import('../views/TendersView.vue'),
    },
    {
      path: '/tenders/:id',
      name: 'tenderDetails',
      component: () => import('../views/TenderDetailsView.vue'),
      props: true,
    },
    {
      path: '/real-weddings',
      name: 'realWeddings',
      component: () => import('../views/RealWeddingsView.vue'),
    },
    {
      path: '/articles',
      name: 'articles',
      component: () => import('../views/ArticlesView.vue'),
    },
    // {
    //   path: '/login',
    //   name: 'login',
    //   component: () => import('../views/LoginView.vue'),
    // },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true, userType: 'couple' }
    },
    {
      path: '/specialist-profile',
      name: 'specialistProfile',
      component: () => import('../views/SpecialistProfileView.vue'),
      meta: { requiresAuth: true, userType: 'specialist' }
    },
  ],
})

// Navigation guard to redirect based on user role
router.beforeEach(async (to, from, next) => {
  // Check if the route being accessed requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const authStore = useAuthStore()
    
    // If not logged in, allow navigation (components handle showing the login modal)
    if (!authStore.isLoggedIn) {
      next()
      return
    }

    // Special case for profile routes: direct path redirect regardless of meta
    if (to.path === '/profile') {
      // Make sure we have user data for role-based routing
      if (authStore.token && !authStore.user) {
        try {
          console.log('Загрузка данных пользователя для профиля...')
          await authStore.fetchCurrentUser()
        } catch (error) {
          console.error('Ошибка при загрузке профиля:', error)
        }
      }
      
      // Force specialist users to their specific profile URL
      if (authStore.user?.user_type === 'specialist') {
        console.log('Перенаправление специалиста на /specialist-profile', authStore.user)
        next({ path: '/specialist-profile' })
        return
      }
    }
    
    // Redirect couple users to regular profile
    if (to.path === '/specialist-profile' && authStore.user?.user_type === 'couple') {
      next({ path: '/profile' })
      return
    }

    // Prevent specialists from accessing planner
    if (to.path === '/planner' && authStore.user?.user_type === 'specialist') {
      next({ path: '/' })
      return
    }
  }

  // For all other cases, allow the navigation
  next()
})

export default router
