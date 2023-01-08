
export default {
  computed: {
    defaultSubtitle() {
      return this.$tc('Data Experience', 1)
    }
  },
  methods: {
    kTitle(experienceConfig, key) {
      let bubbleConfig
      const { bubble } = this.$route.params
      if (bubble) {
        bubbleConfig = this.$store.state.config.bubbleConfig[bubble]
      }
      const nameAndTag = this.$store.getters['xp/experienceNameAndTagFromConfig'](
        experienceConfig,
        this.$store.state.config,
        bubbleConfig
      )
      return `experiences.${nameAndTag}.intro.${key}`
    },
    title(xp) {
      return this.$tev(this.kTitle(xp, 'title'), xp.title)
    },
    subtitle(xp) {
      return this.$tev(this.kTitle(xp, 'subtitle'), xp.subtitle || this.defaultSubtitle)
    }
  }
}
