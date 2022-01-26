<template>
  <div>
    <LazyUnitFilesCombobox
      v-if="isPlayground"
      class="mb-4"
      @update="filesToExtract = $event"
    />

    <LazyUnitFilesSampleSelector
      v-if="samples.length"
      :value.sync="selectedSamples"
      :items="samples"
      class="mb-4"
    />

    <div ref="dashboard" />

    <BaseButton
      v-bind="{ disabled, progress, status, error }"
      text="Process files"
      icon="mdiStepForward"
      class="my-sm-2 mr-sm-4"
      @click="returnFiles"
    />
    <UnitFilesDialog :file-globs="Object.values(files)" main />
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
    files: {
      type: Object,
      required: true
    },
    samples: {
      type: Array,
      default: () => []
    }
  },
  data() {
    const config = {
      debug: false,
      allowMultipleUploads: true
    }
    return {
      uppy: new Uppy(config),
      selectedSamples: [],
      filesEmpty: true,
      status: false,
      error: false,
      progress: false,
      filesToExtract: this.files
    }
  },
  computed: {
    key() {
      return this.$route.params.key
    },
    isPlayground() {
      return this.key === 'playground'
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
      const uppyFiles = this.uppy.getFiles().map(f => f.data)
      this.status = true
      this.$emit('update', { uppyFiles })
    }
  }
}
</script>
