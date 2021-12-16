<template>
  <div>
    <div class="d-flex flex-column flex-sm-row align-start align-sm-end">
      <BaseButton
        v-bind="{ disabled, progress, status, error }"
        text="Process files"
        icon="mdiStepForward"
        class="my-sm-2 mr-sm-2"
        @click="returnFiles"
      />
    </div>

    <LazyUnitFilesCombobox
      v-if="isPlayground"
      class="mb-4"
      @update="filesToExtract = $event"
    />

    <LazyUnitFilesSampleSelector
      v-if="samples.length"
      :value.sync="selectedSamples"
      :items="samples"
      class="my-sm-2 mr-sm-2 mb-2"
    />

    <div class="caption my-2">{{ extensionsMessage }}</div>

    <div ref="dashboard" />
  </div>
</template>

<script>
import Uppy from '@uppy/core'
import Dashboard from '@uppy/dashboard'
import DropTarget from '@uppy/drop-target'

import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import '@uppy/drop-target/dist/style.css'

async function fetchSampleFile({ path, filename }) {
  const response = await window.fetch(path)
  const blob = await response.blob()
  return new File([blob], filename)
}

export default {
  name: 'UnitFiles',
  props: {
    extensions: {
      type: Array,
      required: true
    },
    files: {
      type: Array,
      required: true
    },
    multiple: {
      type: Boolean,
      default: false
    },
    samples: {
      type: Array,
      default: () => []
    },
    allowMissingFiles: {
      type: Boolean,
      default: false
    },
    isGenericViewer: Boolean
  },
  data() {
    const config = {
      debug: false,
      allowMultipleUploads: this.multiple,
      restrictions: {
        maxNumberOfFiles: this.multiple ? null : 1,
        allowedFileTypes: this.extensions.length > 0 ? this.extensions : null
      }
    }
    return {
      uppy: new Uppy(config),
      selectedSamples: [],
      filesEmpty: true,
      status: false,
      error: false,
      progress: false,
      filesToExtract: this.files,
      cachedResult: null
    }
  },
  computed: {
    key() {
      return this.$route.params.key
    },
    isPlayground() {
      return this.key === 'playground'
    },
    extensionsMessage() {
      const exts = this.extensions.join(', ')
      return `${this.multiple ? 'Multiple files' : 'One file'} allowed (${
        exts.length > 0 ? exts : 'any extension'
      })`
    },
    disabled() {
      return this.filesEmpty
    }
  },
  watch: {
    async selectedSamples(newSamples, oldSamples) {
      if (newSamples.length > oldSamples.length) {
        // some sample was added
        const addedSamples = newSamples.filter(
          ns => !oldSamples.find(os => os.key === ns.key)
        )
        const files = await Promise.all(addedSamples.map(fetchSampleFile))
        files.forEach(file => {
          try {
            this.uppy.addFile({
              name: file.name,
              type: file.type,
              data: file
            })
          } catch (error) {
            // addFile gives an error if the file cannot be added
            // -> most likely restrictions checks failed
            this.selectedSamples = oldSamples
            this.uppy.info(error.message)
          }
        })
      } else {
        // some sample was removed
        const removedSamples = oldSamples.filter(
          os => !newSamples.find(ns => ns.key === os.key)
        )
        removedSamples.forEach(sample => {
          const file = this.uppy
            .getFiles()
            .find(f => f.name === sample.filename)
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
        width: 550,
        height: 200
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
        if (reason === 'removed-by-user') {
          // ensure selectedSamples is updated if sample file is removed using the Uppy dashboard
          this.selectedSamples = this.selectedSamples.filter(
            s => s.filename !== file.name
          )
        }

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
    returnFiles() {
      const files = this.uppy.getFiles().map(f => f.data)
      this.status = true
      this.$emit('update', files)
    }
  }
}
</script>
