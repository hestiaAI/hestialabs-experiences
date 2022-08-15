import DummyButton from './components/DummyButton.vue'
import store from './store'

export default {
  install (Vue, options) {
    if (!options || !options.store) {
      throw new Error('Please initialise plugin with a Vuex store.')
    }

    options.store.registerModule('data-experience', store)

    Vue.component('DummyButton', DummyButton)
  }
}
