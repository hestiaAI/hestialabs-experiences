<template>
  <div>
    <p>
      Unknown file type
      <BaseButton small class="ml-2" @click="click">
        Try to open it
      </BaseButton>
    </p>
    <iframe
      ref="iframe"
      :class="iframeClass"
      :src="href"
      width="100%"
      height="500px"
      @load="onIframeLoad"
    />
  </div>
</template>

<script>
import mixin from './mixin'
import mixinPath from './mixin-path'
import BaseButton from '@/components/base/button/BaseButton.vue'

export default {
  name: 'UnitFileExplorerViewerUnknown',
  components: { BaseButton },
  mixins: [mixin, mixinPath],
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
