/* eslint-disable no-undef */
import experience from 'https://cdn.jsdelivr.net/npm/@hestia.ai/twitter/dist/index.mjs'
const dataResp = await fetch('./twitter-overview.json')
const data = await dataResp.json()
const messagesFrResp = await fetch('./fr.json')
const messagesFr = await messagesFrResp.json()

const ViewBlock = DataExperience.ViewBlock
Vue.use(DataExperience.ViewBlock)

Vue.use(VueI18n)
const i18n = new VueI18n({
  ...DataExperience.i18nOpts,
  locale: 'fr'
})
ViewBlock.configureI18n(i18n, experience, messagesFr)

const props = ViewBlock.buildProps(data, experience, 'overview')

const vuetify = new Vuetify(DataExperience.vuetifyOpts(i18n))
new Vue({
  el: '#app',
  i18n,
  vuetify,
  data: { props }
})
