export default {
  methods: {
    // Convert local translation key to global vue-i18n
    kViewBlock(key, prefix = '', postfix = '') {
      const pre = prefix ? `${prefix}.` : ''
      const post = postfix ? `.${postfix}` : ''
      const { experience } = this.$route.params
      const id = this.$route.hash.slice(1)
      return `experiences.${experience}.viewBlocks.${id}.${pre}${key}${post}`
    }
  }
}
