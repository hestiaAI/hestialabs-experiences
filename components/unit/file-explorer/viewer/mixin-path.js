export default {
  computed: {
    path () {
      return URL.createObjectURL(this.fileManager.fileDict[this.filename])
    }
  }
}
