export const state = () => ({
  progress: false
})

export const mutations = {
  setProgress(state, value) {
    state.progress = value
  }
}
