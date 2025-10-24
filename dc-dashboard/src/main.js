import Vue from 'vue'
import VueI18n from 'vue-i18n'
import App from '@/App.vue'

import '@/assets/style/grid.css'
import '@/assets/style/dc.css'
import '@/assets/style/main.css'

import en from '@/locales/en.json'
import fr from '@/locales/fr.json'


Vue.use(VueI18n)

const i18n = new VueI18n({
  availableLocales: ['en', 'fr'],
  locale: 'en',
  messages: {
    en,
    fr
  }
})


new Vue({
  i18n,
  render: h => h(App)
}).$mount('#app')
