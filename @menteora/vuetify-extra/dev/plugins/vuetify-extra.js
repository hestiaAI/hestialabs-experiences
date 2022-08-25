import Vue from 'vue'
import VuetifyExtra from '@/plugin' /* point to /src/plugin.js for dev purpose
in production replace with: import VuetifyExtra from '@menteora/vuetify-extra' and
import '@menteora/vuetify-extra/dist/menteora.css' */
import store from '../store'

console.log('Vue use plugin')
Vue.use(VuetifyExtra, { store })

export default store
