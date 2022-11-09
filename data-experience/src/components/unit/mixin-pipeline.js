export default {
  props: {
    id: {
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
        this.$store.commit('xp/setProgress', value)
      }
    },
    '$store.state.xp.fileManager': {
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
    '$store.state.xp.currentTab': {
      immediate: true,
      handler(currentTab) {
        // Re-run the pipeline when
        // 1. the tab is reopened, and
        // 2. the store was previously cleared
        if (currentTab === this.id && this.refreshPipeline) {
          this.progress = true
          window.setTimeout(async() => {
            await this.run()
            this.refreshPipeline = false
          }, 500)
        }
      }
    }
  }
}
