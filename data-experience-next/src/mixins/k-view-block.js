export default {
  props: {
    viewBlockTranslationPrefix: {
      type: String,
      required: true
    }
  },
  methods: {
    // Convert local translation key to global vue-i18n
    kViewBlock(key, prefix = '', postfix = '') {
      const pre = prefix ? `${prefix}.` : ''
      const post = postfix ? `.${postfix}` : ''
      return `${this.viewBlockTranslationPrefix}.${pre}${key}${post}`
    }
  }
}
