<template>
  <base-button v-bind="{ disabled, href, download, text }" icon="mdiDownload" />
</template>

<script>
import { createObjectURL, revokeObjectURL } from '@/utils/utils'

const defaultExtension = 'txt'

const mimeTypes = {
  csv: 'text/csv',
  json: 'application/json',
  jsonld: 'application/ld+json',
  nq: 'application/n-quads',
  rq: 'application/sparql-query',
  ttl: 'text/turtle',
  yaml: 'application/x-yaml',
  yml: 'application/x-yaml',
  [defaultExtension]: 'text/plain;charset=UTF-8'
}

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
