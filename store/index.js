import manifestMap from '@/manifests'

export const state = () => ({
  config: { notLoaded: true },
  manifestMap,
  power: false
})

export const getters = {
  config(state) {
    return state.config
  },
  manifests(state) {
    const experiences = state.config?.experiences || []
    const activeManifests = experiences
      .map(key => state.manifestMap[key])
      .filter(m => m)

    if (state.power) {
      return activeManifests
    }

    // playground is not available in default mode
    return activeManifests.filter(m => m.key !== 'playground')
  },
  keys(state, getters) {
    return getters.manifests.map(({ key }) => key)
  },
  // https://vuex.vuejs.org/guide/getters.html#method-style-access
  manifest:
    state =>
    ({ params: { key } }) => {
      // return state.manifests.find(m => m.key === key)
      return state.manifestMap[key]
    }
}

export const mutations = {
  updateConfig(state, config) {
    state.config = config
  },
  updatePower(state, power) {
    state.power = power
  }
}

export const actions = {
  async loadConfig({ commit }) {
    // AK: Not sure if webpack's import is the best solution.
    // It's faster for server side rendering, which we're not using.
    // Is it also faster on the client? I don't see an http request for it.
    // We could also put the config in the static directory
    // and use window.fetch (breaks ssr) or axios
    // https://github.com/nuxt/nuxt.js/issues/123#issuecomment-272246782
    const config = await import(`~/config/${process.env.configName}.json`)
    commit('updateConfig', config)
  }
}
