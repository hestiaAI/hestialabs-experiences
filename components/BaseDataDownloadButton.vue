<template>
  <BaseDownloadButton v-bind="{ extension, href, ...$attrs }" />
</template>

<script>
import { createObjectURL, defaultExtension, mimeTypes } from '@/utils/utils'

export default {
  name: 'BaseDataDownloadButton',
  props: {
    data: {
      type: [String, Blob, Uint8Array, Array],
      default: ''
    },
    extension: {
      type: String,
      default: defaultExtension,
      validator(val) {
        return Object.keys(mimeTypes).includes(val)
      }
    }
  },
  computed: {
    href() {
      return createObjectURL(this.data, mimeTypes[this.extension])
    }
  }
}
</script>
