// import Vue from 'vue'

import TheDataExperience from './components/TheDataExperience.vue'

import store from './store'
import './assets/dc.css'

import { MODULE_NAME } from '@/utils/store-helper'
export { default as vuetify } from './plugins/vuetify'

// https://github.com/vuetifyjs/vue-cli-plugins/issues/140#issuecomment-599001935
// new Vue({
//   i18n
// }).$mount('#app')

// export { vuetify }
export default {
  install(Vue, options) {
    if (!options || !options.store) {
      throw new Error('Please initialise plugin with a Vuex store.')
    }

    // Vue.use(vuetify)

    options.store.registerModule(MODULE_NAME, store)
    Vue.component('TheDataExperience2', TheDataExperience)
  }
}
