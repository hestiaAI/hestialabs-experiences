<template>
  <VApp>
    <TheAppBar />
    <VMain>
      <VContainer class="mt-5">
        <VRow>
          <VCol align="center">
            <h2>
              <a
                :href="newsletterURL"
                target="_blank"
                rel="noreferrer noopener"
              >
                {{ newsletterMessage }}
              </a>
            </h2>
          </VCol>
        </VRow>
        <Nuxt />
        <VSnackbar
          v-model="snackbar"
          content-class="v-snack__content-online-status"
          color="info"
          :timeout="timeout"
        >
          <template v-if="$nuxt.isOffline">
            The app is running in offline mode
          </template>
          <template v-else> You are online again! </template>
        </VSnackbar>
      </VContainer>
    </VMain>
    <VFooter app absolute color="primary">
      <div class="lighten-2 py-2 ma-auto white--text" align="center">
        Educational material developed by
        <a href="https://hestia.ai" target="_blank" style="color: white"
          >Hestia.ai</a
        >
        <br />Currently in development
      </div>
    </VFooter>
  </VApp>
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
          hid: 'og:title',
          property: 'og:title',
          content: this.appName
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: this.$url(this.$route)
        },
        {
          hid: 'twitter:card',
          property: 'twitter:card',
          content: 'summary'
        },
        {
          hid: 'twitter:site',
          property: 'twitter:site',
          content: '@HestiaLabs'
        },
        {
          hid: 'twitter:title',
          property: 'twitter:title',
          content: this.appName
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
    ...mapGetters(['manifest', 'appName']),
    collaborator() {
      const { collaborator = {} } = this.manifest(this.$route)
      return collaborator
    },
    newsletterURL() {
      const { url = 'https://hestialabs.org/' } = this.collaborator
      return `${url}#newsletter`
    },
    newsletterMessage() {
      const { title = 'HestiaLabs' } = this.collaborator
      const genitiveCaseEnding = title.endsWith('s') ? '’' : '’s'
      return `Subscribe to ${title}${genitiveCaseEnding} newsletter!`
    }
  },
  watch: {
    '$nuxt.isOffline'(isOffline) {
      this.snackbar = true
      // changing timeout property resets the timeout
      this.timeout = isOffline ? 5001 : 5000
    }
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
