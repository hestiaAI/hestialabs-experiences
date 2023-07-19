import { merge } from 'lodash-es'

import mixinPage from '@/mixins/page'
import mixinTitles from '@/mixins/titles'

const mixin = {
  computed: {
    experienceModule() {
      return this.$store.getters.experience(this.$route)
    },
    siteConfig() {
      return this.$store.state.config
    },
    experienceTitle() {
      // title() comes from mixinTitles
      const experienceConfig = this.experienceModule?.config
      return experienceConfig && this.title(experienceConfig)
    },
    experienceSubtitle() {
      // subtitle() comes from mixinTitles
      const experienceConfig = this.experienceModule?.config
      return experienceConfig && this.subtitle(experienceConfig)
    }
  }
}

export default merge(mixinPage, mixinTitles, mixin)
