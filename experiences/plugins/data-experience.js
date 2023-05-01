import Vue from 'vue'
import { DataExperience, ViewBlock, CodeEditor, ChartView } from 'data-experience'
import 'data-experience/dist/DataExperience.css'

export default ({ store }) => {
  Vue.use(ChartView)
  Vue.use(CodeEditor)
  Vue.use(DataExperience, { store })
  Vue.use(ViewBlock, { store })
}
