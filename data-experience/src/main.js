import DummyButton from './components/DummyButton.vue'
import ChartView from './components/chart/ChartView.vue'
import store from './store'
import './assets/dc.css'

export default {
  install (Vue, options) {
    if (!options || !options.store) {
      throw new Error('Please initialise plugin with a Vuex store.')
    }

    options.store.registerModule('data-experience', store)

    Vue.component('DummyButton', DummyButton)
    Vue.component('ChartView2', ChartView)
  }
}
