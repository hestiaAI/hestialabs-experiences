<template>
  <TheDataExperience />
</template>

<script>
import validate from '@/pages/validate'
import { vueMeta } from '@/utils/utils'

export default {
  middleware: 'auth',
  validate(context) {
    return validate.experience(context) && validate.bubble(context)
  },
  head() {
    const k =
      key => `experiences.${this.$route.params.experience}.intro.${key}`
    const { title } = this.$store.getters.experience(
      this.$route
    )
    const t = this.$tev(k('title'), title)
    const s = this.$tet(k('subtitle'), 'Data Experience')

    const bubble =
      this.$store.state.config.bubbleConfig[this.$route.params.bubble]

    const bubbleText = this.$t('Bubble')
    const metaBubbleTitle = this.$i18n.locale === 'fr' ? `${bubbleText} ${bubble.title}` : `${bubble.title} ${bubbleText}`

    const metaTitle = `${t}: ${s} | ${metaBubbleTitle}`
    return vueMeta(this, metaTitle)
  }
}
</script>
