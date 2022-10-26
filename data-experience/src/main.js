// import Vue from 'vue'

import TheDataExperience from './components/TheDataExperience.vue'

import store from './store'
import './assets/dc.css'

import { MODULE_NAME } from '@/utils/store-helper'
export { default as vuetify } from './plugins/vuetify'
export { default as i18n } from './plugins/i18n'
// https://github.com/vuetifyjs/vue-cli-plugins/issues/140#issuecomment-599001935
// new Vue({
// }).$mount('#app')

// export { vuetify }
export default {
  install(Vue, options) {
    if (!options || !options.store) {
      throw new Error('Please initialise plugin with a Vuex store.')
    }
    /*
    try {
      Vue.prototype.$tev = function(key, valueFallback) {
        // tev -> Translation Exists (else) Value fallback
        return this.$te(key) ? this.$t(key) : valueFallback
      }
    } catch (err) {
      throw new Error('Conflict: $tev function is already injected in the host app, please change it\'s name.')
    }
    try {
      Vue.prototype.$tet = function(key, keyFallback) {
        // tet -> Translation Exists (else) Translate fallback
        return this.$te(key) ? this.$t(key) : this.$t(keyFallback)
      }
    } catch (err) {
      throw new Error('Conflict: $tet function is already injected in the host app, please change it\'s name.')
    }
    try {
      Vue.prototype.$days = function() {
        return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(v => this.$t(`dayOfWeek.${v}`))
      }
    } catch (err) {
      throw new Error('Conflict: $days function is already injected in the host app, please change it\'s name.')
    }
    */
    /*
      Vue.mixin({
        methods: {
        // inject translation helpers to encapsulate ternary expressions
          $tev(key, valueFallback) {
          // tev -> Translation Exists (else) Value fallback
            return this.$te(key) ? this.$t(key) : valueFallback
          },
          $tet(key, keyFallback) {
          // tet -> Translation Exists (else) Translate fallback
            return this.$te(key) ? this.$t(key) : this.$t(keyFallback)
          },
          $days() {
            return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(v => this.$t(`dayOfWeek.${v}`))
          }
        }

      })
      */

    // Vue.use(vuetify)

    options.store.registerModule(MODULE_NAME, store)
    Vue.component('TheDataExperience2', TheDataExperience)
  }
}
