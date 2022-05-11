export default {
  props: {
    experiences: {
      type: Array,
      required: true
    }
  },
  methods: {
    menuItemAttrs(url, slug, disabled) {
      return url
        ? { href: url, target: '_blank', rel: 'noopener noreferrer', disabled }
        : disabled
        ? { disabled }
        : { nuxt: true, to: `/${slug}` }
    }
  }
}
