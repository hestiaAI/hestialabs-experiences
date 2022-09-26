export default {
  methods: {
    vueMeta(title) {
      const content = `${title} | ${this.$t('app.name')}`
      return {
        title,
        meta: [
          {
            hid: 'og:title',
            property: 'og:title',
            content
          },
          {
            hid: 'twitter:title',
            property: 'twitter:title',
            content
          }
        ]
      }
    }
  }
}
