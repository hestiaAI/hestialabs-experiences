<template>
  <div>
    <VAppBar fixed app color="white" height="60" style="z-index: 2500">
      <VAppBarNavIcon
        aria-label="Open navigation menu"
        @click.stop="drawer = !drawer"
      />
      <VToolbarTitle class="d-flex align-center" style="width: 100%">
        <VMenu offset-y>
          <template #activator="{ on, attrs }">
            <VBtn
              v-bind="attrs"
              icon
              v-on="on"
            >
              <VIcon>$vuetify.icons.mdiTranslate</VIcon>
            </VBtn>
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
        <VBtn
          v-if="!$route.name.startsWith('index')"
          icon
          :to="localePath('index')"
          class="v-btn__home mr-0"
          color="primary"
        >
          <VIcon>$vuetify.icons.mdiHome</VIcon>
        </VBtn>
        <VSpacer />
        <div v-if="$route.params.experience" class="d-flex">
          <VImg max-width="30" :src="e.icon" :lazy-src="e.icon" contain />
          <h3 class="ml-3">
            {{ $tev(`experiences.${$route.params.experience}.intro.title`, e.title) }}
          </h3>
        </div>
        <VSpacer />
        <VBtn
          href="https://hestia.ai/en/#contact"
          target="_blank"
          rel="noreferrer noopener"
          class="v-btn__home mr-0"
          text
        >
          {{ $t('Contact us') }}
        </VBtn>
        <VBtn
          v-for="link in links"
          :key="link.url"
          :to="link.url"
          class="v-btn__home mr-0"
          text
        >
          {{ $t(link.name) }}
        </VBtn>
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
        </v-menu>
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
        <template v-if="$auth.loggedIn">
          <VSubheader class="mt-2">
            Connected to bubble:
            <span class="font-weight-black">
              &nbsp;{{ $auth.user.bubble.title }}
            </span>
          </VSubheader>
        </template>
        <TheBubbleMenu />
        <TheExperienceMenu
          v-if="$auth.loggedIn"
          :include="$auth.user.bubble.experiences"
        />
        <TheExperienceMenu v-else />
      </div>
    </VNavigationDrawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      selected: ''
    }
  },
  computed: {
    e() {
      return this.$store.getters.experience(this.$route)
    },
    links() {
      return this.$store.getters.siteConfig.appBarLinks
    },
    collaborator() {
      return this.e.collaborator
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
