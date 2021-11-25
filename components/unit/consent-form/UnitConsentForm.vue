<template>
  <VForm v-if="consent">
    <VCard class="pa-2 my-6">
      <VCardTitle class="justify-center">Export Results</VCardTitle>
      <VCardText>
        <UnitConsentFormSection
          v-for="(section, index) in consent"
          :key="`section-${index}`"
          v-bind="{ section, index }"
          @change="updateConsent"
        />
        <h2 class="mb-2 mt-2">Results to include</h2>
        <VCheckbox
          v-for="(result, index) in allResults"
          :key="`data-${index}`"
          v-model="includedResults"
          :dense="true"
          :disabled="!result"
          :label="defaultView[index].title"
          :value="index"
        ></VCheckbox>
        <BaseButton
          text="Generate ZIP"
          :status="generateStatus"
          :error="generateError"
          :progress="generateProgress"
          :disabled="missingRequired"
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
        <p v-if="sentError">
          Sending failed. Please download the file and send it by email.
        </p>
        <p v-if="sentStatus && !sentError">Form successfully submitted.</p>
      </VCardText>
    </VCard>
  </VForm>
</template>

<script>
import JSZip from 'jszip'

const _sodium = require('libsodium-wrappers')

export default {
  props: {
    allResults: {
      type: Array,
      required: true
    },
    defaultView: {
      type: Array,
      required: true
    }
    // consentForm: {
    //   type: Array,
    //   required: true
    // }
  },
  data() {
    return {
      consent: null,
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
      if (!this.consent) {
        return false
      }
      // If one section with attribute required has not been filled
      return !this.consent.every(section => {
        if ('required' in section || section.required) {
          if (section.type === 'checkbox') {
            // At least one checkbox must be selected
            return section.selected.length > 0
          } else if (section.type === 'radio') {
            // A radio button must be selected
            return section.selected !== ''
          } else if (section.type === 'input') {
            // Some text must be given
            return 'value' in section && section.value !== ''
          }
        }
        return true
      })
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
    this.initConsent()
  },
  methods: {
    initConsent() {
      const consent = this.$store.state.config.consent
      const key = this.$route.params.key
      if (key in consent) {
        this.consent = JSON.parse(JSON.stringify(consent[key]))
      } else if ('default' in consent) {
        this.consent = JSON.parse(JSON.stringify(consent.default))
      }
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
        timestamp: this.timestamp
      }
      zip.file('experience.json', JSON.stringify(experience))

      // Add consent log
      zip.file('consent.json', JSON.stringify(this.consent))

      // Add included data
      this.includedResults.forEach(i => {
        const content = JSON.parse(JSON.stringify(this.defaultView[i]))
        content.result = JSON.parse(this.allResults[i])
        zip.file(`block${i}.json`, JSON.stringify(content))
      })

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
    updateConsent({ index, selected, value }) {
      const section = this.consent[index]
      if (section.type === 'checkbox' || section.type === 'radio') {
        section.selected = selected
      } else if (section.type === 'input') {
        section.value = value
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
