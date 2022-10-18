<template>
  <div>
    <template v-for="({ experiences, heading, collaborator }, index) in sections">
      <div v-if="experiences.length" :key="index">
        <div class="mt-6 mb-4">
          <template v-if="collaborator && groupByCollaborator">
            <span class="text-overline">{{ $t('Made for') }}</span>
            <CollaboratorLink v-if="collaborator" :collaborator="collaborator" :width="250" />
          </template>
          <template v-else>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <h1 class="text-h4" v-html="heading" />
          </template>
        </div>
        <component :is="component" v-bind="{ experiences }" />
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { groupBy } from 'lodash-es'

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
    },
    hideCollaborators: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(['enabledExperiences', 'disabledExperiences']),
    groupByCollaborator() {
      return !!this.$store.state.config.displayCollaborators && !this.hideCollaborators
    },
    sections() {
      const sections = []
      const enabledExperiences = this.filterExperiences(this.enabledExperiences)
      if (this.groupByCollaborator) {
        sections.push(...this.groupExperiences(enabledExperiences))
      } else {
        sections.push(
          {
            experiences: enabledExperiences,
            heading: ''
          }
        )
      }
      sections.push(
        {
          experiences: this.filterExperiences(this.disabledExperiences),
          heading: `
              ${this.$t('Available on-demand')} (<a target="_blank" rel="noopener noreferrer" href="mailto:contact@hestialabs.org">${this.$t('Contact us')}</a>)
            `
        }
      )

      return sections
    },
    component() {
      return this.cards ? TheExperienceMenuCards : TheExperienceMenuList
    }
  },
  methods: {
    groupExperiences(experiences) {
      const experiencesByCollaborator = groupBy(experiences, 'collaborator.title')
      return Object.values(experiencesByCollaborator).map((experiences) => {
        const { collaborator } = experiences[0]
        return {
          experiences,
          collaborator,
          heading: collaborator?.title || this.$t('Public experiences')
        }
      })
    },
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
