<template>
  <iframe
    ref="iframe"
    :src="src"
    :style="`width: 100%; height: ${height}`"
    @load="onload"
  ></iframe>
</template>

<script>
// TODO add  manifest.defaultView with iframe field
// add custom pipeline for kepler data (no processing, so we delegate to kepler's method?)
export default {
  props: {
    data: undefined,
    src: {
      type: String,
      required: true
    },
    height: {
      type: String,
      default: '500px'
    }
  },
  methods: {
    onload() {
      const update = this.$refs.iframe.contentWindow?.update
      if (update) {
        try {
          update(this.data)
        } catch (error) {
          console.error('problem in iframe', error)
        }
      } else {
        console.error('iframe does not have an update function')
      }
    }
  }
}
</script>
