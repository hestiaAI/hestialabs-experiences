import { encryptFile, decryptBytes, hybridEncrypt, hybridDecrypt } from './encryption'
import { Blob } from 'node:buffer'
import { TextDecoder } from 'util'
import sodium from 'libsodium-wrappers'
import { Crypt, RSA } from 'hybrid-crypto-js'

test('encrypt and decrypt', async() => {
  const publicKey = '5925c10d32bd1dbde1663154aa70fceafaa3809fbc763d3df9f452305ed64e4e'
  const secretKey = 'b844421500a475c37796cf8e8e21ea68dd40fab6609ba7459a8ee68a1035289b'
  const content = 'thanks for encrypting this'

  const encryptedText = await encryptFile(content, publicKey)

  const blob = new Blob([encryptedText])
  const decryptedBytes = await decryptBytes(blob, secretKey, publicKey)
  const decoder = new TextDecoder()
  const decryptedText = decoder.decode(decryptedBytes)

  expect(decryptedText).toEqual(content)
})

test('hybrid encryption with libsodium', async() => {
  const plaintext = 'Hello, world!'

  await sodium.ready
  // Generate a random symmetric key
  const symmetricKey = sodium.crypto_secretbox_keygen()

  // Encrypt the plaintext data using the symmetric key
  const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES)
  const ciphertext = sodium.crypto_secretbox_easy(plaintext, nonce, symmetricKey)

  // Encrypt the symmetric key using the recipient's public key
  const recipientPublicKeyHex = '5925c10d32bd1dbde1663154aa70fceafaa3809fbc763d3df9f452305ed64e4e'
  const recipientPublicKey = sodium.from_hex(recipientPublicKeyHex)
  const encryptedSymmetricKey = sodium.crypto_box_seal(symmetricKey, recipientPublicKey)

  // Combine the encrypted symmetric key and the symmetric ciphertext to form the final ciphertext
  const finalCiphertext = new Uint8Array(encryptedSymmetricKey.length + ciphertext.length)
  finalCiphertext.set(encryptedSymmetricKey)
  finalCiphertext.set(ciphertext, encryptedSymmetricKey.length)

  // Send the final ciphertext to the recipient
  // PROBLEM, the nonce needs to be included in the finalCiphertext
  // WORSE, the recipient doesn't know the size of the finalCiphertext

  // The recipient can decrypt the ciphertext by first decrypting the symmetric key using their private key
  const recipientPrivateKeyHex = 'b844421500a475c37796cf8e8e21ea68dd40fab6609ba7459a8ee68a1035289b'
  const recipientPrivateKey = sodium.from_hex(recipientPrivateKeyHex)
  const decryptedSymmetricKey = sodium.crypto_box_seal_open(encryptedSymmetricKey, recipientPublicKey, recipientPrivateKey)

  // Once the recipient has the symmetric key, they can decrypt the symmetric ciphertext using the key
  const decryptedPlaintext = sodium.crypto_secretbox_open_easy(ciphertext, nonce, decryptedSymmetricKey)

  // Convert the decrypted plaintext from a Uint8Array to a text string
  const decoder = new TextDecoder()
  const decryptedText = decoder.decode(decryptedPlaintext)
  expect(decryptedText).toEqual(plaintext)
})

// test('hybrid encryption', async() => {
//   const plainText = 'Hello, world!'
//   const publicKey = '5925c10d32bd1dbde1663154aa70fceafaa3809fbc763d3df9f452305ed64e4e'

//   await sodium.ready

//   const encrypted = await hybridEncrypt(plainText, publicKey)

//   // The recipient can decrypt the ciphertext by first decrypting the symmetric key using their secret key
//   const secretKey = 'b844421500a475c37796cf8e8e21ea68dd40fab6609ba7459a8ee68a1035289b'

//   const decryptedText = hybridDecrypt(encrypted, secretKey, publicKey)
//   // Convert the decrypted plainText from a Uint8Array to a text string
//   const decoder = new TextDecoder()
//   const decodedText = decoder.decode(decryptedText)
//   expect(decodedText).toEqual(plainText)
// })

test('hybrid-crypto-js', async() => {
  // Basic initialization
  const crypt = new Crypt()
  const rsa = new RSA()

  // Generate RSA key pair, default key size is 4096 bit
  const { publicKey, privateKey } = await rsa.generateKeyPairAsync()
  const message = 'Hello world!'

  // Encryption with one public RSA key
  const encrypted = crypt.encrypt(publicKey, message)

  const decrypted = crypt.decrypt(privateKey, encrypted)
  expect(decrypted.message).toEqual(message)
})
