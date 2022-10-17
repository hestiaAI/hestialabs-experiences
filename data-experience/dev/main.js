import Vue from 'vue'
import App from './App.vue'
import store from './store'
import DataExperience from '@/main'
import VueRouter from 'vue-router'

// https://vuetify.cn/en/getting-started/quick-start/#webpack-install
import vuetify from './vuetify-plugin'

// https://v2.vuejs.org/v2/guide/plugins.html#Writing-a-Plugin
const i18nPlugin = {
  install: function(Vue) {
    Vue.prototype.$tev = key => key
    Vue.prototype.$tet = key => key
    Vue.prototype.$te = key => key
    Vue.prototype.$t = key => key
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
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
