export default {
  props: {
    translationKeyPrefix: {
      type: String,
      required: true
    }
  },
  methods: {
    // Convert local translation key to global vue-i18n
    kViewBlock(key, prefix = '', postfix = '') {
      const pre = prefix ? `${prefix}.` : ''
      const post = postfix ? `.${postfix}` : ''
      return `${this.translationKeyPrefix}.${pre}${key}${post}`
    }
  }
}
