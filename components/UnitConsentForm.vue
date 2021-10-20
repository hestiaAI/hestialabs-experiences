<template>
  <v-form>
    <v-card class="pa-2 my-6">
      <v-card-title class="justify-center">Export Results</v-card-title>
      <v-card-text>
        <unit-consent-form-section
          v-for="(section, index) in $store.state.config.consent"
          :key="`section-${index}`"
          v-bind="{ section, index }"
          @change="updateConsent"
        />
        <h2 class="mb-2 mt-2">Results to include</h2>
        <v-checkbox
          v-for="(items, index) in allItems"
          :key="`data-${index}`"
          v-model="includedResults"
          :dense="true"
          :disabled="items.length === 0"
          :label="defaultView[index].title"
          :value="index"
        ></v-checkbox>
        <base-button
          text="Generate ZIP"
          :status="generateStatus"
          :error="generateError"
          :progress="generateProgress"
          @click="generateZIP"
        />
        <base-data-download-button
          :data="encryptedZipFile"
          extension="zip"
          text="Download encrypted"
          :disabled="!zipReady"
        />
        <base-button
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
      </v-card-text>
    </v-card>
  </v-form>
</template>

<script>
import JSZip from 'jszip'

const _sodium = require('libsodium-wrappers')

export default {
  props: {
    allItems: {
      type: Object,
      required: true
    },
    allHeaders: {
      type: Object,
      required: true
    },
    defaultView: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      consent: JSON.parse(JSON.stringify(this.$store.state.config.consent)),
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
    }
  },
  watch: {
    includedResults: {
      deep: true,
      handler(includedResults) {
        this.resetStatus()
      }
    }
  },
  methods: {
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
        content.items = JSON.parse(this.allItems[i])
        content.headers = JSON.parse(this.allHeaders[i])
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
    updateConsent({ index, selected }) {
      this.consent[index].selected = selected
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
