<template>
  <img width="100%" :src="imagePath" alt="problem" />
</template>

<script>
export default {
  name: 'UnitImageViewer',
  props: {
    file: {
      type: File,
      required: true
    }
  },
  computed: {
    imagePath() {
      return URL.createObjectURL(this.file)
    }
  }
}
</script>
