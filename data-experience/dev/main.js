import Vue from 'vue'
import App from './App.vue'
import store from './store'
import DataExperience, { vuetifyOpts, i18n } from '@/main'
import Vuetify from '../../experiences/node_modules/vuetify'
import '../../experiences/node_modules/vuetify/dist/vuetify.min.css'

Vue.use(DataExperience, { store })

Vue.use(Vuetify)
const vuetify = new Vuetify(vuetifyOpts)

Vue.config.productionTip = false

new Vue({
  i18n,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
