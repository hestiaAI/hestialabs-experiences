import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '@/views/HomeView.vue'

import experiences from '@/experiences'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/:experience',
    name: 'experience',
    // route level code-splitting
    // this generates a separate chunk (experience.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "experience" */ '../views/ExperienceView.vue'),
    beforeEnter(to, from, next) {
      if (to.params.experience in experiences) {
        return next()
      }
      // experience not found -> redirect to home
      return next('/')
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
