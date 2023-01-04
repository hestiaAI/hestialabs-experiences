
export default {
  computed: {
    defaultSubtitle() {
      return this.$tc('Data Experience', 1)
    }
  },
  methods: {
    kTitle(experience, key) {
      let bubbleConfig
      const { bubble } = this.$route.params
      if (bubble) {
        bubbleConfig = this.$store.state.config.bubbleConfig[bubble]
      }
      const nameAndTag = this.$store.getters['xp/experienceNameAndTagFromConfig'](
        experience,
        this.$store.state.config,
        bubbleConfig
      )
      return `experiences.${nameAndTag}.intro.${key}`
    },
    title({ slug, title }) {
      return this.$tev(this.kTitle(slug, 'title'), title)
    },
    subtitle({ slug, subtitle }) {
      return this.$tev(this.kTitle(slug, 'subtitle'), subtitle || this.defaultSubtitle)
    }
  }
}
