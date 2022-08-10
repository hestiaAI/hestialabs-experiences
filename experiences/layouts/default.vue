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
        Want to know more about our work ?
        <br>
        <ExternalLink :href="newsletterURL">
          {{ newsletterMessage }}
        </ExternalLink>
      </VAlert>
    </VMain>
    <VFooter app absolute color="primary">
      <div class="lighten-2 py-2 ma-auto white--text" align="center">
        &copy; Copyright 2022
        <ExternalLink
          href="https://hestia.ai"
        >
          Hestia.ai
        </ExternalLink>
        <br>
        {{ $t('footer-digipower-academy') }}
        <ExternalLink
          href="https://www.sitra.fi/en/projects/digipower-investigation"
        >
          SITRA
        </ExternalLink>, <ExternalLink
          href="https://www.migros-engagement.ch/en/news-projects/technology-ethics/hestialabs"
        >
          Migros Pioneer Fund
        </ExternalLink> (via
        <ExternalLink
          href="http://www.hestialabs.org"
        >
          {{ $t('the HestiaLabs project') }}
        </ExternalLink>) {{ $t('and') }}
        <ExternalLink
          href="https://personaldata.io/"
        >
          PersonalData.IO
        </ExternalLink>
      </div>
    </VFooter>
  </VApp>
</template>

<script>
import { mapGetters } from 'vuex'

/**
 * Merge local, experience-specific, default messages
 * into vue-i18n's global dictionary
 */
function i18nMergeMessages(
  experienceName,
  locale,
  messages,
  i18n
) {
  // merge the messages into vue-i18n's global dictionary
  const mergeableMessages = { experiences: { [experienceName]: messages } }
  i18n.mergeLocaleMessage(locale, mergeableMessages)
}

export default {
  async middleware({
    app,
    store,
    params: { bubble },
    route: { path },
    isDev,
    redirect,
    $auth,
    $axios,
    $vuetify
  }) {
    if (!store.state.loaded) {
      // first, we need to load the site config
      await store.dispatch('loadConfig', { isDev, $axios })
      // and only then we can load the experiences
      await store.dispatch('loadExperiences')
      // set state.loaded = true
      store.commit('setLoaded')
      const { experiences } = store.state
      experiences.filter(({ messages }) => messages)
        .forEach((experience) => {
          Object.entries(experience.messages).forEach(([locale, messages]) => {
            i18nMergeMessages(experience.slug, locale, messages, app.i18n)
          })
        })

      const config = store.getters.siteConfig
      if (config.i18nLocale) {
        store.$i18n.locale = config.i18nLocale
      }

      const locale = store.$i18n.locale
      if (config.i18nUrl) {
        const messagesResp = await fetch(config.i18nUrl)
        const messages = await messagesResp.json()
        store.$i18n.mergeLocaleMessage(locale, messages[locale])
      }

      const { theme } = store.state.config
      if (theme) {
        // override light theme colors
        Object.assign($vuetify.theme.themes.light, theme)
      }
    }

    if (bubble && $auth.loggedIn && bubble !== $auth.user.username) {
      // auto-logout if user tries to enter another bubble
      await $auth.logout()
      return redirect(app.localePath({
        name: 'login',
        query: { redirect: path }
      }))
    }
  },
  data() {
    return {
      // Display offline message if user opens app when offline
      snackbar: this.$nuxt.isOffline,
      timeout: 5000,
      alert: false
    }
  },
  head() {
    if (!this.appName) {
      return
    }
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
          hid: 'twitter:title',
          property: 'twitter:title',
          content: this.appName
        }
      ],
      htmlAttrs: {
        lang: this.$i18n.locale
      }
    }
  },
  computed: {
    ...mapGetters(['experience', 'appName']),
    collaborator() {
      const { collaborator = {} } = this.experience(this.$route)
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
