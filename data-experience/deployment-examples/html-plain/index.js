import twitter from 'https://cdn.jsdelivr.net/npm/@hestia.ai/twitter@1.x/dist/index.mjs'

Vue.use(Vuex)
Vue.use(VueI18n)

const i18n = new VueI18n(DataExperience.i18nOpts)

const vuetify = new Vuetify(DataExperience.vuetifyOpts(i18n))

const store = new Vuex.Store({})

Vue.use(DataExperience.default, { store })

new Vue({
  el: '#app',
  i18n,
  vuetify,
  store,
  data: {
    experienceConfig: twitter.options,
    siteConfig: {}
  }
})
