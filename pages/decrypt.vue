<template>
  <div>
    <v-file-input
      v-model="encryptedZipFile"
      accept="application/zip"
      label="Encrypted ZIP file"
    ></v-file-input>
    <v-text-field v-model="secretKey" label="Secret Key"></v-text-field>
    <base-button text="Decrypt" @click="decryptZIP" />
    <base-data-download-button
      :data="zipFile"
      extension="zip"
      text="Download plaintext"
      :disabled="!success"
    />
  </div>
</template>

<script>
const _sodium = require('libsodium-wrappers')

export default {
  data() {
    return {
      secretKey: '',
      encryptedZipFile: new Blob(),
      zipFile: [],
      success: false
    }
  },
  methods: {
    async decryptZIP() {
      this.success = false
      await _sodium.ready
      const sodium = _sodium

      const sk = sodium.from_hex(this.secretKey)
      const pk = sodium.from_hex(this.$store.state.config.publicKey)
      const buf = await this.encryptedZipFile.arrayBuffer()
      const ciphertext = new Uint8Array(buf)
      const decrypted = sodium.crypto_box_seal_open(ciphertext, pk, sk)

      this.zipFile = decrypted
      this.success = true
    }
  }
}
</script>
