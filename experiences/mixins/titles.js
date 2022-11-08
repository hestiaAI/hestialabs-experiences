const k = (experience, key) => `experiences.${experience}.intro.${key}`

export default {
  computed: {
    defaultSubtitle() {
      return this.$tc('Data Experience', 1)
    }
  },
  methods: {
    title({ slug, title }) {
      return this.$tev(k(slug, 'title'), title)
    },
    subtitle({ slug, subtitle }) {
      return this.$tev(k(slug, 'subtitle'), subtitle || this.defaultSubtitle)
    }
  }
}
