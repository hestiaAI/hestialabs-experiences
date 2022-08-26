import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import './plugins/data-experience'
import './plugins/vuetify-extra'
import store from './store';

Vue.config.productionTip = false

new Vue({
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

Vue.prototype.$t = d => d
Vue.prototype.$tc = d => d
