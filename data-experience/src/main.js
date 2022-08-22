import DummyButton from './components/DummyButton.vue'
import ChartViewBar from './components/chart/view/ChartViewBar.vue'
import ChartViewTimeSeries from './components/chart/view/ChartViewTimeSeries.vue'
import store from './store'

export default {
  install (Vue, options) {
    if (!options || !options.store) {
      throw new Error('Please initialise plugin with a Vuex store.')
    }

    options.store.registerModule('data-experience', store)

    Vue.component('DummyButton', DummyButton)
    Vue.component('ChartViewBar', ChartViewBar)
    Vue.component('ChartViewTimeSeries', ChartViewTimeSeries)
  }
}
