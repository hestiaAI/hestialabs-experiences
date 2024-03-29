import TheDataExperience from './components/TheDataExperience.vue'
import CodeEditorComponent from './components/misc/CodeEditor.vue'
import ChartViewComponent from './components/chart/ChartView.vue'

import store from './store'
import './assets/dc.css'
import './assets/dc-custom.css'

import { MODULE_NAME } from '@/utils/store-helper'
import UnitPipelineViewBlock from './components/unit/UnitPipelineViewBlock'
import {
  kViewBlockPrefix, mergeMessagesIntoI18n, experienceNameFromTitle,
  nestExperienceLocaleMessages, injectTranslationHelpersIntoVue
}
  from '@/utils/i18n-utils'
export { default as vuetifyOpts } from './plugins/vuetify'
export { default as i18nOpts } from './plugins/i18n'
export { default as chartViewBar } from './components/chart/view/ChartViewBar.vue'
export { default as chartViewGenericMap } from './components/chart/view/ChartViewGenericMap.vue'
export { hashFile, encryptFile } from './utils/encryption'
export { default as BubbleAPI } from './utils/bubble-api'

export const CodeEditor = {
  install(Vue, options) {
    Vue.component('CodeEditor', CodeEditorComponent)
  }
}

export const ChartView = {
  install(Vue, options) {
    Vue.component('ChartView', ChartViewComponent)
  }
}
export const ViewBlock = {
  install(Vue, options) {
    injectTranslationHelpersIntoVue(Vue, options?.ignoreConflicts)
    Vue.component('ViewBlock', UnitPipelineViewBlock)
  },
  configureI18n(i18n, experience, appLocaleMessages, vuetifyMessages) {
    const { config: { title, messages } } = experience
    const { locale } = i18n
    appLocaleMessages.$vuetify = vuetifyMessages
    const experienceName = experienceNameFromTitle(title)
    const expLocaleMessages =
          nestExperienceLocaleMessages(experienceName, messages[locale])
    const messagesList = [expLocaleMessages, appLocaleMessages]
    mergeMessagesIntoI18n(i18n, locale, messagesList)
  },
  buildProps(data, experience, viewBlockId) {
    const { config: { title, viewBlocks } } = experience
    const experienceName = experienceNameFromTitle(title)
    const viewBlock = viewBlocks.find(vb => vb.id === viewBlockId)
    const prefix = kViewBlockPrefix(experienceName, viewBlockId)
    return {
      data,
      viewBlockTranslationPrefix: prefix,
      ...viewBlock
    }
  }
}

export const DataExperience = {
  install(Vue, options) {
    if (!options || !options.store) {
      throw new Error('Please initialise plugin with a Vuex store.')
    }
    injectTranslationHelpersIntoVue(Vue)
    options.store.registerModule(MODULE_NAME, store)
    Vue.component('TheDataExperience', TheDataExperience)
  }
}
