/* eslint-disable no-undef */
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
// import DataExperience from '@hestia.ai/data-experience'
// import '@hestia.ai/data-experience/dist/DataExperience.css'

import App from './App.vue'
import store from './store'

console.log(DataExperience)
Vue.use(VueI18n)
const i18n = new VueI18n(DataExperience.i18nOpts)
Vue.use(Vuetify)
const vuetify = new Vuetify(DataExperience.vuetifyOpts(i18n))

Vue.use(DataExperience.default, { store })

new Vue({
  i18n,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
