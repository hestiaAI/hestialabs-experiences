import createPersistedState from 'vuex-persistedstate'

// https://github.com/robinvdvleuten/vuex-persistedstate
export default ({ store }) => {
  createPersistedState({
    paths: ['power']
  })(store)
}
