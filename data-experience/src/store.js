import { set } from 'vue'
import { cloneDeep } from 'lodash-es'

const matchExperienceName = (nameAndTag, name) => nameAndTag.match(new RegExp(`^${name}(?:$|@|latest)`))

const store = {
  namespaced: true,
  state: () => ({
    progress: false,
    currentTab: 0,
    experienceConfig: undefined,
    siteConfig: {
      // to avoid "Cannot read properties of undefined (reading 'find')"
      experiences: []
    },
    bubbleConfig: undefined,
    bubbleCodeword: undefined,
    selectedFiles: [],
    results: {},
    currentDB: null,
    fileManager: null,
    fileExplorerCurrentItem: {},
    fileExplorerClickedSchemaTreeNode: null,
    consentForm: null
  }),
  mutations: {
    setProgress(state, value) {
      state.progress = value
    },
    setCurrentTab(state, value) {
      state.currentTab = value
    },
    setExperienceConfig(state, config) {
      state.experienceConfig = config
    },
    setBubbleConfig(state, config) {
      state.bubbleConfig = config
    },
    setBubbleCodeword(state, codeword) {
      state.bubbleCodeword = codeword
    },
    setSiteConfig(state, config) {
      state.siteConfig = config
    },
    setCurrentDB(state, db) {
      state.currentDB = db
    },
    setFileManager(state, fileManager) {
      state.fileManager = fileManager
    },
    setSelectedFiles(state, selectedFiles) {
      state.selectedFiles = selectedFiles
    },
    setClickedSchemaTreeNode(state, node) {
      state.fileExplorerClickedSchemaTreeNode = node
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
    setResult(state, { result }) {
      set(state.results, state.currentTab, cloneDeep(result))
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
      state.fileExplorerCurrentItem = item
      state.fileExplorerCurrentItem.selectedPaths = []
    }
  },
  getters: {
    selectedPaths: state => state.fileExplorerCurrentItem.selectedPaths,
    experienceNameAndTagFromConfig:
      state =>
        (experienceConfig, siteConfig, bubbleConfig) => {
          if (!experienceConfig) {
            return ''
          }
          let experienceNameAndTag = `${experienceConfig.name}@${experienceConfig.version || 'latest'}`
          if (bubbleConfig?.experiences) {
            // fetch name and tag from bubble config
            experienceNameAndTag = bubbleConfig.experiences.find(
              nameAndTag => matchExperienceName(nameAndTag, experienceConfig.name)
            )
          } else if (siteConfig.experiences) {
            // fetch name and tag from site config
            experienceNameAndTag = siteConfig.experiences.find(
              nameAndTag => matchExperienceName(nameAndTag, experienceConfig.name)
            )
          }
          // It is problematic to have '.' in a key,
          // notably for i18n messages
          return experienceNameAndTag.replace(/[@.]/g, '_')
        },
    // use `experienceNameAndTag` within an experience
    experienceNameAndTag:
      (state, getters) => {
        return getters.experienceNameAndTagFromConfig(
          state.experienceConfig,
          state.siteConfig,
          state.bubbleConfig
        )
      }
  }
}

export default store
