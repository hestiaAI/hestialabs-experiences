<template>
  <iframe :src="htmlPath" width="100%" height="500px" />
</template>

<script>
import FileManager from '~/utils/file-manager'

export default {
  name: 'UnitFileExplorerViewerHtml',
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
  computed: {
    htmlPath() {
      return URL.createObjectURL(this.fileManager.fileDict[this.filename])
    }
  }
}
</script>
