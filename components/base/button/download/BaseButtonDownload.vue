<template>
  <BaseButton v-bind="{ href, download, text, ...$attrs }" icon="mdiDownload" />
</template>

<script>
import mixin from './mixin'
import { revokeObjectURL } from '@/utils/utils'

export default {
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
    download () {
      return this.filename ?? `results.${this.extension}`
    }
  },
  watch: {
    href (href, oldHref) {
      revokeObjectURL(oldHref)
    }
  },
  beforeDestroy () {
    revokeObjectURL(this.href)
  }
}
</script>
