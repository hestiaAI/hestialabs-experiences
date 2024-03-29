<template>
  <VApp v-if="$store.state.loaded">
    <TheAppBar />
    <VMain>
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
        <template v-else>
          You are online again!
        </template>
      </VSnackbar>
      <VAlert
        :value="alert"
        border="right"
        colored-border
        color="primary"
        elevation="2"
        close-text="Not now"
        dismissible
        max-width="20%"
        class="fixedAlert"
        transition="slide-x-transition"
        fixed
        bottom
        left
        @input="alertClosed"
      >
        Want to know more about our work?
        <br>
        <ExternalLink :href="newsletterURL">
          {{ newsletterMessage }}
        </ExternalLink>
      </VAlert>
    </VMain>
    <VFooter app absolute color="primary">
      <div class="lighten-2 py-2 ma-auto white--text" align="center">
        <div>
          <span>&copy; Copyright {{ new Date().getFullYear() }}</span>
          <ExternalLink
            href="https://hestia.ai"
          >
            Hestia.ai
          </ExternalLink>
        </div>
        <i18n path="footer-digipower-academy" tag="p">
          <template #sitra>
            <ExternalLink
              href="https://www.sitra.fi/en/projects/digipower-investigation"
            >
              SITRA
            </ExternalLink>
          </template>
          <template #migros>
            <ExternalLink
              href="https://www.migros-engagement.ch/en/news-projects/technology-ethics/hestialabs"
            >
              {{ $t('Migros Pioneer Fund') }}
            </ExternalLink>
          </template>
          <template #hestialabs>
            <ExternalLink
              href="http://www.hestialabs.org"
            >
              {{ $t('the HestiaLabs project') }}
            </ExternalLink>
          </template>
          <template #personaldataio>
            <ExternalLink
              href="https://personaldata.io/"
            >
              PersonalData.IO
            </ExternalLink>
          </template>
        </i18n>
        <blockquote class="mt-2">
          <span class="font-italic">"We need to train both the people who are putting data and information out there, as well as those reading it, how to interpret and question it to ensure they understand it and are not being misled or deceived."</span>
          <br>&mdash; Sir Tim Berners-Lee, inventor of the World Wide Web
        </blockquote>
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
      timeout: 5000,
      alert: false
    }
  },
  head() {
    const appName = this.$t('app.name')
    const appDescription = this.$t('app.description')
    return {
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: appDescription
        },
        {
          hid: 'og:site_name',
          property: 'og:site_name',
          content: appName
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${process.env.baseUrl}${this.$route.path}`
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: appName
        },
        {
          hid: 'twitter:title',
          property: 'twitter:title',
          content: appName
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: appDescription
        },
        {
          hid: 'twitter:description',
          property: 'twitter:description',
          content: appDescription
        }
      ],
      htmlAttrs: {
        lang: this.$i18n.locale
      }
    }
  },
  computed: {
    ...mapGetters(['experience']),
    collaborator() {
      const experience = this.experience(this.$route)
      return experience?.collaborator || {}
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
    // Show the newsletter alert once a day
    /*
    if (
      !this.alert &&
      (!localStorage.alertNewsletterDismissed ||
        new Date().getTime() -
          new Date(localStorage.alertNewsletterDismissed).getTime() >
          1000 * 3600 * 24) // one day in milliseconds
    ) {
      window.setInterval(() => {
        this.alert = true
      }, 3000)
    }
    */
  },
  methods: {
    alertClosed() {
      localStorage.alertNewsletterDismissed = new Date()
    }
  }
}
</script>

<style lang="sass">
@import "./assets/styles"

.v-snack__content.v-snack__content-online-status
  text-align: center

.v-application .v-footer a
  color: white
</style>

<style scoped>
.fixedAlert {
  position: fixed;
  bottom: 0px;
  z-index: 2500;
}
</style>
