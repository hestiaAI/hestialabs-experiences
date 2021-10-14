<template>
  <v-form>
    <h1>Consent Form</h1>
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
    <base-button text="Generate ZIP" @click="generateZIP" />
    <base-data-download-button
      :data="zipFile"
      extension="zip"
      text="Download plaintext"
      :disabled="!success"
    />
    <base-data-download-button
      :data="encryptedZipFile"
      extension="zip"
      text="Download encrypted"
      :disabled="!success"
    />
    <base-button text="Send encrypted" :disabled="!success" @click="sendForm" />
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
      success: false
    }
  },
  methods: {
    switchForm() {
      this.showForm = !this.showForm
    },
    async generateZIP() {
      this.success = false

      const zip = new JSZip()

      // Add info about the experience
      const manifest = this.$store.getters.manifest(this.$route)
      const experience = {
        key: manifest.key,
        timestamp: Date.now()
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
      this.success = true
    },
    sendForm() {
      throw new Error('not implemented')
    },
    updateConsent({ index, selected }) {
      this.consent[index].selected = selected
    }
  }
}
</script>
