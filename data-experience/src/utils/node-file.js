export default class NodeFile {
  #content
  #name

  constructor(name, content) {
    this.#content = content
    this.#name = name
  }

  get name() {
    return this.#name
  }

  get blob() {
    return this.#content
  }

  text() {
    return this.#content.toString()
  }

  get bufferType() {
    return 'nodebuffer'
  }

  async hash() {
    // https://nodejs.org/api/crypto.html#class-hash
    const { createHash } = await import('node:crypto')
    const hash = createHash('md5')
    hash.update(this.#content)
    return hash.digest('hex')
  }

  copy(newName) {
    return new NodeFile(newName, this.#content)
  }

  build(content, name) {
    return new NodeFile(name, content)
  }
}
