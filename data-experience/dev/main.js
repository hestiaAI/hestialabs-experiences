import Vue from 'vue'
import App from './App.vue'
import store from './store'
import DataExperience from '@/main'
import VueRouter from 'vue-router'

// https://v2.vuejs.org/v2/guide/plugins.html#Writing-a-Plugin
const i18nPlugin = {
  install: function(Vue) {
    Vue.prototype.$tev = function(key) {
      return key
    }
    Vue.prototype.$t = function(key) {
      return key
    }
  }
}
Vue.use(i18nPlugin)

// https://stackoverflow.com/questions/40816966/how-to-use-vue-router-in-vue-2
Vue.use(VueRouter)
const router = new VueRouter({
  routes: []
})

Vue.use(DataExperience, { store })

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
