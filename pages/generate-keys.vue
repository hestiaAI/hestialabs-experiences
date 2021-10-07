<template>
  <base-button text="Generate keys" @click="generateKeys" />
</template>

<script>
import { box } from 'tweetnacl'
import { encodeBase64 } from 'tweetnacl-util'
import JSZip from 'jszip'
import FileSaver from 'file-saver'

export default {
  methods: {
    async generateKeys() {
      const keys = box.keyPair()
      const pk = encodeBase64(keys.publicKey)
      const sk = encodeBase64(keys.secretKey)
      const zip = new JSZip()
      zip.file('public-key.txt', pk)
      zip.file('secret-key.txt', sk)
      const content = await zip.generateAsync({ type: 'blob' })
      FileSaver.saveAs(content, 'keys.zip')
    }
  }
}
</script>
