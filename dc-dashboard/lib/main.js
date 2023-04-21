import Vue from 'vue'
import VueI18n from 'vue-i18n'
import DashboardComponent from '@/components/Dashboard.vue'

Vue.use(VueI18n)

import en from '@/locales/en.json'
import fr from '@/locales/fr.json'

// export default function install(Vue, options = {}) {
export const Dashboard = {
  install(Vue, options = {}) {
    // Create a new i18n instance if one is not provided
    const i18n = options.i18n || new VueI18n({
      locale: 'en',
      messages: {
        en,
        fr
      }
    })

    // If the parent app has already setup i18n, merge the messages
    if(options.i18n) {
      i18n.mergeLocaleMessage('en', en)
      i18n.mergeLocaleMessage('fr', fr)
    } else {
      // Add the i18n instance to the Vue prototype
      Vue.prototype.$i18n = i18n
    }

    // Register the component
    Vue.component('Dashboard', DashboardComponent)
  }
}
