// import Vue from 'vue'

import TheDataExperience from './components/TheDataExperience.vue'

import store from './store'
import './assets/dc.css'
import './assets/dc-custom.css'

import { MODULE_NAME } from '@/utils/store-helper'
export { default as vuetifyOpts } from './plugins/vuetify'
export { default as i18nOpts } from './plugins/i18n'
export { default as chartView } from './components/chart/ChartView.vue'
export { default as chartViewBar } from './components/chart/view/ChartViewBar.vue'
export { default as chartViewGenericMap } from './components/chart/view/ChartViewGenericMap.vue'

export default {
  install(Vue, options) {
    if (!options || !options.store) {
      throw new Error('Please initialise plugin with a Vuex store.')
    }
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

    options.store.registerModule(MODULE_NAME, store)
    Vue.component('TheDataExperience2', TheDataExperience)
  }
}
