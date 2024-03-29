<template>
  <div>
    <template v-if="samples.length">
      <VRow justify="center" dense>
        <VCol align="center">
          <UnitFilesSampleSelector
            :value.sync="selectedSamples"
            :items="samples"
            class="mb-4"
          />
        </VCol>
      </VRow>
      <VRow>
        <VCol align="center" class="font-weight-bold">
          {{ $t('unit-files.or') }}
        </VCol>
      </VRow>
    </template>
    <VRow>
      <VCol align="center">
        <div ref="dashboard" />
      </VCol>
    </VRow>
    <VRow>
      <VCol class="d-flex align-center justify-center">
        <div class="unit-files__decrypt-button">
          <BaseButtonDialog
            :dialog-title="$t('decrypt-files.title')"
            tooltip-position="left"
            :tooltip-label="$t('decrypt-files.title')"
            mdi-icon="mdiLockOpenVariant"
          >
            <VTextField
              v-model="privateKey"
              :label="$t('decrypt-files.sk-label')"
              clearable
            />
            <VTextField
              v-model="publicKey"
              :label="$t('decrypt-files.pk-label')"
              clearable
            />
          </BaseButtonDialog>
        </div>
        <div class="unit-files__explore-button">
          <BaseButton
            v-bind="{ disabled, progress, status, error }"
            text="unit-files.run-btn"
            mdi-icon="mdiStepForward"
            class="my-sm-2 mr-sm-4"
            @click="returnFiles"
          />
        </div>
        <div class="unit-files__files-button">
          <UnitFilesDialog :file-globs="Object.values(files)" main />
        </div>
      </VCol>
    </VRow>
    <VRow>
      <VCol>
        <template v-if="progress">
          <BaseProgressCircular class="mr-2" />
          <span>{{ $t('unit-files.process-msg') }}</span>
        </template>
        <template v-else-if="readError || error || success">
          <BaseAlert
            :type="readError || error ? 'error' : 'success'"
            border="left"
            dense
            text
          >
            {{ readError ? readErrorMsg : message }}
          </BaseAlert>
        </template>
      </VCol>
    </VRow>
  </div>
</template>

<script>
import { promisify } from 'util'
import { mapState } from '@/utils/store-helper'

import Uppy from '@uppy/core'
import Dashboard from '@uppy/dashboard'
import DropTarget from '@uppy/drop-target'

import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import '@uppy/drop-target/dist/style.css'

import English from '@uppy/locales/lib/en_US'
import French from '@uppy/locales/lib/fr_FR'

import { decryptBlob } from '@/utils/encryption'
import { BrowserFile } from '@/utils/file-manager'
import BaseProgressCircular from '@/components/base/BaseProgressCircular.vue'
import BaseAlert from '@/components/base/BaseAlert.vue'
import BaseButton from '@/components/base/button/BaseButton.vue'
import UnitFilesDialog from './UnitFilesDialog.vue'
import BaseButtonDialog from '@/components/base/button/BaseButtonDialog.vue'
import UnitFilesSampleSelector from './UnitFilesSampleSelector.vue'

const locales = {
  en: English,
  fr: French
}

const stringsOverride = {
  en: {
    cancel: 'Clear all'
  },
  fr: {
    cancel: 'Effacer tout'
  }
}

async function fetchSampleFile({ url, filename }) {
  const response = await window.fetch(url)
  const blob = await response.blob()
  return new File([blob], filename)
}

export default {
  name: 'UnitFiles',
  components: { BaseProgressCircular, BaseAlert, BaseButton, UnitFilesDialog, BaseButtonDialog, UnitFilesSampleSelector },
  props: {
    progress: {
      type: Boolean,
      default: false
    },
    success: {
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
    return {
      uppy: null,
      selectedSamples: [],
      filesEmpty: true,
      status: false,
      dialog: false,
      privateKey: null,
      publicKey: null,
      readError: false,
      readErrorMsg: ''
    }
  },
  computed: {
    ...mapState(['fileManager', 'bubbleConfig']),
    ...mapState({
      files: state => state.experienceConfig.files,
      samples: state => state.experienceConfig.dataSamples.map(
        url => ({ url, filename: url.match(/filename=([^&?]+)/)[1] })
      )
    }),
    disabled() {
      return this.filesEmpty
    }
  },
  watch: {
    '$i18n.locale'(locale) {
      this.uppy.setOptions({
        locale: locales[locale]
      })
      this.uppy.getPlugin('Dashboard').setOptions({
        locale: {
          strings: stringsOverride[locale]
        }
      })
    },
    // Watch filemanager to detect a reset of the store, if it is null
    // we also delete files in the Uppy dashboard
    fileManager() {
      if (this.fileManager === null && this.uppy) {
        this.uppy.reset()
      }
    },
    // Watch files, if user empty all files we reset the store and delete all files
    filesEmpty() {
      if (this.filesEmpty && this.fileManager) {
        this.$store.commit('xp/clearStore')
      }
    },
    async selectedSamples(newSamples, oldSamples) {
      if (newSamples.length > oldSamples.length) {
        // some sample was added
        const addedSamples = newSamples.filter(ns => !oldSamples.find(os => os.filename === ns.filename))
        const files = await Promise.all(addedSamples.map(fetchSampleFile))
        files.forEach((file) => {
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
        const removedSamples = oldSamples.filter(os => !newSamples.find(ns => ns.filename === os.filename))
        removedSamples.forEach((sample) => {
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
    this.initUppy()
  },
  beforeDestroy() {
    this.uppy.close()
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
          height: 300,
          locale: {
            strings: stringsOverride[this.$i18n.locale]
          }
        })
        .use(DropTarget, {
        // allow dropping files anywhere on the page
          target: document.body
        })
        .on('files-added', () => {
          this.filesEmpty = false
        })
        .on('cancel-all', () => {
          this.filesEmpty = true
          this.selectedSamples = []
        })
        .on('file-removed', (file, reason) => {
          if (reason === 'removed-by-user') {
          // ensure selectedSamples is updated if sample file is removed using the Uppy dashboard
            this.selectedSamples = this.selectedSamples.filter(s => s.filename !== file.name)
          }
          if (reason !== 'cancel-all' && !this.uppy.getFiles().length) {
            this.filesEmpty = true
          }
        })
    },
    async decryptFiles(uppyFiles) {
      const decryptBlobPromise = promisify(decryptBlob)
      const publicKey = this.publicKey || this.bubbleConfig.publicKey
      const decryptedFiles = await Promise.all(uppyFiles.map(async(f) => {
        const blob = await decryptBlobPromise(f.data, this.privateKey, publicKey)
        return new File([blob], f.name)
      }))
      return decryptedFiles
    },
    async returnFiles() {
      this.readError = false
      this.readErrorMsg = ''
      try {
        let files = this.uppy.getFiles()
        if (this.privateKey) {
          files = await this.decryptFiles(files)
        } else {
          files = files.map(f => f.data)
        }
        this.status = true
        this.$emit('update', { uppyFiles: files.map(f => new BrowserFile(f)) })
      } catch (error) {
        console.error(error)
        this.readError = true
        this.readErrorMsg = String(error)
      }
    }
  }
}
</script>

<style scoped>
::v-deep .uppy-Dashboard-AddFiles-title {
  font-size: 1rem;
}
::v-deep .uppy-Dashboard-inner {
  margin: auto;
}
</style>
