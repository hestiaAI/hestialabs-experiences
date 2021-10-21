<template>
  <div>
    <v-app-bar fixed app color="white" height="75" style="z-index: 2000">
      <v-app-bar-nav-icon
        aria-label="Open navigation menu"
        @click.stop="drawer = !drawer"
      />
      <v-col cols="3">
        <v-toolbar-title class="d-flex align-center">
          <v-btn icon to="/" class="v-btn__home mr-0 mr-sm-4" color="primary">
            <v-icon>$vuetify.icons.mdiHome</v-icon>
          </v-btn>
          <a
            href="https://hestialabs.org/"
            target="_blank"
            rel="noreferrer noopener"
            class="ml-2"
          >
            <logo-img class="mr-5" width="100" />
          </a>

          <template v-if="collaborator">
            <a
              :href="collaborator.url"
              target="_blank"
              rel="noreferrer noopener"
              class="ml-2"
            >
              <v-img
                :src="collaborator.icon"
                :lazy-src="collaborator.icon"
                :alt="collaborator.title"
                contain
                width="100"
              />
            </a>
          </template>
        </v-toolbar-title>
      </v-col>
      <v-col align="center">
        <a
          :href="`${
            collaborator ? collaborator.url : 'https://hestialabs.org/'
          }#newsletter`"
          target="_blank"
          rel="noreferrer noopener"
          class="text-lg-h5"
        >
          Subscribe to the newsletter of
          <template v-if="collaborator"> {{ collaborator.title }}! </template>
          <template v-else> HestiaLabs! </template>
        </a>
      </v-col>
      <v-col cols="3">
        <v-layout column align-end>
          <mode-switch v-if="$vuetify.breakpoint.smAndUp" />
        </v-layout>
      </v-col>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      app
      temporary
      class="pa-5"
      :width="500"
      style="z-index: 3000"
    >
      <template #prepend>
        <div class="d-flex justify-space-between align-center">
          <v-btn icon to="/">
            <v-icon>$vuetify.icons.mdiHome</v-icon>
          </v-btn>
          <v-btn icon @click="drawer = false">
            <v-icon>$vuetify.icons.mdiClose</v-icon>
          </v-btn>
        </div>
      </template>
      <template #append>
        <mode-switch />
      </template>
      <div class="mt-6">
        <logo-img width="250" />
        <the-data-experience-list class="mt-6" />
      </div>
    </v-navigation-drawer>
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
      if (this.$route.params.key) {
        const { collaborator } = this.manifest(this.$route) || {}
        return collaborator
      }
      return null
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
