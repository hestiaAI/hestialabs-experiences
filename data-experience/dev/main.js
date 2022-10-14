import Vue from 'vue'
import App from './App.vue'
import store from './store'
// import DataExperience from '../src/main'
import DataExperience from '@/main'

console.log('hello from main', DataExperience)
// Vue.use(DataExperience, { store })

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')

// import Vue from 'vue'
// import App from './App.vue'

// Vue.config.productionTip = false

// new Vue({
//   render: h => h(App)
// }).$mount('#app')
