import Vue from 'vue'
// const DataExperience = require('data-experience')
import DataExperience from 'data-experience'
import 'data-experience/dist/DataExperience.css'

export default ({ store }) => {
  Vue.use(DataExperience, { store, mixinsAlreadyInjected: true })
}
