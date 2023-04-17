import SparkMD5 from 'spark-md5'

import _sodium from 'libsodium-wrappers'

export async function encryptFile(content, publicKey) {
  await _sodium.ready
  const publicKeyB = _sodium.from_hex(publicKey)
  const cipherText = _sodium.crypto_box_seal(content, publicKeyB)
  return cipherText
}

export async function hybridEncrypt(content, publicKey){
  await _sodium.ready
  // Generate a random symmetric key
  const symmetricKey = _sodium.crypto_secretbox_keygen()

  // Encrypt the plaintext data using the symmetric key
  const nonce = _sodium.randombytes_buf(_sodium.crypto_secretbox_NONCEBYTES)
  const ciphertext = _sodium.crypto_secretbox_easy(content, nonce, symmetricKey)

  // Encrypt the symmetric key using the recipient's public key
  const recipientPublicKey = _sodium.from_hex(publicKey)
  const encryptedSymmetricKey = _sodium.crypto_box_seal(symmetricKey, recipientPublicKey)

  // nonce, encrypted symmetric key and ciphertext should all be concatenated
  // but for the receiver to separate them after encryption he needs to know their size
  // the size of the nonce is always the same, the ciphetext varies,
  // but apparently the size of the encrypted symmetric key is not fixed?

  // // Combine the encrypted symmetric key and the symmetric ciphertext to form the final ciphertext
  // const finalCiphertext = new Uint8Array(encryptedSymmetricKey.length + nonce.length + ciphertext.length)
  // finalCiphertext.set(encryptedSymmetricKey, _sodium.crypto_secretbox_MACBYTES)
  // // finalCiphertext.set(_sodium.crypto_secretbox_MAC(ciphertext, nonce, symmetricKey), encryptedSymmetricKey.length)
  // finalCiphertext.set(nonce, _sodium.crypto_secretbox_MACBYTES + encryptedSymmetricKey.length )
  // finalCiphertext.set(ciphertext, _sodium.crypto_secretbox_MACBYTES + encryptedSymmetricKey.length + nonce.length)
  // return finalCiphertext

}

export async function hybridDecrypt(encrypted, secretKey, publicKey){
  await _sodium.ready
  const eskLength = _sodium.crypto_box_SEALBYTES + _sodium.crypto_secretbox_KEYBYTES
  const nonceLength = _sodium.crypto_secretbox_NONCEBYTES
  const encryptedSymmetricKey = encrypted.subarray(0, eskLength)
  const nonce = encrypted.subarray(eskLength, eskLength + nonceLength)
  const encryptedContent = encrypted.subarray(eskLength + nonceLength)

  // Decrypt the message using the extracted symmetric key and nonce
  const sk = _sodium.from_hex(secretKeyHex)
  const pk = _sodium.from_hex(publicKey)
  const symmetricKey = _sodium.crypto_box_seal_open(encryptedSymmetricKey, pk, sk)
  return _sodium.crypto_secretbox_open_easy(encryptedContent, nonce, symmetricKey)
}

export async function decryptBytes(blob, secretKey, publicKey) {
  await _sodium.ready
  const buffer = await blob.arrayBuffer()
  const sk = _sodium.from_hex(secretKey)
  const pk = _sodium.from_hex(publicKey)
  const ciphertext = new Uint8Array(buffer)
  return _sodium.crypto_box_seal_open(ciphertext, pk, sk)
}

export function decryptBlob(blob, secretKey, publicKey, callback) {
  _sodium.ready
    .then(async() => {
      // const buf = await blob.arrayBuffer()
      // const sodium = _sodium
      // const sk = sodium.from_hex(secretKey)
      // const pk = sodium.from_hex(publicKey)
      // const ciphertext = new Uint8Array(buf)
      const bytes = decryptBytes(blob, secretKey, publicKey)
      const decryptedBlob = new Blob([bytes])
      callback(null, decryptedBlob)
    })
    .catch(error => callback(new Error('Decryption, ' + error.message)))
}

export function hashString(string) {
  const spark = new SparkMD5()
  spark.append(string)
  return spark.end()
}

// https://github.com/satazor/js-spark-md5
export function hashFile(file) {
  return new Promise(function(resolve, reject) {
    const blobSlice = File.prototype.slice
    // Read in chunks of 2MB
    const chunkSize = 2097152
    const chunks = Math.ceil(file.size / chunkSize)
    let currentChunk = 0
    const spark = new SparkMD5.ArrayBuffer()
    const fileReader = new FileReader()

    fileReader.onload = function(e) {
      spark.append(e.target.result) // Append array buffer
      currentChunk++
      if (currentChunk < chunks) {
        loadNext()
      } else {
        resolve(spark.end())
      }
    }

    fileReader.onerror = function() {
      reject(new Error('hashing failed'))
    }

    function loadNext() {
      const start = currentChunk * chunkSize
      const end = Math.min(file.size, start + chunkSize)

      fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
    }

    loadNext()
  })
}
