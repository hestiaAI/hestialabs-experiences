import Vue from 'vue'
import { DataExperience, ViewBlock } from 'data-experience'
import 'data-experience/dist/DataExperience.css'

export default ({ store }) => {
  Vue.use(DataExperience, { store })
  Vue.use(ViewBlock, { store })
}
