<template>
  <div>
    <VAppBar fixed app color="white" height="60" style="z-index: 2500">
      <VAppBarNavIcon
        aria-label="Open navigation menu"
        @click.stop="drawer = !drawer"
      />
      <VToolbarTitle class="d-flex align-center" style="width: 100%">
        <VTooltip bottom>
          <template #activator="{ on, attrs }">
            <VBtn
              icon
              v-bind="{...homeButtonProps, ...attrs}"
              class="v-btn__home mr-0"
              color="primary"
              v-on="on"
            >
              <VIcon>$vuetify.icons.mdiHome</VIcon>
            </VBtn>
          </template>
          <span v-t="'Home Page'" />
        </VTooltip>
        <VTooltip v-if="hasBubbles" bottom>
          <template #activator="{ on, attrs }">
            <VBtn
              icon
              :to="localePath({ name: 'spaces' })"
              class="v-btn__home"
              v-bind="attrs"
              v-on="on"
            >
              <VAvatar rounded size="30">
                <img src="/data-space.png">
              </VAvatar>
            </VBtn>
          </template>
          <span>{{ $tc('Data Space', 2) }}</span>
        </VTooltip>
        <VMenu v-if="$i18n.locales.length > 1" offset-y>
          <template #activator="menu">
            <VTooltip bottom>
              <template #activator="tooltip">
                <VBtn
                  icon
                  v-bind="{ ...menu.attrs, ...tooltip.attrs }"
                  v-on="{ ...menu.on, ...tooltip.on }"
                >
                  <VIcon>$vuetify.icons.mdiTranslate</VIcon>
                </VBtn>
              </template>
              <span v-t="'Language'" />
            </VTooltip>
          </template>
          <VList>
            <VListItem
              v-for="({ code, name }) in $i18n.locales"
              :key="code"
              nuxt
              :to="switchLocalePath(code)"
            >
              <VListItemTitle>{{ name }}</VListItemTitle>
            </VListItem>
          </VList>
        </VMenu>
        <VSpacer />
        <div v-if="experience" class="d-flex">
          <VImg max-width="30" :src="e.icon" :lazy-src="e.icon" contain />
          <h3 class="ml-3">
            {{ $tev(`experiences.${experience}.intro.title`, e.title) }}
          </h3>
        </div>
        <VSpacer />
        <div v-for="link in appBarLinks" :key="link.url">
          <VBtn
            v-bind="link"
            class="v-btn__home mr-0"
            text
          >
            {{ $t(link.name) }}
          </VBtn>
        </div>
        <CollaboratorLink
          v-if="collaborator"
          :collaborator="collaborator"
          class="ml-2 mr-5"
        />
        <ExternalLink
          href="https://hestialabs.org/"
          class="ml-2"
        >
          <LogoImg width="100" />
        </ExternalLink>
      </VToolbarTitle>
    </VAppBar>
    <VNavigationDrawer
      v-model="drawer"
      app
      temporary
      class="pa-5"
      :width="500"
      style="z-index: 3000"
    >
      <template #prepend>
        <div class="d-flex justify-space-between align-center">
          <VBtn icon to="/">
            <VIcon>$vuetify.icons.mdiHome</VIcon>
          </VBtn>
          <VBtn icon @click="drawer = false">
            <VIcon>$vuetify.icons.mdiClose</VIcon>
          </VBtn>
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
    hasBubbles() {
      const bubbleConfig = this.$store.state.config.bubbleConfig
      return bubbleConfig && Object.keys(bubbleConfig).length > 0
    },
    experience() {
      return this.$route.params.experience
    },
    e() {
      return this.$store.getters.experience(this.experience)
    },
    collaborator() {
      return this.config.displayCollaborators ? this.e.collaborator : undefined
    },
    homeButtonProps() {
      // check for an external home page
      const { homePath } = this.config
      if (homePath) {
        return {
          href: homePath,
          rel: 'noreferrer noopener'
        }
      }
      // if an external home page is not configured,
      // we link to the internal home page
      return {
        to: this.localePath('index')
      }
    },
    include() {
      const { bubble } = this.$route.params
      if (!bubble) {
        return
      }
      return this.config.bubbleConfig[bubble].experiences
    },
    appBarLinks() {
      const links = this.config.appBarLinks?.map(l => ({
        ...l,
        ...(
          l.external
            ? {
                href: l.url,
                target: '_blank',
                rel: 'noreferrer noopener'
              }
            : {
                to: l.url
              }
        )
      }))
      return links || []
    }
  }
}
</script>

<style>
.v-btn__home.theme--light.v-btn--router.v-btn--active::before {
  /* Override default style for active nav router link element */
  opacity: 0 !important;
}
</style>
