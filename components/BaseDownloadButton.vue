<template>
  <base-button nuxt :disabled="disabled" :download="download" :href="href">
    <v-icon left>
      mdi-download
    </v-icon>
    Download
  </base-button>
</template>

<script>
import { createObjectURL, revokeObjectURL } from '@/utils/utils'

const defaultMimeType = 'text/plain;charset=UTF-8'

const extensions = {
  [defaultMimeType]: 'txt',
  'application/json': 'json',
  'application/ld+json': 'jsonld',
  'application/n-quads': 'nq',
  'text/csv': 'csv',
  'text/turtle': 'ttl'
}

export default {
  props: {
    data: {
      type: String,
      required: true
    },
    mimeType: {
      type: String,
      default: defaultMimeType
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    href() {
      return createObjectURL(this.data, this.mimeType)
    },
    download() {
      return `results.${extensions[this.mimeType]}`
    }
  },
  watch: {
    data() {
      revokeObjectURL(this.href)
    }
  }
}
</script>
