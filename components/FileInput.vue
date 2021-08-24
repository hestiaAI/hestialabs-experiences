<template>
  <div>
    <v-select
      v-if="samples.length"
      v-model="selectedSamples"
      :items="samples"
      label="Select sample data"
      hide-details
      style="max-width: 200px"
      class="mb-6 mt-4"
      menu-props="auto, overflowY, offsetY, top"
      multiple
    />
    <div class="caption mb-2">{{ extensionsMessage }}</div>
    <div ref="dashboard" />
    <base-button
      :disabled="processDisabled"
      :progress="loading"
      :status="processStatus"
      :error="error"
      text="Process files"
      class="mt-4"
      @click="processFiles"
    />
  </div>
</template>

<script>
import Uppy from '@uppy/core'
import Dashboard from '@uppy/dashboard'
import DropTarget from '@uppy/drop-target'

import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import '@uppy/drop-target/dist/style.css'

async function fetchSampleFile(filename) {
  const response = await window.fetch(`/data/${filename}`)
  const blob = await response.blob()
  const file = new File([blob], filename)
  return file
}

export default {
  props: {
    samples: {
      type: Array,
      default: () => []
    },
    handleFiles: {
      type: Function,
      required: true
    },
    extensions: {
      type: Array,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    status: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: ''
    }
  },
  data() {
    const config = {
      debug: false,
      allowMultipleUploads: this.multiple,
      restrictions: {
        maxNumberOfFiles: this.multiple ? null : 1,
        allowedFileTypes: this.extensions
      }
    }
    return {
      uppy: new Uppy(config),
      selectedSamples: [],
      filesEmpty: true,
      enableStatus: true
    }
  },
  computed: {
    extensionsMessage() {
      const exts = this.extensions.join(', ')
      return `Allowed file types: ${exts}`
    },
    processDisabled() {
      return this.disabled || this.filesEmpty
    },
    processStatus() {
      return this.status && this.enableStatus
    }
  },
  watch: {
    message(val) {
      if (val) {
        // show message in Uppy Informer
        this.uppy.info(val)
      }
    },
    async selectedSamples(newSamples, oldSamples) {
      if (newSamples.length > oldSamples.length) {
        // some sample was added
        const addedSamples = newSamples.filter(s => !oldSamples.includes(s))
        const files = await Promise.all(addedSamples.map(fetchSampleFile))
        files.forEach(file =>
          this.uppy.addFile({
            name: file.name,
            type: file.type,
            data: file
          })
        )
      } else {
        // some sample was removed
        const removedSamples = oldSamples.filter(s => !newSamples.includes(s))
        removedSamples.forEach(sample => {
          const file = this.uppy.getFiles().find(f => f.name === sample)
          if (file) {
            this.uppy.removeFile(file.id)
          }
        })
      }
    }
  },
  mounted() {
    this.uppy
      .use(Dashboard, {
        target: this.$refs.dashboard,
        inline: true,
        // we're currently not uploading to a server
        hideUploadButton: true,
        proudlyDisplayPoweredByUppy: false,
        theme: 'light',
        width: 600,
        height: 400
      })
      // allow dropping files anywhere on the page
      .use(DropTarget, { target: document.body })
      .on('files-added', () => {
        this.filesEmpty = false
        this.enableStatus = false
      })
      .on('cancel-all', () => {
        this.filesEmpty = true
        this.enableStatus = false
      })
      .on('file-removed', (file, reason) => {
        // ensure selectedSamples is updated if sample file is removed using the Uppy dashboard
        this.selectedSamples = this.selectedSamples.filter(s => s !== file.name)

        if (reason !== 'cancel-all' && !this.uppy.getFiles().length) {
          this.filesEmpty = true
        }

        this.enableStatus = false
      })
  },
  beforeDestroy() {
    this.uppy.close()
  },
  methods: {
    async processFiles() {
      this.enableStatus = true
      const files = this.uppy.getFiles().map(f => f.data)
      if (files.length) {
        await this.handleFiles(files)
      }
    }
  }
}
</script>
