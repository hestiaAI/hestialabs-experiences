import { mapState } from '@/utils/store-helper'

export default {
  props: {
    filename: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState(['fileManager'])
  }
}
