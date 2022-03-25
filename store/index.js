import Vue from 'vue'
import manifestMap, { config } from '@/manifests'

export const state = () => ({
  config: {
    appName: 'HestiaLabs Experiences',
    ...config
  },
  manifestMap,
  selectedFiles: [],
  results: {},
  currentDB: null,
  fileManager: null,
  fileExplorerCurrentItem: {},
  consentForm: null
})

export const getters = {
  appName(state) {
    return state.config.appName
  },
  manifests(state) {
    const experiences = state.config?.experiences || []
    const activeManifests = experiences
      .map(key => state.manifestMap[key])
      .filter(m => m)

    // playground is not available in default mode
    return activeManifests.filter(m => m.key !== 'playground')
  },
  enabledExperiences(state, getters) {
    return getters.manifests.filter(({ disabled }) => !disabled)
  },
  disabledExperiences(state, getters) {
    return getters.manifests
      .filter(({ disabled }) => disabled)
      .map(o => (o.key === 'other' ? { ...o, disabled: false } : o))
  },
  keys(state, getters) {
    return getters.manifests.map(({ key }) => key)
  },
  // https://vuex.vuejs.org/guide/getters.html#method-style-access
  manifest:
    state =>
    ({ params: { key } }) => {
      return state.manifestMap[key] || {}
    }
}

export const mutations = {
  setCurrentDB(state, db) {
    state.currentDB = db
  },
  setFileManager(state, fileManager) {
    state.fileManager = fileManager
  },
  setSelectedFiles(state, selectedFiles) {
    state.selectedFiles = selectedFiles
  },
  setResult(state, { experience, result }) {
    Vue.set(state.results, experience, result)
  },
  setConsentForm(state, consentForm) {
    // Initialize missing values
    if (!consentForm) {
      return
    }
    for (const section of consentForm) {
      if (typeof section.value === 'undefined') {
        // The value hasn't been initialized
        if (['checkbox', 'data'].includes(section.type)) {
          section.value = []
        } else if (['radio', 'input', 'multiline'].includes(section.type)) {
          section.value = ''
        }
      }
    }
    state.consentForm = consentForm
  },
  setConsentFormValue(state, { index, value }) {
    state.consentForm[index].value = value
  },
  clearStore(state) {
    state.selectedFiles = []
    state.results = {}
    state.fileExplorerCurrentItem = {}
    if (state.currentDB !== null) state.currentDB.close()
    state.currentDB = null
    state.fileManager = null
    state.consentForm = null
  },
  setFileExplorerCurrentItem(state, item) {
    state.fileExplorerCurrentItem = item
  }
}
