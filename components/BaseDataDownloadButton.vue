<template>
  <base-download-button v-bind="{ extension, href, ...$attrs }" />
</template>

<script>
import { createObjectURL, defaultExtension, mimeTypes } from '@/utils/utils'

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
    }
  },
  computed: {
    href() {
      return createObjectURL(this.data, mimeTypes[this.extension])
    }
  }
}
</script>
