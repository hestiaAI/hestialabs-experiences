<template>
  <VForm>
    <VCard class="pa-2 my-6">
      <VCardText>
        <UnitConsentFormSection
          v-for="(section, index) in consent"
          :key="`section-${index}`"
          v-bind="{ section, index, dataCheckboxDisabled, showDataExplorer }"
          @change="updateConsent"
        />
        <BaseButton
          text="Generate ZIP"
          :status="generateStatus"
          :error="generateError"
          :progress="generateProgress"
          :disabled="
            missingRequired ||
            missingRequiredDataProcessing.length > 0 ||
            missingRequiredData.length > 0
          "
          @click="generateZIP"
        />
        <BaseButtonDownloadData
          :data="encryptedZipFile"
          extension="zip"
          text="Download encrypted"
          :disabled="!zipReady"
        />
        <BaseButton
          text="Send encrypted"
          :status="sentStatus"
          :error="sentError"
          :progress="sentProgress"
          :disabled="!zipReady || (sentStatus && !sentError)"
          @click="sendForm"
        />
        <p v-if="zipReady">ZIP size: {{ zipSizeString }}</p>
        <p v-if="sentError">
          Sending failed. Please download the file and send it by email.
        </p>
        <p v-if="sentStatus && !sentError">Form successfully submitted.</p>
        <p v-if="missingRequired">Some required fields are not filled in.</p>
        <p v-if="missingRequiredDataProcessing.length > 0">
          Some data required for sending this form has not been processed ({{
            missingRequiredDataProcessing.join(', ')
          }}).
        </p>
        <p v-if="missingRequiredData.length > 0">
          Some data required for sending this form has not been included ({{
            missingRequiredData.join(', ')
          }}).
        </p>
      </VCardText>
    </VCard>
  </VForm>
</template>

<script>
import JSZip from 'jszip'
import FileManager from '~/utils/file-manager.js'
import { humanReadableFileSize } from '~/manifests/utils'

const _sodium = require('libsodium-wrappers')

// In the case of changes that would break the import, this version number must be incremented
// and the function versionCompatibilityHandler of import.vue must be able to handle previous versions.
const VERSION = 2

export default {
  props: {
    consentForm: {
      type: Array,
      required: true
    },
    allResults: {
      type: Array,
      required: true
    },
    defaultView: {
      type: Array,
      required: true
    },
    fileManager: {
      type: FileManager,
      required: true
    },
    showDataExplorer: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      consent: JSON.parse(JSON.stringify(this.consentForm)),
      includedResults: [],
      zipFile: [],
      encryptedZipFile: [],
      generateStatus: false,
      generateError: false,
      generateProgress: false,
      sentStatus: false,
      sentError: false,
      sentProgress: false,
      timestamp: 0
    }
  },
  computed: {
    zipReady() {
      return this.generateStatus && !this.generateError
    },
    missingRequired() {
      // If one section with attribute required has not been filled
      return !this.consent.every(section => {
        if ('required' in section) {
          if (section.type === 'checkbox') {
            // At least one checkbox must be selected
            return section.selected.length > 0
          } else if (section.type === 'radio') {
            // A radio button must be selected
            return section.selected !== ''
          } else if (section.type === 'input' || section.type === 'multiline') {
            // Some text must be given
            return 'value' in section && section.value !== ''
          } else if (
            section.type === 'data' &&
            typeof section.required === 'boolean'
          ) {
            // Some data must be given
            return section.includedResults.length > 0
          }
        }
        return true
      })
    },
    missingRequiredDataProcessing() {
      const section = this.consent.find(section => section.type === 'data')
      return this.defaultView
        .filter(
          (block, i) =>
            typeof section.required === 'object' &&
            section.required.includes(block.key) &&
            typeof this.allResults[i] === 'undefined'
        )
        .map(block => block.title)
    },
    missingRequiredData() {
      const section = this.consent.find(section => section.type === 'data')
      return this.defaultView
        .filter(
          block =>
            typeof section.required === 'object' &&
            section.required.includes(block.key) &&
            !section.includedResults.includes(block.key)
        )
        .map(block => block.title)
    },
    dataCheckboxDisabled() {
      return this.allResults.map(r => typeof r === 'undefined')
    },
    key() {
      return this.$route.params.key
    },
    zipSizeString() {
      return humanReadableFileSize(this.encryptedZipFile.length)
    }
  },
  watch: {
    includedResults: {
      deep: true,
      handler() {
        this.resetStatus()
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      // Add titles and keys to the data section
      const section = this.consent.find(section => section.type === 'data')
      section.titles = this.defaultView.map(e => e.title)
      section.keys = this.defaultView.map(e => e.key)
      // Copy included results preset
      section.includedResults = section.includedResults ?? []
      this.includedResults = section.includedResults ?? []
    },
    switchForm() {
      this.showForm = !this.showForm
    },
    async generateZIP() {
      this.resetStatus()
      this.generateProgress = true

      const zip = new JSZip()

      // Add info about the experience
      const manifest = this.$store.getters.manifest(this.$route)
      this.timestamp = Date.now()
      const experience = {
        key: manifest.key,
        timestamp: this.timestamp,
        version: VERSION
      }
      zip.file('experience.json', JSON.stringify(experience))

      // Add consent log
      zip.file('consent.json', JSON.stringify(this.consent))

      // Add included data
      const keys = this.defaultView.map(block => block.key)
      this.includedResults
        .map(key => keys.indexOf(key))
        .filter(i => i !== -1)
        .forEach(i => {
          const content = JSON.parse(JSON.stringify(this.defaultView[i]))
          content.result = JSON.parse(this.allResults[i])
          content.index = i
          zip.file(
            `block${i.toString().padStart(2, '0')}.json`,
            JSON.stringify(content)
          )
        })

      // Add whole files
      if (this.includedResults.includes('file-explorer')) {
        const zipFilesFolder = zip.folder('files')
        const files = this.$store.state.selectedFiles[this.key] ?? []
        for (const file of files) {
          zipFilesFolder.file(
            file.filename,
            this.fileManager.fileDict[file.filename]
          )
        }
      }

      const content = await zip.generateAsync({ type: 'uint8array' })
      this.zipFile = content

      // Encrypt the zip
      await _sodium.ready
      const sodium = _sodium

      const ciphertext = sodium.crypto_box_seal(
        content,
        sodium.from_hex(this.$store.state.config.publicKey)
      )

      this.encryptedZipFile = ciphertext
      this.generateStatus = true
      this.generateProgress = false
    },
    sendForm() {
      this.sentStatus = false
      this.sentError = false
      this.sentProgress = true

      // Programmatically create the form data
      // Names must correspond to the dummy form defined in /static/export-data-form-dummy.html
      const formData = new FormData()
      formData.append('form-name', 'export-data')
      const zipBlob = new Blob(
        [this.encryptedZipFile],
        { type: 'application/zip' },
        `exported-data-${this.timestamp}.zip`
      )
      formData.append('encrypted-zip', zipBlob)
      fetch('/', {
        method: 'POST',
        body: formData
      })
        .then(() => {
          this.sentStatus = true
          this.sentProgress = false
        })
        .catch(error => {
          console.error(error)
          this.sentError = true
        })
    },
    updateConsent({ index, selected, value, includedResults }) {
      const section = this.consent[index]
      if (section.type === 'checkbox' || section.type === 'radio') {
        section.selected = selected
      } else if (section.type === 'input' || section.type === 'multiline') {
        section.value = value
      } else if (section.type === 'data') {
        section.includedResults = includedResults
        this.includedResults = includedResults
      }
      // For reactivity
      this.$set(this.consent, index, section)

      this.resetStatus()
    },
    resetStatus() {
      this.generateStatus = false
      this.generateError = false
      this.sentStatus = false
      this.sentError = false
    }
  }
}
</script>
