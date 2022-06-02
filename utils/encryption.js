const _sodium = require('libsodium-wrappers')

export function encryptFile(content, publicKey, callback) {
  _sodium.ready
    .then(() => {
      const sodium = _sodium
      const cipherText = sodium.crypto_box_seal(
        content,
        sodium.from_hex(publicKey)
      )
      callback(null, cipherText)
    })
    .catch(error => callback(new Error('Encryption, ' + error.message)))
}

export function decryptBlob(blob, secretKey, publicKey, callback) {
  _sodium.ready
    .then(() => {
      return blob.arrayBuffer()
    })
    .then(buf => {
      const sodium = _sodium
      const sk = sodium.from_hex(secretKey)
      const pk = sodium.from_hex(publicKey)
      const ciphertext = new Uint8Array(buf)
      const decryptedBlob = new Blob([
        sodium.crypto_box_seal_open(ciphertext, pk, sk)
      ])
      callback(null, decryptedBlob)
    })
    .catch(error => callback(new Error('Decryption, ' + error.message)))
}
