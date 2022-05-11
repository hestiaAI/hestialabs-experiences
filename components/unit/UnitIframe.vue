<template>
  <iframe
    ref="iframe"
    :src="src"
    class="frame"
    :style="`width: 100%; height: ${height}px`"
    frameborder="0"
    @load="onload"
  ></iframe>
</template>

<script>
export default {
  props: {
    args: {
      type: Object,
      default: () => {}
    },
    src: {
      type: String,
      required: true
    },
    height: {
      type: Number,
      default: 500
    }
  },
  data() {
    return {
      loaded: false
    }
  },
  watch: {
    args(newArgs) {
      if (this.loaded) {
        this.callIframeFunction('update', newArgs)
      }
    }
  },
  methods: {
    onload() {
      const initParameters = {
        height: this.height,
        width: (this.width = this.$refs.iframe.offsetWidth)
      }
      this.callIframeFunction('init', initParameters)
      this.callIframeFunction('update', this.args)
      this.loaded = true
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
