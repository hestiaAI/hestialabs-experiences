<template>
  <div>
    <v-app-bar fixed app color="white" height="75" style="z-index: 2000;">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>
        <nuxt-link
          to="/"
          class="d-flex align-center"
          style="text-decoration: none; color: inherit;"
        >
          <logo-img class="mr-5" width="100" />
        </nuxt-link>
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
      style="z-index: 3000;"
    >
      <template #prepend>
        <div class="d-flex justify-space-between align-center">
          <v-btn icon to="/">
            <v-icon>{{ mdiHome }}</v-icon>
          </v-btn>
          <v-btn icon @click="drawer = false">
            <v-icon>{{ mdiClose }}</v-icon>
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
import { mdiHome, mdiClose } from '@mdi/js'

export default {
  data() {
    return {
      drawer: false,
      mdiHome,
      mdiClose
    }
  }
}
</script>
