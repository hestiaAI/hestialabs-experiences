export default {
  watch: {
    progress(value) {
      this.$store.commit('experience/setProgress', value)
    }
  }
}
