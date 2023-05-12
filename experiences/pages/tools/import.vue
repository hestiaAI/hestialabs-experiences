<template>
  <VContainer>
    <h2>Key Generation</h2>
    <p>
      This step only needs to be done once. Copy the public key in the config
      and store the secret key in a safe place.
    </p>
    <BaseButton @click="generateKeys">
      Generate keys
    </BaseButton>
  </VContainer>
</template>

<script>
import JSZip from 'jszip'
import FileSaver from 'file-saver'
import _sodium from 'libsodium-wrappers'

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
