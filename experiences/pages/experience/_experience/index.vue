<template>
  <TheDataExperience
    v-if="experienceConfig"
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
  data() {
    return { experienceConfig: undefined }
  },
  head() {
    const { experienceTitle: t, experienceSubtitle: s } = this
    const metaTitle = `${t}: ${s}`
    return this.vueMeta(metaTitle)
  },
  created() {
    this.configureViewerOptions(this.experienceModule)
  },
  methods: {
    async configureViewerOptions(experienceModule) {
      const { experienceViewOptionsUrl } = this.siteConfig
      let experienceConfig = experienceModule.config
      if (experienceViewOptionsUrl) {
        const experienceName = experienceConfig.name
        const vUrl =
`${experienceViewOptionsUrl}/${experienceName}-viewer.json`
        const viewerOptsResp = await fetch(vUrl)
        if (viewerOptsResp.ok) {
          const viewerOpts = await viewerOptsResp.json()
          experienceConfig = experienceModule.reconfigure(viewerOpts).config
        }
      }
      this.experienceConfig = experienceConfig
    }
  }
}
</script>
