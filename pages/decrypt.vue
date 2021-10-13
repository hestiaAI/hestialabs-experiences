<template>
  <div>
    <v-file-input
      v-model="inputZIP"
      accept="application/zip"
      label="Encrypted or plaintext ZIP file"
    ></v-file-input>
    <v-checkbox v-model="decrypt" label="Decrypt"></v-checkbox>
    <v-text-field
      v-model="secretKey"
      label="Secret Key"
      :disabled="!decrypt"
    ></v-text-field>
    <base-button text="Import" @click="importZIP" />
    <base-data-download-button
      :data="outputZIP"
      extension="zip"
      text="Download plaintext"
      :disabled="!success"
    />
    <template v-if="success">
      <v-card class="pa-2 my-6">
        <v-card-title class="justify-center">Experience Details</v-card-title>
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title>Experience</v-list-item-title>
            <v-list-item-subtitle>{{ experience.key }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title>Date</v-list-item-title>
            <v-list-item-subtitle>{{
              new Date(experience.timestamp)
            }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </template>
  </div>
</template>

<script>
import JSZip from 'jszip'

const _sodium = require('libsodium-wrappers')

export default {
  data() {
    return {
      secretKey: '',
      inputZIP: new Blob(),
      decrypt: false,
      outputZIP: [],
      success: false,
      experience: null
    }
  },
  methods: {
    async importZIP() {
      this.success = false
      await _sodium.ready
      const sodium = _sodium

      // Decrypt
      if (this.decrypt) {
        const sk = sodium.from_hex(this.secretKey)
        const pk = sodium.from_hex(this.$store.state.config.publicKey)
        const buf = await this.inputZIP.arrayBuffer()
        const ciphertext = new Uint8Array(buf)
        this.outputZIP = sodium.crypto_box_seal_open(ciphertext, pk, sk)
      } else {
        this.outputZIP = this.inputZIP
      }

      // Extract files
      const zip = new JSZip()
      await zip.loadAsync(this.outputZIP)
      this.experience = JSON.parse(
        await zip.file('experience.json').async('string')
      )
      console.log(this.experience)

      this.success = true
    }
  }
}
</script>
