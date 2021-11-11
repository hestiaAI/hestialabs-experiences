<template>
  <img width="100%" :src="imagePath" alt="problem" />
</template>

<script>
import FileManager from '~/utils/file-manager'

export default {
  name: 'UnitImageViewer',
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
    imagePath() {
      return URL.createObjectURL(this.fileManager.fileDict[this.filename])
    }
  }
}
</script>
