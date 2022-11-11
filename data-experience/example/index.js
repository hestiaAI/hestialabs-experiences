Vue.use(Vuex)
const store = new Vuex.Store({})
Vue.use(DataExperience.default, { store })

new Vue({
  el: '#app',
  i18n: DataExperience.i18n,
  vuetify: new Vuetify(DataExperience.vuetifyOpts)
})

