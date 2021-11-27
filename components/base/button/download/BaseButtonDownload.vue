<template>
  <BaseButton v-bind="{ href, download, text, ...$attrs }" icon="mdiDownload" />
</template>

<script>
import { revokeObjectURL, defaultExtension, mimeTypes } from '@/utils/utils'

export default {
  props: {
    href: {
      type: String,
      required: true
    },
    filename: {
      type: String,
      default: undefined
    },
    extension: {
      type: String,
      default: defaultExtension,
      validator(val) {
        return Object.keys(mimeTypes).includes(val)
      }
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
  beforeDestroy() {
    revokeObjectURL(this.href)
  }
}
</script>
