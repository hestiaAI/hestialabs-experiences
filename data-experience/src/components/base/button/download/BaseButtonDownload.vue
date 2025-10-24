<template>
  <BaseButton v-bind="{ href, download, text, ...$attrs }" mdi-icon="mdiDownload" />
</template>

<script>
import mixin from './mixin'
import { revokeObjectURL } from '@/utils/utils'
import BaseButton from '@/components/base/button/BaseButton.vue'

export default {
  name: 'BaseButtonDownload',
  components: { BaseButton },
  mixins: [mixin],
  props: {
    href: {
      type: String,
      required: true
    },
    filename: {
      type: String,
      default: undefined
    },
    text: {
      type: String,
      default: 'Download'
    }
  },
  computed: {
    download() {
      return this.filename ?? `results.${this.extension}`
    }
  },
  watch: {
    href(href, oldHref) {
      revokeObjectURL(oldHref)
    }
  },
  beforeUnmount() {
    revokeObjectURL(this.href)
  }
}
</script>
