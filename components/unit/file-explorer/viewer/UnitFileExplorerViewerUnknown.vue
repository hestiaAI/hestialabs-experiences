<template>
  <div>
    <p>
      Unknown file type
      <BaseButton small class="ml-2" @click="click">Try to open it</BaseButton>
    </p>
    <iframe
      ref="iframe"
      :class="iframeClass"
      :src="href"
      @load="onIframeLoad"
      width="100%"
      height="500px"
    />
  </div>
</template>

<script>
import mixin from './mixin'
import mixinPath from './mixin-path'

export default {
  name: 'UnitFileExplorerViewerUnknown',
  data() {
    return {
      showIframe: false,
      href: ''
    }
  },
  computed: {
    iframeClass() {
      return this.showIframe ? '' : 'd-none'
    }
  },
  mixins: [mixin, mixinPath],
  watch: {
    filename() {
      this.showIframe = false
    }
  },
  methods: {
    click() {
      this.href = this.path
    },
    onIframeLoad() {
      if (this.href === this.path) {
        this.showIframe = true
      }
    }
  }
}
</script>
