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
    data: {
      type: Object,
      default: () => {}
    },
    src: {
      type: String,
      required: true
    },
    height: {
      type: String,
      default: '500px'
    }
  },
  mounted() {
    console.log('mounted', this.data)
  },
  methods: {
    onload() {
      const update = this.$refs.iframe.contentWindow?.update
      if (update) {
        update(this.data)
      } else {
        console.log('iframe does not have an update function')
      }
    }
  }
}
</script>
