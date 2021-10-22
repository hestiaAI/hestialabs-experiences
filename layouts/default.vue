<template>
  <v-app>
    <the-app-bar />
    <v-main>
      <v-container class="mt-5">
        <v-row>
          <v-col align="center">
            <h2>
              <a
                :href="`${
                  collaborator ? collaborator.url : 'https://hestialabs.org/'
                }#newsletter`"
                target="_blank"
                rel="noreferrer noopener"
              >
                Subscribe to the newsletter of
                <template v-if="collaborator">
                  {{ collaborator.title }}!
                </template>
                <template v-else> HestiaLabs! </template>
              </a>
            </h2>
          </v-col>
        </v-row>
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
import { mapGetters } from 'vuex'
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
  computed: {
    ...mapGetters(['manifest']),
    collaborator() {
      if (this.$route.params.key) {
        const { collaborator } = this.manifest(this.$route) || {}
        return collaborator
      }
      return null
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
