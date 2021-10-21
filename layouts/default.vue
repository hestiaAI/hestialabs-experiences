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
      <div class="lighten-2 py-2 ma-auto white--text" align="center">
        Educational material developed by
        <a href="https://hestia.ai" target="_blank" style="color: white"
          >Hestia.ai</a
        >
        <br />Currently in development
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
  head() {
    return {
      meta: [
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${process.env.baseUrl}${this.$route.path}`
        },
        {
          hid: 'twitter:image',
          property: 'twitter:image',
          content: `${process.env.baseUrl}/ogimg.png`
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
  },
  beforeCreate() {
    this.$store.dispatch('loadConfig')
  },
  mounted() {
    if (!window.Worker) {
      this.$nuxt.error({
        statusCode: 500,
        message: 'Web Workers are not supported by this browser'
      })
    }
  }
}
</script>

<style lang="sass">
@import "./assets/styles"

.v-snack__content.v-snack__content-online-status
  text-align: center
</style>
