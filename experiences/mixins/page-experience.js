import { merge } from 'lodash-es'

import mixinPage from '@/mixins/page'
import mixinTitles from '@/mixins/titles'

const mixin = {
  computed: {
    experienceConfig() {
      return this.$store.getters.experience(this.$route)?.config
    },
    siteConfig() {
      return this.$store.state.config
    },
    experienceTitle() {
      // title() comes from mixinTitles
      return this.title(this.experienceConfig)
    },
    experienceSubtitle() {
      // subtitle() comes from mixinTitles
      return this.subtitle(this.experienceConfig)
    }
  }
}

export default merge(mixinPage, mixinTitles, mixin)
