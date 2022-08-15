const store = {
  state: {
    counter: 0
  },
  getters: {
    counter: state => state.counter
  },
  mutations: {
    increment (state) {
      state.counter += 1
    }
  }
}
export default store
