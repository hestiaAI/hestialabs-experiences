<template>
  <iframe :src="pdfPath" width="100%" height="500px" />
</template>

<script>
export default {
  name: 'UnitPdfViewer',
  props: {
    file: {
      type: File,
      required: true
    }
  },
  computed: {
    pdfPath() {
      return URL.createObjectURL(this.file)
    }
  }
}
</script>
