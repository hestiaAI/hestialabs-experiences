<template>
  <div>
    {{ fileText }}
  </div>
</template>

<script>
export default {
  name: 'UnitTextViewer',
  props: {
    file: {
      type: File,
      required: true
    }
  },
  data() {
    return {
      fileText: ''
    }
  },
  watch: {
    file: {
      async handler(newFile) {
        await this.getFileText(newFile)
      },
      immediate: true
    }
  },
  methods: {
    async getFileText(file) {
      this.fileText = await file.text()
    }
  }
}
</script>
