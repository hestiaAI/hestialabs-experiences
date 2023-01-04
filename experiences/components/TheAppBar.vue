<template>
  <div>
    <VAppBar fixed app color="white" height="60" style="z-index: 2500">
      <VAppBarNavIcon
        aria-label="Open navigation menu"
        @click.stop="drawer = !drawer"
      />
      <template v-if="smAndUp">
        <TheAppFunctions />
      </template>
      <VToolbarTitle class="d-flex align-center pl-0" style="width: 100%">
        <VSpacer />
        <template v-if="experience">
          <div class="d-flex">
            <VImg max-width="30" :src="e.icon" :lazy-src="e.icon" contain :alt="e.title" />
            <div v-if="smAndUp" class="text-subtitle ml-3">
              {{ $tev(`experiences.${experience}.intro.title`, e.title) }}
            </div>
          </div>
        </template>
        <VSpacer />
        <template v-if="smAndUp">
          <TheAppInfoLinks />
          <CollaboratorLink
            v-if="collaborator"
            :collaborator="collaborator"
            class="ml-3"
          />
          <ExternalLink
            href="https://hestialabs.org/"
            class="ml-3"
          >
            <LogoImg width="100" />
          </ExternalLink>
        </template>
      </VToolbarTitle>
    </VAppBar>
    <VNavigationDrawer
      v-model="drawer"
      app
      temporary
      class="px-5"
      :width="500"
      style="z-index: 3000"
    >
      <template #prepend>
        <div class="v-toolbar__content d-flex justify-space-between align-center px-2 pt-2 pb-1 mx-n5 mb-4 elevation-3">
          <TheAppFunctions />
          <div>
            <VBtn icon @click="drawer = false">
              <VIcon>$vuetify.icons.mdiClose</VIcon>
            </VBtn>
          </div>
        </div>
      </template>
      <template v-if="!smAndUp" #append>
        <div class="v-toolbar__content d-flex justify-space-between align-center px-2 pt-2 pb-1 mx-n5 mt-4 elevation-3">
          <TheAppInfoLinks :tooltip-props="{ top: true }" />
        </div>
      </template>
      <div class="my-6">
        <LogoImg width="250" />
        <template v-if="$route.params.bubble">
          <VSubheader class="mt-2">
            {{ $t('Connected to data space') }}:
            <span class="font-weight-black">
              &nbsp;{{ $route.params.bubble }}
            </span>
          </VSubheader>
        </template>
        <TheExperienceMenu :include="include" />
      </div>
    </VNavigationDrawer>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      drawer: false,
      selected: ''
    }
  },
  computed: {
    ...mapState(['config']),
    smAndUp() {
      return this.$vuetify.breakpoint.smAndUp
    },
    experience() {
      return this.$route.params.experience
    },
    e() {
      return this.$store.getters.experience(this.$route) || {}
    },
    collaborator() {
      return this.config.displayCollaborators ? this.e.collaborator : undefined
    },
    include() {
      const { bubble } = this.$route.params
      if (bubble) {
        return this.config.bubbleConfig[bubble].experiences
      }
      return this.config.experiences
    }
  }
}
</script>

<style>
.v-btn.v-btn--router.theme--light.v-btn--active::before {
  /* Override default style for active nav router link element */
  opacity: 0 !important;
}
</style>
