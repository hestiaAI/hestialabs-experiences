import Vue from 'vue'
import App from './App.vue'
import store from './store'
import DataExperience, { vuetify, i18n } from '@/main'
import VueRouter from 'vue-router'

// https://stackoverflow.com/questions/40816966/how-to-use-vue-router-in-vue-2
Vue.use(VueRouter)
const router = new VueRouter({
  mode: 'history',
  routes: []
})

Vue.use(DataExperience, { store })

Vue.config.productionTip = false

new Vue({
  i18n,
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
