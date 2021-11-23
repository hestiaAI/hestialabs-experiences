<template>
  <div>
    {{ text }}
  </div>
</template>

<script>
import mixin from './mixin'

export default {
  name: 'UnitFileExplorerViewerTxt',
  mixins: [mixin],
  data() {
    return {
      text: ''
    }
  },
  watch: {
    fileManager: {
      async handler(_) {
        this.text = await this.fileManager.getPreprocessedText(this.filename)
      },
      immediate: true
    },
    filename: {
      async handler(_) {
        this.text = await this.fileManager.getPreprocessedText(this.filename)
      },
      immediate: true
    }
  }
}
</script>
