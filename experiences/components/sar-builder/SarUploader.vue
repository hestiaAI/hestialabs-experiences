<template>
  <VContainer>
    <span class="blue-grey--text text--darken-2 mt-6 mb-6">
      First add the files you want to include in the SAR
    </span>
    <VCard flat class="pa-3 mt-6">
      <div ref="dashboard" />
    </VCard>
  </VContainer>
</template>
<script>
import { Uppy } from '@uppy/core'
import Dashboard from '@uppy/dashboard'
import DropTarget from '@uppy/drop-target'

import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import '@uppy/drop-target/dist/style.css'

import English from '@uppy/locales/lib/en_US'
import French from '@uppy/locales/lib/fr_FR'

const locales = {
  en: English,
  fr: French
}

export default {
  prop: ['value'],
  data() {
    return {
      uppy: null,
      files: this.value
    }
  },
  mounted() {
    this.initUppy()
  },
  methods: {
    initUppy() {
      const config = {
        debug: false,
        allowMultipleUploads: true,
        locale: locales[this.$i18n.locale]
      }
      this.uppy = new Uppy(config)
      this.uppy
        .use(Dashboard, {
          target: this.$refs.dashboard,
          inline: true,
          // we're currently not uploading to a server
          hideUploadButton: true,
          proudlyDisplayPoweredByUppy: false,
          theme: 'light',
          height: 300
        })
        .use(DropTarget, {
        // allow dropping files anywhere on the page
          target: document.body
        })
        .on('files-added', () => {
          this.files = this.uppy.getFiles()
          this.$emit('input', this.files)
        })
        .on('cancel-all', () => {
          this.files = []
          this.$emit('input', this.files)
        })
        .on('file-removed', () => {
          this.files = this.uppy.getFiles()
          this.$emit('input', this.files)
        })
    }
  }
}
</script>
<style scoped>
::v-deep .uppy-size--md .uppy-Dashboard-AddFiles-title {
  font-size: 16px;
}
</style>
