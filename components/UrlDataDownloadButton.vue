<template>
  <base-button
    v-bind="{ disabled, href, download, text, ...$attrs }"
    icon="mdiDownload"
  />
</template>

<script>
import { revokeObjectURL, defaultExtension, mimeTypes } from '@/utils/utils'

export default {
  props: {
    href: {
      type: String,
      required: true
    },
    extension: {
      type: String,
      default: defaultExtension,
      validator(val) {
        return Object.keys(mimeTypes).includes(val)
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: 'Download'
    }
  },
  computed: {
    download() {
      return `results.${this.extension}`
    }
  },
  watch: {
    href(href, oldHref) {
      revokeObjectURL(oldHref)
    }
  },
  beforeDestroy() {
    revokeObjectURL(this.href)
  }
}
</script>
