import { defaultExtension, mimeTypes } from '@/utils/utils'

export default {
  props: {
    extension: {
      type: String,
      default: defaultExtension,
      validator(val) {
        return Object.keys(mimeTypes).includes(val)
      }
    }
  }
}
