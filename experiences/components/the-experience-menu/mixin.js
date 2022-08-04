export default {
  props: {
    experiences: {
      type: Array,
      required: true
    }
  },
  methods: {
    k(experience, key) {
      return `experiences.${experience}.intro.${key}`
    },
    menuItemAttrs({ url, slug, disabled }) {
      const { bubble } = this.$route.params
      return url
        ? { href: url, target: '_blank', rel: 'noopener noreferrer', disabled }
        : disabled
          ? { disabled }
          : {
              nuxt: true,
              exact: true,
              to: this.localePath({
                name: `${bubble ? 'bubble-bubble-' : ''}experience-experience`,
                params: { bubble, experience: slug },
                hash: '#load-data'
              })
            }
    }
  }
}
