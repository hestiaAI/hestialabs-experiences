/* eslint-disable no-undef */
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
// import '@hestia.ai/data-experience/dist/DataExperience.css'

import store from './store'
import App from './App.vue'

// Unfortunately, vue-cli does not support ES modules output format for bundles
// so we must import the DataExperience module with a <script> tag
// import { DataExperience, i18nOpts, vuetifyOpts } from '@hestia.ai/data-experience'

Vue.use(VueI18n)
const i18n = new VueI18n(DataExperience.i18nOpts)

Vue.use(Vuetify)
const vuetify = new Vuetify(DataExperience.vuetifyOpts(i18n))

Vue.use(DataExperience.DataExperience, { store })

new Vue({
  store,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount('#app')
