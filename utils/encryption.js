import SparkMD5 from 'spark-md5'

import _sodium from 'libsodium-wrappers'

export async function encryptFile(content, publicKey) {
  await _sodium.ready
  const publicKeyB = _sodium.from_hex(publicKey)
  const cipherText = _sodium.crypto_box_seal(content, publicKeyB)
  return cipherText
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

export function hashString(string) {
  const spark = new SparkMD5()
  spark.append(string)
  return spark.end()
}

// https://github.com/satazor/js-spark-md5
export function hashFile(file) {
  return new Promise(function (resolve, reject) {
    const blobSlice = File.prototype.slice
    // Read in chunks of 2MB
    const chunkSize = 2097152
    const chunks = Math.ceil(file.size / chunkSize)
    let currentChunk = 0
    const spark = new SparkMD5.ArrayBuffer()
    const fileReader = new FileReader()

    fileReader.onload = function (e) {
      spark.append(e.target.result) // Append array buffer
      currentChunk++
      if (currentChunk < chunks) {
        loadNext()
      } else {
        resolve(spark.end())
      }
    }

    fileReader.onerror = function () {
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
