<template>
  <iframe :src="htmlPath" width="100%" height="500px" />
</template>

<script>
export default {
  name: 'UnitHtmlViewer',
  props: {
    file: {
      type: File,
      required: true
    }
  },
  computed: {
    htmlPath() {
      return URL.createObjectURL(this.file)
    }
  }
}
</script>
