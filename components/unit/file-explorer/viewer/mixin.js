import FileManager from '@/utils/file-manager'

export default {
  props: {
    fileManager: {
      type: FileManager,
      required: true
    },
    filename: {
      type: String,
      required: true
    }
  }
}
