<template>
  <v-app>
    <v-app-bar fixed app height="75">
      <v-toolbar-title>
        <nuxt-link
          to="/"
          class="d-flex align-center"
          style="text-decoration: none; color: inherit;"
        >
          <v-img
            src="https://hestialabs.org/assets/img/hestialabs-logo+text.svg"
            alt="HestiaLabs logo"
            class="mr-5"
            contain
            width="100"
          />
          <span>HestiaLabs Demo</span>
        </nuxt-link>
      </v-toolbar-title>
    </v-app-bar>
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
