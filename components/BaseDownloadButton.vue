<template>
  <base-button
    v-bind="{ disabled, href, download, text, ...$attrs }"
    icon="mdiDownload"
  />
</template>

<script>
import {
  createObjectURL,
  revokeObjectURL,
  defaultExtension,
  mimeTypes
} from '@/utils/utils'

export default {
  props: {
    data: {
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
    href() {
      return createObjectURL(this.data, mimeTypes[this.extension])
    },
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
