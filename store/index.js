import manifests from '@/manifests'
import config from '@/config'

export const state = () => ({
  config,
  manifests,
  power: false
})

export const getters = {
  config(state) {
    return state.config
  },
  manifests(state) {
    const activeManifests = state.manifests.filter(m =>
      state.config.experiences.includes(m.key)
    )

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
      return state.manifests.find(m => m.key === key)
    }
}

export const mutations = {
  updatePower(state, power) {
    state.power = power
  }
}
