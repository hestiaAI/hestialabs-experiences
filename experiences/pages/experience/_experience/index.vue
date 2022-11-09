<template>
  <TheDataExperience2
    v-bind="{
      experienceConfig,
      siteConfig
    }"
  />
</template>

<script>
import validate from '@/pages/validate'
import mixin from '@/mixins/page-experience'

export default {
  mixins: [mixin],
  validate(context) {
    return validate.experience(context)
  },
  head() {
    const { experienceTitle: t, experienceSubtitle: s } = this
    const metaTitle = `${t}: ${s}`
    return this.vueMeta(metaTitle)
  }
}
</script>
