export default {
  props: {
    hash: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      progress: false,
      refreshPipeline: true
    }
  },
  watch: {
    progress: {
      immediate: true,
      handler(value) {
        this.$store.commit('experience/setProgress', value)
      }
    },
    '$store.state.fileManager': {
      immediate: true,
      handler(value) {
        if (value) {
          // When switching to a tab, we only want to refresh
          // the corresponding pipeline if this is the first time
          // the tab is opened after the fileManager was reset, for instance,
          // when new data is uploaded or when the store is cleared manually
          this.refreshPipeline = true
        }
      }
    },
    '$route.hash': {
      immediate: true,
      handler(value) {
        // Re-run the pipeline when
        // 1. the tab is reopened, and
        // 2. the store was previously cleared
        if (value.slice(1) === this.hash && this.refreshPipeline) {
          this.progress = true
          window.setTimeout(async () => {
            await this.run()
            this.refreshPipeline = false
          }, 500)
        }
      }
    }
  }
}
