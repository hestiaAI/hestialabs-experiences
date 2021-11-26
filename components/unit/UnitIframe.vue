<template>
  <iframe
    ref="iframe"
    :src="src"
    :style="`width: 100%; height: ${height}px`"
    @load="onload"
  ></iframe>
</template>

<script>
export default {
  props: {
    data: undefined,
    src: {
      type: String,
      required: true
    },
    height: {
      type: Number,
      default: 500
    }
  },
  watch: {
    data(data) {
      this.callIframeFunction('update', data)
    }
  },
  methods: {
    onload() {
      const initArgs = {
        height: this.height,
        width: (this.width = this.$refs.iframe.offsetWidth)
      }
      this.callIframeFunction('init', initArgs)
      this.callIframeFunction('update', this.data)
    },
    callIframeFunction(functionName, ...args) {
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
