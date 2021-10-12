<template>
  <v-container>
    <v-row>
      <v-col>
        <base-button text="consent form" @click="switchForm" />
      </v-col>
    </v-row>
    <v-form v-if="showForm">
      <template v-for="(section, name, i) in $store.state.config.consent">
        <h2 :key="`${i}-1`">{{ section.title }}</h2>
        <v-radio-group
          :key="`${i}-2`"
          :value="section.selected"
          @change="option => updateConsent(option, name)"
        >
          <v-radio
            v-for="(option, j) in section.options"
            :key="j"
            :label="option"
            :value="option"
          ></v-radio>
        </v-radio-group>
      </template>
      <v-row>
        <v-col> <h2 class="mb-2 mt-2">Results to include</h2> </v-col>
      </v-row>
      <v-checkbox
        v-for="(items, index) in allItems"
        :key="index"
        v-model="includedResults"
        :dense="true"
        :disabled="items.length === 0"
        :label="'Data block ' + index"
        :value="[index, JSON.stringify(items)]"
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
      <base-button
        text="Send encrypted"
        :disabled="!success"
        @click="sendForm"
      />
    </v-form>
  </v-container>
</template>

<script>
import JSZip from 'jszip'

const _sodium = require('libsodium-wrappers')

export default {
  props: {
    allItems: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showForm: false,
      consent: null,
      includedResults: [],
      zipFile: [],
      encryptedZipFile: [],
      success: false
    }
  },
  watch: {
    consent: {
      immediate: true,
      handler(consent) {
        // Initialize
        if (!consent) {
          this.consent = this.$store.state.config.consent
        }
      }
    }
  },
  methods: {
    switchForm() {
      this.showForm = !this.showForm
    },
    async generateZIP() {
      this.success = false

      const zip = new JSZip()

      zip.file('consent.json', JSON.stringify(this.consent))

      this.includedResults.forEach(result =>
        zip.file(`block${result[0]}.json`, result[1])
      )

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
    updateConsent(option, name) {
      this.consent[name].selected = option
    }
  }
}
</script>
