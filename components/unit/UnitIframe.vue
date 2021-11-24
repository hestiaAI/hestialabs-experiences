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
  watch: {
    data(data) {
      this.callIframeFunction('update', [data])
    }
  },
  methods: {
    onload() {
      this.callIframeFunction('init')
      this.callIframeFunction('update', [this.data])
    },
    callIframeFunction(functionName, args = []) {
      const func = this.$refs.iframe.contentWindow?.[functionName]
      if (func) {
        try {
          func(...args)
        } catch (error) {
          console.error('problem in iframe', error)
        }
      } else {
        console.error('iframe does not have a function called ' + functionName)
      }
    }
  }
}
</script>
