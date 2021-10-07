<template>
  <base-button text="Generate keys" @click="generateKeys" />
</template>

<script>
import JSZip from 'jszip'
import FileSaver from 'file-saver'

const _sodium = require('libsodium-wrappers')

export default {
  methods: {
    async generateKeys() {
      await _sodium.ready
      const sodium = _sodium

      const key = sodium.crypto_box_keypair()
      const pk = sodium.to_hex(key.publicKey)
      const sk = sodium.to_hex(key.privateKey)
      const zip = new JSZip()
      zip.file('public-key.txt', pk)
      zip.file('secret-key.txt', sk)
      const content = await zip.generateAsync({ type: 'blob' })
      FileSaver.saveAs(content, 'keys.zip')
    }
  }
}
</script>
