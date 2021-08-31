import manifests from '@/manifests'

export const state = () => ({
  manifests,
  power: false
})

export const getters = {
  manifests(state) {
    if (state.power) {
      return state.manifests
    }

    // playground is not available in default mode
    return state.manifests.filter(m => m.key !== 'playground')
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
