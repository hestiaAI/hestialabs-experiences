import Vue from 'vue'
import VueI18n from 'vue-i18n'
import App from './App.vue'
import store from './store'
import DataExperience, { vuetifyOpts, i18nOpts } from '@/main'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(VueI18n)
const i18n = new VueI18n(i18nOpts)

Vue.use(Vuetify)
const vuetify = new Vuetify(vuetifyOpts(i18n))

Vue.use(DataExperience, { store })

Vue.config.productionTip = false

new Vue({
  i18n,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
