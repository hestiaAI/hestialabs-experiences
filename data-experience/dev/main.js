import Vue from 'vue'
import App from './App.vue'
import store from './store'
import DataExperience, { vuetifyOpts, i18n } from '@/main'
import VueRouter from 'vue-router'
import Vuetify from '../../experiences/node_modules/vuetify'
import '../../experiences/node_modules/vuetify/dist/vuetify.min.css'

// https://stackoverflow.com/questions/40816966/how-to-use-vue-router-in-vue-2
Vue.use(VueRouter)
const router = new VueRouter({
  mode: 'history',
  routes: []
})

Vue.use(DataExperience, { store })

Vue.use(Vuetify)
const vuetify = new Vuetify(vuetifyOpts)

Vue.config.productionTip = false

new Vue({
  i18n,
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
