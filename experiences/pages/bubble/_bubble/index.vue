<template>
  <VContainer class="mt-6">
    <div class="d-flex">
      <VImg max-width="50" :src="bubble.icon" :lazy-src="bubble.icon" contain />
      <h1 class="mt-4 ml-3 text-h3" v-text="bubble.title" />
    </div>
    <TheExperienceMenu
      :cards="$vuetify.breakpoint.smAndUp"
      :include="bubble.experiences"
      :group-by-collaborator="false"
    />
  </VContainer>
</template>

<script>
import validate from '@/pages/validate'
import { vueMeta } from '@/utils/utils'

export default {
  middleware: 'auth',
  validate(context) {
    return validate.bubble(context)
  },
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
