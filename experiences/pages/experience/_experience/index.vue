<template>
  <TheDataExperience
    v-if="experienceModule"
    v-bind="{
      experienceModule,
      siteConfig
    }"
  />
</template>

<script>
import validate from '@/pages/validate'
import mixin from '@/mixins/page-experience'

export default {
  // https://github.com/nuxt-community/router-module/issues/67#issuecomment-726112465
  name: 'Index',
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
