import Vue from 'vue'
import 'data-experience/dist/style.css'
import { DataExperience } from 'data-experience'

export default ({ store }) => {
  Vue.use(DataExperience, { store, mixinsAlreadyInjected: true })
}
