/* eslint-disable no-undef */
import experience from 'https://cdn.jsdelivr.net/npm/@hestia.ai/twitter-agg/dist/index.mjs'
// import experience from 'https://cdn.jsdelivr.net/npm/@hestia.ai/uber-driver/dist/index.mjs'

Vue.use(Vuex)
Vue.use(VueI18n)

const i18n = new VueI18n(DataExperience.i18nOpts)

const vuetify = new Vuetify(DataExperience.vuetifyOpts(i18n))

const store = new Vuex.Store({})

Vue.use(DataExperience.DataExperience, { store })

// const theApiUrl = 'http://localhost:8000'
const theApiUrl = 'https://bubbles.hestialabs.org'
const bubbleAPI = new DataExperience.BubbleAPI(theApiUrl)
const bubbleConfig = await bubbleAPI.getConfig('demo-aggregator')
console.log('bub', bubbleConfig?.id, bubbleConfig)
// const bubbleConfig = await bubbleAPI.getConfig('live-participant')

const mapboxToken = 'pk.eyJ1IjoiYW5kcmVhc2t1bmRpZyIsImEiOiJja3ZxcnlmNXc2ZzUwMnFva2F2a3Q1azU5In0.NrvCU8OKlkwJOVFOgZzTzA'
new Vue({
  el: '#app',
  i18n,
  vuetify,
  store,
  data: {
    experienceModule: experience,
    bubbleConfig,
    siteConfig: { mapboxToken }
  }
})
