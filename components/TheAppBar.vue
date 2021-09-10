<template>
  <div>
    <v-app-bar fixed app color="white" height="75" style="z-index: 2000">
      <v-app-bar-nav-icon
        aria-label="Open navigation menu"
        @click.stop="drawer = !drawer"
      />
      <v-toolbar-title class="d-flex align-center">
        <nuxt-link
          to="/"
          class="d-flex align-center"
          style="text-decoration: none; color: inherit"
        >
          <logo-img class="mr-5" width="100" />
        </nuxt-link>
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
      <v-spacer />
      <mode-switch v-if="$vuetify.breakpoint.smAndUp" />
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
