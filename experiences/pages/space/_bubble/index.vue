<!-- eslint-disable vue/no-v-html -->
<template>
  <VContainer class="mt-6">
    <div class="d-flex mt-3">
      <h1 class="text-h4 font-weight-bold mr-6" v-text="bubble.title" />
      <VImg max-width="50" :src="bubble.icon" :lazy-src="bubble.icon" contain />
    </div>
    <div class="subtitle-2" v-text="bubble.description" />
    <p class="mt-3 text-justify" v-html="bubble.content" />
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
  validate(context) {
    return validate.bubble(context)
  },
  head() {
    const { title: t } = this.bubble
    const title = `${t} | ${this.$tc('Data Space', 1)}`
    return this.vueMeta(title)
  },
  computed: {
    bubble() {
      return this.$store.state.config.bubbleConfig[this.$route.params.bubble]
    }
  }
}
</script>
