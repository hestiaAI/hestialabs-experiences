/* eslint-disable no-undef */
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import DataExperience, { i18nOpts, vuetifyOpts } from '@hestia.ai/data-experience'
// import '@hestia.ai/data-experience/dist/DataExperience.css'

import store from './store'
import App from './App.vue'
console.log(DataExperience, i18nOpts, vuetifyOpts)

Vue.use(VueI18n)
const i18n = new VueI18n(i18nOpts)

Vue.use(Vuetify)
const vuetify = new Vuetify(vuetifyOpts(i18n))

Vue.use(DataExperience, { store })

new Vue({
  store,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount('#app')
