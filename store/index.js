import manifestMap, { config } from '@/manifests'

export const state = () => ({
  config: {
    appName: 'HestiaLabs Experiences',
    ...config
  },
  manifestMap,
  selectedFiles: Object.fromEntries(config.experiences.map(k => [k, []])),
  results: Object.fromEntries(
    config.experiences.map(k => [
      k,
      Object.fromEntries(
        manifestMap[k].defaultView?.map(b => [b.key, null]) ?? []
      )
    ])
  ),
  currentDB: null,
  fileExplorerCurrentItem: {}
})

export const getters = {
  currentDB(state) {
    return state.currentDB
  },
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
  setSelectedFiles(state, { key, value }) {
    state.selectedFiles[key] = value
  },
  setResult(state, { company, experience, result }) {
    state.results[company][experience] = result
  },
  clearStore(state) {
    state.selectedFiles = Object.fromEntries(
      config.experiences.map(k => [k, []])
    )
    state.results = Object.fromEntries(
      config.experiences.map(k => [
        k,
        Object.fromEntries(
          manifestMap[k].defaultView?.map(b => [b.key, null]) ?? []
        )
      ])
    )
    state.fileExplorerCurrentItem = {}
    if (state.currentDB !== null) state.currentDB.close()
    state.currentDB = null
  },
  setFileExplorerCurrentItem(state, item) {
    state.fileExplorerCurrentItem = item
  }
}
