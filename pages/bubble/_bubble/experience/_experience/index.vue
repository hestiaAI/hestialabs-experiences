<template>
  <TheDataExperience />
</template>

<script>
import { vueMeta } from '@/utils/utils'

export default {
  head() {
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
