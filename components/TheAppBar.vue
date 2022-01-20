<template>
  <div>
    <VAppBar fixed app color="white" height="60" style="z-index: 2500">
      <VAppBarNavIcon
        aria-label="Open navigation menu"
        @click.stop="drawer = !drawer"
      />
      <VToolbarTitle class="d-flex align-center" style="width: 100%">
        <VBtn
          v-if="$nuxt.$route.path !== '/'"
          icon
          to="/"
          class="v-btn__home mr-0 mr-sm-4"
          color="primary"
        >
          <VIcon>$vuetify.icons.mdiHome</VIcon>
        </VBtn>
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
      <div class="mt-6">
        <LogoImg width="250" />
        <TheExperienceMenu />
      </div>
    </VNavigationDrawer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      drawer: false
    }
  },
  computed: {
    ...mapGetters(['manifest']),
    collaborator() {
      return this.manifest(this.$route).collaborator
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
