export default {
  methods: {
    // Convert local translation key to global vue-i18n
    kViewBlock(key, prefix = '', postfix = '') {
      const pre = prefix ? `${prefix}.` : ''
      const post = postfix ? `.${postfix}` : ''
      // fetch view-block id (i.e. current tab value) from Vuex state
      const viewBlock = this.$store.state.xp.currentTab
      // fetch experience slug from Vuex state
      const experience = this.$store.state.xp.experienceConfig.slug
      return `experiences.${experience}.viewBlocks.${viewBlock}.${pre}${key}${post}`
    }
  }
}
