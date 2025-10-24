<template>
  <div>
    <VAppBar fixed app color="white" height="60" style="z-index: 2500">
      <VAppBarNavIcon
        aria-label="Open navigation menu"
        @click.stop="drawer = !drawer"
      />
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
          <LocalesMenu />
          <ExternalLink
            :href="logoLink"
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
      :width="350"
      style="z-index: 3000"
    >
      <template #prepend>
        <div class="v-toolbar__content d-flex justify-space-between align-center px-2 pt-2 pb-1 mx-n5 mb-4 elevation-3">
          <VSpacer />
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
          <LocalesMenu />
        </div>
      </template>
      <div>
        <div class="d-flex justify-center">
          <LogoImg
            :url="config.logoImgMenu"
            class="my-6"
            max-width="150"
          />
        </div>
        <template v-if="$route.params.bubble">
          <VSubheader class="mt-2">
            {{ $t('Connected to data space') }}:
            <span class="font-weight-black">
              &nbsp;{{ $route.params.bubble }}
            </span>
          </VSubheader>
        </template>

        <TheAppMenu />
      </div>
    </VNavigationDrawer>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import LocalesMenu from './LocalesMenu.vue'
import TheAppMenu from './TheAppMenu.vue'

export default {
  name: 'TheAppBar',
  components: {
    LocalesMenu,
    TheAppMenu
  },
  data() {
    return {
      drawer: false,
      selected: '',
      items: [
        { title: this.$t('Home'), icon: '$vuetify.icons.mdiHome', to: this.localePath({ name: '/' }) },
        { title: this.$t('Experiences'), icon: '$vuetify.icons.mdiChartScatterPlot', to: this.localePath({ name: 'experiences' }) },
        { title: this.$tc('Data Space', 2), icon: '$vuetify.icons.mdiDatabase', to: this.localePath({ name: 'spaces' }) },
        { title: this.$t('TL Data Stories'), icon: '$vuetify.icons.mdiAccountDetails', to: this.localePath({ name: 'story-id', params: { id: 'getting-around-the-lausanne-area' } }) },
        { title: this.$tc('Tool', 2), icon: '$vuetify.icons.mdiTools', to: this.localePath({ name: 'tools' }) },
        { title: this.$t('Privacy'), icon: '$vuetify.icons.mdiShieldLockOutline', to: this.localePath({ name: 'privacy' }) },
        { title: this.$t('About'), icon: '$vuetify.icons.mdiHelp', to: this.localePath({ name: 'about' }) }
      ]
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
      const module = this.$store.getters.experience(this.$route)
      return module?.config || {}
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
    },
    logoLink() {
      return this.config.logoLink || 'https://hestialabs.org'
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
