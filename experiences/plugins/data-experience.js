import Vue from 'vue'
// const DataExperience = require('data-experience')
import DataExperience from 'data-experience'
import 'data-experience/dist/data-experience.css'

export default ({ store }) => {
  Vue.use(DataExperience, { store, mixinsAlreadyInjected: true })
}
