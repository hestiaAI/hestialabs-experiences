<template>
  <div>
    <div class="d-flex flex-column flex-sm-row align-start align-sm-end">
      <base-button
        v-bind="{ disabled, progress, status, error }"
        text="Process files"
        icon="mdiStepForward"
        class="my-sm-2 mr-sm-2"
        @click="returnFiles"
      />
    </div>

    <lazy-the-files-combobox
      v-if="isPlayground"
      class="mb-4"
      @update="filesToExtract = $event"
    />

    <lazy-the-sample-selector
      v-if="samples.length"
      :value.sync="selectedSamples"
      :items="samples"
      class="my-sm-2 mr-sm-2 mb-2"
    />

    <div class="caption my-2">{{ extensionsMessage }}</div>

    <div ref="dashboard" />

    <lazy-code-editor
      v-if="$store.state.power"
      :value="messagePowerUser"
      :error="error"
      class="mt-6"
      readonly
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

import BaseButton from '~/components/BaseButton'
async function fetchSampleFile({ path, filename }) {
  const response = await window.fetch(path)
  const blob = await response.blob()
  return new File([blob], filename)
}

export default {
  name: 'UnitFiles',
  components: { BaseButton },
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
      restrictions: this.extensions
        ? {}
        : {
            maxNumberOfFiles: this.multiple ? null : 1,
            allowedFileTypes: this.extensions
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
      messagePowerUser: '',
      cachedResult: null
    }
  },
  computed: {
    key() {
      return this.$route.params.key
    },
    isSingleFileExperience() {
      return !this.filesToExtract.length && !this.multiple
    },
    isPlayground() {
      return this.key === 'playground'
    },
    extensionsMessage() {
      const exts = this.extensions.join(', ')
      return `Allowed file types: ${exts}`
    },
    disabled() {
      return this.filesEmpty
    },
    saveFiles() {
      return this.$store.state.config.saveFiles
    }
  },
  watch: {
    $props: {
      immediate: true,
      handler() {
        this.validateProps()
      }
    },
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
    validateProps() {
      if (this.isPlayground || this.isGenericViewer) return
      if (this.extensions.includes('.zip') && !this.filesToExtract.length) {
        throw new TypeError('Extension `zip` requires `files` to be specified')
      }

      if (this.isSingleFileExperience && this.extensions.length !== 1) {
        throw new Error(
          'Single file is expected but multiple extensions are specified.'
        )
      }
    },
    returnFiles() {
      const files = this.uppy.getFiles().map(f => f.data)
      this.status = true
      this.$emit('update', files)
    }
  }
}
</script>
