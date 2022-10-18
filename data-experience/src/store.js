import Vue from 'vue'
import { cloneDeep } from 'lodash-es'

const store = {
  namespaced: true,
  state: () => ({
    progress: false,
    experienceConfig: {},
    siteConfig: {},
    selectedFiles: [],
    results: {},
    currentDB: null,
    fileManager: null,
    fileExplorerCurrentItem: {},
    consentForm: null
  }),
  mutations: {
    setProgress(state, value) {
      state.progress = value
    },
    setExperienceConfig(state, config) {
      console.log('setting experienceConfig', config)
      state.experienceConfig = config
      console.log('experienceConfig set', state.experienceConfig)
    },
    setSiteConfig(state, config) {
      console.log('setting siteConfig', config)
      state.siteConfig = config
      console.log('siteConfig set', state.siteConfig)
    },
    setCurrentDB(state, db) {
      console.log('setting DB', db)
      state.currentDB = db
    },
    setFileManager(state, fileManager) {
      state.fileManager = fileManager
    },
    setSelectedFiles(state, selectedFiles) {
      state.selectedFiles = selectedFiles
    },
    selectPath(state, path) {
      if (!state.fileExplorerCurrentItem.selectedPaths.includes(path)) {
        state.fileExplorerCurrentItem.selectedPaths.push(path)
        // trigger reactivity
        state.fileExplorerCurrentItem = {
          ...state.fileExplorerCurrentItem
        }
      }
    },
    unselectPath(state, path) {
      state.fileExplorerCurrentItem.selectedPaths =
        state.fileExplorerCurrentItem.selectedPaths.filter(e => e !== path)
    },
    setResult(state, { experience, result }) {
      Vue.set(state.results, experience, cloneDeep(result))
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
          } else if (
            ['radio', 'input', 'multiline', 'select'].includes(section.type)
          ) {
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
      if (state.currentDB !== null) {
        state.currentDB.close()
      }
      state.currentDB = null
      state.fileManager = null
      state.consentForm = null
    },
    setFileExplorerCurrentItem(state, item) {
      console.log('STORE setFileExplorerCurrentItem', item)
      state.fileExplorerCurrentItem = item
      state.fileExplorerCurrentItem.selectedPaths = []
    }
  },
  getters: {
    tutorialVideos(state) {
      console.log('Get TutVideos', state.experienceConfig.tutorialVideos)
      return state.experienceConfig.tutorialVideos || []
    },
    videoHeight(state) {
      return state.experienceConfig.videoHeight || '400'
    },
    dataPortalHtml(state) {
      return state.experienceConfig.dataPortalHtml
    }
  }
}

export default store
