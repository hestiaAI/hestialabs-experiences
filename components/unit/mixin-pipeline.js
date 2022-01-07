import { setTimeoutPromise } from '@/utils/utils'

export default {
  async beforeMount() {
    // set small timeout to allow UI to switch tabs
    await setTimeoutPromise(250)
    await this.run()
  },
  watch: {
    progress(value) {
      this.$store.commit('experience/setProgress', value)
    }
  }
}
