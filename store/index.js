import Vue from 'vue'
import { cloneDeep } from 'lodash-es'

export const state = () => ({
  loaded: false,
  config: {},
  experiences: [],
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
  enabledExperiences(state) {
    return state.experiences.filter(
      ({ slug, disabled }) => !disabled && slug !== 'other'
    )
  },
  disabledExperiences(state, getters) {
    const disabledExperiences = state.experiences.filter(
      ({ slug }) => !getters.enabledExperiences.find(e => e.slug === slug)
    )
    // Add 'other' to the end of the Array
    const otherIdx = disabledExperiences.findIndex(
      ({ slug }) => slug === 'other'
    )
    const [other] = disabledExperiences.splice(otherIdx, 1)
    if (other) {
      disabledExperiences.push(other)
    }
    return disabledExperiences
  },
  config:
    state =>
      ({ params: { bubble } }) =>
        bubble ? state.config.bubbleConfig[bubble] : state.config,
  // https://vuex.vuejs.org/guide/getters.html#method-style-access
  experience:
    state =>
      ({ params: { experience } }) =>
        state.experiences.find(e => e.slug === experience) || {}
}

export const mutations = {
  setLoaded(state) {
    state.loaded = true
  },
  setConfig(state, config) {
    state.config = config
  },
  setExperiences(state, experiences) {
    state.experiences = experiences
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
    if (state.currentDB !== null) { state.currentDB.close() }
    state.currentDB = null
    state.fileManager = null
    state.consentForm = null
  },
  setFileExplorerCurrentItem(state, item) {
    state.fileExplorerCurrentItem = item
  }
}

export const actions = {
  async loadConfig({ commit, state }) {
    if (!state.loaded) {
      const config = (await import(`@/config/${process.env.configName}.json`))
        .default
      if (config.bubbles?.length) {
        config.bubbleConfig = {}
        for (const bubble of config.bubbles) {
          const data = await this.$api.getConfig(bubble)
          if (data) {
            config.bubbleConfig[bubble] = data
          }
        }
      }
      commit('setConfig', {
        ...config,
        appName: 'HestiaLabs Experiences'
      })
    }
  },
  async loadExperiences({ commit, state, dispatch }, { isDev, $axios }) {
    if (!state.loaded) {
      await dispatch('loadConfig', $axios)
      const experiences = (
        await Promise.all(
          state.config.experiences.map((packageNameAndTag) => {
            // We need to explicitly import dist (dist/index.mjs)
            // and not just `@hestiaai/${name}`
            // since dynamic imports are not resolved by webpack
            // during the build step
            const [name] = packageNameAndTag.split('@')
            return import(`@hestiaai/${name}/dist`)
          })
        )
      ).map(module => module.default.options)

      commit('setExperiences', experiences)
      commit('setLoaded')
    }
  }
}
