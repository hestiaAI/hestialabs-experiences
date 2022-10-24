export default {
  methods: {
    // Convert local translation key to global vue-i18n
    kViewBlock(key, prefix = '', postfix = '') {
      const pre = prefix ? `${prefix}.` : ''
      const post = postfix ? `.${postfix}` : ''
      // fetch view-block #id hash from $route
      const { hash } = this.$route
      const id = hash.slice(1)
      // fetch experience slug from vuex
      const experience = this.$store.state.xp.experienceConfig.slug
      return `experiences.${experience}.viewBlocks.${id}.${pre}${key}${post}`
    }
  }
}
