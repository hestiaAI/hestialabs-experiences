<template>
  <v-app>
    <v-app-bar fixed app height="75">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>
        <nuxt-link
          to="/"
          class="d-flex align-center"
          style="text-decoration: none; color: inherit;"
        >
          <logo-img class="mr-5" width="100" />
          <span>HestiaLabs Demo</span>
        </nuxt-link>
      </v-toolbar-title>
      <v-spacer />
      <mode-switch />
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      app
      temporary
      class="pa-5"
      :width="500"
    >
      <template #prepend>
        <div class="d-flex justify-space-between align-center">
          <v-btn icon to="/"><v-icon>mdi-home-outline</v-icon></v-btn>
          <v-btn icon @click="drawer = false"><v-icon>mdi-close</v-icon></v-btn>
        </div>
      </template>
      <template #append>
        <mode-switch />
      </template>
      <div class="mt-6">
        <logo-img width="250" />
        <v-list class="mt-6" rounded>
          <v-list-item
            v-for="{ key, title, subtitle, icon } in $store.getters.manifests"
            :key="key"
            :to="`/${key}`"
          >
            <v-list-item-avatar tile>
              <v-img :src="icon" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-text="title"></v-list-item-title>
              <v-list-item-subtitle v-text="subtitle"></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </div>
    </v-navigation-drawer>
    <v-main>
      <v-container class="mt-5">
        <nuxt />
        <v-snackbar
          v-model="snackbar"
          content-class="v-snack__content-online-status"
          color="info"
          :timeout="timeout"
        >
          <template v-if="$nuxt.isOffline">
            The app is running in offline mode
          </template>
          <template v-else>
            You are online again!
          </template>
        </v-snackbar>
      </v-container>
    </v-main>
    <v-footer app absolute>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      // Display offline message if user opens app when offline
      snackbar: this.$nuxt.isOffline,
      timeout: 5000
    }
  },
  head() {
    return {
      meta: [
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${process.env.baseUrl}${this.$route.path}`
        }
      ]
    }
  },
  watch: {
    '$nuxt.isOffline'(isOffline) {
      this.snackbar = true
      // changing timeout property resets the timeout
      this.timeout = isOffline ? 5001 : 5000
    }
  }
}
</script>

<style>
.v-snack__content.v-snack__content-online-status {
  text-align: center;
}
</style>
