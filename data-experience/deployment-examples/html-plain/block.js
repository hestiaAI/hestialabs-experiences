/* eslint-disable no-undef */
import experience from 'https://cdn.jsdelivr.net/npm/@hestia.ai/twitter/dist/index.mjs'
const dataResp = await fetch('./twitter-overview.json')
const data = await dataResp.json()

const locale = 'fr'
const messagesFrResp = await fetch(`./${locale}.json`)
const messagesFr = await messagesFrResp.json()
const { default: vuetifyFr } = await import(`https://cdn.jsdelivr.net/npm/vuetify@2.6.14/lib/locale/${locale}.js`)
const ViewBlock = DataExperience.ViewBlock
Vue.use(DataExperience.ViewBlock)

Vue.use(VueI18n)
const i18n = new VueI18n(DataExperience.i18nOpts)
ViewBlock.configureI18n(i18n, experience, messagesFr, vuetifyFr )

const props = ViewBlock.buildProps(data, experience, 'overview')
const vuetify = new Vuetify(DataExperience.vuetifyOpts(i18n))
new Vue({
  el: '#app',
  i18n,
  vuetify,
  data: { props }
})
