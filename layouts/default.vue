<template>
  <v-app>
    <the-app-bar />
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
          <template v-else> You are online again! </template>
        </v-snackbar>
      </v-container>
    </v-main>
    <v-footer app absolute color="primary">
      <div class="lighten-2 py-2 ma-auto white--text">
        <span
          >&copy; {{ new Date().getFullYear() }} —
          <span class="font-bold">Hestia.ai</span></span
        >
      </div>
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
  beforeCreate() {
    this.$store.dispatch('loadConfig')
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

<style lang="sass">
@import "./assets/styles"

.v-snack__content.v-snack__content-online-status
  text-align: center
</style>
