export default class WebFile {
  constructor(file) {
    this.file = file
  }

  get name() {
    return this.file.name
  }

  get blob() {
    return this.file.data
  }

  text() {
    return this.file.text()
  }

  get bufferType() {
    return 'blob'
  }

  copy(newName) {
    const clone = this.file.slice(0, this.file.size)
    const file = new File([clone], newName)
    return new WebFile(file)
  }

  build(content, name) {
    const file = new File([content], name)
    return new WebFile(file)
  }
}
