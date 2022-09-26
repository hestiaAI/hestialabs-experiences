<template>
  <VContainer class="mt-6">
    <div class="d-flex">
      <VImg max-width="50" :src="bubble.icon" :lazy-src="bubble.icon" contain />
      <h1 class="mt-4 ml-3 text-h3" v-text="bubble.title" />
    </div>
    <TheExperienceMenu
      :cards="$vuetify.breakpoint.smAndUp"
      :include="bubble.experiences"
      hide-collaborators
    />
  </VContainer>
</template>

<script>
import validate from '@/pages/validate'
import mixin from '@/mixins/page'

export default {
  mixins: [mixin],
  middleware: 'auth',
  validate(context) {
    return validate.bubble(context)
  },
  head() {
    const bubbleText = this.$tc('Bubble', 1)
    const { title: t } = this.bubble
    const title = this.$i18n.locale === 'fr' ? `${bubbleText} ${t}` : `${t} ${bubbleText}`
    return this.vueMeta(title)
  },
  computed: {
    bubble() {
      return this.$store.state.config.bubbleConfig[this.$route.params.bubble]
    }
  }
}
</script>
