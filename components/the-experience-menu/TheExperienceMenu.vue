<template>
  <div>
    <template v-for="({ experiences, heading }, index) in sections">
      <div v-if="experiences.length > 0" :key="index">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <h1 class="mt-6 mb-4 text-h4" v-html="heading" />
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
    },
    include: {
      type: Array,
      default: undefined
    }
  },
  computed: {
    ...mapGetters(['enabledExperiences', 'disabledExperiences']),
    sections() {
      return [
        {
          experiences: this.filterExperiences(this.enabledExperiences),
          heading: 'Public experiences'
        },
        {
          experiences: this.filterExperiences(this.disabledExperiences),
          heading: `
            Available on-demand (<a href="mailto:contact@hestialabs.org">Contact us</a>)
          `
        }
      ]
    },
    component() {
      return this.cards ? TheExperienceMenuCards : TheExperienceMenuList
    }
  },
  methods: {
    filterExperiences(experiences) {
      const { include } = this
      // return all experiences, if no filter provided
      let filtered = experiences
      if (include) {
        filtered = filtered.filter(e => include.includes(e.slug))
      }
      if (!this.$route.params.bubble) {
        // remove aggregator experiences from the menu when
        // user is not in a bubble
        filtered = filtered.filter(e => !e.slug.endsWith('-agg'))
      }
      return filtered
    }
  }
}
</script>
