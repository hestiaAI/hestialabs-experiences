<template>
  <div>
    <template v-for="({ experiences, heading }, index) in sections">
      <div :key="index">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <h1 class="mt-6 mb-4" v-html="heading"></h1>
        <component :is="component" v-bind="{ experiences }" />
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

const TheExperienceMenuCards = () =>
  import('@/components/the-experience-menu/TheExperienceMenuCards')
const TheExperienceMenuList = () =>
  import('@/components/the-experience-menu/TheExperienceMenuList')

export default {
  props: {
    cards: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(['enabledExperiences', 'disabledExperiences']),
    sections() {
      return [
        {
          experiences: this.enabledExperiences,
          heading: 'Public experiences'
        },
        {
          experiences: this.disabledExperiences,
          heading: `
            Available on-demand (<a href="mailto:contact@hestialabs.org">Contact us</a>)
          `
        }
      ]
    },
    component() {
      return this.cards ? TheExperienceMenuCards : TheExperienceMenuList
    }
  }
}
</script>
