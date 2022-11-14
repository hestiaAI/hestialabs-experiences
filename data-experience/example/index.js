import twitter from "https://cdn.jsdelivr.net/npm/@hestia.ai/tinder@1.0.0/dist/index.mjs"

Vue.use(Vuex)

const store = new Vuex.Store({})
Vue.use(DataExperience.default, { store })

new Vue({
  el: '#app',
  i18n: DataExperience.i18n,
  vuetify: new Vuetify(DataExperience.vuetifyOpts),
  store,
  data: {
    experienceConfig: twitter.options,
    siteConfig: {}
  }
})

