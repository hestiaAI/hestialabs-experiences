import { mapState } from 'vuex'

export default {
  props: {
    filename: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState('dataexp', ['fileManager'])
  }
}
