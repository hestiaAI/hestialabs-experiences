import manifestMap, { config } from '@/manifests'

export const state = () => ({
  config,
  manifestMap,
  power: false
})

export const getters = {
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
  updatePower(state, power) {
    state.power = power
  }
}
