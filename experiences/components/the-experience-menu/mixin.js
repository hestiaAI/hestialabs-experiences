export default {
  props: {
    experiences: {
      type: Array,
      required: true
    }
  },
  methods: {
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
                name: `${bubble ? 'space-bubble-' : ''}experience-experience`,
                params: { bubble, experience: slug }
              })
            }
    }
  }
}
