<template>
  <base-download-button v-bind="{ extension, href, ...$attrs }" />
</template>

<script>
import { createObjectURL, defaultExtension, mimeTypes } from '@/utils/utils'
import BaseDownloadButton from '~/components/BaseDownloadButton'

export default {
  name: 'BaseDataDownloadButton',
  components: { BaseDownloadButton },
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
