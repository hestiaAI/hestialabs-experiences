<template>
  <iframe :src="pdfPath" width="100%" height="500px" />
</template>

<script>
import FileManager from '~/utils/file-manager'

export default {
  name: 'UnitPdfViewer',
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
    pdfPath() {
      return URL.createObjectURL(this.fileManager.fileDict[this.filename])
    }
  }
}
</script>
