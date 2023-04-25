import Vue from 'vue'
import { DataExperience, ViewBlock, CodeEditor } from 'data-experience'
import 'data-experience/dist/DataExperience.css'

export default ({ store }) => {
  console.log('TEST', CodeEditor, DataExperience)
  Vue.use(CodeEditor)
  Vue.use(DataExperience, { store })
  Vue.use(ViewBlock, { store })
}
