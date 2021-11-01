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
    async file(newFile) {
      await this.getFileText(newFile)
    }
  },
  async created() {
    await this.getFileText(this.file)
  },
  methods: {
    async getFileText(file) {
      this.fileText = await file.text()
    }
  }
}
</script>
