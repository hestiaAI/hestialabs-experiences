<template>
  <TheDataExperience />
</template>

<script>
import validate from '@/pages/validate'
import { vueMeta } from '@/utils/utils'

export default {
  middleware: 'auth',
  validate (context) {
    return validate.experience(context) && validate.bubble(context)
  },
  head () {
    const { title: t, subtitle: s } = this.$store.getters.experience(
      this.$route
    )
    const bubble =
      this.$store.state.config.bubbleConfig[this.$route.params.bubble]
    const title = `${t}: ${s} | ${bubble.title} Bubble`
    return vueMeta(this, title)
  }
}
</script>
