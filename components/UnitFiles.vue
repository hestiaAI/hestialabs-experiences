<template>
  <div>
    <lazy-the-files-combobox
      v-if="isPlayground"
      @update="filesToExtract = $event"
    />
    <div class="d-flex flex-column flex-sm-row align-start align-sm-end">
      <lazy-the-sample-selector
        v-if="samples.length"
        :value.sync="selectedSamples"
        :items="samples"
        class="my-sm-2 mr-sm-2 mb-2"
      />

      <base-button
        v-bind="{ disabled, progress, status, error }"
        text="Process files"
        class="ma-sm-2"
        @click="processFiles"
      />
    </div>

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

import preprocessors from '@/manifests/preprocessors'
import processFiles from '@/utils/process-files'
import localforage from '@/utils/localforage'
import { processError } from '@/utils/utils'

async function fetchSampleFile({ path, filename }) {
  const response = await window.fetch(path)
  const blob = await response.blob()
  const file = new File([blob], filename)
  return file
}

export default {
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
    preprocessor: {
      type: String,
      default: undefined
    },
    samples: {
      type: Array,
      default: () => []
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
      status: false,
      error: false,
      progress: false,
      filesToExtract: this.files,
      messagePowerUser: ''
    }
  },
  computed: {
    isSingleFileExperience() {
      return !this.filesToExtract.length && !this.multiple
    },
    isPlayground() {
      return this.$route.params.key === 'playground'
    },
    extensionsMessage() {
      const exts = this.extensions.join(', ')
      return `Allowed file types: ${exts}`
    },
    disabled() {
      return this.filesEmpty
    },
    preprocessorFunc() {
      if (!this.preprocessor) {
        // identity
        return val => val
      }
      return preprocessors[this.preprocessor]
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
        files.forEach(file =>
          this.uppy.addFile({
            name: file.name,
            type: file.type,
            data: file
          })
        )
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
      if (
        this.extensions.includes('.zip') &&
        !this.filesToExtract.length &&
        // Does not apply to the playground since there
        // we allow to list the files to extract
        !this.isPlayground
      ) {
        throw new TypeError('Extension `zip` requires `files` to be specified')
      }

      if (this.isSingleFileExperience && this.extensions.length !== 1) {
        throw new Error(
          'Single file is expected but multiple extensions are specified.'
        )
      }
    },
    getMessagePowerUser({
      inputFilesRocketRML: inputFiles,
      extractedFiles: xfiles,
      filesProcessingTime: ms
    }) {
      if (!inputFiles) {
        return ''
      }

      const secs = ms / 1000

      if (this.isSingleFileExperience) {
        // Single file input.<ext>
        return `Success! File registered: ${
          Object.keys(inputFiles)[0]
        }\nTime elapsed: ${secs}`
      }

      if (!xfiles) {
        return 'Unexpected result'
      }

      let msg = `Success! Time elapsed: ${secs} sec.\n`
      Object.entries(xfiles).forEach(([archive, filelist]) => {
        if (!archive) {
          // archive is empty string
          msg += 'Files submitted:'
        } else {
          msg += `Files extracted from ${archive}:`
        }
        msg += `\n${filelist.join('\n')}\n\n`
      })

      return msg.slice(0, -2)
    },
    async processFiles() {
      this.progress = true
      this.error = false
      this.status = false

      const files = this.uppy.getFiles().map(f => f.data)
      if (files.length) {
        try {
          const strictExtraction = !this.isPlayground
          const result = await processFiles(
            files,
            this.filesToExtract,
            strictExtraction,
            this.extensions,
            this.preprocessorFunc,
            this.isSingleFileExperience
          )
          if (this.$store.state.power) {
            this.messagePowerUser = this.getMessagePowerUser(result)
          }
          await localforage.setItem(
            'inputFilesRocketRML',
            result.inputFilesRocketRML,
            this.$route.params.key
          )
          this.$emit('update', result)
        } catch (err) {
          console.error(err)
          this.error = true
          const error = processError(err)
          this.messagePowerUser = error
          this.$emit('update', { error })
        } finally {
          this.status = true
          this.progress = false
        }
      }
    }
  }
}
</script>
