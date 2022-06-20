<template>
  <BaseButtonDownload v-bind="{ extension, href, ...$attrs }" />
</template>

<script>
import mixin from './mixin'
import { createObjectURL, mimeTypes } from '@/utils/utils'

export default {
  name: 'BaseButtonDownloadData',
  mixins: [mixin],
  props: {
    data: {
      type: [String, Blob, Uint8Array, Array],
      default: ''
    }
  },
  computed: {
    href () {
      return createObjectURL(this.data, mimeTypes[this.extension])
    }
  }
}
</script>
