<template>
  <VContainer>
    <div class="d-flex">
      <VImg max-width="50" :src="bubble.icon" :lazy-src="bubble.icon" contain />
      <h1 class="mt-4 ml-3 text-h3" v-text="bubble.title" />
    </div>
    <TheExperienceMenu
      :cards="$vuetify.breakpoint.smAndUp"
      :include="bubble.experiences"
    />
  </VContainer>
</template>

<script>
import { vueMeta } from '@/utils/utils'

export default {
  middleware: 'auth',
  head() {
    const title = `${this.bubble.title} Bubble`
    return vueMeta(this, title)
  },
  computed: {
    bubble() {
      return this.$store.state.config.bubbleConfig[this.$route.params.bubble]
    }
  }
}
</script>
