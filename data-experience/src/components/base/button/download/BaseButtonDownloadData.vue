<template>
  <BaseButtonDownload v-bind="{ extension, href, ...$attrs }" />
</template>

<script>
import mixin from './mixin'
import { createObjectURL, mimeTypes } from '@/utils/utils'
import BaseButtonDownload from '@/components/base/button/download/BaseButtonDownload.vue'

export default {
  name: 'BaseButtonDownloadData',
  components: { BaseButtonDownload },
  mixins: [mixin],
  props: {
    data: {
      type: [String, Blob, Uint8Array, Array],
      default: ''
    }
  },
  computed: {
    href() {
      return createObjectURL(this.data, mimeTypes[this.extension])
    }
  }
}
</script>
