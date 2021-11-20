<template>
  <div>
    {{ text }}
  </div>
</template>

<script>
import FileManager from '~/utils/file-manager'

export default {
  name: 'UnitFileExplorerViewerText',
  props: {
    fileManager: {
      type: FileManager,
      required: true
    },
    filename: {
      type: String,
      required: true
    }
  },
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
