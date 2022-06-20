// import { setTimeoutPromise } from '@/utils/utils'

export default {
  data () {
    return {
      loading: false
    }
  },
  methods: {
    setLoading (loading) {
      this.loading = loading
      this.$emit('loading', this.loading)
    }
  }
}
