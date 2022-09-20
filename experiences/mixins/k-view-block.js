export default {
  methods: {
    // Convert local translation key to global vue-i18n
    kViewBlock(key, prefix = '', postfix = '') {
      const pre = prefix ? `${prefix}.` : ''
      const post = postfix ? `.${postfix}` : ''
      // fetch :experience param and view-block #id hash from $route
      const { params: { experience }, hash } = this.$route
      const id = hash.slice(1)
      return `experiences.${experience}.viewBlocks.${id}.${pre}${key}${post}`
    }
  }
}
