<template>
  <div>
    <VAppBar fixed app color="white" height="60" style="z-index: 2500">
      <VAppBarNavIcon
        aria-label="Open navigation menu"
        @click.stop="drawer = !drawer"
      />
      <VToolbarTitle class="d-flex align-center" style="width: 100%">
        <VBtn
          v-if="$route.path !== '/'"
          icon
          to="/"
          class="v-btn__home mr-0"
          color="primary"
        >
          <VIcon>$vuetify.icons.mdiHome</VIcon>
        </VBtn>
        <VSpacer />
        <div class="d-flex">
          <VImg max-width="30" :src="e.icon" :lazy-src="e.icon" contain />
          <h3 class="ml-3">
            {{ e.title }}
          </h3>
        </div>
        <VSpacer />
        <a
          v-if="collaborator"
          :href="collaborator.url"
          target="_blank"
          rel="noreferrer noopener"
          class="ml-2 mr-5"
        >
          <VImg
            :src="collaborator.icon"
            :lazy-src="collaborator.icon"
            :alt="collaborator.title"
            contain
            width="100"
          />
        </a>
        <a
          href="https://hestialabs.org/"
          target="_blank"
          rel="noreferrer noopener"
          class="ml-2"
        >
          <LogoImg width="100" />
        </a>
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
            Connected to bubble:
            <span class="font-weight-black">
              &nbsp;{{ $auth.user.bubble.title }}
            </span>
          </VSubheader>
        </template>
        <TheBubbleMenu />
        <TheExperienceMenu
          v-if="$route.params.bubble"
          :include="$auth.user.bubble.experiences"
        />
        <TheExperienceMenu v-else />
      </div>
    </VNavigationDrawer>
  </div>
</template>

<script>
export default {
  data () {
    return {
      drawer: false,
      selected: ''
    }
  },
  computed: {
    e () {
      return this.$store.getters.experience(this.$route)
    },
    collaborator () {
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
