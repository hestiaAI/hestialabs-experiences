export default class NodeFile {
  #content
  #name

  constructor(content, name) {
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

  copy(newName) {
    return new NodeFile(this.#content, newName)
  }

  build(content, name) {
    return new NodeFile(content, name)
  }
}
